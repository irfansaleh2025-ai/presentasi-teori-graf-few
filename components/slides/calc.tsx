"use client";

import { content } from "@/data/slides";
import { fewGraph } from "@/data/graphs";
import {
  betweenness,
  betweennessBreakdown,
  degreeCentrality,
  fmt,
  inDegree,
  loopPolarity,
  outDegree,
  simpleCycles,
} from "@/lib/graph-metrics";
import { AnimatedGraph, TONES } from "../AnimatedGraph";
import { Tex } from "../Tex";
import { SlideScene } from "../scenes";
import { Badge, FadeRow, FadeUp, SlideShell } from "../ui";
import type { SlideProps } from "./types";

/* Semua nilai di bawah dihitung dari `fewGraph` — graf yang sama dengan Slide 9. */
const n = fewGraph.nodes.length;
const indeg = inDegree(fewGraph);
const outdeg = outDegree(fewGraph);
const degC = degreeCentrality(fewGraph);
const bet = betweenness(fewGraph);
const cycles = simpleCycles(fewGraph);
const nodeName = Object.fromEntries(fewGraph.nodes.map((v) => [v.id, v.label]));

const fraction = (num: number, den: number) => (den === 1 ? `${num}` : `\\tfrac{${num}}{${den}}`);
const arrowPath = (p: string[]) => p.join("\\to ");

/* ---------------- Slide 9 — Rekonstruksi Graf ---------------- */

const legend = [
  { tone: "food", label: "Pangan" },
  { tone: "water", label: "Air" },
  { tone: "energy", label: "Energi" },
  { tone: "general", label: "Sosial & kebijakan" },
] as const;

export function ReconstructionSlide() {
  const c = content.s09;
  return (
    <SlideShell
      number={9}
      eyebrow={c.eyebrow}
      title={c.title}
      aside={<Badge tone="wheat">{c.badge}</Badge>}
      backdrop={
<SlideScene n={9} />
      }
    >
      <div className="grid h-full grid-cols-[1fr_470px] gap-10">
        <div className="relative -mt-4 flex flex-col rounded-2xl border border-line bg-white/80 px-3 pt-2 pb-3">
          <AnimatedGraph
            graph={fewGraph}
            width={880}
            height={600}
            r={30}
            showSigns
            autoHighlight
            delay={0.3}
            nodeStagger={0.1}
            className="min-h-0 w-full flex-1"
          />
          <FadeUp delay={1.3} className="flex items-center gap-6 px-3 text-[16px] text-muted">
            {legend.map((l) => (
              <span key={l.label} className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-full border-2" style={{ background: TONES[l.tone].fill, borderColor: TONES[l.tone].stroke }} />
                {l.label}
              </span>
            ))}
          </FadeUp>
        </div>
        <div className="flex flex-col">
          <FadeUp delay={0.3} className="flex items-baseline justify-between border-b border-line pb-3">
            <span className="font-mono text-[15px] tracking-[0.14em] text-muted uppercase">Daftar edge</span>
            <span className="font-mono text-[15px] text-muted">
              |V| = {n} · |E| = {fewGraph.edges.length}
            </span>
          </FadeUp>
          <ol className="mt-2 grid grid-cols-2 gap-x-8">
            {fewGraph.edges.map((e, i) => (
              <FadeUp key={`${e.from}${e.to}`} delay={0.5 + i * 0.06} y={8}>
                <li className="flex items-center gap-3 border-b border-line/70 py-[9px] font-mono text-[19px]">
                  <span className="w-6 text-[15px] text-faint">{i + 1}</span>
                  <span className="text-charcoal">
                    {e.from} → {e.to}
                  </span>
                  <span className={`ml-auto font-semibold ${e.sign === "+" ? "text-leaf" : "text-soil"}`}>
                    {e.sign === "+" ? "+" : "−"}
                  </span>
                </li>
              </FadeUp>
            ))}
          </ol>

          <FadeUp delay={1.2} className="mt-7">
            <span className="font-mono text-[15px] tracking-[0.14em] text-muted uppercase">Feedback loop terbentuk</span>
            <ul className="mt-3 space-y-2">
              {cycles.map((cyc) => (
                <li key={cyc.join("")} className="flex items-center justify-between text-[19px]">
                  <span className="font-mono text-charcoal">{[...cyc, cyc[0]].join(" → ")}</span>
                  <span className="rounded-full bg-wheat-soft px-3 py-0.5 font-mono text-[14px] text-wheat-deep">
                    {loopPolarity(fewGraph, cyc) === "+" ? "reinforcing (R)" : "balancing (B)"}
                  </span>
                </li>
              ))}
            </ul>
          </FadeUp>
          <FadeUp delay={1.4} className="mt-auto text-[16px] leading-snug text-muted">
            Graf berarah tanpa bobot. Tanda +/− hanya atribut CLD dan tidak memengaruhi perhitungan metrik.
          </FadeUp>
        </div>
      </div>
    </SlideShell>
  );
}

/* ---------------- Slide 10 — Perhitungan Manual ---------------- */

export function CalculationSlide({ step, onStep }: SlideProps) {
  const c = content.s10;
  const dv = c.degreeExample;
  const bv = c.betweennessExample;
  const terms = betweennessBreakdown(fewGraph, bv);
  const total = bet[bv];
  const norm = (n - 1) * (n - 2);
  const maxBet = Math.max(...Object.values(bet));
  const activeIdx = Math.min(step, terms.length - 1);
  const active = terms[activeIdx];
  /** Vertex pada lintasan terpendek aktif yang melewati vertex contoh */
  const onPath = new Set(active.paths.filter((p) => p.includes(bv)).flat());

  return (
    <SlideShell number={10} eyebrow={c.eyebrow} title={c.title} aside={<Badge tone="wheat">Graf Slide 9 · n = {n}</Badge>}
      backdrop={
<SlideScene n={10} />
      }
    >
      <div className="grid h-full grid-cols-[540px_1fr] gap-14">
        {/* Tabel derajat */}
        <div className="flex flex-col">
          <table className="w-full text-[18px]">
            <thead>
              <FadeRow delay={0.2} className="border-b border-charcoal/70 text-left font-mono text-[14px] tracking-wider text-muted">
                  <th className="py-2 font-medium uppercase">Vertex</th>
                  <th className="py-2 text-right font-medium">
                    <Tex>{"\\deg^-"}</Tex>
                  </th>
                  <th className="py-2 text-right font-medium">
                    <Tex>{"\\deg^+"}</Tex>
                  </th>
                  <th className="py-2 text-right font-medium">
                    <Tex>{"C_D"}</Tex>
                  </th>
                  <th className="py-2 text-right font-medium">
                    <Tex>{"C_B"}</Tex>
                  </th>
                </FadeRow>
            </thead>
            <tbody>
              {fewGraph.nodes.map((v, i) => {
                const hi = v.id === dv || v.id === bv;
                const path = onPath.has(v.id) && !hi;
                return (
                  <FadeRow
                    key={v.id}
                    delay={0.3 + i * 0.07}
                    className={`border-b border-line font-mono transition-colors duration-300 ${hi ? "bg-sage" : path ? "bg-wheat-soft" : ""}`}
                  >
                      <td className="py-[7px] pl-2">
                        <span
                          className="mr-2 inline-block h-2.5 w-2.5 rounded-full"
                          style={{ background: TONES[v.tone ?? "general"].stroke }}
                        />
                        <span className={`font-semibold ${hi ? "text-forest" : "text-charcoal"}`}>{v.id}</span>
                        <span className="ml-3 font-sans text-[15px] text-muted">{v.label}</span>
                      </td>
                      <td className="py-[7px] text-right">{indeg[v.id]}</td>
                      <td className="py-[7px] text-right">{outdeg[v.id]}</td>
                      <td className="py-[7px] text-right">{fmt(degC[v.id].total, 3)}</td>
                      <td className={`py-[7px] pr-2 text-right ${bet[v.id] === maxBet ? "font-semibold text-leaf" : ""}`}>
                        {fmt(bet[v.id], 1)}
                      </td>
                    </FadeRow>
                );
              })}
              <FadeRow delay={0.85} className="font-mono text-muted">
                  <td className="py-[7px] pl-2 font-sans text-[15px]">Jumlah</td>
                  <td className="py-[7px] text-right">{Object.values(indeg).reduce((a, b) => a + b, 0)}</td>
                  <td className="py-[7px] text-right">{Object.values(outdeg).reduce((a, b) => a + b, 0)}</td>
                  <td colSpan={2} className="py-[7px] pr-2 text-right font-sans text-[15px]">
                    Σdeg⁻ = Σdeg⁺ = |E|
                  </td>
                </FadeRow>
            </tbody>
          </table>

          <FadeUp delay={1.0} className="mt-auto rounded-xl border border-line border-l-4 border-l-leaf bg-white/90 px-6 py-4">
            <div className="font-mono text-[14px] tracking-[0.14em] text-muted uppercase">
              Degree centrality · contoh vertex {dv}
            </div>
            <div className="mt-2 text-[21px]">
              <Tex>{`C_D(v)=\\frac{\\deg^-(v)+\\deg^+(v)}{2(n-1)}`}</Tex>
            </div>
            <div className="mt-1 text-[21px] text-forest">
              <Tex>{`C_D(${dv})=\\frac{${indeg[dv]}+${outdeg[dv]}}{2(${n}-1)}=\\frac{${indeg[dv] + outdeg[dv]}}{${2 * (n - 1)}}=${fmt(degC[dv].total, 3)}`}</Tex>
            </div>
          </FadeUp>
        </div>

        {/* Betweenness bertahap */}
        <div className="flex flex-col">
          <FadeUp delay={0.4} className="flex items-end justify-between">
            <div>
              <div className="font-mono text-[14px] tracking-[0.14em] text-muted uppercase">
                Betweenness · vertex {bv} ({nodeName[bv]})
              </div>
              <div className="mt-2 text-[22px]">
                <Tex>{`C_B(v)=\\sum_{s\\neq v\\neq t}\\frac{\\sigma_{st}(v)}{\\sigma_{st}}`}</Tex>
              </div>
            </div>
            <span className="pb-1 text-[15px] text-muted">
              <Tex>{"\\sigma_{st}"}</Tex> = jumlah lintasan terpendek s → t
            </span>
          </FadeUp>

          <div className="mt-4 border-t border-charcoal/70">
            <div className="grid grid-cols-[80px_1fr_150px] border-b border-line py-2 font-mono text-[14px] tracking-wider text-muted">
              <span>(s, t)</span>
              <span className="uppercase">Lintasan terpendek</span>
              <span className="text-right">
                <Tex>{`\\sigma_{st}(${bv})/\\sigma_{st}`}</Tex>
              </span>
            </div>
            {terms.map((t, i) => (
              <FadeUp key={t.s + t.t} delay={0.6 + i * 0.12} y={6}>
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => onStep(i)}
                  className={`grid w-full grid-cols-[80px_1fr_150px] items-center border-b border-l-[3px] border-b-line py-[9px] pl-2 text-left text-[18px] transition-colors duration-300 ${
                    i === activeIdx ? "border-l-leaf bg-mist" : "border-l-transparent hover:bg-white/60"
                  }`}
                >
                  <span className="font-mono text-charcoal">
                    ({t.s}, {t.t})
                  </span>
                  <span className="flex flex-wrap gap-x-5 text-[17px]">
                    {t.paths.map((p) => (
                      <span
                        key={p.join("")}
                        className={`rounded px-1 transition-colors duration-300 ${
                          p.includes(bv) ? (i === activeIdx ? "bg-wheat-soft text-forest" : "text-forest") : "text-faint"
                        }`}
                      >
                        <Tex>{arrowPath(p)}</Tex>
                      </span>
                    ))}
                  </span>
                  <span className="text-right text-[19px]">
                    <Tex>{`\\frac{${t.sigmaSTv}}{${t.sigmaST}}=${fraction(t.sigmaSTv, t.sigmaST)}`}</Tex>
                  </span>
                </button>
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={0.7 + terms.length * 0.12} className="relative mt-auto overflow-hidden rounded-xl bg-forest px-6 py-4 text-white">
            <div className="text-[22px]">
              <Tex>{`C_B(${bv})=${terms
                .map((t, i) => (i === activeIdx ? `\\color{#A7C957}{${fraction(t.sigmaSTv, t.sigmaST)}}` : fraction(t.sigmaSTv, t.sigmaST)))
                .join("+")}=${fmt(total, 0)}`}</Tex>
            </div>
            <div className="mt-1 text-[19px] text-white/80">
              <Tex>{`\\text{Normalisasi: }\\frac{C_B(${bv})}{(n-1)(n-2)}=\\frac{${fmt(total, 0)}}{${norm}}=${fmt(total / norm, 3)}`}</Tex>
            </div>
          </FadeUp>
          <FadeUp delay={0.9 + terms.length * 0.12} className="mt-3 text-[15px] text-muted">
            Langkah {activeIdx + 1}/{terms.length} · baris kuning di tabel kiri = vertex pada jalur aktif. Pasangan lain berkontribusi 0;
            lintasan abu-abu tidak melewati {bv}.
          </FadeUp>
        </div>
      </div>
    </SlideShell>
  );
}
