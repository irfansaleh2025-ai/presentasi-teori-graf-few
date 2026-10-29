"use client";

import { motion } from "motion/react";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { slides } from "@/data/slides";
import { StaticProvider } from "./anim";
import { SlideRenderer } from "./SlideRenderer";
import { SlideStage } from "./SlideStage";

interface SlideOverviewProps {
  current: number;
  onSelect: (index: number) => void;
  onClose: () => void;
}

/** Grid seluruh slide (thumbnail statis). Escape atau O untuk menutup. */
export function SlideOverview({ current, onSelect, onClose }: SlideOverviewProps) {
  const currentRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    currentRef.current?.scrollIntoView({ block: "nearest" });
  }, [current]);

  return (
    <motion.div
      className="no-print fixed inset-0 z-40 overflow-y-auto bg-cream/97 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      role="dialog"
      aria-label="Overview slide"
    >
      <div className="mx-auto max-w-[1800px] px-10 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="font-mono text-[14px] tracking-[0.14em] text-muted uppercase">
            Overview · {slides.length} slide · ← → untuk berpindah, Enter untuk membuka
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-charcoal/70 hover:bg-sage"
            aria-label="Tutup overview (Esc)"
            title="Tutup (Esc)"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <StaticProvider value>
          <div className="grid grid-cols-3 gap-6 lg:grid-cols-5">
            {slides.map((s, i) => (
              <motion.button
                key={s.id}
                ref={i === current ? currentRef : undefined}
                type="button"
                onClick={() => onSelect(i)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.02 }}
                className="group text-left"
              >
                <div
                  className={`aspect-video w-full overflow-hidden rounded-lg border bg-cream transition-all duration-200 ${
                    i === current ? "border-forest ring-2 ring-leaf" : "border-line group-hover:border-leaf group-hover:shadow-md"
                  }`}
                >
                  <div className="pointer-events-none h-full w-full" aria-hidden>
                    <SlideStage>
                      <SlideRenderer index={i} />
                    </SlideStage>
                  </div>
                </div>
                <div className="mt-2 flex gap-3 text-[14px]">
                  <span className={`font-mono ${i === current ? "text-forest" : "text-faint"}`}>{String(i + 1).padStart(2, "0")}</span>
                  <span className={i === current ? "font-medium text-charcoal" : "text-muted"}>{s.label}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </StaticProvider>
      </div>
    </motion.div>
  );
}
