import { useSyncExternalStore } from "react";

/**
 * Pengaturan animasi dekoratif (loop latar). Disimpan di localStorage dan diterapkan
 * sebagai atribut `data-decor` pada <html>; CSS di globals.css menghentikan semua `loop-*`.
 */
const KEY = "few-decor";
const listeners = new Set<() => void>();
let enabled: boolean | null = null;

function read(): boolean {
  if (enabled === null) {
    try {
      enabled = window.localStorage.getItem(KEY) !== "off";
    } catch {
      enabled = true;
    }
    document.documentElement.dataset.decor = enabled ? "on" : "off";
  }
  return enabled;
}

export function toggleDecor() {
  enabled = !read();
  document.documentElement.dataset.decor = enabled ? "on" : "off";
  try {
    window.localStorage.setItem(KEY, enabled ? "on" : "off");
  } catch {
    /* penyimpanan tidak tersedia — pengaturan hanya berlaku di sesi ini */
  }
  for (const l of listeners) l();
}

export function useDecorEnabled(): boolean {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    read,
    () => true,
  );
}
