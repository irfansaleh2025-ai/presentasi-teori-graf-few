"use client";

import { motion } from "motion/react";
import { Droplets, Wheat, Zap } from "lucide-react";
import type { CSSProperties } from "react";
import type { GraphNode } from "@/lib/graph-metrics";
import { EASE, useIsStatic } from "./anim";
import { edgeGeometry } from "./AnimatedGraph";

type Vars = CSSProperties & Record<`--${string}`, string | number>;

const SECTORS = {
  W: { label: "Air", Icon: Droplets, color: "var(--color-water)", deep: "var(--color-water-deep)", soft: "var(--color-water-soft)" },
  F: { label: "Pangan", Icon: Wheat, color: "var(--color-wheat)", deep: "var(--color-wheat-deep)", soft: "var(--color-wheat-soft)" },
  E: { label: "Energi", Icon: Zap, color: "var(--color-soil)", deep: "var(--color-soil)", soft: "var(--color-soil-soft)" },
} as const;

type SectorId = keyof typeof SECTORS;

const nodes: (GraphNode & { id: SectorId })[] = [
  { id: "W", short: "", label: "Air", x: 360, y: 120 },
  { id: "F", short: "", label: "Pangan", x: 130, y: 500 },
  { id: "E", short: "", label: "Energi", x: 590, y: 500 },
];

const links: { from: SectorId; to: SectorId; label: string }[] = [
  { from: "W", to: "F", label: "irigasi" },
  { from: "F", to: "W", label: "limpasan" },
  { from: "E", to: "W", label: "pemompaan" },
  { from: "W", to: "E", label: "pendinginan" },
  { from: "E", to: "F", label: "pupuk & mesin" },
  { from: "F", to: "E", label: "bioenergi" },
];

/**
 * Diagram keterkaitan Food–Energy–Water. Setiap sektor punya warna sendiri;
 * aliran pada edge mengikuti warna sektor asal dan bergerak searah panah.
 */
export function FewDiagram({
  labels = true,
  dark = false,
  delay = 0.35,
  className = "h-full w-full",
}: {
  labels?: boolean;
  dark?: boolean;
  delay?: number;
  className?: string;
}) {
  const isStatic = useIsStatic();
  const R = 66;
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const edgeStart = delay + 0.55;
  return (
    <svg viewBox="0 0 720 640" className={className} role="img" aria-label="Diagram keterkaitan pangan, energi, dan air">
      {links.map((l, i) => {
        const g = edgeGeometry(byId[l.from], byId[l.to], R, 0.2);
        const d = edgeStart + i * 0.12;
        const color = SECTORS[l.from].color;
        return (
          <g key={`${l.from}${l.to}`}>
            <motion.path
              d={g.d}
              fill="none"
              strokeWidth={2.4}
              strokeLinecap="round"
              style={{ stroke: color, opacity: dark ? 0.6 : 0.75 }}
              initial={isStatic ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.55, delay: d, ease: EASE }}
            />
            <path
              d={g.d}
              fill="none"
              strokeWidth={4}
              strokeLinecap="round"
              strokeDasharray="4 16"
              className="loop-dash decor-motion"
              style={{ stroke: dark ? "#ffffff" : SECTORS[l.from].deep, opacity: dark ? 0.7 : 0.85, "--dur": "2s", "--delay": `${-i * 0.33}s` } as Vars}
            />
            <motion.polygon
              points={g.arrow}
              style={{ fill: SECTORS[l.from].deep }}
              initial={isStatic ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: d + 0.45 }}
            />
            {labels && (
              <motion.text
                className="svg-halo"
                x={g.mid.x + g.normal.x * 6}
                y={g.mid.y + g.normal.y * 6}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={19}
                fontWeight={500}
                style={{ fill: SECTORS[l.from].deep }}
                initial={isStatic ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: d + 0.4 }}
              >
                {l.label}
              </motion.text>
            )}
          </g>
        );
      })}
      {nodes.map((n, i) => {
        const s = SECTORS[n.id];
        return (
          <motion.g
            key={n.id}
            initial={isStatic ? false : { opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, delay: delay + i * 0.15, ease: EASE }}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          >
            <circle
              cx={n.x}
              cy={n.y}
              r={R}
              fill="none"
              strokeWidth={2.5}
              className="loop-pulse decor-motion"
              style={{ stroke: s.color, "--dur": "4.5s", "--delay": `${-i * 1.5}s` } as Vars}
            />
            <circle
              cx={n.x}
              cy={n.y}
              r={R + 12}
              strokeWidth={4}
              className="loop-seq decor-motion"
              style={{ fill: "none", stroke: s.color, "--dur": "9s", "--delay": `${i * 3}s` } as Vars}
            />
            <circle
              cx={n.x}
              cy={n.y}
              r={R}
              strokeWidth={3}
              style={{ fill: dark ? "rgba(255,255,255,0.08)" : s.soft, stroke: s.color }}
            />
            <s.Icon x={n.x - 20} y={n.y - 34} width={40} height={40} color={dark ? "#ffffff" : s.deep} strokeWidth={1.8} />
            <text
              x={n.x}
              y={n.y + 26}
              textAnchor="middle"
              fontSize={22}
              fontWeight={600}
              style={{ fill: dark ? "var(--color-cream)" : s.deep }}
            >
              {s.label}
            </text>
          </motion.g>
        );
      })}
    </svg>
  );
}
