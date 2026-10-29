"use client";

import { motion } from "motion/react";
import { AlertTriangle, Check, Lightbulb, Rocket, Share2, Sprout } from "lucide-react";
import { content } from "@/data/slides";
import { fmt } from "@/lib/graph-metrics";
import { EASE, useIsStatic } from "../anim";
import { AnimatedFlowchart } from "../AnimatedFlowchart";
import { AmbientNetwork, DecorLayer } from "../decor";
import { SlideScene } from "../scenes";
import { FewDiagram } from "../FewDiagram";
import { StatCounter } from "../StatCounter";
import { Tex } from "../Tex";
import { Badge, FadeUp, Placeholder, SlideShell } from "../ui";
import type { SlideProps } from "./types";

/* ---------------- Slide 11 — Alur Penelitian ---------------- */

export function WorkflowSlide({ step, onStep }: SlideProps) {
  const c = content.s11;
  return (
    <SlideShell
      number={11}
      eyebrow={c.eyebrow}
      title={c.title}
      backdrop={
<SlideScene n={11} />
      }
    >
      <div className="flex h-full flex-col justify-center pb-16">
        <AnimatedFlowchart
          steps={c.flow}
          active={Math.min(step, c.flow.length - 1)}
          onSelect={onStep}
          delay={0.3}
          stagger={0.18}
          progress
        />
        <FadeUp delay={1.6} className="mt-8 flex items-center justify-between text-[19px] text-muted">
          <span>
            Input: <span className="font-medium text-forest">pengetahuan ahli</span>
          </span>
          <span className="font-mono text-[15px] text-faint">→ untuk menyorot tahap berikutnya</span>
          <span>
            Output: <span className="font-medium text-forest">leverage points</span>
          </span>
        </FadeUp>
      </div>
    </SlideShell>
  );
}

/* ---------------- Slide 12 — Karakteristik Graf ---------------- */

const tileColors = ["text-forest", "text-leaf", "text-wheat-deep", "text-water-deep", "text-soil", "text-forest"];
const barColors = ["bg-forest", "bg-leaf", "bg-wheat", "bg-water", "bg-soil", "bg-fresh"];

/** Meter tipis untuk menempatkan nilai pada skala yang jelas (mis. 0–1). */
function Meter({ ratio, color, label, delay }: { ratio: number; color: string; label: string; delay: number }) {
  const isStatic = useIsStatic();
  return (
    <div className="mt-3">
      <div className="h-2 overflow-hidden rounded-full bg-sage">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={isStatic ? false : { width: 0 }}
          animate={{ width: `${Math.max(ratio * 100, 1.5)}%` }}
          transition={{ duration: 1.1, delay, ease: EASE }}
        />
      </div>
      <div className="mt-1 font-mono text-[13px] text-faint">{label}</div>
    </div>
  );
}

export function CharacteristicsSlide() {
  const c = content.s12;
  const [vertices, edges] = c.metrics;
  const computedDensity = edges.value / (vertices.value * (vertices.value - 1));
  const diameter = c.metrics[3].value;
  /** Skala meter: density & modularity pada 0–1, panjang lintasan relatif terhadap diameter */
  const meters: Record<string, { ratio: number; label: string } | undefined> = {
    Density: { ratio: c.metrics[2].value, label: "skala 0 – 1" },
    Diameter: { ratio: 1, label: "jarak terpendek terpanjang" },
    "Average path length": { ratio: c.metrics[4].value / diameter, label: `relatif terhadap diameter (${diameter})` },
    Modularity: { ratio: c.metrics[5].value, label: "skala 0 – 1" },
  };
  return (
    <SlideShell number={12} eyebrow={c.eyebrow} title={c.title} aside={<Badge tone="wheat">{c.badge}</Badge>}
      backdrop={
<SlideScene n={12} />
      }
    >
      <div className="flex h-full flex-col">
        <div className="grid grid-cols-3 gap-x-8 gap-y-5">
          {c.metrics.map((m, i) => (
            <FadeUp key={m.name} delay={0.2 + i * 0.1} className="relative overflow-hidden rounded-2xl border border-line bg-white/85 px-7 pt-4 pb-4">
              <span className={`absolute inset-y-0 left-0 w-1.5 ${barColors[i]}`} />
              <div className="font-mono text-[16px] tracking-[0.12em] text-muted uppercase">{m.name}</div>
              <StatCounter
                value={m.value}
                decimals={m.decimals}
                delay={0.3 + i * 0.1}
                className={`mt-1 block text-[62px] leading-none font-semibold tracking-[-0.03em] ${tileColors[i]}`}
              />
              <p className="mt-2 text-[18px] leading-snug text-charcoal/75">{m.desc}</p>
              {meters[m.name] && (
                <Meter ratio={meters[m.name]!.ratio} color={barColors[i]} label={meters[m.name]!.label} delay={0.5 + i * 0.1} />
              )}
            </FadeUp>
          ))}
        </div>
        <FadeUp delay={1.0} className="mt-auto flex items-center gap-4 self-start rounded-full bg-white/80 px-5 py-1.5 text-[18px] text-muted">
          <span className="font-mono text-[14px] tracking-[0.14em] uppercase">Cek konsistensi</span>
          <Tex>{`\\text{density}=\\frac{|E|}{|V|(|V|-1)}=\\frac{${edges.value}}{${vertices.value}\\times${vertices.value - 1}}\\approx ${fmt(computedDensity, 4)}`}</Tex>
        </FadeUp>
      </div>
    </SlideShell>
  );
}

/* ---------------- Slide 13 — Hasil ---------------- */

const clusterColors = [
  "var(--color-forest)",
  "var(--color-leaf)",
  "var(--color-fresh)",
  "var(--color-wheat)",
  "var(--color-soil)",
  "var(--color-water)",
  "var(--color-water-deep)",
];

export function ResultsSlide() {
  const c = content.s13;
  const icons = [Rocket, Share2];
  return (
    <SlideShell
      number={13}
      eyebrow={c.eyebrow}
      title={c.title}
      backdrop={
<SlideScene n={13} />
      }
    >
      <div className="grid h-full grid-cols-[1fr_420px] gap-12">
        <div className="flex flex-col">
          <div className="grid grid-cols-2 gap-8">
            {c.roles.map((r, i) => {
              const Icon = icons[i];
              return (
                <FadeUp
                  key={r.title}
                  delay={0.2 + i * 0.12}
                  className={`rounded-2xl border p-7 ${i === 0 ? "border-leaf/30 bg-mist" : "border-wheat/50 bg-wheat-soft"}`}
                >
                  <span className={`flex h-12 w-12 items-center justify-center rounded-full ${i === 0 ? "bg-forest" : "bg-wheat-deep"}`}>
                    <Icon className="h-6 w-6 text-cream" strokeWidth={1.8} />
                  </span>
                  <h3 className="mt-4 text-[28px] font-semibold text-forest">{r.title}</h3>
                  <p className="mt-2 text-[20px] leading-snug text-muted">{r.desc}</p>
                  <Placeholder label="[Contoh variabel dari jurnal]" className="mt-5 py-3" />
                </FadeUp>
              );
            })}
          </div>
          <FadeUp delay={0.5} className="mt-auto">
            <div className="mb-4 flex items-baseline justify-between">
              <span className="text-[24px] font-semibold text-forest">{c.clustersTitle}</span>
              <span className="font-mono text-[14px] text-faint">komposisi menyusul dari Tabel 4</span>
            </div>
            <div className="grid grid-cols-7 gap-3">
              {Array.from({ length: 7 }, (_, i) => (
                <FadeUp key={i} delay={0.6 + i * 0.06} y={8}>
                  <div className="relative flex h-[118px] flex-col justify-between overflow-hidden rounded-xl border border-line bg-white/85 p-3 pt-4">
                    <span className="absolute inset-x-0 top-0 h-1.5" style={{ background: clusterColors[i] }} />
                    <span className="flex items-center gap-2 font-mono text-[16px] font-semibold text-forest">
                      <span className="h-3 w-3 rounded-full" style={{ background: clusterColors[i] }} />C{i + 1}
                    </span>
                    <span className="font-mono text-[13px] leading-tight text-faint">{c.clusterPlaceholder}</span>
                  </div>
                </FadeUp>
              ))}
            </div>
          </FadeUp>
        </div>
        <FadeUp delay={0.45} className="flex flex-col">
          <div className="relative flex-1 overflow-hidden rounded-xl">
            <DecorLayer>
              <AmbientNetwork region={{ x: 200, y: 120, w: 1200, h: 660 }} count={16} seed={21} opacity={0.35} />
            </DecorLayer>
            <Placeholder label={c.figurePlaceholder} className="relative h-full" />
          </div>
          <p className="mt-3 text-[16px] leading-snug text-muted">
            Ganti dengan diagram yang direkonstruksi dari Gambar 6 setelah data jurnal tersedia. Tidak menggunakan screenshot.
          </p>
        </FadeUp>
      </div>
    </SlideShell>
  );
}

/* ---------------- Slide 14 — Kritik ---------------- */

const toneStyles = {
  green: { card: "bg-mist border-leaf/30", chip: "bg-leaf", text: "text-forest", Icon: Check },
  warm: { card: "bg-wheat-soft border-wheat/50", chip: "bg-wheat-deep", text: "text-wheat-deep", Icon: AlertTriangle },
  navy: { card: "bg-water-soft border-water/50", chip: "bg-water-deep", text: "text-water-deep", Icon: Lightbulb },
} as const;

export function CritiqueSlide() {
  const c = content.s14;
  return (
    <SlideShell
      number={14}
      eyebrow={c.eyebrow}
      title={c.title}
      backdrop={
<SlideScene n={14} />
      }
    >
      <div className="grid h-full grid-cols-3 grid-rows-[1fr_auto] gap-x-8">
        {c.columns.map((col, i) => {
          const t = toneStyles[col.tone];
          return (
            <FadeUp key={col.heading} delay={0.2 + i * 0.15} className={`flex flex-col rounded-2xl border p-8 ${t.card}`}>
              <div className="flex items-center gap-4">
                <span className={`flex h-12 w-12 items-center justify-center rounded-full ${t.chip}`}>
                  <t.Icon className="h-6 w-6 text-cream" strokeWidth={2} />
                </span>
                <h3 className={`text-[30px] font-semibold ${t.text}`}>{col.heading}</h3>
              </div>
              <ul className="mt-6 space-y-5">
                {col.items.map((item, j) => (
                  <FadeUp key={item} delay={0.35 + i * 0.15 + j * 0.1} y={10}>
                    <li className="border-t border-charcoal/10 pt-4 text-[22px] leading-snug text-charcoal/90">{item}</li>
                  </FadeUp>
                ))}
              </ul>
            </FadeUp>
          );
        })}
        <FadeUp delay={0.9} className="col-span-3 mt-6 flex items-center gap-3 text-[21px] text-muted">
          <Sprout className="h-6 w-6 shrink-0 text-leaf" />
          <span>
            <span className="font-semibold text-forest">Rekomendasi</span> — gabungkan analisis struktur (graf dan ALC) untuk memilih
            kandidat leverage points dengan simulasi perilaku untuk menguji dampaknya.
          </span>
        </FadeUp>
      </div>
    </SlideShell>
  );
}

/* ---------------- Slide 15 — Kesimpulan ---------------- */

export function ConclusionSlide() {
  const c = content.s15;
  return (
    <SlideShell
      number={15}
      eyebrow={c.eyebrow}
      title={<span className="block max-w-[1000px]">{c.title}</span>}
      dark
      background="bg-forest"
      backdrop={
        <>
<SlideScene n={15} />
          <div className="absolute top-[26px] right-[80px] h-[258px] w-[290px]">
            <FewDiagram labels={false} dark delay={0.4} />
          </div>
        </>
      }
    >
      <div className="flex h-full flex-col">
        <div className="grid grid-cols-3 gap-8">
          {c.points.map((p, i) => (
            <FadeUp key={p} delay={0.2 + i * 0.12} className="rounded-2xl border border-white/10 bg-white/[0.06] px-6 py-5 backdrop-blur-[2px]">
              <span className="font-mono text-[18px] text-fresh">{String(i + 1).padStart(2, "0")}</span>
              <p className="mt-3 text-[22px] leading-snug text-cream/90">{p}</p>
            </FadeUp>
          ))}
        </div>
        <FadeUp delay={0.75} y={24} className="mt-auto mb-6 border-l-4 border-wheat pl-10">
          <blockquote className="max-w-[1080px] text-[42px] leading-[1.2] font-medium tracking-[-0.02em] text-cream">“{c.quote}”</blockquote>
        </FadeUp>
      </div>
    </SlideShell>
  );
}
