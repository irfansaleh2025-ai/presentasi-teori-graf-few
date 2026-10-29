"use client";

import { ArrowRight, GitBranch, HelpCircle, MapPin, Sprout, Target, Users } from "lucide-react";
import { content, source } from "@/data/slides";
import { Cinematic } from "../cinema";
import { CornerSprig, DecorLayer } from "../decor";
import { SlideScene } from "../scenes";
import { FewDiagram } from "../FewDiagram";
import { StatCounter } from "../StatCounter";
import { Bullets, FadeUp, SlideShell } from "../ui";

/* ---------------- Slide 1 — Judul ---------------- */

export function TitleSlide() {
  const c = content.s01;
  return (
    <Cinematic className="relative h-full overflow-hidden bg-cream">
      {/* Pembuka: lanskap naik dari kedalaman, judul tersusun per baris, lalu sumber dan diagram FEW. */}
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

        <div className="mt-10 max-w-[940px]">
          <h1
            data-cine="title"
            data-cine-at="0.2"
            className="text-[66px] leading-[1.04] font-semibold tracking-[-0.03em] text-balance text-forest"
          >
            {c.title}
          </h1>
          <FadeUp delay={0.75} className="mt-8 flex flex-col gap-2 border-l-[3px] border-wheat pl-6">
            <span className="font-mono text-[15px] tracking-[0.12em] text-muted uppercase">Berdasarkan artikel</span>
            <span className="text-[24px] leading-snug text-charcoal/90 italic">“{source.articleTitle}”</span>
            <span className="text-[21px] text-muted">
              {source.authors} · {source.year} · <span className="font-medium text-forest">{source.journal}</span>
            </span>
          </FadeUp>
        </div>

        <FadeUp delay={0.35} className="absolute top-[70px] right-[90px] h-[420px] w-[470px]">
          <FewDiagram labels={false} delay={0.6} />
        </FadeUp>

        <FadeUp
          delay={1.0}
          className="absolute bottom-[64px] left-[112px] flex items-end gap-14 rounded-2xl border border-white/70 bg-white/85 px-8 py-5 shadow-[0_16px_40px_-24px_rgba(35,75,53,0.5)] backdrop-blur-sm"
        >
          <div className="grid grid-cols-2 gap-x-10 gap-y-1 text-[18px] text-charcoal/85">
            {c.group.members.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
          <div className="text-[17px] leading-relaxed text-muted">
            <div>{c.group.className}</div>
            <div>{c.group.institution}</div>
          </div>
        </FadeUp>
      </div>
    </Cinematic>
  );
}

/* ---------------- Slide 2 — Latar Belakang ---------------- */

export function BackgroundSlide() {
  const c = content.s02;
  const accents = ["bg-wheat", "bg-water", "bg-soil"];
  return (
    <SlideShell
      number={2}
      eyebrow={c.eyebrow}
      title={c.title}
      backdrop={
<SlideScene n={2} />
      }
    >
      <div className="grid h-full grid-cols-[1fr_640px] gap-16">
        <div className="flex flex-col">
          <FadeUp delay={0.2}>
            <p className="text-[27px] leading-snug text-charcoal/90">{c.lead}</p>
          </FadeUp>
          <ul className="mt-10 space-y-5">
            {c.points.map((p, i) => (
              <FadeUp key={p} delay={0.35 + i * 0.09} y={12}>
                <li className="flex gap-4 text-[23px] leading-snug text-charcoal/85">
                  <span className={`mt-[0.55em] h-[10px] w-[10px] shrink-0 rounded-full ${accents[i]}`} />
                  <span>{p}</span>
                </li>
              </FadeUp>
            ))}
          </ul>
          <FadeUp delay={0.8} className="mt-auto mb-6 flex items-center gap-4 rounded-xl bg-forest px-6 py-5 text-cream">
            <ArrowRight className="h-7 w-7 shrink-0 text-fresh" />
            <span className="text-[24px] font-medium">{c.closing}</span>
          </FadeUp>
        </div>
        <div className="relative -mt-14 h-[calc(100%+40px)]">
          <FewDiagram />
        </div>
      </div>
    </SlideShell>
  );
}

/* ---------------- Slide 3 — Permasalahan & Tujuan ---------------- */

export function ProblemSlide() {
  const c = content.s03;
  return (
    <SlideShell
      number={3}
      eyebrow={c.eyebrow}
      title={c.title}
      backdrop={
<SlideScene n={3} />
      }
    >
      <div className="flex h-full flex-col">
        <div className="grid flex-1 grid-cols-[1fr_72px_1fr] items-stretch">
          <FadeUp delay={0.2} className="flex flex-col rounded-2xl bg-sage p-10">
            <div className="flex items-center gap-3">
              <HelpCircle className="h-8 w-8 text-soil" strokeWidth={1.8} />
              <span className="font-mono text-[18px] tracking-[0.14em] text-soil uppercase">{c.problem.heading}</span>
            </div>
            <p className="mt-6 text-[31px] leading-[1.25] font-medium tracking-[-0.01em] text-charcoal">{c.problem.statement}</p>
            <Bullets items={c.problem.points} delay={0.4} className="mt-8" size="text-[21px]" />
          </FadeUp>
          <FadeUp delay={0.38} className="z-10 flex items-center justify-center">
            <span className="-mx-6 flex h-14 w-14 items-center justify-center rounded-full border-4 border-cream bg-wheat text-forest shadow-md">
              <ArrowRight className="h-6 w-6" strokeWidth={2.4} />
            </span>
          </FadeUp>
          <FadeUp delay={0.45} className="relative flex flex-col overflow-hidden rounded-2xl bg-forest p-10 text-cream">
            <DecorLayer className="opacity-100">
              <CornerSprig corner="br" scale={0.8} opacity={0.18} color="var(--color-fresh)" />
            </DecorLayer>
            <div className="relative flex items-center gap-3">
              <Target className="h-8 w-8 text-fresh" strokeWidth={1.8} />
              <span className="font-mono text-[18px] tracking-[0.14em] text-fresh uppercase">{c.goal.heading}</span>
            </div>
            <p className="relative mt-6 text-[31px] leading-[1.25] font-medium tracking-[-0.01em]">{c.goal.statement}</p>
            <ul className="relative mt-8 space-y-5">
              {c.goal.points.map((p, i) => (
                <FadeUp key={p} delay={0.65 + i * 0.09} y={12}>
                  <li className="flex gap-4 text-[21px] leading-snug text-cream/90">
                    <span className="mt-[0.6em] h-[7px] w-[7px] shrink-0 rounded-full bg-fresh" />
                    <span>{p}</span>
                  </li>
                </FadeUp>
              ))}
            </ul>
          </FadeUp>
        </div>
        <FadeUp delay={0.85} className="mt-7 flex items-center gap-3 text-[21px] text-muted">
          <Sprout className="h-6 w-6 text-leaf" />
          <span>
            <span className="font-semibold text-forest">Leverage point</span> — {c.definition.split(": ")[1]}
          </span>
        </FadeUp>
      </div>
    </SlideShell>
  );
}

/* ---------------- Slide 4 — Data Penelitian ---------------- */

const statStyles = [
  { Icon: Users, value: "text-forest", bar: "bg-forest", chip: "bg-sage text-forest" },
  { Icon: Sprout, value: "text-leaf", bar: "bg-leaf", chip: "bg-mist text-leaf" },
  { Icon: GitBranch, value: "text-wheat-deep", bar: "bg-wheat", chip: "bg-wheat-soft text-wheat-deep" },
];

export function DataSlide() {
  const c = content.s04;
  return (
    <SlideShell
      number={4}
      eyebrow={c.eyebrow}
      title={c.title}
      backdrop={
<SlideScene n={4} />
      }
    >
      <div className="flex h-full flex-col">
        <div className="grid grid-cols-3 gap-8">
          {c.stats.map((s, i) => {
            const st = statStyles[i];
            return (
              <FadeUp
                key={s.label}
                delay={0.2 + i * 0.12}
                className="relative flex flex-col overflow-hidden rounded-2xl border border-line bg-white/85 px-9 pt-9 pb-8"
              >
                <span className={`absolute inset-x-0 top-0 h-1.5 ${st.bar}`} />
                <span className={`flex h-12 w-12 items-center justify-center rounded-full ${st.chip}`}>
                  <st.Icon className="h-6 w-6" strokeWidth={1.8} />
                </span>
                <StatCounter
                  value={s.value}
                  delay={0.3 + i * 0.12}
                  className={`mt-5 text-[132px] leading-none font-semibold tracking-[-0.04em] ${st.value}`}
                />
                <span className="mt-5 text-[27px] font-semibold text-charcoal">{s.label}</span>
                <span className="mt-1 text-[20px] text-muted">{s.desc}</span>
              </FadeUp>
            );
          })}
        </div>
        <FadeUp delay={0.7} className="mt-auto flex items-center gap-5">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-water-soft">
            <MapPin className="h-7 w-7 text-water-deep" />
          </span>
          <div>
            <div className="font-mono text-[15px] tracking-[0.14em] text-muted uppercase">{c.region.label}</div>
            <div className="text-[28px] font-medium text-forest">{c.region.value}</div>
            <div className="text-[18px] text-muted">{c.note}</div>
          </div>
        </FadeUp>
      </div>
    </SlideShell>
  );
}
