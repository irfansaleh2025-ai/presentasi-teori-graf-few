import type { CSSProperties, ReactNode } from "react";

/*
 * Elemen dekoratif bertema pertanian & alam.
 * Semua animasi berupa CSS keyframes `loop-*` (globals.css): ringan, tanpa timer JS,
 * dan otomatis berhenti untuk reduced motion, toggle "M", thumbnail, dan cetak.
 * Komponen ini selalu dirender di belakang konten (pointer-events: none).
 */

type Vars = CSSProperties & Record<`--${string}`, string | number>;

const C = {
  forest: "var(--color-forest)",
  leaf: "var(--color-leaf)",
  fresh: "var(--color-fresh)",
  sage: "var(--color-sage)",
  cream: "var(--color-cream)",
  soil: "var(--color-soil)",
  wheat: "var(--color-wheat)",
  water: "var(--color-water)",
  waterDeep: "var(--color-water-deep)",
} as const;

/** Generator acak deterministik agar posisi sama di server dan klien (tanpa hydration mismatch). */
function seeded(seed: number) {
  let s = seed % 2147483647 || 1;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

const LEAF = "M0 0 C -15 -11 -17 -36 0 -56 C 17 -36 15 -11 0 0 Z";
const LEAF_RIB = "M0 -2 L0 -48";

/** Satu daun (pangkal di titik 0,0, mengarah ke atas). */
export function LeafShape({ color = C.leaf, rib = true, opacity = 1 }: { color?: string; rib?: boolean; opacity?: number }) {
  return (
    <g opacity={opacity}>
      <path d={LEAF} style={{ fill: color }} />
      {rib && <path d={LEAF_RIB} style={{ stroke: C.cream, strokeWidth: 1.4, opacity: 0.55 }} fill="none" />}
    </g>
  );
}

/** Kanvas SVG penuh 1600×900 untuk lapisan dekorasi. */
export function DecorLayer({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <svg
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden
    >
      {children}
    </svg>
  );
}

/* ------------------------------------------------------------------ */

interface Region {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Daun kecil yang melayang naik-turun dengan kecepatan dan rotasi berbeda. */
export function FloatingLeaves({
  regions,
  count = 6,
  seed = 7,
  colors = [C.leaf, C.fresh, C.sage],
  opacity = 0.35,
}: {
  regions: Region[];
  count?: number;
  seed?: number;
  colors?: string[];
  opacity?: number;
}) {
  const rnd = seeded(seed);
  const leaves = Array.from({ length: count }, (_, i) => {
    const r = regions[i % regions.length];
    return {
      x: r.x + rnd() * r.w,
      y: r.y + rnd() * r.h,
      rot: -60 + rnd() * 120,
      scale: 0.35 + rnd() * 0.45,
      color: colors[i % colors.length],
      vars: {
        "--dur": `${(5 + rnd() * 3).toFixed(2)}s`,
        "--delay": `${(-rnd() * 6).toFixed(2)}s`,
        "--dy": `${(-10 - rnd() * 14).toFixed(1)}px`,
        "--dx": `${(-6 + rnd() * 12).toFixed(1)}px`,
        "--r0": `${(-6 + rnd() * 4).toFixed(1)}deg`,
        "--r1": `${(3 + rnd() * 6).toFixed(1)}deg`,
      } as Vars,
    };
  });
  return (
    <g opacity={opacity}>
      {leaves.map((l, i) => (
        <g key={i} transform={`translate(${l.x.toFixed(1)} ${l.y.toFixed(1)}) rotate(${l.rot.toFixed(1)}) scale(${l.scale.toFixed(2)})`}>
          <g className="loop-float" style={l.vars}>
            <LeafShape color={l.color} />
          </g>
        </g>
      ))}
    </g>
  );
}

/** Ranting berdaun di sudut slide; daun bergoyang lembut. */
export function CornerSprig({
  corner,
  scale = 1,
  opacity = 0.22,
  color = C.leaf,
}: {
  corner: "tl" | "tr" | "bl" | "br";
  scale?: number;
  opacity?: number;
  color?: string;
}) {
  const place = {
    tl: `translate(0 0) scale(${scale})`,
    tr: `translate(1600 0) scale(${-scale} ${scale})`,
    bl: `translate(0 900) scale(${scale} ${-scale})`,
    br: `translate(1600 900) scale(${-scale})`,
  }[corner];
  const leaves: [number, number, number, number][] = [
    [62, 52, 120, 1],
    [118, 86, 150, 0.9],
    [150, 140, 105, 1.05],
    [196, 162, 160, 0.8],
    [214, 222, 118, 0.85],
    [96, 32, 60, 0.75],
    [170, 104, 70, 0.7],
  ];
  return (
    <g transform={place} opacity={opacity}>
      <path d="M -10 -10 C 80 50 150 120 240 270" fill="none" style={{ stroke: color, strokeWidth: 3 }} strokeLinecap="round" />
      {leaves.map(([x, y, rot, s], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
          <g className="loop-sway" style={{ "--dur": `${5 + (i % 3)}s`, "--delay": `${-i * 0.7}s` } as Vars}>
            <LeafShape color={i % 2 ? C.fresh : color} />
          </g>
        </g>
      ))}
    </g>
  );
}

/** Garis kontur lahan bergelombang yang bergeser perlahan (loop satu panjang gelombang). */
export function ContourLines({
  y = 620,
  count = 5,
  gap = 26,
  amplitude = 18,
  color = C.leaf,
  opacity = 0.16,
  speed = 38,
}: {
  y?: number;
  count?: number;
  gap?: number;
  amplitude?: number;
  color?: string;
  opacity?: number;
  speed?: number;
}) {
  const wl = 320;
  const wave = (y0: number, amp: number) => {
    let d = `M ${-wl} ${y0}`;
    for (let x = -wl; x < 1600 + wl; x += wl) {
      d += ` C ${x + wl * 0.25} ${y0 - amp} ${x + wl * 0.25} ${y0 - amp} ${x + wl / 2} ${y0}`;
      d += ` C ${x + wl * 0.75} ${y0 + amp} ${x + wl * 0.75} ${y0 + amp} ${x + wl} ${y0}`;
    }
    return d;
  };
  return (
    <g opacity={opacity}>
      {Array.from({ length: count }, (_, i) => (
        <path
          key={i}
          d={wave(y + i * gap, amplitude * (1 - i * 0.1))}
          fill="none"
          style={{ stroke: color, strokeWidth: 1.6, "--shift": `${i % 2 ? wl : -wl}px`, "--dur": `${speed + i * 6}s` } as Vars}
          className="loop-shift"
        />
      ))}
    </g>
  );
}

/** Barisan tanaman tipis dengan perspektif menuju horizon. */
export function CropRows({
  horizon = 560,
  vanishX = 1200,
  rows = 14,
  color = C.leaf,
  opacity = 0.12,
}: {
  horizon?: number;
  vanishX?: number;
  rows?: number;
  color?: string;
  opacity?: number;
}) {
  return (
    <g opacity={opacity}>
      {Array.from({ length: rows }, (_, i) => {
        const bx = -300 + (i / (rows - 1)) * 2200;
        return (
          <line key={i} x1={vanishX} y1={horizon} x2={bx} y2={900} style={{ stroke: color, strokeWidth: 1.4 }} strokeDasharray="2 10" />
        );
      })}
    </g>
  );
}

/* ------------------------------------------------------------------ */

/** Tanaman kecil yang tumbuh bertahap, berhenti sejenak, lalu memudar dan tumbuh lagi. */
export function GrowingPlant({
  x,
  y,
  scale = 1,
  delay = 0,
  dur = 11,
  grain = true,
  color = C.leaf,
}: {
  x: number;
  y: number;
  scale?: number;
  delay?: number;
  dur?: number;
  grain?: boolean;
  color?: string;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g className="loop-plant" style={{ "--delay": `${delay}s`, "--dur": `${dur}s` } as Vars}>
        <path
          d="M0 0 C 3 -22 -4 -44 0 -72"
          pathLength={1}
          fill="none"
          className="loop-stem"
          style={{ stroke: color, strokeWidth: 3 }}
          strokeLinecap="round"
        />
        <g transform="translate(0 -24) rotate(-58) scale(0.55)">
          <g className="loop-leaf-a">
            <LeafShape color={color} rib={false} />
          </g>
        </g>
        <g transform="translate(-1 -42) rotate(54) scale(0.5)">
          <g className="loop-leaf-b">
            <LeafShape color={C.fresh} rib={false} />
          </g>
        </g>
        <g transform="translate(0 -72)">
          <g className="loop-bud">
            {grain ? (
              <g style={{ fill: C.wheat }}>
                <ellipse cx={0} cy={-14} rx={4} ry={7} />
                <ellipse cx={-6} cy={-6} rx={3.5} ry={6} transform="rotate(-25 -6 -6)" />
                <ellipse cx={6} cy={-6} rx={3.5} ry={6} transform="rotate(25 6 -6)" />
                <ellipse cx={-5} cy={4} rx={3.2} ry={5.5} transform="rotate(-25 -5 4)" />
                <ellipse cx={5} cy={4} rx={3.2} ry={5.5} transform="rotate(25 5 4)" />
              </g>
            ) : (
              <circle cx={0} cy={-6} r={7} style={{ fill: C.fresh }} />
            )}
          </g>
        </g>
      </g>
    </g>
  );
}

/** Deretan tanaman tumbuh dengan tanah tipis di bawahnya. */
export function PlantRow({
  x,
  y,
  count = 4,
  gap = 56,
  scale = 1,
  stagger = 0.6,
  soil = true,
}: {
  x: number;
  y: number;
  count?: number;
  gap?: number;
  scale?: number;
  stagger?: number;
  soil?: boolean;
}) {
  return (
    <g>
      {soil && (
        <path
          d={`M ${x - 30} ${y + 4} Q ${x + ((count - 1) * gap) / 2} ${y - 6} ${x + (count - 1) * gap + 30} ${y + 4}`}
          fill="none"
          style={{ stroke: C.soil, strokeWidth: 4, opacity: 0.45 }}
          strokeLinecap="round"
        />
      )}
      {Array.from({ length: count }, (_, i) => (
        <GrowingPlant key={i} x={x + i * gap} y={y} scale={scale * (0.85 + (i % 3) * 0.12)} delay={-i * stagger} grain={i % 2 === 0} />
      ))}
    </g>
  );
}

/* ------------------------------------------------------------------ */

/** Gelombang air berlapis yang mengalir kontinu, plus garis arus putus-putus. */
export function FlowingWater({
  y = 800,
  height = 100,
  opacity = 1,
}: {
  y?: number;
  height?: number;
  opacity?: number;
}) {
  const wl = 240;
  const wave = (y0: number, amp: number) => {
    let d = `M ${-wl} ${y0}`;
    for (let x = -wl; x < 1600 + wl * 2; x += wl) {
      d += ` Q ${x + wl / 4} ${y0 - amp} ${x + wl / 2} ${y0} T ${x + wl} ${y0}`;
    }
    return `${d} L ${1600 + wl * 2} ${y + height} L ${-wl} ${y + height} Z`;
  };
  return (
    <g opacity={opacity}>
      <path d={wave(y, 10)} className="loop-shift" style={{ fill: C.water, opacity: 0.18, "--shift": `${-wl}px`, "--dur": "14s" } as Vars} />
      <path d={wave(y + 18, 8)} className="loop-shift" style={{ fill: C.water, opacity: 0.22, "--shift": `${wl}px`, "--dur": "18s" } as Vars} />
      <path d={wave(y + 38, 6)} className="loop-shift" style={{ fill: C.waterDeep, opacity: 0.16, "--shift": `${-wl}px`, "--dur": "11s" } as Vars} />
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M -40 ${y + 30 + i * 18} C 400 ${y + 18 + i * 18} 1000 ${y + 44 + i * 18} 1640 ${y + 26 + i * 18}`}
          fill="none"
          strokeDasharray="14 26"
          strokeLinecap="round"
          className="loop-dash decor-motion"
          style={{ stroke: "#ffffff", strokeWidth: 2, opacity: 0.55, "--dur": `${2.6 + i * 0.8}s` } as Vars}
        />
      ))}
    </g>
  );
}

/* ------------------------------------------------------------------ */

const HILLS = {
  back: "M0 200 C 260 140 480 160 720 192 C 980 226 1220 138 1600 170 L1600 360 L0 360 Z",
  mid: "M0 252 C 300 212 560 244 820 262 C 1080 282 1320 222 1600 244 L1600 360 L0 360 Z",
  front: "M0 306 C 360 276 700 296 1000 314 C 1260 330 1440 296 1600 300 L1600 360 L0 360 Z",
};

/** Titik-titik pada kurva Bezier kubik berantai (untuk menempatkan tanaman di punggung bukit). */
function ridgeY(x: number) {
  // Segmen bukit depan: (0,306)→(1000,314) dan (1000,314)→(1600,300)
  const seg = (p0: number[], p1: number[], p2: number[], p3: number[]) => {
    let best = p0[1];
    let bestDx = Infinity;
    for (let t = 0; t <= 1; t += 0.02) {
      const mt = 1 - t;
      // Perkalian eksplisit (bukan `**`/Math.pow) agar hasil identik di server dan browser
      const bx = mt * mt * mt * p0[0] + 3 * mt * mt * t * p1[0] + 3 * mt * t * t * p2[0] + t * t * t * p3[0];
      const by = mt * mt * mt * p0[1] + 3 * mt * mt * t * p1[1] + 3 * mt * t * t * p2[1] + t * t * t * p3[1];
      if (Math.abs(bx - x) < bestDx) {
        bestDx = Math.abs(bx - x);
        best = by;
      }
    }
    return best;
  };
  const y = x <= 1000 ? seg([0, 306], [360, 276], [700, 296], [1000, 314]) : seg([1000, 314], [1260, 330], [1440, 296], [1600, 300]);
  return Math.round(y * 1000) / 1000;
}

export function Cloud({ y, scale, dur, delay, opacity }: { y: number; scale: number; dur: number; delay: number; opacity: number }) {
  return (
    <g className="loop-cloud" style={{ "--dur": `${dur}s`, "--delay": `${delay}s` } as Vars}>
      <g transform={`translate(0 ${y}) scale(${scale})`} opacity={opacity} style={{ fill: "#ffffff" }}>
        <ellipse cx={60} cy={20} rx={60} ry={18} />
        <ellipse cx={30} cy={10} rx={30} ry={20} />
        <ellipse cx={80} cy={4} rx={36} ry={24} />
      </g>
    </g>
  );
}

/**
 * Lanskap pertanian minimalis: matahari, awan, bukit berlapis, sungai, dan tanaman bergoyang.
 * Ditempatkan di bagian bawah slide (viewBox 1600×360).
 */
export function AgriculturalLandscape({ dark = false, className = "", sun = true }: { dark?: boolean; className?: string; sun?: boolean }) {
  const plants = Array.from({ length: 26 }, (_, i) => 30 + i * 61);
  const hill = dark
    ? { back: "rgba(167,201,87,0.12)", mid: "rgba(111,158,88,0.22)", front: "rgba(220,231,211,0.14)", plant: C.fresh, row: C.fresh }
    : { back: C.sage, mid: "rgba(111,158,88,0.45)", front: C.forest, plant: C.fresh, row: C.cream };
  return (
    <svg
      viewBox="0 0 1600 360"
      preserveAspectRatio="xMidYMax slice"
      className={`pointer-events-none absolute inset-x-0 bottom-0 w-full ${className}`}
      aria-hidden
    >
      {sun && (
        <g transform="translate(1330 92)">
          <g className="loop-rays" opacity={dark ? 0.35 : 0.5}>
            {Array.from({ length: 12 }, (_, i) => (
              <line
                key={i}
                x1={0}
                y1={-62}
                x2={0}
                y2={-80}
                transform={`rotate(${i * 30})`}
                style={{ stroke: C.wheat, strokeWidth: 3 }}
                strokeLinecap="round"
              />
            ))}
          </g>
          <circle r={48} className="loop-sun" style={{ fill: C.wheat, opacity: dark ? 0.75 : 0.9 }} />
        </g>
      )}
      <Cloud y={40} scale={1} dur={95} delay={-20} opacity={dark ? 0.12 : 0.85} />
      <Cloud y={92} scale={0.7} dur={120} delay={-75} opacity={dark ? 0.1 : 0.7} />
      <Cloud y={18} scale={0.55} dur={140} delay={-110} opacity={dark ? 0.08 : 0.6} />

      <path d={HILLS.back} style={{ fill: hill.back }} />
      <path d={HILLS.mid} style={{ fill: hill.mid }} />
      {/* barisan tanaman di lahan tengah */}
      {[14, 28, 42].map((dy, i) => (
        <path
          key={dy}
          d={`M0 ${252 + dy} C 300 ${212 + dy} 560 ${244 + dy} 820 ${262 + dy} C 1080 ${282 + dy} 1320 ${222 + dy} 1600 ${244 + dy}`}
          fill="none"
          strokeDasharray="3 9"
          style={{ stroke: hill.row, strokeWidth: 2, opacity: 0.5 - i * 0.12 }}
        />
      ))}
      {/* sungai */}
      <path d="M -20 296 C 300 266 520 290 760 284 C 1000 278 1200 298 1620 286" fill="none" style={{ stroke: C.water, strokeWidth: 7, opacity: dark ? 0.5 : 0.9 }} strokeLinecap="round" />
      <path
        d="M -20 296 C 300 266 520 290 760 284 C 1000 278 1200 298 1620 286"
        fill="none"
        strokeDasharray="10 30"
        strokeLinecap="round"
        className="loop-dash decor-motion"
        style={{ stroke: "#ffffff", strokeWidth: 2.5, opacity: 0.8, "--dur": "3s" } as Vars}
      />
      <path d={HILLS.front} style={{ fill: hill.front }} />
      {plants.map((x, i) => (
        <g key={x} transform={`translate(${x} ${ridgeY(x) + 4}) scale(${0.32 + (i % 4) * 0.05})`}>
          <g className="loop-sway" style={{ "--dur": `${4.5 + (i % 5) * 0.6}s`, "--delay": `${-i * 0.37}s` } as Vars}>
            <path d="M0 0 L0 -50" style={{ stroke: hill.plant, strokeWidth: 4 }} strokeLinecap="round" />
            <g transform="translate(0 -18) rotate(-50) scale(0.55)">
              <LeafShape color={hill.plant} rib={false} />
            </g>
            <g transform="translate(0 -30) rotate(48) scale(0.5)">
              <LeafShape color={hill.plant} rib={false} />
            </g>
          </g>
        </g>
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */

/** Jaringan titik-titik terhubung yang berdenyut halus (latar slide ilmiah). */
export function AmbientNetwork({
  region,
  count = 14,
  seed = 3,
  color = C.leaf,
  opacity = 0.28,
}: {
  region: Region;
  count?: number;
  seed?: number;
  color?: string;
  opacity?: number;
}) {
  const rnd = seeded(seed);
  const round = (n: number) => Math.round(n * 1000) / 1000;
  const pts = Array.from({ length: count }, () => ({ x: round(region.x + rnd() * region.w), y: round(region.y + rnd() * region.h) }));
  const links: [number, number][] = [];
  pts.forEach((p, i) => {
    const near = pts
      .map((q, j) => ({ j, d: (p.x - q.x) * (p.x - q.x) + (p.y - q.y) * (p.y - q.y) }))
      .filter((o) => o.j > i)
      .sort((a, b) => a.d - b.d)
      .slice(0, 2);
    for (const n of near) links.push([i, n.j]);
  });
  return (
    <g opacity={opacity}>
      {links.map(([a, b], i) => (
        <line
          key={`${a}-${b}`}
          x1={pts[a].x}
          y1={pts[a].y}
          x2={pts[b].x}
          y2={pts[b].y}
          className={i % 3 === 0 ? "loop-dash" : "loop-breathe"}
          strokeDasharray={i % 3 === 0 ? "4 16" : undefined}
          style={{ stroke: color, strokeWidth: 1.4, "--dur": `${4 + (i % 4)}s`, "--delay": `${-i * 0.6}s`, "--o0": "0.35", "--o1": "1" } as Vars}
        />
      ))}
      {pts.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={3 + (i % 3)}
          className="loop-breathe"
          style={{ fill: i % 4 === 0 ? C.water : i % 5 === 0 ? C.wheat : color, "--dur": `${3.5 + (i % 5) * 0.7}s`, "--delay": `${-i * 0.45}s`, "--o0": "0.4", "--o1": "1" } as Vars}
        />
      ))}
    </g>
  );
}
