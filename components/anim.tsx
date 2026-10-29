"use client";

import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";

export const EASE = [0.22, 1, 0.36, 1] as const;

/** Konteks "statis": animasi dilewati (thumbnail overview, cetak PDF, reduced motion). */
const StaticContext = createContext(false);

export function StaticProvider({ value, children }: { value: boolean; children: ReactNode }) {
  return (
    <StaticContext.Provider value={value}>
      {/* `static-scope` menghentikan semua animasi loop CSS di dalamnya (lihat globals.css) */}
      {value ? <div className="static-scope contents">{children}</div> : children}
    </StaticContext.Provider>
  );
}

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

/** Preferensi reduced motion; server selalu `false` sehingga tidak terjadi hydration mismatch. */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}

export function useIsStatic(): boolean {
  const forced = useContext(StaticContext);
  const reduced = usePrefersReducedMotion();
  return forced || reduced;
}
