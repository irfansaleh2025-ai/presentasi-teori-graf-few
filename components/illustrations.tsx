import type { CSSProperties, ReactNode } from "react";
import { LeafShape } from "./decor";

/*
 * Pustaka ilustrasi vektor semi-flat bertema Food–Water–Energy, desa, kota, dan pemerintahan.
 * Setiap objek digambar dengan pangkal di titik (0,0) dan tumbuh ke atas (y negatif),
 * lalu ditempatkan dengan `x`, `y`, `s` (skala). Semua koordinat statis/bilangan bulat
 * sehingga output server dan klien identik. Animasi memakai kelas CSS `loop-*`.
 */

type Vars = CSSProperties & Record<`--${string}`, string | number>;

export const P = {
  forest: "var(--color-forest)",
  leaf: "var(--color-leaf)",
  fresh: "var(--color-fresh)",
  sage: "var(--color-sage)",
  cream: "var(--color-cream)",
  soil: "var(--color-soil)",
  soilSoft: "var(--color-soil-soft)",
  wheat: "var(--color-wheat)",
  wheatSoft: "var(--color-wheat-soft)",
  water: "var(--color-water)",
  waterDeep: "var(--color-water-deep)",
  waterSoft: "var(--color-water-soft)",
  wheatDeep: "var(--color-wheat-deep)",
  charcoal: "var(--color-charcoal)",
  mist: "var(--color-mist)",
  white: "#ffffff",
  concrete: "#d3d9cc",
  haze: "#cbd9cf",
  road: "#d8ccb5",
} as const;

interface Place {
  x: number;
  y: number;
  s?: number;
}

const at = ({ x, y, s = 1 }: Place) => `translate(${x} ${y}) scale(${s})`;

/* ------------------------------ Alam ------------------------------ */

export function Tree({ kind = "round", delay = 0, ...p }: Place & { kind?: "round" | "pine" | "bush"; delay?: number }) {
  return (
    <g transform={at(p)}>
      <rect x={-3} y={-24} width={6} height={24} rx={2} style={{ fill: P.soil }} />
      <g className="loop-sway" style={{ "--dur": "6s", "--delay": `${delay}s` } as Vars}>
        {kind === "round" && (
          <>
            <circle cx={0} cy={-40} r={19} style={{ fill: P.leaf }} />
            <circle cx={-11} cy={-30} r={12} style={{ fill: P.forest, opacity: 0.85 }} />
            <circle cx={9} cy={-48} r={9} style={{ fill: P.fresh, opacity: 0.8 }} />
          </>
        )}
        {kind === "pine" && (
          <>
            <polygon points="0,-74 -16,-38 16,-38" style={{ fill: P.forest }} />
            <polygon points="0,-56 -20,-18 20,-18" style={{ fill: P.leaf }} />
          </>
        )}
        {kind === "bush" && (
          <>
            <ellipse cx={-8} cy={-14} rx={14} ry={11} style={{ fill: P.leaf }} />
            <ellipse cx={9} cy={-16} rx={13} ry={12} style={{ fill: P.fresh, opacity: 0.85 }} />
          </>
        )}
      </g>
    </g>
  );
}

/** Sawah terasering: pita-pita bertingkat dengan barisan tanaman. */
export function RiceTerrace({ w = 260, rows = 4, ...p }: Place & { w?: number; rows?: number }) {
  return (
    <g transform={at(p)}>
      {Array.from({ length: rows }, (_, i) => {
        const inset = i * 22;
        const y = -(i + 1) * 13;
        return (
          <g key={i}>
            <rect x={inset} y={y} width={w - inset * 2} height={12} rx={6} style={{ fill: i % 2 ? P.fresh : P.leaf, opacity: 0.9 }} />
            <line x1={inset + 8} y1={y + 6} x2={w - inset - 8} y2={y + 6} strokeDasharray="2 7" style={{ stroke: P.cream, strokeWidth: 2, opacity: 0.7 }} />
          </g>
        );
      })}
    </g>
  );
}

/** Ladang gandum: barisan bulir emas. */
export function WheatField({ w = 200, ...p }: Place & { w?: number }) {
  const stalks = Array.from({ length: Math.floor(w / 12) }, (_, i) => i * 12 + 6);
  return (
    <g transform={at(p)}>
      <rect x={0} y={-8} width={w} height={8} rx={4} style={{ fill: P.soil, opacity: 0.5 }} />
      {stalks.map((x, i) => (
        <g key={x} transform={`translate(${x} -6)`}>
          <g className="loop-sway" style={{ "--dur": `${4 + (i % 4) * 0.5}s`, "--delay": `${-i * 0.3}s` } as Vars}>
            <line x1={0} y1={0} x2={0} y2={-22} style={{ stroke: P.wheat, strokeWidth: 2 }} />
            <ellipse cx={0} cy={-26} rx={3.2} ry={7} style={{ fill: P.wheat }} />
          </g>
        </g>
      ))}
    </g>
  );
}

/* ------------------------------ Desa ------------------------------ */

export function House({ roof = P.soil, body = P.white, ...p }: Place & { roof?: string; body?: string }) {
  return (
    <g transform={at(p)}>
      <rect x={-26} y={-34} width={52} height={34} style={{ fill: body, stroke: P.sage, strokeWidth: 1.5 }} />
      <polygon points="-32,-33 0,-58 32,-33" style={{ fill: roof }} />
      <rect x={-6} y={-18} width={12} height={18} rx={1.5} style={{ fill: P.forest }} />
      <rect x={11} y={-27} width={10} height={9} rx={1} style={{ fill: P.wheat }} />
      <rect x={-21} y={-27} width={10} height={9} rx={1} style={{ fill: P.wheat }} />
    </g>
  );
}

export function Barn(p: Place) {
  return (
    <g transform={at(p)}>
      <rect x={-30} y={-38} width={60} height={38} style={{ fill: P.soil }} />
      <polygon points="-36,-37 0,-62 36,-37" style={{ fill: P.forest }} />
      <rect x={-12} y={-24} width={24} height={24} style={{ fill: P.cream }} />
      <path d="M-12 -24 L12 0 M12 -24 L-12 0" style={{ stroke: P.soil, strokeWidth: 2 }} />
      <rect x={34} y={-52} width={14} height={52} rx={7} style={{ fill: P.concrete }} />
      <ellipse cx={41} cy={-52} rx={7} ry={4} style={{ fill: P.wheat }} />
    </g>
  );
}

/** Industri kecil dengan cerobong berasap. */
export function Factory(p: Place) {
  return (
    <g transform={at(p)}>
      <rect x={20} y={-74} width={11} height={50} style={{ fill: P.soil }} />
      {[0, 1, 2].map((i) => (
        <circle
          key={i}
          cx={26}
          cy={-82}
          r={7}
          className="loop-smoke decor-motion"
          style={{ fill: P.concrete, "--dur": "5.4s", "--delay": `${-i * 1.8}s` } as Vars}
        />
      ))}
      <path d="M-42 0 L-42 -30 L-28 -42 L-28 -30 L-14 -42 L-14 -30 L0 -42 L0 -30 L42 -30 L42 0 Z" style={{ fill: P.concrete }} />
      {[-34, -20, -6, 10, 24].map((x) => (
        <rect key={x} x={x} y={-20} width={8} height={8} rx={1} style={{ fill: P.wheat, opacity: 0.85 }} />
      ))}
    </g>
  );
}

/* ------------------------------ Kota ------------------------------ */

interface BuildingSpec {
  dx: number;
  w: number;
  h: number;
  color?: string;
}

/** Variasi nada hijau-biru agar deretan gedung tidak tampak seragam dan terlalu pekat. */
const CITY_TONES = ["#2f5f45", "#3f7558", "#4d7f78", "#36664c", "#5a8a6a"];

/** Deretan gedung kota dengan jendela; `haze` membuatnya tampak jauh. */
export function Skyline({ buildings, haze = false, ...p }: Place & { buildings: BuildingSpec[]; haze?: boolean }) {
  return (
    <g transform={at(p)} opacity={haze ? 0.75 : 1}>
      {buildings.map((b, i) => {
        const fill = b.color ?? (haze ? P.haze : CITY_TONES[i % CITY_TONES.length]);
        const cols = Math.max(1, Math.floor((b.w - 6) / 11));
        const rows = Math.max(1, Math.floor((b.h - 12) / 16));
        return (
          <g key={b.dx} transform={`translate(${b.dx} 0)`}>
            <rect x={0} y={-b.h} width={b.w} height={b.h} style={{ fill }} />
            {!haze &&
              Array.from({ length: rows * cols }, (_, k) => {
                const c = k % cols;
                const r = Math.floor(k / cols);
                return (
                  <rect
                    key={k}
                    x={5 + c * 11}
                    y={-b.h + 8 + r * 16}
                    width={5}
                    height={8}
                    style={{ fill: (r + c) % 3 === 0 ? P.wheat : P.white, opacity: 0.55 }}
                  />
                );
              })}
          </g>
        );
      })}
    </g>
  );
}

/** Taman kota / ruang hijau. */
export function Park({ w = 120, ...p }: Place & { w?: number }) {
  return (
    <g transform={at(p)}>
      <rect x={0} y={-6} width={w} height={6} rx={3} style={{ fill: P.fresh, opacity: 0.8 }} />
      {Array.from({ length: Math.floor(w / 30) }, (_, i) => (
        <Tree key={i} x={15 + i * 30} y={-4} s={0.55} kind={i % 2 ? "bush" : "round"} delay={-i} />
      ))}
    </g>
  );
}

/* --------------------------- Pemerintahan --------------------------- */

/** Balai kota / gedung pemerintahan: tangga, pilar, pediment, kubah, bendera. */
export function GovBuilding(p: Place) {
  return (
    <g transform={at(p)}>
      <rect x={-86} y={-8} width={172} height={8} style={{ fill: P.concrete }} />
      <rect x={-78} y={-15} width={156} height={7} style={{ fill: P.sage }} />
      <rect x={-70} y={-70} width={140} height={55} style={{ fill: P.mist, stroke: P.sage, strokeWidth: 1.5 }} />
      {[-60, -38, -16, 8, 30, 52].map((x) => (
        <rect key={x} x={x} y={-68} width={8} height={53} style={{ fill: P.white, stroke: P.sage, strokeWidth: 1 }} />
      ))}
      <rect x={-76} y={-76} width={152} height={7} style={{ fill: P.forest }} />
      <polygon points="-78,-76 0,-104 78,-76" style={{ fill: P.forest }} />
      <polygon points="-58,-79 0,-99 58,-79" style={{ fill: P.leaf, opacity: 0.55 }} />
      <rect x={-22} y={-116} width={44} height={13} style={{ fill: P.white, stroke: P.sage, strokeWidth: 1 }} />
      <path d="M-22 -116 A22 22 0 0 1 22 -116 Z" style={{ fill: P.wheat }} />
      <line x1={0} y1={-138} x2={0} y2={-166} style={{ stroke: P.charcoal, strokeWidth: 2 }} />
      <g transform="translate(0 -166)">
        <g className="loop-sway" style={{ "--dur": "3.2s", transformOrigin: "0% 50%" } as Vars}>
          <path d="M1 0 L26 4 L1 10 Z" style={{ fill: P.leaf }} />
        </g>
      </g>
    </g>
  );
}

/* ------------------------------ Air ------------------------------ */

/** Bendungan dengan waduk dan limpasan air yang mengalir. */
export function Dam({ w = 180, ...p }: Place & { w?: number }) {
  return (
    <g transform={at(p)}>
      <ellipse cx={w / 2} cy={-52} rx={w * 0.72} ry={13} style={{ fill: P.water, opacity: 0.8 }} />
      <polygon points={`0,0 ${w},0 ${w - 14},-52 14,-52`} style={{ fill: P.concrete, stroke: P.sage, strokeWidth: 1.5 }} />
      <rect x={w / 2 - 16} y={-50} width={32} height={50} style={{ fill: P.water }} />
      {[-8, 0, 8].map((dx, i) => (
        <line
          key={dx}
          x1={w / 2 + dx}
          y1={-48}
          x2={w / 2 + dx}
          y2={0}
          strokeDasharray="6 14"
          className="loop-dash decor-motion"
          style={{ stroke: P.white, strokeWidth: 2, "--dur": `${1.4 + i * 0.3}s` } as Vars}
        />
      ))}
    </g>
  );
}

export function WaterTower(p: Place) {
  return (
    <g transform={at(p)}>
      <path d="M-12 0 L-6 -46 M12 0 L6 -46 M-9 -18 L9 -30 M9 -18 L-9 -30" style={{ stroke: P.charcoal, strokeWidth: 2, opacity: 0.55 }} />
      <rect x={-18} y={-74} width={36} height={28} rx={6} style={{ fill: P.water }} />
      <path d="M-18 -74 Q0 -90 18 -74 Z" style={{ fill: P.waterDeep }} />
      <rect x={-18} y={-62} width={36} height={4} style={{ fill: P.white, opacity: 0.5 }} />
    </g>
  );
}

/** Sumur/pompa air kecil. */
export function WaterPump(p: Place) {
  return (
    <g transform={at(p)}>
      <rect x={-14} y={-16} width={28} height={16} rx={3} style={{ fill: P.concrete }} />
      <path d="M8 -16 L8 -30 L-10 -30" fill="none" style={{ stroke: P.waterDeep, strokeWidth: 4 }} strokeLinecap="round" />
      <path d="M-10 -26 C -13 -20 -7 -20 -10 -26 Z" className="loop-breathe" style={{ fill: P.water, "--dur": "2.4s" } as Vars} />
    </g>
  );
}

/** Garis air (sungai/kanal) dengan arus putus-putus yang mengalir. */
export function WaterLine({ d, width = 8, dur = 3 }: { d: string; width?: number; dur?: number }) {
  return (
    <g>
      <path d={d} fill="none" strokeLinecap="round" style={{ stroke: P.water, strokeWidth: width, opacity: 0.9 }} />
      <path
        d={d}
        fill="none"
        strokeLinecap="round"
        strokeDasharray="10 30"
        className="loop-dash decor-motion"
        style={{ stroke: P.white, strokeWidth: Math.max(1.5, width / 3), opacity: 0.85, "--dur": `${dur}s` } as Vars}
      />
    </g>
  );
}

/** Pipa air bersih. */
export function Pipe({ d }: { d: string }) {
  return (
    <g>
      <path d={d} fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: P.waterDeep, strokeWidth: 4, opacity: 0.55 }} />
      <path
        d={d}
        fill="none"
        strokeLinecap="round"
        strokeDasharray="4 16"
        className="loop-dash decor-motion"
        style={{ stroke: P.water, strokeWidth: 3, "--dur": "1.6s" } as Vars}
      />
    </g>
  );
}

/* ------------------------------ Energi ------------------------------ */

export function WindTurbine({ delay = 0, dur = 9, ...p }: Place & { delay?: number; dur?: number }) {
  return (
    <g transform={at(p)}>
      <polygon points="-4,0 4,0 1.6,-120 -1.6,-120" style={{ fill: P.white, stroke: P.sage, strokeWidth: 1 }} />
      <g transform="translate(0 -120)">
        <g className="loop-spin" style={{ "--dur": `${dur}s`, "--delay": `${delay}s` } as Vars}>
          {[0, 120, 240].map((a) => (
            <path key={a} d="M0 0 L-3.5 -7 L0 -54 L3.5 -7 Z" transform={`rotate(${a})`} style={{ fill: P.white, stroke: "#c2ccbb", strokeWidth: 1 }} />
          ))}
        </g>
        <circle r={4} style={{ fill: P.sage, stroke: "#c2ccbb", strokeWidth: 1 }} />
      </g>
    </g>
  );
}

export function SolarArray({ n = 4, ...p }: Place & { n?: number }) {
  return (
    <g transform={at(p)}>
      {Array.from({ length: n }, (_, i) => {
        const x = i * 38;
        return (
          <g key={i}>
            <line x1={x + 10} y1={0} x2={x + 12} y2={-14} style={{ stroke: P.charcoal, strokeWidth: 2, opacity: 0.5 }} />
            <line x1={x + 26} y1={0} x2={x + 30} y2={-22} style={{ stroke: P.charcoal, strokeWidth: 2, opacity: 0.5 }} />
            <polygon points={`${x},-12 ${x + 32},-12 ${x + 40},-32 ${x + 8},-32`} style={{ fill: P.waterDeep }} />
            <path
              d={`M${x + 4} -22 L${x + 36} -22 M${x + 16} -12 L${x + 24} -32`}
              style={{ stroke: P.waterSoft, strokeWidth: 1, opacity: 0.7 }}
            />
            <polygon
              points={`${x + 8},-32 ${x + 18},-32 ${x + 10},-12 ${x},-12`}
              className="loop-breathe"
              style={{ fill: P.white, "--o0": "0", "--o1": "0.35", "--dur": "4s", "--delay": `${-i * 0.8}s` } as Vars}
            />
          </g>
        );
      })}
    </g>
  );
}

export function Pylon({ h = 90, ...p }: Place & { h?: number }) {
  return (
    <g transform={at(p)} style={{ stroke: P.charcoal, strokeWidth: 1.8, opacity: 0.5 }} fill="none">
      <path d={`M-14 0 L-3 ${-h} L3 ${-h} L14 0`} />
      <path d={`M-18 ${-h + 12} L18 ${-h + 12} M-14 ${-h + 26} L14 ${-h + 26}`} />
      <path d={`M-11 -10 L8 ${-h * 0.5} M11 -10 L-8 ${-h * 0.5} M-7 ${-h * 0.5} L4 ${-h + 26} M7 ${-h * 0.5} L-4 ${-h + 26}`} />
    </g>
  );
}

/** Kabel listrik melengkung antar titik dengan aliran energi bergerak. */
export function PowerLine({ points, sag = 12 }: { points: [number, number][]; sag?: number }) {
  let d = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 1; i < points.length; i++) {
    const [x0, y0] = points[i - 1];
    const [x1, y1] = points[i];
    d += ` Q ${(x0 + x1) / 2} ${(y0 + y1) / 2 + sag} ${x1} ${y1}`;
  }
  return (
    <g>
      <path d={d} fill="none" style={{ stroke: P.charcoal, strokeWidth: 1.4, opacity: 0.35 }} />
      <path
        d={d}
        fill="none"
        strokeDasharray="5 15"
        strokeLinecap="round"
        className="loop-dash decor-motion"
        style={{ stroke: P.wheat, strokeWidth: 2.5, "--dur": "1.4s" } as Vars}
      />
    </g>
  );
}

/* --------------------------- Infrastruktur --------------------------- */

export function Road({ d, width = 10 }: { d: string; width?: number }) {
  return (
    <g>
      <path d={d} fill="none" strokeLinecap="round" style={{ stroke: P.road, strokeWidth: width }} />
      <path d={d} fill="none" strokeDasharray="8 10" style={{ stroke: P.white, strokeWidth: 1.6, opacity: 0.9 }} />
    </g>
  );
}

/** Pin lokasi pada peta. */
export function MapPin({ color = P.forest, ...p }: Place & { color?: string }) {
  return (
    <g transform={at(p)}>
      <path d="M0 0 C -4 -8 -12 -14 -12 -24 A12 12 0 0 1 12 -24 C 12 -14 4 -8 0 0 Z" style={{ fill: color }} />
      <circle cx={0} cy={-24} r={4.5} style={{ fill: P.white }} />
    </g>
  );
}

/** Petani sederhana (siluet dengan topi caping). */
export function Farmer(p: Place) {
  return (
    <g transform={at(p)}>
      <path d="M-6 0 L-4 -22 L4 -22 L6 0" style={{ fill: P.forest }} />
      <rect x={-7} y={-38} width={14} height={18} rx={5} style={{ fill: P.leaf }} />
      <circle cx={0} cy={-44} r={6} style={{ fill: P.soil }} />
      <path d="M-14 -46 L0 -56 L14 -46 Z" style={{ fill: P.wheat }} />
      <line x1={9} y1={-32} x2={20} y2={0} style={{ stroke: P.soil, strokeWidth: 2 }} />
    </g>
  );
}

/** Grafik batang kecil (ikon statistik). */
export function BarChartGlyph(p: Place) {
  return (
    <g transform={at(p)}>
      <line x1={-4} y1={0} x2={70} y2={0} style={{ stroke: P.charcoal, strokeWidth: 1.5, opacity: 0.4 }} />
      {[
        [0, 26, P.leaf],
        [18, 44, P.wheat],
        [36, 34, P.water],
        [54, 58, P.forest],
      ].map(([x, h, c]) => (
        <rect
          key={x as number}
          x={x as number}
          y={-(h as number)}
          width={12}
          height={h as number}
          rx={2}
          className="loop-breathe"
          style={{ fill: c as string, "--o0": "0.65", "--o1": "1", "--dur": "4s", "--delay": `${-(x as number) / 18}s` } as Vars}
        />
      ))}
    </g>
  );
}

/* ---------------------------- Jaringan graf ---------------------------- */

export type NetTone = "general" | "water" | "food" | "energy" | "gov";

const NET_COLORS: Record<NetTone, string> = {
  general: P.leaf,
  water: P.water,
  food: P.wheat,
  energy: P.soil,
  gov: P.forest,
};

/**
 * Jaringan graf di atas ilustrasi: garis dengan aliran cahaya searah, titik yang menyala bergantian.
 * `links` berisi pasangan indeks [dari, ke].
 */
export function NodeNet({
  nodes,
  links,
  opacity = 1,
  period = 2.2,
  r = 6,
  dashed = [],
}: {
  nodes: { x: number; y: number; tone?: NetTone }[];
  links: [number, number][];
  opacity?: number;
  period?: number;
  r?: number;
  /** Indeks link yang digambar sebagai garis putus statis (mis. hubungan lemah) */
  dashed?: number[];
}) {
  return (
    <g opacity={opacity}>
      {links.map(([a, b], i) => {
        const d = `M ${nodes[a].x} ${nodes[a].y} L ${nodes[b].x} ${nodes[b].y}`;
        const weak = dashed.includes(i);
        return (
          <g key={`${a}-${b}`}>
            <path d={d} strokeDasharray={weak ? "3 6" : undefined} style={{ stroke: P.forest, strokeWidth: 1.4, opacity: weak ? 0.35 : 0.28 }} />
            {!weak && (
              <path
                d={d}
                strokeDasharray="3 17"
                strokeLinecap="round"
                className="loop-dash decor-motion"
                style={{ stroke: NET_COLORS[nodes[a].tone ?? "general"], strokeWidth: 2.6, "--dur": "2.2s", "--delay": `${-i * 0.4}s` } as Vars}
              />
            )}
          </g>
        );
      })}
      {nodes.map((n, i) => (
        <g key={i}>
          <circle
            cx={n.x}
            cy={n.y}
            r={r + 6}
            className="loop-seq decor-motion"
            style={{ fill: "rgba(167,201,87,0.25)", stroke: P.fresh, strokeWidth: 2, "--dur": `${nodes.length * period}s`, "--delay": `${i * period}s` } as Vars}
          />
          <circle cx={n.x} cy={n.y} r={r} style={{ fill: NET_COLORS[n.tone ?? "general"], stroke: P.white, strokeWidth: 2 }} />
        </g>
      ))}
    </g>
  );
}

/** Kelompok elemen dengan opasitas — membantu membuat lapisan "jauh". */
export function Layer({ opacity = 1, children }: { opacity?: number; children: ReactNode }) {
  return <g opacity={opacity}>{children}</g>;
}

export { LeafShape };
