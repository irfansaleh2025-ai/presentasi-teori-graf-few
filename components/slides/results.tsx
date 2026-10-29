"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { AlertTriangle, Check, Lightbulb, Rocket, Share2, Sprout } from "lucide-react";
import { content, source } from "@/data/slides";
import { fmt } from "@/lib/graph-metrics";
import { EASE, useIsStatic } from "../anim";
import { AnimatedFlowchart } from "../AnimatedFlowchart";
import { Cinematic } from "../cinema";
import { SlideScene } from "../scenes";
import { FewDiagram } from "../FewDiagram";
import { StatCounter } from "../StatCounter";
import { Tex } from "../Tex";
import { Badge, FadeUp, SlideShell } from "../ui";
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

/** Warna cluster diambil dari Gambar 6 jurnal agar strip cocok dengan gambar aslinya. */
const clusterColors = ["#d03020", "#e87048", "#d8b880", "#e8e098", "#b0d0b0", "#70a8b8", "#2878b8"];

export function ResultsSlide() {
  const c = content.s13;
  const icons = [Rocket, Share2];
  const roleVariables = [c.initiators, c.disseminators];
  const roleNotes = ["Outdegree tertinggi", c.disseminatorsNote];
  const f = c.figure;
  return (
    <SlideShell
      number={13}
      eyebrow={c.eyebrow}
      title={c.title}
      backdrop={
<SlideScene n={13} />
      }
    >
      <div className="flex h-full flex-col gap-4">
        <div className="grid min-h-0 flex-1 grid-cols-[1fr_620px] gap-9">
          <div className="flex min-h-0 flex-col">
            <FadeUp delay={0.15} className="mb-3 flex items-baseline justify-between">
              <span className="text-[22px] font-semibold text-forest">{c.variablesTitle}</span>
              <span className="font-mono text-[13px] text-faint">{c.variablesNote}</span>
            </FadeUp>
            <div className="grid min-h-0 flex-1 grid-cols-2 gap-4">
              {c.roles.map((r, i) => {
                const Icon = icons[i];
                return (
                  <FadeUp
                    key={r.title}
                    delay={0.2 + i * 0.12}
                    className={`flex flex-col rounded-2xl border px-5 py-4 ${i === 0 ? "border-leaf/30 bg-mist" : "border-wheat/50 bg-wheat-soft"}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${i === 0 ? "bg-forest" : "bg-wheat-deep"}`}>
                        <Icon className="h-5 w-5 text-cream" strokeWidth={1.8} />
                      </span>
                      <div>
                        <h3 className="text-[21px] leading-tight font-semibold text-forest">{r.title}</h3>
                        <div className="text-[15px] leading-tight text-muted">{r.subtitle}</div>
                      </div>
                    </div>
                    <ul className="mt-2 flex flex-1 flex-col justify-evenly">
                      {roleVariables[i].map((v) => (
                        <li key={v.name} className="flex items-baseline justify-between gap-3 border-t border-charcoal/10 py-1.5">
                          <span className="text-[17px] leading-snug font-medium text-charcoal/90">{v.name}</span>
                          <span className={`shrink-0 font-mono text-[13px] ${i === 0 ? "text-forest" : "text-wheat-deep"}`}>{v.metric}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="border-t border-charcoal/10 pt-2 font-mono text-[12px] leading-tight text-faint">{roleNotes[i]}</p>
                  </FadeUp>
                );
              })}
            </div>
            <FadeUp delay={0.45} className="mt-3">
              <p className="text-[16px] leading-snug text-muted">{c.rolesSummary}</p>
            </FadeUp>
            <FadeUp delay={0.55} className="mt-4">
              <div className="mb-2 flex items-baseline justify-between">
                <span className="text-[18px] font-semibold text-forest">{c.clustersTitle}</span>
                <span className="font-mono text-[13px] text-faint">{c.clustersNote}</span>
              </div>
              <div className="grid grid-cols-4 gap-2.5">
                {c.clusters.map((cl, i) => (
                  <FadeUp key={cl.name} delay={0.6 + i * 0.05} y={8}>
                    <div
                      className={`rounded-xl border bg-white/85 px-3 py-1.5 ${
                        "isolated" in cl ? "border-dashed border-charcoal/30" : "border-line"
                      }`}
                      style={{ borderLeft: `5px solid ${clusterColors[i]}` }}
                    >
                      <div className="flex items-baseline justify-between font-mono text-[13px]">
                        <span className="font-semibold text-forest">C{i + 1}</span>
                        <span className="text-muted">{cl.vertices} vertex</span>
                      </div>
                      <div className="text-[15px] leading-tight text-charcoal/85">{cl.name}</div>
                    </div>
                  </FadeUp>
                ))}
              </div>
            </FadeUp>
          </div>
          <FadeUp delay={0.35} className="flex min-h-0 flex-col">
            <div className="mb-3 text-[22px] font-semibold text-forest">{f.title}</div>
            <figure
              data-cine="figure"
              data-cine-at="0.6"
              className="flex min-h-0 flex-1 flex-col rounded-2xl border border-line bg-white px-2 pt-2 pb-2.5"
            >
              <div data-cine="figure-media" className="relative min-h-0 flex-1">
                <Image
                  src={f.src}
                  alt={f.alt}
                  fill
                  sizes="(min-width: 1800px) 740px, 620px"
                  loading="eager"
                  className="object-contain"
                />
              </div>
              <figcaption className="mt-1.5 border-t border-line px-2 pt-2 text-[14px] leading-snug text-muted">
                {f.caption} <span className="text-faint">{f.source}</span>
              </figcaption>
            </figure>
            <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 font-mono text-[12px] whitespace-nowrap text-faint">
              {f.notes.map((n, i) => (
                <span key={n}>
                  {i > 0 && <span className="mr-2">·</span>}
                  {n}
                </span>
              ))}
            </div>
          </FadeUp>
        </div>
        <FadeUp delay={0.9} className="flex items-center gap-3 text-[18px] text-muted">
          <Sprout className="h-5 w-5 shrink-0 text-leaf" />
          <span>
            <span className="font-semibold text-forest">Kesimpulan</span> — {c.takeaway}
          </span>
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
        {/* Kutipan penutup: garis emas tumbuh lebih dulu, lalu baris kutipan naik satu per satu (GSAP). */}
        <div className="relative mt-auto mb-6 pl-10">
          <span data-cine="rule-v" data-cine-at="0.7" className="absolute inset-y-0 left-0 w-1 bg-wheat" />
          <blockquote
            data-cine="quote"
            data-cine-at="0.85"
            className="max-w-[1080px] text-[42px] leading-[1.2] font-medium tracking-[-0.02em] text-cream"
          >
            “{c.quote}”
          </blockquote>
        </div>
      </div>
    </SlideShell>
  );
}

/* ---------------- Slide 16 — Terima kasih ---------------- */

/** Penutup yang menggemakan slide pembuka: lanskap yang sama, judul besar, lalu kelompok dan sumber. */
export function ThankYouSlide() {
  const c = content.s16;
  const group = content.s01.group;
  return (
    <Cinematic className="relative h-full overflow-hidden bg-cream">
      <div data-cine="backdrop" className="pointer-events-none absolute inset-0">
        <div data-cine-depth="14" className="absolute -inset-[14px]">
          <SlideScene n={1} />
        </div>
      </div>

      <div className="relative h-full px-[112px] pt-[84px]">
        <div data-cine="eyebrow" data-cine-at="0.1" className="flex items-center gap-4 font-mono text-[17px] tracking-[0.14em] text-muted uppercase">
          <Sprout className="h-5 w-5 text-leaf" strokeWidth={2} />
          {c.eyebrow}
        </div>

        <h1
          data-cine="title"
          data-cine-at="0.2"
          className="mt-8 text-[148px] leading-[0.98] font-semibold tracking-[-0.045em] text-forest"
        >
          {c.title}
        </h1>
        <div className="mt-8 flex items-center gap-5">
          <span data-cine="rule" data-cine-at="0.7" className="h-[3px] w-16 bg-wheat" />
          <FadeUp delay={0.8}>
            <p className="text-[30px] leading-snug text-charcoal/85">{c.subtitle}</p>
          </FadeUp>
        </div>
        <FadeUp delay={0.95} className="mt-5 pl-[84px] text-[18px] text-muted">
          {source.authors} · {source.year} · <span className="font-medium text-forest">{source.journal}</span>
        </FadeUp>

        <FadeUp delay={0.35} className="absolute top-[70px] right-[90px] h-[420px] w-[470px]">
          <FewDiagram labels={false} delay={0.6} />
        </FadeUp>

        <FadeUp
          delay={1.0}
          className="absolute bottom-[64px] left-[112px] flex items-end gap-14 rounded-2xl border border-white/70 bg-white/85 px-8 py-5 shadow-[0_16px_40px_-24px_rgba(35,75,53,0.5)] backdrop-blur-sm"
        >
          <div className="grid grid-cols-2 gap-x-10 gap-y-1 text-[18px] text-charcoal/85">
            {group.members.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
          <div className="text-[17px] leading-relaxed text-muted">
            <div>{group.className}</div>
            <div>{group.institution}</div>
          </div>
        </FadeUp>
      </div>
    </Cinematic>
  );
}
