import { useEffect, useRef } from "react";

export type ShortcutMap = Partial<Record<string, () => void>>;

function isTyping(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target.isContentEditable;
}

/**
 * Satu listener keydown global. Peta shortcut disimpan di ref sehingga listener
 * hanya didaftarkan sekali (tidak terduplikasi) walau handler berubah tiap render.
 * Kunci memakai `event.key` dalam huruf kecil, mis. "arrowright", " ", "f".
 */
export function useShortcuts(map: ShortcutMap) {
  const ref = useRef(map);
  useEffect(() => {
    ref.current = map;
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey || isTyping(e.target)) return;
      const handler = ref.current[e.key.toLowerCase()];
      if (!handler) return;
      e.preventDefault();
      handler();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}
