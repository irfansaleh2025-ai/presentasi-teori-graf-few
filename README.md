# Presentasi UTS Teori Graf — Sistem Food–Energy–Water & ALC

Website presentasi interaktif (15 slide, 16:9) berdasarkan artikel
Rozhkov dkk. (2025), *Identifying Leverage Points for Sustainable Transitions in Urban–Rural Systems*,
Environmental Science and Policy.

## Menjalankan

```bash
npm install
npm run dev          # http://localhost:3000 (development)
# atau versi produksi:
npm run build && npm run start
```

| Halaman      | Fungsi                                                    |
| ------------ | --------------------------------------------------------- |
| `/`          | Presentasi utama (`/#7` membuka slide 7 langsung)          |
| `/presenter` | Mode presenter: slide aktif, slide berikutnya, catatan, timer. Tersinkron dengan jendela utama |
| `/print`     | Semua slide statis untuk **Cetak / Save as PDF** (1 slide per halaman) |

## Shortcut keyboard

| Tombol                  | Aksi                                   |
| ----------------------- | -------------------------------------- |
| → / Space / PageDown    | Maju (menelusuri langkah sorotan dulu pada slide 7, 8, 10, 11) |
| ← / PageUp              | Mundur                                 |
| Home / End              | Slide pertama / terakhir               |
| F                       | Fullscreen                             |
| O                       | Overview seluruh slide (Esc untuk menutup) |
| N                       | Catatan pembicara                      |
| S                       | Buka mode presenter                    |
| M                       | Matikan / nyalakan animasi dekoratif (disimpan di browser) |

Shortcut tidak aktif ketika fokus berada di input/textarea.

## Desain visual

Konsep **Modern Agriculture × Scientific Nature**. Palet warna didefinisikan sekali sebagai CSS variables
di `app/globals.css` (`--color-forest`, `--color-leaf`, `--color-fresh`, `--color-sage`, `--color-cream`,
`--color-soil`, `--color-wheat`, `--color-water`, `--color-charcoal`) dan dipakai oleh Tailwind maupun SVG.

Animasi looping dekoratif (`components/decor.tsx`, `FewDiagram.tsx`, aliran edge di `AnimatedGraph.tsx`)
memakai CSS keyframes `loop-*` — ringan dan tanpa timer JavaScript. Animasi otomatis berhenti untuk
`prefers-reduced-motion`, tombol **M**, thumbnail overview, dan halaman cetak.

## Struktur

```
app/                    page.tsx, presenter/, print/, layout.tsx, globals.css
components/
  Presentation.tsx      navigasi, transisi, progress bar, catatan
  SlideControls.tsx     tombol kontrol
  SlideOverview.tsx     grid overview
  SlideRenderer.tsx     peta id slide → komponen
  SlideStage.tsx        kanvas 1600×900 yang diskalakan ke layar
  AnimatedGraph.tsx     graf berarah SVG (vertex & edge beranimasi, sorotan)
  AnimatedFlowchart.tsx flowchart bertahap
  StatCounter.tsx       angka count-up
  FewDiagram.tsx        diagram Food–Energy–Water berwarna dengan aliran beranimasi
  illustrations.tsx     ilustrasi vektor: rumah, sawah, pohon, gedung kota, balai kota, turbin angin,
                        panel surya, bendungan, menara air, tiang listrik, pabrik, sungai, jalan, pipa, jaringan graf
  scenes.tsx            komposisi latar berbeda untuk tiap slide (SlideScene n={1..15})
  decor.tsx             BotanicalBackground: FloatingLeaves, CornerSprig, ContourLines, CropRows,
                        AgriculturalLandscape, FlowingWater, GrowingPlant/PlantRow, AmbientNetwork
  slides/               tata letak 15 slide
data/
  slides.ts             SEMUA teks slide + catatan pembicara
  graphs.ts             graf ilustratif (Slide 7, 9–10)
lib/
  graph-metrics.ts      indegree, outdegree, degree, betweenness (Brandes), closeness, PageRank, eigenvector, siklus
  deck-store.ts         state navigasi (hash URL + BroadcastChannel)
  use-shortcuts.ts      listener keyboard tunggal
  decor-store.ts        pengaturan on/off animasi dekoratif
```

## Yang perlu dilengkapi sebelum presentasi

- `data/slides.ts` → `s01.group`: nama anggota, NIM, kelas, institusi.
- Slide 12: angka karakteristik graf berasal dari materi — verifikasi terhadap jurnal asli.
- Slide 13: placeholder untuk Tabel 4 (komposisi 7 cluster), contoh variabel, dan Gambar 6.

Angka pada Slide 10 dihitung otomatis oleh `lib/graph-metrics.ts` dari graf yang sama dengan Slide 9,
sehingga jika graf di `data/graphs.ts` diubah, perhitungannya ikut menyesuaikan.
