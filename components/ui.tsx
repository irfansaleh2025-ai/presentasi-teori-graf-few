"use client";

import { motion } from "motion/react";
import { createContext, useContext, useRef, type ReactNode } from "react";
import { EASE, useIsStatic } from "./anim";
import { useCinematic } from "./cinema";

interface FadeUpProps {
  delay?: number;
  y?: number;
  className?: string;
  children: ReactNode;
}

/**
 * Jeda dasar konten di dalam slide. SlideShell memberi sedikit jeda agar konten
 * menyusul setelah baris judul mulai naik (judul dikendalikan GSAP, konten oleh Motion).
 */
const SequenceOffset = createContext(0);

export function FadeUp({ delay = 0, y = 18, className, children }: FadeUpProps) {
  const isStatic = useIsStatic();
  const offset = useContext(SequenceOffset);
  return (
    <motion.div
      className={className}
      initial={isStatic ? false : { opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: delay + offset, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

interface SlideShellProps {
  number: number;
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  aside?: ReactNode;
  /** Lapisan dekoratif di belakang konten (lihat components/decor.tsx) */
  backdrop?: ReactNode;
  /** Latar slide; default warm cream */
  background?: string;
  /** Teks terang untuk latar gelap */
  dark?: boolean;
}

/** Kerangka umum slide: lapisan dekorasi, label kecil, judul besar, lalu area konten. Urutan masuk diatur GSAP (lihat cinema.tsx). */
export function SlideShell({ number, eyebrow, title, children, aside, backdrop, background = "bg-cream", dark = false }: SlideShellProps) {
  const ref = useRef<HTMLDivElement>(null);
  useCinematic(ref);
  return (
    <div ref={ref} className={`relative h-full overflow-hidden ${background}`}>
      {backdrop && (
        <div data-cine="backdrop" className="pointer-events-none absolute inset-0">
          <div data-cine-depth="10" className="absolute -inset-[10px]">
            {backdrop}
          </div>
        </div>
      )}
      <div className="relative flex h-full flex-col px-[112px] pt-[80px] pb-[84px]">
        <div className="flex items-center justify-between">
          <div
            className={`flex items-center gap-4 font-mono text-[17px] tracking-[0.14em] uppercase ${dark ? "text-sage/80" : "text-muted"}`}
          >
            <span
              data-cine="badge"
              className={`flex h-9 min-w-9 items-center justify-center rounded-full px-2 text-[15px] font-semibold tracking-normal ${
                dark ? "bg-fresh text-forest" : "bg-forest text-cream"
              }`}
            >
              {String(number).padStart(2, "0")}
            </span>
            <span data-cine="rule" className={`h-px w-10 ${dark ? "bg-fresh/60" : "bg-leaf/60"}`} />
            <span data-cine="eyebrow">{eyebrow}</span>
          </div>
          {aside && <div data-cine="aside">{aside}</div>}
        </div>
        <div className="mt-6 max-w-[1250px]">
          <h2
            data-cine="title"
            className={`text-[56px] leading-[1.06] font-semibold tracking-[-0.025em] text-balance ${dark ? "text-cream" : "text-forest"}`}
          >
            {title}
          </h2>
        </div>
        <div className="relative mt-12 min-h-0 flex-1">
          <SequenceOffset.Provider value={0.22}>{children}</SequenceOffset.Provider>
        </div>
      </div>
    </div>
  );
}

export function Bullets({
  items,
  delay = 0.25,
  className = "",
  size = "text-[25px]",
}: {
  items: readonly ReactNode[];
  delay?: number;
  className?: string;
  size?: string;
}) {
  return (
    <ul className={`space-y-5 ${className}`}>
      {items.map((item, i) => (
        <FadeUp key={i} delay={delay + i * 0.09} y={12}>
          <li className={`flex gap-4 leading-snug text-charcoal/85 ${size}`}>
            <span className="mt-[0.62em] h-[7px] w-[7px] shrink-0 rounded-full bg-leaf" />
            <span>{item}</span>
          </li>
        </FadeUp>
      ))}
    </ul>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "forest" | "leaf" | "wheat" | "water";
}) {
  const tones = {
    neutral: "border-line text-muted bg-white/80",
    forest: "border-forest/20 text-forest bg-sage",
    leaf: "border-leaf/30 text-forest bg-mist",
    wheat: "border-wheat/60 text-wheat-deep bg-wheat-soft",
    water: "border-water/60 text-water-deep bg-water-soft",
  } as const;
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 font-mono text-[15px] tracking-wide ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

/** Kotak penanda konten yang harus dilengkapi dari jurnal asli. */
export function Placeholder({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div
      className={`flex items-center justify-center rounded-xl border border-dashed border-leaf/50 bg-white/60 p-4 text-center font-mono text-[15px] text-faint ${className}`}
    >
      {label}
    </div>
  );
}

/** Baris tabel dengan animasi fade-up (motion.tr agar struktur tabel tetap valid). */
export function FadeRow({ delay = 0, className, children }: { delay?: number; className?: string; children: ReactNode }) {
  const isStatic = useIsStatic();
  return (
    <motion.tr
      className={className}
      initial={isStatic ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: EASE }}
    >
      {children}
    </motion.tr>
  );
}
