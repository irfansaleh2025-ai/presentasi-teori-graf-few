import type { CSSProperties, ReactNode } from "react";
import { Cloud, DecorLayer, FloatingLeaves } from "./decor";
import {
  Barn,
  BarChartGlyph,
  Dam,
  Factory,
  Farmer,
  GovBuilding,
  House,
  Layer,
  MapPin,
  NodeNet,
  P,
  Park,
  Pipe,
  PowerLine,
  Pylon,
  RiceTerrace,
  Road,
  Skyline,
  SolarArray,
  Tree,
  WaterLine,
  WaterPump,
  WaterTower,
  WheatField,
  WindTurbine,
} from "./illustrations";

/*
 * Komposisi latar per slide (koordinat slide 1600×900).
 * Ilustrasi ditempatkan di zona yang kosong pada tiap slide — bawah, samping, atau sudut —
 * sehingga judul, rumus, tabel, dan diagram tetap menjadi fokus.
 */

type Vars = CSSProperties & Record<`--${string}`, string | number>;

function Ground({ d, fill = P.sage, opacity = 1 }: { d: string; fill?: string; opacity?: number }) {
  return <path d={d} style={{ fill, opacity }} />;
}

function Sun({ x, y, r = 34, opacity = 0.9 }: { x: number; y: number; r?: number; opacity?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="loop-rays" opacity={opacity * 0.55}>
        {Array.from({ length: 12 }, (_, i) => (
          <line key={i} x1={0} y1={-r - 12} x2={0} y2={-r - 26} transform={`rotate(${i * 30})`} style={{ stroke: P.wheat, strokeWidth: 3 }} strokeLinecap="round" />
        ))}
      </g>
      <circle r={r} className="loop-sun" style={{ fill: P.wheat, opacity }} />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Slide 1 — Panorama: desa, sawah, sungai, energi terbarukan, balai kota, kota */

function Scene01() {
  return (
    <DecorLayer>
      <FloatingLeaves regions={[{ x: 60, y: 30, w: 900, h: 90 }]} count={5} seed={11} opacity={0.35} />
      <Sun x={1440} y={575} />
      <Cloud y={560} scale={0.9} dur={110} delay={-30} opacity={0.85} />
      <Cloud y={615} scale={0.6} dur={140} delay={-90} opacity={0.7} />
      <Skyline
        x={1170}
        y={704}
        haze
        buildings={[
          { dx: 0, w: 34, h: 70 },
          { dx: 38, w: 26, h: 110 },
          { dx: 68, w: 40, h: 150 },
          { dx: 112, w: 30, h: 90 },
          { dx: 146, w: 44, h: 130 },
          { dx: 194, w: 28, h: 80 },
          { dx: 226, w: 38, h: 120 },
          { dx: 268, w: 30, h: 95 },
          { dx: 302, w: 46, h: 140 },
          { dx: 352, w: 34, h: 85 },
          { dx: 390, w: 30, h: 110 },
        ]}
      />
      <Ground d="M0 704 C 260 660 520 676 760 698 C 1000 720 1240 650 1600 672 L1600 900 L0 900 Z" />
      <Tree x={22} y={704} s={0.8} delay={-1} />
      <House x={70} y={702} s={0.8} />
      <House x={140} y={698} s={0.9} roof={P.forest} />
      <Tree x={200} y={694} s={0.7} kind="pine" delay={-2} />
      <Barn x={258} y={690} s={0.7} />
      <RiceTerrace x={360} y={718} w={330} rows={3} />
      <WindTurbine x={860} y={712} s={0.75} dur={10} />
      <WindTurbine x={935} y={716} s={0.85} dur={8.5} delay={-2} />
      <WindTurbine x={1005} y={718} s={0.68} dur={11} delay={-5} />
      <Tree x={1040} y={712} s={0.6} delay={-3} />
      <GovBuilding x={1110} y={710} s={0.55} />
      <Tree x={1180} y={706} s={0.6} kind="pine" />
      <Ground d="M0 772 C 300 734 560 762 820 780 C 1080 800 1320 742 1600 764 L1600 900 L0 900 Z" fill={P.leaf} opacity={0.45} />
      <SolarArray x={890} y={790} n={4} s={0.9} />
      <WheatField x={1150} y={782} w={180} />
      <Pylon x={1260} y={772} h={80} />
      <Pylon x={1500} y={768} h={80} />
      <PowerLine points={[[1005, 700], [1260, 692], [1500, 688]]} />
      <WaterTower x={1400} y={770} s={0.7} />
      <WaterLine d="M -20 830 C 300 800 520 822 760 814 C 1000 806 1200 830 1620 816" />
      <Ground d="M0 852 C 360 822 700 842 1000 860 C 1260 876 1440 842 1600 846 L1600 900 L0 900 Z" fill={P.forest} />
      {Array.from({ length: 9 }, (_, i) => (
        <Tree key={i} x={900 + i * 80} y={858 - (i % 3) * 4} s={0.5} kind="bush" delay={-i * 0.6} />
      ))}
      <NodeNet
        opacity={0.9}
        nodes={[
          { x: 140, y: 640, tone: "general" },
          { x: 525, y: 668, tone: "food" },
          { x: 935, y: 614, tone: "energy" },
          { x: 1110, y: 600, tone: "gov" },
          { x: 1300, y: 590, tone: "general" },
          { x: 1400, y: 712, tone: "water" },
          { x: 970, y: 752, tone: "energy" },
        ]}
        links={[
          [0, 1],
          [1, 2],
          [2, 3],
          [3, 4],
          [4, 5],
          [5, 6],
          [6, 1],
        ]}
      />
    </DecorLayer>
  );
}

/* Slide 2 — Desa ↔ kota dihubungkan sungai, pangan–air–energi */

function Scene02() {
  return (
    <DecorLayer>
      <Skyline
        x={1460}
        y={862}
        buildings={[
          { dx: 0, w: 40, h: 180 },
          { dx: 44, w: 34, h: 260 },
          { dx: 82, w: 50, h: 210 },
        ]}
      />
      <Ground d="M0 846 C 400 822 800 842 1200 832 C 1400 828 1500 836 1600 832 L1600 900 L0 900 Z" />
      <RiceTerrace x={20} y={888} w={300} rows={3} />
      <WheatField x={335} y={880} w={140} />
      <Tree x={490} y={858} s={0.7} delay={-1} />
      <House x={545} y={860} s={0.75} />
      <House x={612} y={856} s={0.65} roof={P.forest} />
      <Tree x={662} y={856} s={0.6} kind="pine" />
      <Dam x={690} y={872} w={110} s={0.8} />
      <WindTurbine x={850} y={852} s={0.6} dur={9} />
      <Pylon x={960} y={858} h={60} />
      <Pylon x={1220} y={852} h={60} />
      <PowerLine points={[[850, 790], [960, 798], [1220, 792], [1460, 760]]} />
      <WaterTower x={1080} y={858} s={0.7} />
      <Skyline
        x={1120}
        y={864}
        buildings={[
          { dx: 0, w: 30, h: 40 },
          { dx: 34, w: 24, h: 60 },
          { dx: 62, w: 36, h: 48 },
          { dx: 140, w: 28, h: 66 },
          { dx: 172, w: 40, h: 52 },
          { dx: 216, w: 30, h: 62 },
          { dx: 250, w: 36, h: 45 },
          { dx: 290, w: 30, h: 58 },
        ]}
      />
      <Pipe d="M 760 842 C 900 846 1000 836 1080 840" />
      <WaterLine d="M -20 894 C 300 880 600 898 900 886 C 1150 876 1350 892 1620 882" width={7} />
      <NodeNet
        opacity={0.85}
        nodes={[
          { x: 170, y: 838, tone: "food" },
          { x: 545, y: 812, tone: "general" },
          { x: 734, y: 826, tone: "water" },
          { x: 850, y: 780, tone: "energy" },
          { x: 1300, y: 804, tone: "general" },
          { x: 1525, y: 640, tone: "general" },
        ]}
        links={[
          [0, 1],
          [1, 2],
          [2, 3],
          [3, 4],
          [4, 5],
          [2, 4],
        ]}
      />
    </DecorLayer>
  );
}

/* Slide 3 — Balai kota sebagai pusat keputusan, dikelilingi pangan, air, energi */

function Scene03() {
  return (
    <DecorLayer>
      <NodeNet
        opacity={0.45}
        r={4}
        nodes={[
          { x: 1400, y: 40, tone: "food" },
          { x: 1470, y: 86, tone: "gov" },
          { x: 1540, y: 46, tone: "water" },
          { x: 1520, y: 126, tone: "energy" },
        ]}
        links={[
          [0, 1],
          [1, 2],
          [1, 3],
        ]}
      />
      <Ground d="M0 882 C 400 870 800 880 1100 866 C 1300 858 1450 862 1600 854 L1600 900 L0 900 Z" opacity={0.8} />
      <WheatField x={1010} y={876} w={120} />
      <WaterTower x={1175} y={870} s={0.65} />
      <GovBuilding x={1300} y={884} s={0.62} />
      <SolarArray x={1395} y={868} n={2} s={0.7} />
      <WindTurbine x={1545} y={864} s={0.55} />
      <WaterLine d="M 940 896 C 1150 886 1300 898 1620 888" width={5} />
      <NodeNet
        nodes={[
          { x: 1070, y: 836, tone: "food" },
          { x: 1175, y: 806, tone: "water" },
          { x: 1300, y: 770, tone: "gov" },
          { x: 1425, y: 836, tone: "energy" },
          { x: 1545, y: 798, tone: "energy" },
        ]}
        links={[
          [0, 2],
          [1, 2],
          [3, 2],
          [4, 2],
        ]}
      />
    </DecorLayer>
  );
}

/* Slide 4 — Peta wilayah desa–kota + infrastruktur + statistik */

function Scene04() {
  return (
    <DecorLayer>
      <Layer opacity={0.75}>
        <path
          d="M960 120 C 980 60 1100 40 1220 50 C 1360 60 1500 40 1550 110 C 1590 170 1540 250 1420 262 C 1300 274 1160 250 1060 258 C 980 264 940 190 960 120 Z"
          strokeDasharray="5 6"
          style={{ fill: P.mist, stroke: P.leaf, strokeWidth: 1.5 }}
        />
        <polygon points="1000,150 1100,120 1140,200 1040,230" style={{ fill: P.wheatSoft }} />
        <polygon points="1110,110 1200,92 1230,160 1140,190" style={{ fill: P.sage }} />
        <ellipse cx={1290} cy={205} rx={50} ry={20} style={{ fill: P.waterSoft, stroke: P.water, strokeWidth: 1.5 }} />
        {Array.from({ length: 12 }, (_, i) => (
          <rect key={i} x={1370 + (i % 4) * 24} y={80 + Math.floor(i / 4) * 22} width={18} height={16} rx={2} style={{ fill: P.haze }} />
        ))}
        <Road d="M 990 100 C 1150 140 1300 118 1520 92" width={5} />
        <WaterLine d="M 990 232 C 1100 212 1180 232 1250 205 C 1330 175 1420 205 1545 150" width={5} />
        <MapPin x={1080} y={202} s={0.9} color={P.wheat} />
        <MapPin x={1250} y={168} s={0.9} color={P.waterDeep} />
        <MapPin x={1420} y={112} s={0.9} color={P.forest} />
        <BarChartGlyph x={1460} y={250} s={0.75} />
      </Layer>

      <Ground d="M0 862 C 400 850 800 862 1100 852 C 1300 846 1450 850 1600 844 L1600 900 L0 900 Z" />
      <RiceTerrace x={820} y={884} w={220} rows={3} />
      <House x={1080} y={874} s={0.7} />
      <Barn x={1150} y={872} s={0.6} />
      <Pylon x={1210} y={868} h={70} />
      <PowerLine points={[[1080, 830], [1210, 800], [1320, 790]]} />
      <Skyline
        x={1250}
        y={884}
        buildings={[
          { dx: 0, w: 34, h: 80 },
          { dx: 38, w: 28, h: 120 },
          { dx: 70, w: 42, h: 160 },
          { dx: 116, w: 30, h: 100 },
          { dx: 150, w: 44, h: 140 },
          { dx: 198, w: 30, h: 90 },
          { dx: 232, w: 40, h: 130 },
          { dx: 276, w: 30, h: 70 },
          { dx: 310, w: 40, h: 110 },
        ]}
      />
      <WaterLine d="M 780 896 C 1000 888 1200 898 1620 890" width={5} />
      <NodeNet
        opacity={0.85}
        nodes={[
          { x: 930, y: 830, tone: "food" },
          { x: 1080, y: 812, tone: "general" },
          { x: 1210, y: 798, tone: "energy" },
          { x: 1342, y: 724, tone: "general" },
          { x: 1422, y: 744, tone: "general" },
        ]}
        links={[
          [0, 1],
          [1, 2],
          [2, 3],
          [3, 4],
        ]}
      />
    </DecorLayer>
  );
}

/* Slide 5 — Lanskap sederhana: petani, sumber air, pembangkit, fasilitas publik, kota */

function Scene05() {
  return (
    <DecorLayer>
      <Ground d="M0 874 C 400 862 800 872 1200 864 C 1400 860 1500 866 1600 862 L1600 900 L0 900 Z" />
      <WheatField x={175} y={894} w={90} s={0.8} />
      <Farmer x={150} y={894} s={0.8} />
      <WaterPump x={420} y={894} s={1.1} />
      <WaterLine d="M 330 898 C 400 892 470 898 560 894" width={4} />
      <Factory x={690} y={894} s={0.6} />
      <WindTurbine x={790} y={894} s={0.38} />
      <GovBuilding x={1000} y={896} s={0.38} />
      <Skyline
        x={1220}
        y={896}
        buildings={[
          { dx: 0, w: 26, h: 40 },
          { dx: 30, w: 30, h: 58 },
          { dx: 64, w: 22, h: 46 },
          { dx: 90, w: 34, h: 60 },
          { dx: 128, w: 26, h: 38 },
          { dx: 158, w: 30, h: 52 },
        ]}
      />
      <NodeNet
        opacity={0.9}
        r={5}
        nodes={[
          { x: 150, y: 834, tone: "food" },
          { x: 420, y: 852, tone: "water" },
          { x: 720, y: 838, tone: "energy" },
          { x: 1000, y: 834, tone: "gov" },
          { x: 1300, y: 834, tone: "general" },
        ]}
        links={[
          [0, 1],
          [1, 2],
          [2, 3],
          [3, 4],
        ]}
      />
    </DecorLayer>
  );
}

/* Slide 6 — Jalan desa, irigasi, jaringan listrik sebagai jaringan simpul */

function Scene06() {
  return (
    <DecorLayer>
      <Layer opacity={0.8}>
        <Road d="M 920 250 C 1050 232 1150 190 1300 192 C 1420 196 1500 150 1585 110" width={6} />
        <Road d="M 1150 200 C 1170 130 1240 92 1330 70" width={5} />
        <WaterLine d="M 935 150 C 1050 162 1120 120 1220 130 C 1320 140 1420 232 1585 222" width={4} />
        <Pylon x={1360} y={150} h={60} />
        <Pylon x={1480} y={122} h={60} />
        <PowerLine points={[[1240, 64], [1360, 90], [1480, 62], [1590, 80]]} />
        <House x={960} y={238} s={0.5} />
        <RiceTerrace x={1000} y={150} w={92} rows={2} s={0.7} />
        <WaterPump x={1220} y={128} s={0.8} />
        <GovBuilding x={1420} y={252} s={0.32} />
        <WindTurbine x={1560} y={214} s={0.42} />
      </Layer>
      <NodeNet
        opacity={0.85}
        r={5}
        nodes={[
          { x: 960, y: 212, tone: "general" },
          { x: 1045, y: 128, tone: "food" },
          { x: 1220, y: 104, tone: "water" },
          { x: 1360, y: 90, tone: "energy" },
          { x: 1560, y: 164, tone: "energy" },
          { x: 1420, y: 210, tone: "gov" },
          { x: 1150, y: 200, tone: "general" },
        ]}
        links={[
          [0, 1],
          [1, 2],
          [2, 3],
          [3, 4],
          [0, 6],
          [6, 5],
          [5, 4],
          [6, 2],
        ]}
      />
      <Road d="M -10 884 C 400 872 800 888 1200 876 C 1400 870 1500 878 1610 874" width={7} />
      <WaterLine d="M -10 898 C 400 890 800 900 1200 892 C 1400 888 1500 894 1610 890" width={4} />
    </DecorLayer>
  );
}

/* Slide 7 — Kota pintar dengan titik jaringan pada gedung, air, energi, pertanian */

function Scene07() {
  const b = [
    { dx: 0, w: 30, h: 70 },
    { dx: 34, w: 40, h: 120 },
    { dx: 78, w: 30, h: 90 },
    { dx: 112, w: 48, h: 150 },
    { dx: 164, w: 32, h: 100 },
    { dx: 200, w: 40, h: 130 },
    { dx: 244, w: 30, h: 80 },
    { dx: 278, w: 44, h: 140 },
    { dx: 326, w: 34, h: 95 },
    { dx: 364, w: 40, h: 120 },
    { dx: 408, w: 30, h: 75 },
    { dx: 442, w: 44, h: 110 },
  ];
  return (
    <DecorLayer>
      <Ground d="M0 884 C 400 874 800 884 1200 876 C 1400 872 1500 878 1600 874 L1600 900 L0 900 Z" />
      <WheatField x={885} y={894} w={110} />
      <WaterTower x={1012} y={892} s={0.65} />
      <Skyline x={1048} y={896} buildings={b} />
      <WindTurbine x={1565} y={896} s={0.55} dur={8} />
      <NodeNet
        nodes={[
          { x: 940, y: 852, tone: "food" },
          { x: 1012, y: 836, tone: "water" },
          { x: 1184, y: 746, tone: "general" },
          { x: 1268, y: 766, tone: "general" },
          { x: 1348, y: 756, tone: "general" },
          { x: 1512, y: 786, tone: "general" },
          { x: 1565, y: 830, tone: "energy" },
        ]}
        links={[
          [0, 1],
          [1, 2],
          [2, 3],
          [3, 4],
          [4, 5],
          [5, 6],
          [1, 3],
        ]}
      />
    </DecorLayer>
  );
}

/* Slide 8 — Loop Food–Water–Energy (hijau, biru, emas) di sudut kanan atas */

function Scene08() {
  const arcs: { d: string; color: string }[] = [
    { d: "M 1270 70 A 200 70 0 0 1 1443 175", color: P.water },
    { d: "M 1443 175 A 200 70 0 0 1 1097 175", color: P.leaf },
    { d: "M 1097 175 A 200 70 0 0 1 1270 70", color: P.wheat },
  ];
  return (
    <DecorLayer>
      {arcs.map((a, i) => (
        <g key={i}>
          <path d={a.d} fill="none" style={{ stroke: a.color, strokeWidth: 3, opacity: 0.35 }} />
          <path
            d={a.d}
            fill="none"
            strokeDasharray="4 16"
            strokeLinecap="round"
            className="loop-dash decor-motion"
            style={{ stroke: a.color, strokeWidth: 4, "--dur": "1.8s" } as Vars}
          />
        </g>
      ))}
      <Dam x={1226} y={92} w={90} s={0.75} />
      <WheatField x={1048} y={212} w={96} s={0.9} />
      <Tree x={1156} y={210} s={0.5} delay={-2} />
      <SolarArray x={1392} y={214} n={2} s={0.55} />
      <WindTurbine x={1478} y={214} s={0.5} />
      <NodeNet
        nodes={[
          { x: 1270, y: 70, tone: "water" },
          { x: 1443, y: 175, tone: "energy" },
          { x: 1097, y: 175, tone: "food" },
        ]}
        links={[]}
        period={2.6}
      />
    </DecorLayer>
  );
}

/* Slide 9 — Desa pertanian: sawah, irigasi, rumah, industri kecil, distribusi energi */

function Scene09() {
  return (
    <DecorLayer>
      <path d="M1010 806 C 1120 780 1260 790 1490 782 L1490 808 L1010 808 Z" style={{ fill: P.sage }} />
      <RiceTerrace x={1022} y={804} w={140} rows={2} />
      <WaterPump x={1184} y={800} />
      <Pipe d="M 1196 786 C 1210 790 1230 794 1250 794" />
      <House x={1246} y={796} s={0.6} />
      <House x={1296} y={794} s={0.5} roof={P.forest} />
      <Factory x={1372} y={794} s={0.55} />
      <Pylon x={1450} y={792} h={60} />
      <PowerLine points={[[1250, 770], [1345, 752], [1450, 732]]} />
      <WaterLine d="M 1010 808 C 1150 800 1300 808 1490 802" width={4} />
    </DecorLayer>
  );
}

/* Slide 10 — Kertas berpetak + buku catatan dan alat ukur (sangat lembut) */

function Scene10() {
  return (
    <DecorLayer>
      <g style={{ stroke: P.leaf, strokeWidth: 1, opacity: 0.07 }}>
        {Array.from({ length: 41 }, (_, i) => (
          <line key={`v${i}`} x1={i * 40} y1={0} x2={i * 40} y2={900} />
        ))}
        {Array.from({ length: 23 }, (_, i) => (
          <line key={`h${i}`} x1={0} y1={i * 40} x2={1600} y2={i * 40} />
        ))}
      </g>
      <Layer opacity={0.75}>
        <rect x={1130} y={130} width={150} height={100} rx={8} style={{ fill: P.white, stroke: P.sage, strokeWidth: 1.5 }} />
        {[1150, 1175, 1200, 1225, 1250].map((x) => (
          <circle key={x} cx={x} cy={130} r={4} style={{ fill: P.cream, stroke: P.soil, strokeWidth: 1.5 }} />
        ))}
        {[158, 176, 194, 212].map((y) => (
          <line key={y} x1={1142} y1={y} x2={1268} y2={y} style={{ stroke: P.waterSoft, strokeWidth: 1.5 }} />
        ))}
        <NodeNet
          r={4}
          nodes={[
            { x: 1170, y: 205, tone: "food" },
            { x: 1205, y: 160, tone: "water" },
            { x: 1245, y: 200, tone: "energy" },
          ]}
          links={[
            [0, 1],
            [1, 2],
            [2, 0],
          ]}
        />
        <g transform="translate(1305 222) rotate(-8)">
          <rect x={0} y={-12} width={170} height={22} rx={3} style={{ fill: P.wheatSoft, stroke: P.wheat, strokeWidth: 1.5 }} />
          {Array.from({ length: 17 }, (_, i) => (
            <line key={i} x1={6 + i * 10} y1={-12} x2={6 + i * 10} y2={i % 5 === 0 ? -2 : -6} style={{ stroke: P.wheatDeep, strokeWidth: 1 }} />
          ))}
        </g>
        <g transform="translate(1440 190)">
          <path d="M -55 0 A 55 55 0 0 1 55 0 Z" style={{ fill: P.waterSoft, stroke: P.waterDeep, strokeWidth: 1.5, opacity: 0.85 }} />
          {Array.from({ length: 13 }, (_, i) => (
            <line key={i} x1={0} y1={-46} x2={0} y2={-54} transform={`rotate(${-90 + i * 15})`} style={{ stroke: P.waterDeep, strokeWidth: 1 }} />
          ))}
          <circle r={3} style={{ fill: P.waterDeep }} />
        </g>
        <g transform="translate(1520 150) rotate(35)">
          <rect x={-5} y={-50} width={10} height={70} rx={2} style={{ fill: P.wheat }} />
          <polygon points="-5,20 5,20 0,32" style={{ fill: P.soil }} />
          <rect x={-5} y={-58} width={10} height={8} rx={2} style={{ fill: P.leaf }} />
        </g>
      </Layer>
    </DecorLayer>
  );
}

/* Slide 11 — Jalan & sungai mengalir dari desa → kota → pusat pemerintahan */

function Scene11() {
  return (
    <DecorLayer>
      <Ground d="M0 800 C 300 770 700 790 1000 780 C 1250 772 1450 784 1600 778 L1600 900 L0 900 Z" />
      <Tree x={22} y={802} s={0.7} delay={-1} />
      <House x={75} y={800} s={0.8} />
      <House x={150} y={796} s={0.7} roof={P.forest} />
      <Barn x={235} y={794} s={0.7} />
      <Tree x={300} y={792} s={0.6} kind="pine" delay={-2} />
      <RiceTerrace x={335} y={808} w={230} rows={3} />
      <WindTurbine x={630} y={790} s={0.55} dur={9} />
      <SolarArray x={680} y={798} n={3} s={0.7} />
      <Skyline
        x={960}
        y={794}
        buildings={[
          { dx: 0, w: 30, h: 50 },
          { dx: 34, w: 26, h: 80 },
          { dx: 64, w: 38, h: 100 },
          { dx: 106, w: 30, h: 70 },
          { dx: 140, w: 40, h: 90 },
          { dx: 184, w: 28, h: 60 },
          { dx: 216, w: 36, h: 85 },
        ]}
      />
      <Park x={1222} y={798} w={92} />
      <GovBuilding x={1430} y={800} s={0.58} />
      <Ground d="M0 846 C 400 826 800 846 1200 834 C 1400 828 1500 836 1600 832 L1600 900 L0 900 Z" fill={P.leaf} opacity={0.3} />
      <Road d="M -10 872 C 300 846 600 866 900 852 C 1150 840 1350 852 1610 840" />
      <WaterLine d="M -10 894 C 400 878 800 896 1200 882 C 1400 876 1500 886 1610 880" width={7} />
      <NodeNet
        nodes={[
          { x: 150, y: 860, tone: "general" },
          { x: 450, y: 856, tone: "food" },
          { x: 700, y: 862, tone: "energy" },
          { x: 1060, y: 846, tone: "general" },
          { x: 1430, y: 844, tone: "gov" },
        ]}
        links={[
          [0, 1],
          [1, 2],
          [2, 3],
          [3, 4],
        ]}
      />
    </DecorLayer>
  );
}

/* Slide 12 — Peta desa–kota: jalan, pipa air, jalur listrik, titik fasilitas */

function Scene12() {
  return (
    <DecorLayer>
      <path
        d="M660 900 C 660 820 760 760 900 750 C 1100 736 1300 760 1460 744 C 1540 736 1600 760 1600 790 L1600 900 Z"
        style={{ fill: P.mist, stroke: P.sage, strokeWidth: 2 }}
      />
      <polygon points="700,890 760,820 880,812 860,890" style={{ fill: P.wheatSoft }} />
      <polygon points="880,812 1000,800 1020,882 870,890" style={{ fill: P.sage }} />
      {Array.from({ length: 10 }, (_, i) => (
        <rect key={i} x={1180 + (i % 5) * 28} y={812 + Math.floor(i / 5) * 30} width={20} height={20} rx={3} style={{ fill: P.haze }} />
      ))}
      {Array.from({ length: 8 }, (_, i) => (
        <rect key={`c${i}`} x={1390 + (i % 4) * 34} y={786 + Math.floor(i / 4) * 34} width={26} height={26} rx={3} style={{ fill: "#b9cdbf" }} />
      ))}
      <WaterLine d="M 670 866 C 800 846 900 872 1050 844 C 1150 826 1250 856 1610 828" width={6} />
      <Road d="M 720 792 C 900 802 1100 782 1300 792 C 1420 798 1520 782 1610 786" width={6} />
      <Road d="M 1110 900 C 1124 852 1142 806 1180 764" width={5} />
      <Pipe d="M 1040 846 L 1040 872 L 1380 872" />
      <PowerLine points={[[760, 788], [1000, 768], [1240, 770], [1500, 756]]} sag={10} />
      <MapPin x={800} y={848} color={P.wheat} />
      <MapPin x={960} y={806} color={P.soil} />
      <MapPin x={1040} y={838} color={P.waterDeep} />
      <MapPin x={1250} y={826} color={P.forest} />
      <MapPin x={1470} y={808} color={P.leaf} />
      <NodeNet
        opacity={0.7}
        r={3}
        nodes={[
          { x: 800, y: 824, tone: "food" },
          { x: 960, y: 782, tone: "energy" },
          { x: 1040, y: 814, tone: "water" },
          { x: 1250, y: 802, tone: "gov" },
          { x: 1470, y: 784, tone: "general" },
        ]}
        links={[
          [0, 1],
          [1, 2],
          [2, 3],
          [3, 4],
        ]}
      />
    </DecorLayer>
  );
}

/* Slide 13 — Lanskap desa–kota dengan tiga cluster jaringan (hijau, biru, emas) */

function Scene13() {
  return (
    <DecorLayer>
      <path d="M1060 232 C 1150 172 1300 192 1400 176 C 1480 166 1550 180 1590 170 L1590 234 L1060 234 Z" style={{ fill: P.sage, opacity: 0.85 }} />
      <RiceTerrace x={1078} y={230} w={130} rows={2} />
      <Tree x={1228} y={206} s={0.5} />
      <WindTurbine x={1330} y={200} s={0.42} />
      <Skyline
        x={1420}
        y={200}
        buildings={[
          { dx: 0, w: 24, h: 50 },
          { dx: 28, w: 30, h: 80 },
          { dx: 62, w: 22, h: 60 },
          { dx: 88, w: 34, h: 100 },
          { dx: 126, w: 26, h: 70 },
        ]}
      />
      <WaterLine d="M 1060 238 C 1200 216 1300 232 1400 210 C 1460 198 1540 210 1592 200" width={4} />
      <NodeNet
        r={5}
        nodes={[
          { x: 1100, y: 118, tone: "general" },
          { x: 1150, y: 86, tone: "general" },
          { x: 1182, y: 136, tone: "general" },
          { x: 1122, y: 162, tone: "general" },
          { x: 1280, y: 140, tone: "water" },
          { x: 1330, y: 104, tone: "water" },
          { x: 1356, y: 152, tone: "water" },
          { x: 1462, y: 70, tone: "food" },
          { x: 1520, y: 104, tone: "food" },
          { x: 1494, y: 44, tone: "food" },
        ]}
        links={[
          [0, 1],
          [1, 2],
          [2, 3],
          [3, 0],
          [4, 5],
          [5, 6],
          [6, 4],
          [7, 8],
          [8, 9],
          [9, 7],
          [2, 4],
          [5, 7],
        ]}
        dashed={[10, 11]}
      />
    </DecorLayer>
  );
}

/* Slide 14 — Desa | pemerintahan | kota; hubungan lemah dan jalur alternatif */

function Scene14() {
  return (
    <DecorLayer>
      <Ground d="M0 878 C 400 866 800 880 1200 870 C 1400 864 1500 872 1600 868 L1600 900 L0 900 Z" />
      <House x={80} y={892} s={0.55} />
      <House x={140} y={890} s={0.5} roof={P.forest} />
      <RiceTerrace x={185} y={896} w={160} rows={2} s={0.9} />
      <Tree x={372} y={892} s={0.55} />
      <GovBuilding x={800} y={896} s={0.38} />
      <Skyline
        x={1180}
        y={896}
        buildings={[
          { dx: 0, w: 26, h: 40 },
          { dx: 30, w: 30, h: 58 },
          { dx: 64, w: 24, h: 46 },
          { dx: 92, w: 34, h: 54 },
          { dx: 130, w: 28, h: 36 },
          { dx: 162, w: 32, h: 50 },
          { dx: 198, w: 26, h: 44 },
        ]}
      />
      <WindTurbine x={1470} y={892} s={0.35} />
      <SolarArray x={1510} y={892} n={2} s={0.5} />
      {/* jalur alternatif (peluang pengembangan metode) */}
      <path d="M 800 838 Q 1030 802 1290 842" fill="none" style={{ stroke: P.fresh, strokeWidth: 2, opacity: 0.45 }} />
      <path
        d="M 800 838 Q 1030 802 1290 842"
        fill="none"
        strokeDasharray="4 14"
        strokeLinecap="round"
        className="loop-dash decor-motion"
        style={{ stroke: P.leaf, strokeWidth: 3, "--dur": "2s" } as Vars}
      />
      <NodeNet
        nodes={[
          { x: 150, y: 848, tone: "general" },
          { x: 800, y: 838, tone: "gov" },
          { x: 1290, y: 842, tone: "general" },
          { x: 1480, y: 846, tone: "energy" },
        ]}
        links={[
          [0, 1],
          [1, 2],
          [2, 3],
        ]}
        dashed={[1]}
      />
    </DecorLayer>
  );
}

/* Slide 15 — Panorama penutup (latar gelap): sawah, sungai, energi, desa, kota, balai kota */

function Scene15() {
  return (
    <DecorLayer>
      <FloatingLeaves
        regions={[{ x: 80, y: 30, w: 1000, h: 60 }]}
        count={5}
        seed={19}
        colors={["var(--color-fresh)", "var(--color-leaf)"]}
        opacity={0.3}
      />
      <Cloud y={520} scale={0.8} dur={120} delay={-40} opacity={0.08} />
      <Cloud y={580} scale={0.6} dur={150} delay={-100} opacity={0.07} />
      <Layer opacity={0.85}>
        <Skyline
          x={1390}
          y={760}
          buildings={[
            { dx: 0, w: 36, h: 120, color: "#2f6146" },
            { dx: 40, w: 30, h: 190, color: "#2f6146" },
            { dx: 74, w: 44, h: 150, color: "#2f6146" },
            { dx: 122, w: 32, h: 220, color: "#2f6146" },
            { dx: 158, w: 44, h: 140, color: "#2f6146" },
          ]}
        />
      </Layer>
      <Ground d="M0 720 C 300 690 600 712 900 722 C 1150 730 1350 690 1600 704 L1600 900 L0 900 Z" fill="rgba(220,231,211,0.10)" />
      <Layer opacity={0.55}>
        <WindTurbine x={38} y={724} s={0.6} dur={10} />
        <WindTurbine x={86} y={730} s={0.5} dur={8} delay={-3} />
        <RiceTerrace x={300} y={842} w={240} rows={2} />
        <House x={640} y={838} s={0.45} />
        <House x={690} y={836} s={0.42} roof={P.forest} />
        <Tree x={735} y={836} s={0.42} />
        <SolarArray x={860} y={842} n={3} s={0.55} />
        <WheatField x={1010} y={842} w={150} s={0.7} />
      </Layer>
      <GovBuilding x={1320} y={786} s={0.62} />
      <Ground d="M0 800 C 300 776 620 796 900 804 C 1150 812 1350 780 1600 792 L1600 900 L0 900 Z" fill="rgba(111,158,88,0.22)" />
      <WaterLine d="M -20 852 C 300 840 520 856 760 850 C 1000 844 1200 860 1620 850" width={6} />
      <Ground d="M0 862 C 360 838 700 856 1000 870 C 1260 882 1440 852 1600 856 L1600 900 L0 900 Z" fill="rgba(167,201,87,0.16)" />
      {Array.from({ length: 12 }, (_, i) => (
        <Tree key={i} x={60 + i * 130} y={870 - (i % 3) * 5} s={0.45} kind="bush" delay={-i * 0.5} />
      ))}
      <NodeNet
        opacity={0.75}
        nodes={[
          { x: 420, y: 812, tone: "food" },
          { x: 665, y: 810, tone: "general" },
          { x: 920, y: 814, tone: "energy" },
          { x: 1235, y: 814, tone: "food" },
          { x: 1320, y: 680, tone: "gov" },
          { x: 1530, y: 560, tone: "general" },
        ]}
        links={[
          [0, 1],
          [1, 2],
          [2, 3],
          [3, 4],
          [4, 5],
        ]}
      />
    </DecorLayer>
  );
}

const SCENES: Record<number, () => ReactNode> = {
  1: Scene01,
  2: Scene02,
  3: Scene03,
  4: Scene04,
  5: Scene05,
  6: Scene06,
  7: Scene07,
  8: Scene08,
  9: Scene09,
  10: Scene10,
  11: Scene11,
  12: Scene12,
  13: Scene13,
  14: Scene14,
  15: Scene15,
};

/** Latar ilustrasi khusus untuk slide ke-`n` (1–15). */
export function SlideScene({ n }: { n: number }) {
  const Scene = SCENES[n];
  return Scene ? <Scene /> : null;
}
