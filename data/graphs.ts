import type { Graph } from "@/lib/graph-metrics";

/**
 * Graf ilustratif 7 vertex untuk Slide 9 dan Slide 10.
 * BUKAN graf asli penelitian — hanya contoh untuk simulasi perhitungan.
 */
export const fewGraph: Graph = {
  nodes: [
    { id: "U", tone: "general", short: "U", label: "Populasi Perkotaan", x: 90, y: 300 },
    { id: "F", tone: "food", short: "F", label: "Permintaan Pangan", x: 160, y: 100, labelDy: -48 },
    { id: "I", tone: "water", short: "I", label: "Irigasi", x: 360, y: 100, labelDy: -48 },
    { id: "E", tone: "energy", short: "E", label: "Permintaan Energi", x: 360, y: 500 },
    {
      id: "K",
      tone: "general",
      short: "K",
      label: "Kebijakan Konservasi",
      labelLines: ["Kebijakan", "Konservasi"],
      x: 560,
      y: 300,
      labelDx: -44,
      labelDy: 0,
      labelAnchor: "end",
    },
    { id: "W", tone: "water", short: "W", label: "Ketersediaan Air", x: 740, y: 300, labelDx: 34, labelDy: -54 },
    { id: "P", tone: "food", short: "P", label: "Produksi Pangan", x: 780, y: 500 },
  ],
  edges: [
    { from: "U", to: "E", sign: "+" },
    { from: "U", to: "F", sign: "+" },
    { from: "F", to: "I", sign: "+" },
    { from: "I", to: "W", sign: "-" },
    { from: "I", to: "E", sign: "+" },
    { from: "E", to: "W", sign: "-" },
    { from: "W", to: "K", sign: "-" },
    { from: "K", to: "I", sign: "-" },
    { from: "K", to: "E", sign: "-" },
    { from: "W", to: "P", sign: "+" },
  ],
};

/** Graf kecil generik untuk ilustrasi perbedaan metrik (Slide 7). */
export const metricGraph: Graph = {
  nodes: [
    { id: "A", short: "A", label: "", x: 700, y: 250 },
    { id: "B", short: "B", label: "", x: 90, y: 250 },
    { id: "C", short: "C", label: "", x: 400, y: 60 },
    { id: "D", short: "D", label: "", x: 400, y: 440 },
    { id: "E", short: "E", label: "", x: 290, y: 250 },
    { id: "F", short: "F", label: "", x: 560, y: 250 },
  ],
  edges: [
    { from: "F", to: "A" },
    { from: "F", to: "C" },
    { from: "F", to: "D" },
    { from: "B", to: "C" },
    { from: "B", to: "E" },
    { from: "D", to: "C" },
    { from: "D", to: "B" },
    { from: "E", to: "D" },
    { from: "C", to: "E" },
  ],
};
