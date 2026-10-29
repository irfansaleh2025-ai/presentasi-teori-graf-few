"use client";

import { AnimatePresence, motion } from "motion/react";
import type { CSSProperties } from "react";
import type { Graph, GraphEdge, GraphNode, NodeTone } from "@/lib/graph-metrics";
import { EASE, useIsStatic } from "./anim";

export const edgeKey = (from: string, to: string) => `${from}>${to}`;

interface AnimatedGraphProps {
  graph: Graph;
  width: number;
  height: number;
  r?: number;
  /** Vertex yang disorot; jika diisi, vertex lain diredupkan */
  highlightNodes?: string[];
  /** Edge yang disorot (gunakan `edgeKey`) */
  highlightEdges?: string[];
  /** Vertex dengan aksen sekunder (hijau) */
  accentNodes?: string[];
  showSigns?: boolean;
  /** Nilai kecil di samping vertex, misalnya hasil metrik */
  values?: Record<string, string>;
  delay?: number;
  nodeStagger?: number;
  edgeStagger?: number;
  labelSize?: number;
  shortSize?: number;
  className?: string;
  /** Aliran cahaya bergerak di sepanjang edge searah panah (loop) */
  flow?: boolean;
  /** Denyut halus pada vertex (loop) */
  pulse?: boolean;
  /** Sorotan bergantian otomatis antarvertex jika tidak ada sorotan eksplisit */
  autoHighlight?: boolean;
}

type Vars = CSSProperties & Record<`--${string}`, string | number>;

interface Point {
  x: number;
  y: number;
}

/**
 * Panjang vektor dengan Math.sqrt. Math.hypot tidak wajib dibulatkan dengan benar oleh spesifikasi,
 * sehingga Node (SSR) dan browser bisa berbeda di digit terakhir → hydration mismatch pada atribut SVG.
 */
const length = (x: number, y: number) => Math.sqrt(x * x + y * y);

/** Bulatkan koordinat ke 3 desimal agar string atribut SVG identik di server dan klien. */
const round = (n: number) => Math.round(n * 1000) / 1000;
const pt = (p: Point): Point => ({ x: round(p.x), y: round(p.y) });

export function edgeGeometry(a: GraphNode, b: GraphNode, r: number, curve: number) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = length(dx, dy);
  const nx = -dy / len;
  const ny = dx / len;
  const c = pt({ x: (a.x + b.x) / 2 + nx * curve * len, y: (a.y + b.y) / 2 + ny * curve * len });

  const toward = (p: Point, q: Point, dist: number): Point => {
    const l = length(q.x - p.x, q.y - p.y);
    return pt({ x: p.x + ((q.x - p.x) / l) * dist, y: p.y + ((q.y - p.y) / l) * dist });
  };

  const start = toward(a, c, r + 2);
  const tip = toward(b, c, r + 3);
  const tdx = tip.x - c.x;
  const tdy = tip.y - c.y;
  const tl = length(tdx, tdy);
  const ux = tdx / tl;
  const uy = tdy / tl;
  const head = 11;
  const end = pt({ x: tip.x - ux * head, y: tip.y - uy * head });
  const wingA = pt({ x: end.x - uy * 6, y: end.y + ux * 6 });
  const wingB = pt({ x: end.x + uy * 6, y: end.y - ux * 6 });
  const arrow = [`${tip.x},${tip.y}`, `${wingA.x},${wingA.y}`, `${wingB.x},${wingB.y}`].join(" ");
  const mid = pt({
    x: 0.25 * start.x + 0.5 * c.x + 0.25 * end.x,
    y: 0.25 * start.y + 0.5 * c.y + 0.25 * end.y,
  });
  return {
    d: `M ${start.x} ${start.y} Q ${c.x} ${c.y} ${end.x} ${end.y}`,
    arrow,
    sign: pt({ x: mid.x + nx * 17, y: mid.y + ny * 17 }),
    mid,
    normal: { x: round(nx), y: round(ny) },
  };
}

/** Warna per kategori vertex — merujuk CSS variables di globals.css. */
export const TONES: Record<NodeTone, { stroke: string; fill: string; text: string; flow: string }> = {
  general: { stroke: "var(--color-forest)", fill: "#ffffff", text: "var(--color-forest)", flow: "var(--color-leaf)" },
  water: { stroke: "var(--color-water-deep)", fill: "var(--color-water-soft)", text: "var(--color-water-deep)", flow: "var(--color-water)" },
  food: { stroke: "var(--color-wheat-deep)", fill: "var(--color-wheat-soft)", text: "var(--color-wheat-deep)", flow: "var(--color-wheat)" },
  energy: { stroke: "var(--color-soil)", fill: "var(--color-soil-soft)", text: "var(--color-soil)", flow: "var(--color-soil)" },
};

const COLORS = {
  edge: "#b4bcab",
  edgeHi: "var(--color-forest)",
  nodeHi: "var(--color-forest)",
  accent: "var(--color-leaf)",
  glow: "var(--color-fresh)",
};

/** Graf berarah SVG: vertex muncul satu per satu, edge digambar bertahap, lalu aliran dan denyut berjalan terus. */
export function AnimatedGraph({
  graph,
  width,
  height,
  r = 28,
  highlightNodes,
  highlightEdges,
  accentNodes = [],
  showSigns = false,
  values,
  delay = 0.2,
  nodeStagger = 0.08,
  edgeStagger = 0.06,
  labelSize = 19,
  shortSize = 20,
  className,
  flow = true,
  pulse = true,
  autoHighlight = false,
}: AnimatedGraphProps) {
  const isStatic = useIsStatic();
  const byId = Object.fromEntries(graph.nodes.map((n) => [n.id, n]));
  const hasHighlight = Boolean(highlightNodes?.length || highlightEdges?.length);
  const edgesStart = delay + graph.nodes.length * nodeStagger + 0.1;
  const seqPeriod = 2.4;

  const curveOf = (e: GraphEdge) =>
    e.curve ?? (graph.edges.some((o) => o.from === e.to && o.to === e.from) ? 0.16 : 0);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={className} role="img">
      {graph.edges.map((e, i) => {
        const g = edgeGeometry(byId[e.from], byId[e.to], r, curveOf(e));
        const key = edgeKey(e.from, e.to);
        const hi = highlightEdges?.includes(key) ?? false;
        const dim = hasHighlight && !hi;
        const color = hi ? COLORS.edgeHi : COLORS.edge;
        const flowColor = hi ? COLORS.glow : TONES[byId[e.from].tone ?? "general"].flow;
        const d = edgesStart + i * edgeStagger;
        return (
          <g key={key} style={{ opacity: dim ? 0.25 : 1, transition: "opacity 300ms ease" }}>
            <motion.path
              d={g.d}
              fill="none"
              strokeWidth={hi ? 3.5 : 2.2}
              strokeLinecap="round"
              style={{ stroke: color, transition: "stroke 300ms ease, stroke-width 300ms ease" }}
              initial={isStatic ? false : { pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                pathLength: { duration: 0.5, delay: d, ease: EASE },
                opacity: { duration: 0.01, delay: d },
              }}
            />
            {flow && !dim && (
              <motion.path
                d={g.d}
                fill="none"
                strokeWidth={hi ? 4 : 3}
                strokeLinecap="round"
                strokeDasharray="3 17"
                className="loop-dash decor-motion"
                style={{ stroke: flowColor, "--dur": hi ? "1.1s" : "1.8s", "--delay": `${-i * 0.3}s` } as Vars}
                initial={isStatic ? false : { opacity: 0 }}
                animate={{ opacity: 0.95 }}
                transition={{ duration: 0.4, delay: isStatic ? 0 : d + 0.5 }}
              />
            )}
            <motion.polygon
              points={g.arrow}
              style={{ fill: color, transition: "fill 300ms ease" }}
              initial={isStatic ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: d + 0.42 }}
            />
            {showSigns && e.sign && (
              <motion.g
                initial={isStatic ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: d + 0.45 }}
              >
                <circle cx={g.sign.x} cy={g.sign.y} r={12} style={{ fill: "var(--color-cream)" }} />
                <text
                  x={g.sign.x}
                  y={g.sign.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={21}
                  fontWeight={600}
                  style={{ fill: e.sign === "+" ? "var(--color-leaf)" : "var(--color-soil)" }}
                  fontFamily="var(--font-geist-mono)"
                >
                  {e.sign === "+" ? "+" : "−"}
                </text>
              </motion.g>
            )}
          </g>
        );
      })}

      {graph.nodes.map((n, i) => {
        const tone = TONES[n.tone ?? "general"];
        const hi = highlightNodes?.includes(n.id) ?? false;
        const accent = accentNodes.includes(n.id);
        const dim = hasHighlight && !hi && !accent && !highlightEdges?.some((k) => k.split(">").includes(n.id));
        const fill = hi ? COLORS.nodeHi : accent ? COLORS.accent : tone.fill;
        const stroke = hi ? COLORS.nodeHi : accent ? COLORS.accent : tone.stroke;
        const value = values?.[n.id];
        return (
          <motion.g
            key={n.id}
            initial={isStatic ? false : { opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: delay + i * nodeStagger, ease: EASE }}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          >
            <g style={{ opacity: dim ? 0.3 : 1, transition: "opacity 300ms ease" }}>
              {pulse && !dim && (
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={r}
                  fill="none"
                  strokeWidth={2}
                  className="loop-pulse decor-motion"
                  style={{ stroke: hi ? COLORS.glow : tone.stroke, "--dur": hi ? "2.4s" : "4.2s", "--delay": `${-i * 0.6}s` } as Vars}
                />
              )}
              {autoHighlight && !hasHighlight && (
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={r + 9}
                  strokeWidth={5}
                  className="loop-seq decor-motion"
                  style={
                    {
                      fill: "rgba(167,201,87,0.18)",
                      stroke: COLORS.glow,
                      "--dur": `${graph.nodes.length * seqPeriod}s`,
                      "--delay": `${i * seqPeriod}s`,
                    } as Vars
                  }
                />
              )}
              {hi && <circle cx={n.x} cy={n.y} r={r + 8} fill="none" strokeWidth={2.5} style={{ stroke: COLORS.glow }} />}
              <circle
                cx={n.x}
                cy={n.y}
                r={r}
                strokeWidth={2.4}
                style={{ fill, stroke, transition: "fill 300ms ease, stroke 300ms ease" }}
              />
              <text
                x={n.x}
                y={n.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={shortSize}
                fontWeight={600}
                fontFamily="var(--font-geist-mono)"
                style={{ fill: hi || accent ? "#ffffff" : tone.text, transition: "fill 300ms ease" }}
              >
                {n.short}
              </text>
              {n.label && (
                <text
                  className="svg-halo"
                  x={n.x + (n.labelDx ?? 0)}
                  y={n.y + (n.labelDy ?? r + 26)}
                  textAnchor={n.labelAnchor ?? "middle"}
                  dominantBaseline="central"
                  fontSize={labelSize}
                  style={{ fill: "var(--color-charcoal)" }}
                >
                  {n.labelLines
                    ? n.labelLines.map((line, li) => (
                        <tspan
                          key={line}
                          x={n.x + (n.labelDx ?? 0)}
                          dy={li === 0 ? `${-((n.labelLines!.length - 1) / 2) * 1.15}em` : "1.15em"}
                        >
                          {line}
                        </tspan>
                      ))
                    : n.label}
                </text>
              )}
            </g>
            <AnimatePresence mode="popLayout">
              {value !== undefined && (
                <motion.g
                  key={value}
                  initial={isStatic ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <rect
                    x={n.x + r - 6}
                    y={n.y - r - 22}
                    width={value.length * 11 + 18}
                    height={28}
                    rx={14}
                    strokeWidth={1}
                    style={{ fill: "var(--color-mist)", stroke: "var(--color-leaf)" }}
                  />
                  <text
                    x={n.x + r - 6 + (value.length * 11 + 18) / 2}
                    y={n.y - r - 8}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={16}
                    fontWeight={600}
                    fontFamily="var(--font-geist-mono)"
                    style={{ fill: "var(--color-forest)" }}
                  >
                    {value}
                  </text>
                </motion.g>
              )}
            </AnimatePresence>
          </motion.g>
        );
      })}
    </svg>
  );
}
