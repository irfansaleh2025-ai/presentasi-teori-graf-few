"use client";

import { AnimatePresence, motion } from "motion/react";
import { content } from "@/data/slides";
import { metricGraph } from "@/data/graphs";
import {
  argMax,
  betweenness,
  closeness,
  degreeCentrality,
  eigenvector,
  fmt,
  inDegree,
  outDegree,
  pageRank,
  simpleCycles,
  type Graph,
  type Metric,
} from "@/lib/graph-metrics";
import { AnimatedFlowchart } from "../AnimatedFlowchart";
import { AnimatedGraph, edgeKey } from "../AnimatedGraph";
import { Tex } from "../Tex";
import { SlideScene } from "../scenes";
import { Badge, FadeUp, SlideShell } from "../ui";
import type { SlideProps } from "./types";

/* ---------------- Slide 5 — Pemodelan Graf ---------------- */

const cldExample: Graph = {
  nodes: [
    { id: "R", tone: "water", short: "R", label: "Curah Hujan", x: 90, y: 110, labelDy: -50 },
    { id: "W", tone: "water", short: "W", label: "Ketersediaan Air", x: 340, y: 110, labelDy: -50 },
    { id: "P", tone: "food", short: "P", label: "Produksi Pangan", x: 560, y: 260, labelDy: 62 },
    { id: "I", tone: "water", short: "I", label: "Irigasi", x: 340, y: 400 },
    { id: "H", tone: "energy", short: "H", label: "Harga Energi", x: 90, y: 400 },
  ],
  edges: [
    { from: "R", to: "W", sign: "+" },
    { from: "W", to: "I", sign: "+" },
    { from: "W", to: "P", sign: "+" },
    { from: "I", to: "P", sign: "+" },
    { from: "H", to: "I", sign: "-" },
  ],
};

export function ModelingSlide() {
  const c = content.s05;
  return (
    <SlideShell
      number={5}
      eyebrow={c.eyebrow}
      title={c.title}
      backdrop={
<SlideScene n={5} />
      }
    >
      <div className="grid h-full grid-cols-[1fr_680px] gap-12">
        <dl className="flex flex-col justify-center divide-y divide-line border-y border-line">
          {c.terms.map((t, i) => (
            <FadeUp key={t.term} delay={0.2 + i * 0.09} y={10} className="grid grid-cols-[220px_1fr] gap-6 py-[18px]">
              <dt className="font-mono text-[20px] font-medium text-forest">{t.term}</dt>
              <dd className="text-[21px] leading-snug text-charcoal/85">{t.desc}</dd>
            </FadeUp>
          ))}
        </dl>
        <div className="flex flex-col rounded-2xl border border-line bg-white/80 p-5">
          <AnimatedGraph graph={cldExample} width={660} height={480} r={30} showSigns delay={0.4} className="w-full" />
          <FadeUp delay={1.4} className="mt-auto flex items-center justify-between px-2 text-[17px] text-muted">
            <span>{c.caption}</span>
            <span className="font-mono">
              <span className="text-leaf">+</span> searah · <span className="text-soil">−</span> berlawanan
            </span>
          </FadeUp>
        </div>
      </div>
    </SlideShell>
  );
}

/* ---------------- Slide 6 — Dasar Teori ---------------- */

const mini = (ids: [string, number, number][], edges: [string, string, ("+" | "-")?][]): Graph => ({
  nodes: ids.map(([id, x, y]) => ({ id, short: id, label: "", x, y })),
  edges: edges.map(([from, to, sign]) => ({ from, to, sign })),
});

const theoryDiagrams: { graph: Graph; highlightEdges?: string[]; highlightNodes?: string[]; signs?: boolean; center?: string }[] = [
  { graph: mini([["u", 50, 140], ["v", 150, 50], ["w", 250, 140]], [["u", "v"], ["v", "w"], ["u", "w"]]) },
  {
    graph: mini([["1", 35, 140], ["2", 105, 55], ["3", 190, 140], ["4", 265, 55]], [["1", "2"], ["2", "3"], ["3", "4"], ["1", "3"]]),
    highlightEdges: [edgeKey("1", "2"), edgeKey("2", "3"), edgeKey("3", "4")],
  },
  {
    graph: mini([["1", 50, 125], ["2", 140, 35], ["3", 230, 125], ["4", 272, 174]], [["1", "2"], ["2", "3"], ["3", "1"], ["3", "4"]]),
    highlightEdges: [edgeKey("1", "2"), edgeKey("2", "3"), edgeKey("3", "1")],
  },
  {
    graph: mini([["X", 60, 140], ["Y", 150, 40], ["Z", 240, 140]], [["X", "Z", "+"], ["Z", "Y", "+"], ["Y", "X", "-"]]),
    signs: true,
    center: "B",
    highlightEdges: [edgeKey("X", "Z"), edgeKey("Z", "Y"), edgeKey("Y", "X")],
  },
];

const cardAccents = ["bg-forest", "bg-leaf", "bg-fresh", "bg-wheat"];

export function TheorySlide() {
  const c = content.s06;
  return (
    <SlideShell
      number={6}
      eyebrow={c.eyebrow}
      title={c.title}
      backdrop={
<SlideScene n={6} />
      }
    >
      <div className="grid h-full grid-cols-4 gap-6">
        {c.cards.map((card, i) => {
          const dg = theoryDiagrams[i];
          return (
            <FadeUp
              key={card.term}
              delay={0.2 + i * 0.12}
              className="relative flex flex-col overflow-hidden rounded-2xl border border-line bg-white/90 p-6"
            >
              <span className={`absolute inset-x-0 top-0 h-1.5 ${cardAccents[i]}`} />
              <div className="relative">
                <AnimatedGraph
                  graph={dg.graph}
                  width={300}
                  height={200}
                  r={20}
                  shortSize={15}
                  highlightEdges={dg.highlightEdges}
                  showSigns={dg.signs}
                  delay={0.4 + i * 0.25}
                  nodeStagger={0.06}
                  edgeStagger={0.1}
                  className="w-full"
                />
                {dg.center && (
                  <FadeUp delay={1.8} className="absolute top-[53.5%] left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-soil font-mono text-[18px] font-semibold text-soil">
                      {dg.center}
                    </span>
                  </FadeUp>
                )}
              </div>
              <h3 className="mt-5 text-[26px] font-semibold text-forest">{card.term}</h3>
              <div className="mt-3 text-[19px] text-charcoal">
                <Tex>{card.formula}</Tex>
              </div>
              <p className="mt-4 text-[19px] leading-snug text-muted">{card.desc}</p>
            </FadeUp>
          );
        })}
      </div>
    </SlideShell>
  );
}

/* ---------------- Slide 7 — Metrik Graf ---------------- */

type MetricKey = (typeof content.s07.metrics)[number]["key"];

const dc = degreeCentrality(metricGraph);
const metricValues: Record<MetricKey, { values: Metric; digits: number }> = {
  in: { values: inDegree(metricGraph), digits: 0 },
  out: { values: outDegree(metricGraph), digits: 0 },
  deg: { values: Object.fromEntries(Object.entries(dc).map(([k, v]) => [k, v.total])), digits: 2 },
  bet: { values: betweenness(metricGraph), digits: 1 },
  clo: { values: closeness(metricGraph), digits: 2 },
  pr: { values: pageRank(metricGraph), digits: 2 },
  eig: { values: eigenvector(metricGraph), digits: 2 },
};

export function MetricsSlide({ step, onStep }: SlideProps) {
  const c = content.s07;
  const active = c.metrics[Math.min(step, c.metrics.length - 1)];
  const { values, digits } = metricValues[active.key];
  const top = argMax(values);
  const labels = Object.fromEntries(Object.entries(values).map(([k, v]) => [k, fmt(v, digits)]));
  const edges =
    active.key === "in"
      ? metricGraph.edges.filter((e) => top.includes(e.to))
      : active.key === "out"
        ? metricGraph.edges.filter((e) => top.includes(e.from))
        : [];

  return (
    <SlideShell
      number={7}
      eyebrow={c.eyebrow}
      title={c.title}
      aside={<span className="font-mono text-[15px] text-faint">→ metrik berikutnya</span>}
      backdrop={<SlideScene n={7} />}
    >
      <div className="grid h-full grid-cols-[1fr_600px] gap-12">
        <div className="flex flex-col rounded-2xl border border-line bg-white/80 p-5">
          <AnimatedGraph
            graph={metricGraph}
            width={780}
            height={510}
            r={32}
            shortSize={22}
            highlightNodes={top}
            highlightEdges={edges.map((e) => edgeKey(e.from, e.to))}
            values={labels}
            delay={0.3}
            className="w-full"
          />
          <FadeUp delay={1.2} className="mt-auto px-2 text-[17px] text-muted">
            Graf ilustratif 6 vertex · nilai dihitung otomatis · vertex tertinggi disorot
          </FadeUp>
        </div>

        <div className="flex flex-col">
          {c.metrics.map((m, i) => {
            const isActive = m.key === active.key;
            return (
              <FadeUp key={m.key} delay={0.2 + i * 0.06} y={8}>
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => onStep(i)}
                  className={`w-full rounded-r-lg border-l-[3px] py-[9px] pr-4 pl-5 text-left transition-colors duration-300 ${
                    isActive ? "border-leaf bg-mist" : "border-line hover:border-leaf/50 hover:bg-white/60"
                  }`}
                >
                  <div className="flex items-baseline justify-between">
                    <span
                      className={`text-[23px] transition-colors duration-300 ${isActive ? "font-semibold text-forest" : "text-muted"}`}
                    >
                      {m.name}
                    </span>
                    {isActive && (
                      <span className="rounded-full bg-forest px-3 py-0.5 font-mono text-[15px] text-cream">
                        tertinggi: {top.join(", ")} = {labels[top[0]]}
                      </span>
                    )}
                  </div>
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-3 pb-2 text-[20px] text-charcoal">
                          <Tex>{m.formula}</Tex>
                        </div>
                        <p className="pb-1 text-[18px] leading-snug text-muted">{m.desc}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </SlideShell>
  );
}

/* ---------------- Slide 8 — ALC ---------------- */

const loopGraph: Graph = {
  nodes: [
    { id: "A", short: "A", label: "", x: 70, y: 150 },
    { id: "B", short: "B", label: "", x: 220, y: 50 },
    { id: "C", short: "C", label: "", x: 220, y: 250 },
    { id: "D", short: "D", label: "", x: 370, y: 150 },
  ],
  edges: [
    { from: "A", to: "B" },
    { from: "B", to: "C" },
    { from: "C", to: "A" },
    { from: "C", to: "D" },
    { from: "D", to: "B" },
  ],
};

const loops = simpleCycles(loopGraph);
const participation = Object.fromEntries(
  loopGraph.nodes.map((n) => [n.id, loops.filter((cyc) => cyc.includes(n.id)).length]),
);
const shared = loopGraph.nodes.map((n) => n.id).filter((id) => participation[id] === loops.length);
const loopEdges = loops.flatMap((cyc) => cyc.map((v, i) => edgeKey(v, cyc[(i + 1) % cyc.length])));

const loopCaptions = [
  `Ditemukan ${loops.length} loop: ${loops.map((l) => l.join("→") + "→" + l[0]).join(" dan ")}`,
  `Jumlah loop yang melibatkan tiap vertex`,
  `Kedua loop berbagi vertex ${shared.join(" dan ")} — tumpang tindih`,
  `Keterlibatan dan kemiripan digabung menjadi skor vertex`,
  `Vertex ${shared.join(" dan ")} menjadi kandidat strategis`,
];

export function AlcSlide({ step, onStep }: SlideProps) {
  const c = content.s08;
  const s = Math.min(step, c.flow.length - 1);
  return (
    <SlideShell
      number={8}
      eyebrow={c.eyebrow}
      title={c.title}
      backdrop={
<SlideScene n={8} />
      }
    >
      <div className="flex h-full flex-col">
        <div className="grid grid-cols-[1fr_440px] gap-14">
          <div>
            <FadeUp delay={0.2}>
              <p className="text-[26px] leading-snug text-charcoal/85">{c.lead}</p>
            </FadeUp>
            <div className="mt-8 grid grid-cols-2 gap-6">
              {c.ideas.map((idea, i) => (
                <FadeUp key={idea.title} delay={0.35 + i * 0.1} className="rounded-xl border-t-4 border-leaf bg-white/80 px-5 pt-4 pb-5">
                  <h3 className="text-[23px] font-semibold text-forest">{idea.title}</h3>
                  <p className="mt-2 text-[19px] leading-snug text-muted">{idea.desc}</p>
                </FadeUp>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center rounded-2xl border border-line bg-white/80 py-2">
            <AnimatedGraph
              graph={loopGraph}
              width={440}
              height={300}
              r={26}
              highlightEdges={s === 0 ? loopEdges : undefined}
              highlightNodes={s >= 2 ? shared : undefined}
              values={s >= 1 && s <= 3 ? Object.fromEntries(Object.entries(participation).map(([k, v]) => [k, `${v}`])) : undefined}
              delay={0.5}
              className="h-[200px]"
            />
            <AnimatePresence mode="wait">
              <motion.p
                key={s}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="mt-2 text-center text-[17px] text-muted"
              >
                {loopCaptions[s]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-auto">
          <AnimatedFlowchart steps={c.flow} active={s} onSelect={onStep} delay={0.6} />
          <FadeUp delay={1.4} className="mt-5 flex items-center justify-between">
            <Badge>{c.note}</Badge>
            <span className="font-mono text-[15px] text-faint">ilustrasi konsep, bukan rumus ALC</span>
          </FadeUp>
        </div>
      </div>
    </SlideShell>
  );
}
