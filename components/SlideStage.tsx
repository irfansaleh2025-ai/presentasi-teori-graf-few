"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

export const SLIDE_W = 1600;
export const SLIDE_H = 900;

/**
 * Kanvas slide 16:9 berukuran tetap 1600×900 yang diskalakan agar pas dengan wadah.
 * Jika `scale` diberikan (thumbnail), pengukuran dilewati.
 */
export function SlideStage({ children, scale: fixedScale, className = "" }: { children: ReactNode; scale?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [measured, setMeasured] = useState<number | null>(null);

  useLayoutEffect(() => {
    if (fixedScale !== undefined || !ref.current) return;
    const el = ref.current;
    const update = () => setMeasured(Math.min(el.clientWidth / SLIDE_W, el.clientHeight / SLIDE_H));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [fixedScale]);

  const scale = fixedScale ?? measured;

  if (fixedScale !== undefined) {
    return (
      <div className={`relative overflow-hidden ${className}`} style={{ width: SLIDE_W * fixedScale, height: SLIDE_H * fixedScale }}>
        <div className="absolute top-0 left-0 origin-top-left" style={{ width: SLIDE_W, height: SLIDE_H, transform: `scale(${fixedScale})` }}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className={`relative h-full w-full overflow-hidden ${className}`}>
      <div
        className="absolute top-1/2 left-1/2 bg-cream"
        style={{
          width: SLIDE_W,
          height: SLIDE_H,
          transform: `translate(-50%, -50%) scale(${scale ?? 1})`,
          visibility: scale === null ? "hidden" : "visible",
        }}
      >
        {children}
        <div className="paper-grain pointer-events-none absolute inset-0" aria-hidden />
      </div>
    </div>
  );
}
