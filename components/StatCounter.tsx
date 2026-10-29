"use client";

import { animate } from "motion/react";
import { useEffect, useState } from "react";
import { fmt } from "@/lib/graph-metrics";
import { useIsStatic } from "./anim";

interface StatCounterProps {
  value: number;
  decimals?: number;
  delay?: number;
  duration?: number;
  className?: string;
}

/** Angka statistik dengan animasi count-up; format desimal Indonesia (koma). */
export function StatCounter({ value, decimals = 0, delay = 0.2, duration = 1.1, className }: StatCounterProps) {
  const isStatic = useIsStatic();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (isStatic) return;
    const controls = animate(0, value, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: setCurrent,
    });
    return () => controls.stop();
  }, [value, delay, duration, isStatic]);

  return (
    <span className={`tabular-nums ${className ?? ""}`}>{fmt(isStatic ? value : current, decimals)}</span>
  );
}
