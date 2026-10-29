import { useSyncExternalStore } from "react";
import { slides } from "@/data/slides";

/**
 * State navigasi presentasi (slide aktif, langkah sorotan, arah transisi).
 * Disimpan di luar React agar dapat disinkronkan dengan URL hash dan
 * jendela presenter (BroadcastChannel) tanpa hydration mismatch.
 */
export interface DeckState {
  index: number;
  step: number;
  /** 1 = maju, -1 = mundur (untuk arah animasi transisi) */
  dir: 1 | -1;
}

export const TOTAL = slides.length;
const SERVER_STATE: DeckState = { index: 0, step: 0, dir: 1 };
const CHANNEL = "few-graph-presentation";

type Message = { type: "state"; state: DeckState } | { type: "hello" };

let state: DeckState | null = null;
let channel: BroadcastChannel | null = null;
const listeners = new Set<() => void>();

const clamp = (i: number) => Math.max(0, Math.min(TOTAL - 1, i));
const stepsOf = (i: number) => slides[i].steps ?? 1;

function parseHash(): DeckState {
  const match = window.location.hash.match(/^#(\d+)/);
  const index = match ? clamp(Number(match[1]) - 1) : 0;
  return { index, step: 0, dir: 1 };
}

function emit() {
  for (const l of listeners) l();
}

function apply(next: DeckState, broadcast: boolean) {
  const prev = state;
  if (prev && prev.index === next.index && prev.step === next.step) return;
  state = next;
  const hash = `#${next.index + 1}`;
  if (window.location.hash !== hash) window.history.replaceState(null, "", hash);
  if (broadcast) channel?.postMessage({ type: "state", state: next } satisfies Message);
  emit();
}

function ensureInit() {
  if (state) return;
  state = parseHash();
  if (typeof BroadcastChannel !== "undefined") {
    channel = new BroadcastChannel(CHANNEL);
    channel.onmessage = (e: MessageEvent<Message>) => {
      if (e.data.type === "state") apply(e.data.state, false);
      else if (e.data.type === "hello" && state) channel?.postMessage({ type: "state", state } satisfies Message);
    };
  }
  window.addEventListener("hashchange", () => {
    const parsed = parseHash();
    if (parsed.index !== state?.index) apply({ ...parsed, dir: parsed.index > (state?.index ?? 0) ? 1 : -1 }, true);
  });
}

function subscribe(listener: () => void) {
  ensureInit();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): DeckState {
  ensureInit();
  return state!;
}

/** Jendela baru (mis. presenter) meminta state terkini dari jendela lain. */
export function requestSync() {
  ensureInit();
  channel?.postMessage({ type: "hello" } satisfies Message);
}

export const deck = {
  next() {
    const s = getSnapshot();
    if (s.step < stepsOf(s.index) - 1) apply({ ...s, step: s.step + 1, dir: 1 }, true);
    else if (s.index < TOTAL - 1) apply({ index: s.index + 1, step: 0, dir: 1 }, true);
  },
  prev() {
    const s = getSnapshot();
    if (s.step > 0) apply({ ...s, step: s.step - 1, dir: -1 }, true);
    else if (s.index > 0) apply({ index: s.index - 1, step: stepsOf(s.index - 1) - 1, dir: -1 }, true);
  },
  goTo(index: number, step = 0) {
    const s = getSnapshot();
    const i = clamp(index);
    apply({ index: i, step: Math.min(step, stepsOf(i) - 1), dir: i >= s.index ? 1 : -1 }, true);
  },
  setStep(step: number) {
    const s = getSnapshot();
    apply({ ...s, step: Math.max(0, Math.min(step, stepsOf(s.index) - 1)), dir: step >= s.step ? 1 : -1 }, true);
  },
  first() {
    deck.goTo(0);
  },
  last() {
    deck.goTo(TOTAL - 1);
  },
};

export function useDeck(): DeckState {
  return useSyncExternalStore(subscribe, getSnapshot, () => SERVER_STATE);
}
