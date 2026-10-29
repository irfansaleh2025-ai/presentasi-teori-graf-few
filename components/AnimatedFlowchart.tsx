"use client";

import { motion } from "motion/react";
import type { CSSProperties } from "react";
import { EASE, useIsStatic } from "./anim";

export interface FlowStep {
  title: string;
  desc?: string;
}

interface AnimatedFlowchartProps {
  steps: readonly FlowStep[];
  /** Indeks langkah yang sedang dijelaskan */
  active?: number;
  onSelect?: (index: number) => void;
  delay?: number;
  /** Jeda antarlangkah saat muncul */
  stagger?: number;
  /** Tampilkan bar progres di bawah langkah */
  progress?: boolean;
}

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/** Flowchart horizontal; langkah dan panah muncul berurutan, lalu aliran pada konektor bergerak terus. */
export function AnimatedFlowchart({
  steps,
  active,
  onSelect,
  delay = 0.3,
  stagger = 0.16,
  progress = false,
}: AnimatedFlowchartProps) {
  const isStatic = useIsStatic();
  const ratio = active === undefined ? 1 : (active + 1) / steps.length;
  return (
    <div>
      <div className="flex items-stretch">
        {steps.map((step, i) => {
          const isActive = active === i;
          const isDone = active !== undefined && i < active;
          const d = delay + i * stagger;
          const lit = active === undefined || i < active;
          return (
            <div key={step.title} className="flex min-w-0 flex-1 items-stretch">
              <motion.button
                type="button"
                tabIndex={-1}
                onClick={() => onSelect?.(i)}
                initial={isStatic ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: d, ease: EASE }}
                className={`relative flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl border p-6 text-left transition-colors duration-300 ${
                  isActive
                    ? "border-forest bg-forest text-white shadow-[0_10px_30px_-12px_rgba(35,75,53,0.55)]"
                    : isDone
                      ? "border-leaf/40 bg-sage"
                      : "border-line bg-white/85 hover:border-leaf/60"
                } ${onSelect ? "cursor-pointer" : "cursor-default"}`}
              >
                {isActive && (
                  <span
                    className="loop-breathe decor-motion pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full bg-fresh/30 blur-2xl"
                    style={{ "--o0": "0.3", "--o1": "0.9", "--dur": "3.5s" } as Vars}
                  />
                )}
                <span className={`font-mono text-[16px] tracking-widest ${isActive ? "text-fresh" : isDone ? "text-forest" : "text-leaf"}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={`mt-3 text-[23px] leading-tight font-semibold ${isActive ? "text-white" : "text-charcoal"}`}>
                  {step.title}
                </span>
                {step.desc && (
                  <span className={`mt-3 text-[17px] leading-snug ${isActive ? "text-white/85" : "text-muted"}`}>{step.desc}</span>
                )}
              </motion.button>
              {i < steps.length - 1 && (
                <svg viewBox="0 0 44 24" className="w-11 shrink-0 self-center" aria-hidden>
                  <motion.path
                    d="M 4 12 L 34 12"
                    strokeWidth={2.2}
                    strokeLinecap="round"
                    fill="none"
                    style={{ stroke: lit ? "var(--color-forest)" : "#b4bcab", transition: "stroke 300ms ease" }}
                    initial={isStatic ? false : { pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.3, delay: d + 0.25, ease: EASE }}
                  />
                  <path
                    d="M 4 12 L 34 12"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeDasharray="3 17"
                    fill="none"
                    className="loop-dash decor-motion"
                    style={{ stroke: "var(--color-fresh)", "--dur": "1.2s", "--delay": `${-i * 0.2}s` } as Vars}
                  />
                  <motion.path
                    d="M 30 6 L 38 12 L 30 18"
                    strokeWidth={2.2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    style={{ stroke: lit ? "var(--color-forest)" : "#b4bcab", transition: "stroke 300ms ease" }}
                    initial={isStatic ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: d + 0.5 }}
                  />
                </svg>
              )}
            </div>
          );
        })}
      </div>

      {progress && (
        <div className="mt-8 flex items-center gap-5">
          <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-sage">
            <motion.div
              className="relative h-full overflow-hidden rounded-full bg-gradient-to-r from-leaf to-fresh"
              initial={isStatic ? false : { width: 0 }}
              animate={{ width: `${ratio * 100}%` }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <span className="loop-sheen decor-motion absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            </motion.div>
          </div>
          <span className="font-mono text-[16px] text-forest tabular-nums">
            {Math.round(ratio * 100)}%
          </span>
        </div>
      )}
    </div>
  );
}
