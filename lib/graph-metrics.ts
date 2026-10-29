/**
 * Fungsi metrik graf berarah tanpa bobot.
 * Semua angka pada slide perhitungan dihasilkan dari fungsi-fungsi ini,
 * sehingga selalu konsisten dengan graf yang digambar.
 */

export type Sign = "+" | "-";

/** Kategori visual vertex (hanya untuk pewarnaan, tidak memengaruhi perhitungan). */
export type NodeTone = "general" | "water" | "food" | "energy";

export interface GraphNode {
  id: string;
  tone?: NodeTone;
  /** Kode singkat yang ditampilkan di dalam lingkaran */
  short: string;
  label: string;
  /** Label dipecah menjadi beberapa baris (opsional) */
  labelLines?: string[];
  x: number;
  y: number;
  /** Posisi label relatif terhadap simpul (default: di bawah) */
  labelDx?: number;
  labelDy?: number;
  labelAnchor?: "start" | "middle" | "end";
}

export interface GraphEdge {
  from: string;
  to: string;
  sign?: Sign;
  /** Kelengkungan edge (0 = lurus) */
  curve?: number;
}

export interface Graph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export type Metric = Record<string, number>;

const ids = (g: Graph) => g.nodes.map((n) => n.id);

export function successors(g: Graph): Record<string, string[]> {
  const adj: Record<string, string[]> = {};
  for (const id of ids(g)) adj[id] = [];
  for (const e of g.edges) adj[e.from].push(e.to);
  return adj;
}

export function predecessors(g: Graph): Record<string, string[]> {
  const adj: Record<string, string[]> = {};
  for (const id of ids(g)) adj[id] = [];
  for (const e of g.edges) adj[e.to].push(e.from);
  return adj;
}

export function inDegree(g: Graph): Metric {
  const p = predecessors(g);
  return Object.fromEntries(ids(g).map((id) => [id, p[id].length]));
}

export function outDegree(g: Graph): Metric {
  const s = successors(g);
  return Object.fromEntries(ids(g).map((id) => [id, s[id].length]));
}

export interface DegreeCentrality {
  in: number;
  out: number;
  /** (deg⁻ + deg⁺) / (2(n − 1)) — total derajat dinormalisasi ke rentang 0–1 */
  total: number;
}

export function degreeCentrality(g: Graph): Record<string, DegreeCentrality> {
  const n = g.nodes.length;
  const ind = inDegree(g);
  const outd = outDegree(g);
  return Object.fromEntries(
    ids(g).map((id) => [
      id,
      {
        in: ind[id] / (n - 1),
        out: outd[id] / (n - 1),
        total: (ind[id] + outd[id]) / (2 * (n - 1)),
      },
    ]),
  );
}

interface BfsResult {
  dist: Record<string, number>;
  sigma: Record<string, number>;
  preds: Record<string, string[]>;
  order: string[];
}

function bfs(g: Graph, source: string, adj = successors(g)): BfsResult {
  const dist: Record<string, number> = {};
  const sigma: Record<string, number> = {};
  const preds: Record<string, string[]> = {};
  for (const id of ids(g)) {
    dist[id] = Infinity;
    sigma[id] = 0;
    preds[id] = [];
  }
  dist[source] = 0;
  sigma[source] = 1;
  const queue = [source];
  const order: string[] = [];
  while (queue.length) {
    const v = queue.shift()!;
    order.push(v);
    for (const w of adj[v]) {
      if (dist[w] === Infinity) {
        dist[w] = dist[v] + 1;
        queue.push(w);
      }
      if (dist[w] === dist[v] + 1) {
        sigma[w] += sigma[v];
        preds[w].push(v);
      }
    }
  }
  return { dist, sigma, preds, order };
}

/** Jarak terpendek dari s ke semua simpul (Infinity jika tidak terjangkau). */
export function distancesFrom(g: Graph, s: string): Record<string, number> {
  return bfs(g, s).dist;
}

/** Semua lintasan terpendek dari s ke t. */
export function allShortestPaths(g: Graph, s: string, t: string): string[][] {
  const { dist, preds } = bfs(g, s);
  if (dist[t] === Infinity || s === t) return [];
  const build = (v: string): string[][] =>
    v === s ? [[s]] : preds[v].flatMap((p) => build(p).map((path) => [...path, v]));
  return build(t);
}

/** Betweenness centrality (algoritma Brandes) untuk graf berarah. */
export function betweenness(g: Graph, normalized = false): Metric {
  const n = g.nodes.length;
  const adj = successors(g);
  const cb: Metric = Object.fromEntries(ids(g).map((id) => [id, 0]));
  for (const s of ids(g)) {
    const { sigma, preds, order } = bfs(g, s, adj);
    const delta: Metric = Object.fromEntries(ids(g).map((id) => [id, 0]));
    for (let i = order.length - 1; i >= 0; i--) {
      const w = order[i];
      for (const v of preds[w]) delta[v] += (sigma[v] / sigma[w]) * (1 + delta[w]);
      if (w !== s) cb[w] += delta[w];
    }
  }
  if (normalized) {
    const scale = (n - 1) * (n - 2);
    for (const id of ids(g)) cb[id] /= scale;
  }
  return cb;
}

export interface BetweennessTerm {
  s: string;
  t: string;
  /** Jumlah lintasan terpendek s → t */
  sigmaST: number;
  /** Jumlah lintasan terpendek s → t yang melewati v */
  sigmaSTv: number;
  paths: string[][];
}

/** Rincian kontribusi tiap pasangan (s, t) terhadap betweenness simpul v. */
export function betweennessBreakdown(g: Graph, v: string): BetweennessTerm[] {
  const terms: BetweennessTerm[] = [];
  for (const s of ids(g)) {
    if (s === v) continue;
    for (const t of ids(g)) {
      if (t === v || t === s) continue;
      const paths = allShortestPaths(g, s, t);
      if (!paths.length) continue;
      const through = paths.filter((p) => p.slice(1, -1).includes(v));
      if (!through.length) continue;
      terms.push({ s, t, sigmaST: paths.length, sigmaSTv: through.length, paths });
    }
  }
  return terms;
}

/**
 * Closeness centrality berbasis jarak keluar dengan koreksi Wasserman–Faust
 * untuk graf yang tidak terhubung kuat: ((r)/(n−1)) · (r / Σd), r = jumlah simpul terjangkau.
 */
export function closeness(g: Graph): Metric {
  const n = g.nodes.length;
  const adj = successors(g);
  return Object.fromEntries(
    ids(g).map((id) => {
      const { dist } = bfs(g, id, adj);
      const reach = Object.entries(dist).filter(([k, d]) => k !== id && d !== Infinity);
      const sum = reach.reduce((acc, [, d]) => acc + d, 0);
      const r = reach.length;
      return [id, sum === 0 ? 0 : (r / (n - 1)) * (r / sum)];
    }),
  );
}

/** PageRank dengan damping factor d; simpul tanpa edge keluar disebar merata. */
export function pageRank(g: Graph, d = 0.85, iterations = 100): Metric {
  const n = g.nodes.length;
  const adj = successors(g);
  let pr: Metric = Object.fromEntries(ids(g).map((id) => [id, 1 / n]));
  for (let k = 0; k < iterations; k++) {
    const dangling = ids(g).reduce((acc, id) => (adj[id].length ? acc : acc + pr[id]), 0);
    const next: Metric = Object.fromEntries(
      ids(g).map((id) => [id, (1 - d) / n + (d * dangling) / n]),
    );
    for (const u of ids(g)) {
      for (const v of adj[u]) next[v] += (d * pr[u]) / adj[u].length;
    }
    pr = next;
  }
  return pr;
}

/** Eigenvector centrality berbasis edge masuk (iterasi pangkat x ← x + Aᵀx, dinormalisasi). */
export function eigenvector(g: Graph, iterations = 200): Metric {
  const pred = predecessors(g);
  let x: Metric = Object.fromEntries(ids(g).map((id) => [id, 1]));
  for (let k = 0; k < iterations; k++) {
    const next: Metric = {};
    for (const v of ids(g)) next[v] = x[v] + pred[v].reduce((acc, u) => acc + x[u], 0);
    const norm = Math.sqrt(Object.values(next).reduce((acc, val) => acc + val * val, 0)) || 1;
    for (const v of ids(g)) next[v] /= norm;
    x = next;
  }
  return x;
}

/** Semua siklus sederhana (setiap siklus dimulai dari simpul dengan indeks terkecil). */
export function simpleCycles(g: Graph): string[][] {
  const order = ids(g);
  const idx = Object.fromEntries(order.map((id, i) => [id, i]));
  const adj = successors(g);
  const cycles: string[][] = [];
  for (const start of order) {
    const stack: string[] = [start];
    const onPath = new Set([start]);
    const dfs = (v: string) => {
      for (const w of adj[v]) {
        if (w === start) cycles.push([...stack]);
        else if (!onPath.has(w) && idx[w] > idx[start]) {
          stack.push(w);
          onPath.add(w);
          dfs(w);
          stack.pop();
          onPath.delete(w);
        }
      }
    };
    dfs(start);
  }
  return cycles;
}

/** Polaritas loop: positif (reinforcing) jika jumlah tanda negatif genap. */
export function loopPolarity(g: Graph, cycle: string[]): Sign {
  let negatives = 0;
  for (let i = 0; i < cycle.length; i++) {
    const from = cycle[i];
    const to = cycle[(i + 1) % cycle.length];
    const edge = g.edges.find((e) => e.from === from && e.to === to);
    if (edge?.sign === "-") negatives++;
  }
  return negatives % 2 === 0 ? "+" : "-";
}

export function density(g: Graph): number {
  const n = g.nodes.length;
  return g.edges.length / (n * (n - 1));
}

/** Simpul dengan nilai tertinggi (bisa lebih dari satu jika seri). */
export function argMax(metric: Metric, eps = 1e-9): string[] {
  const max = Math.max(...Object.values(metric));
  return Object.keys(metric).filter((k) => Math.abs(metric[k] - max) < eps);
}

/** Format angka gaya Indonesia (koma desimal). */
export function fmt(value: number, digits = 3): string {
  return value.toFixed(digits).replace(".", ",");
}
