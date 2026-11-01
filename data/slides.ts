import { fewGraph } from "./graphs";
import { betweennessBreakdown } from "@/lib/graph-metrics";

/**
 * Konten dan metadata seluruh slide. Komponen tata letak berada di `components/slides`,
 * sedangkan logika navigasi berada di `components/Presentation.tsx`.
 */

export interface SlideMeta {
  id: string;
  /** Judul singkat untuk overview dan mode presenter */
  label: string;
  /** Jumlah langkah sorotan di dalam slide (default 1). Tombol → menelusuri langkah sebelum pindah slide. */
  steps?: number;
  notes: string;
}

export const source = {
  articleTitle: "Identifying Leverage Points for Sustainable Transitions in Urban–Rural Systems",
  authors: "Anton Rozhkov dkk.",
  year: "2025",
  journal: "Environmental Science and Policy",
} as const;

export const content = {
  s01: {
    eyebrow: "UTS Teori Graf",
    title: "Pemodelan Sistem Food–Energy–Water Menggunakan Teori Graf dan Adjusted Loop Centrality",
    group: {
      members: [
        "Irham Kadarusman — 25051130056",
        "Irfan Saleh — 25051130082",
        "Muhammad Zafran Abyan Dzaka — 25051130071",
        "Ruben Marvel — 25051130077",
      ],
      className: "Kelas: J",
      institution: "Program Studi Teknologi Informasi (TI)",
    },
  },
  s02: {
    eyebrow: "Latar Belakang",
    title: "Kota dan desa terhubung melalui pangan, energi, dan air",
    lead: "Wilayah perkotaan bergantung pada pedesaan untuk pangan dan air, sedangkan pedesaan bergantung pada kota untuk pasar, energi, dan infrastruktur.",
    points: [
      "Produksi pangan membutuhkan air dan energi.",
      "Penyediaan air membutuhkan energi untuk pemompaan dan pengolahan.",
      "Pembangkitan energi membutuhkan air untuk pendinginan.",
    ],
    closing: "Perubahan pada satu sektor merambat ke sektor lainnya.",
  },
  s03: {
    eyebrow: "Permasalahan dan Tujuan",
    title: "Mencari titik ungkit dalam sistem yang kompleks",
    problem: {
      heading: "Permasalahan",
      statement: "Sulit menentukan variabel paling strategis dalam sistem dengan banyak variabel dan hubungan sebab-akibat.",
      points: [
        "Hubungan antarvariabel bersifat tidak langsung dan berlapis.",
        "Feedback loop membuat dampak suatu perubahan sulit ditelusuri secara intuitif.",
      ],
    },
    goal: {
      heading: "Tujuan",
      statement: "Mengidentifikasi leverage points menggunakan teori graf dan Adjusted Loop Centrality (ALC).",
      points: [
        "Memodelkan sistem FEW sebagai graf berarah.",
        "Melengkapi metrik graf konvensional dengan analisis struktur loop.",
      ],
    },
    definition: "Leverage point: titik dalam sistem yang perubahannya kecil, tetapi berdampak luas.",
  },
  s04: {
    eyebrow: "Data Penelitian",
    title: "Model disusun secara partisipatif bersama para ahli",
    stats: [
      { value: 10, label: "Ahli", desc: "terlibat dalam penyusunan model" },
      { value: 85, label: "Variabel", desc: "menjadi vertex dalam graf" },
      { value: 160, label: "Hubungan sebab-akibat", desc: "menjadi edge berarah" },
    ],
    region: { label: "Wilayah studi", value: "Chicago dan kawasan pedesaan sekitarnya" },
    note: "Hubungan antarvariabel dituangkan dalam Causal Loop Diagram (CLD).",
  },
  s05: {
    eyebrow: "Pemodelan Graf",
    title: "Dari diagram sebab-akibat menjadi graf",
    terms: [
      { term: "Vertex", desc: "Simpul; mewakili satu variabel sistem." },
      { term: "Edge", desc: "Sisi; mewakili hubungan sebab-akibat antarvariabel." },
      { term: "Directed graph", desc: "Graf berarah; setiap edge mengarah dari sebab ke akibat." },
      { term: "Unweighted graph", desc: "Graf tanpa bobot; setiap hubungan dihitung setara." },
      { term: "Tanda + / −", desc: "Pada CLD, + berarti berubah searah; − berarti berubah berlawanan arah." },
    ],
    caption: "Contoh graf berarah bertanda (ilustratif)",
  },
  s06: {
    eyebrow: "Dasar Teori Graf",
    title: "Konsep dasar: arah, lintasan, siklus, dan umpan balik",
    cards: [
      { term: "Directed graph", formula: "G = (V, E),\\; E \\subseteq V \\times V", desc: "Edge berupa pasangan berurutan (u, v): arah dari u ke v." },
      { term: "Path", formula: "v_1 \\to v_2 \\to \\dots \\to v_k", desc: "Barisan vertex yang dihubungkan edge searah tanpa mengulang vertex." },
      { term: "Cycle", formula: "v_1 \\to \\dots \\to v_k \\to v_1", desc: "Path yang kembali ke vertex awal." },
      { term: "Feedback loop", formula: "\\text{R: } \\#(-) \\text{ genap} \\quad \\text{B: } \\#(-) \\text{ ganjil}", desc: "Cycle pada CLD. Polaritas ditentukan oleh jumlah tanda negatif." },
    ],
  },
  s07: {
    eyebrow: "Algoritma dan Metrik Graf",
    title: "Metrik graf: vertex mana yang paling sentral?",
    metrics: [
      { key: "in", name: "Indegree", formula: "\\deg^-(v)", desc: "Jumlah edge yang masuk — seberapa banyak variabel lain memengaruhi v." },
      { key: "out", name: "Outdegree", formula: "\\deg^+(v)", desc: "Jumlah edge yang keluar — seberapa banyak variabel yang dipengaruhi v." },
      { key: "deg", name: "Degree centrality", formula: "C_D(v)=\\dfrac{\\deg^-(v)+\\deg^+(v)}{2(n-1)}", desc: "Total derajat yang dinormalisasi terhadap jumlah vertex." },
      { key: "bet", name: "Betweenness centrality", formula: "C_B(v)=\\sum_{s\\neq v\\neq t}\\dfrac{\\sigma_{st}(v)}{\\sigma_{st}}", desc: "Seberapa sering v berada pada lintasan terpendek antarvertex lain — peran perantara." },
      { key: "clo", name: "Closeness centrality", formula: "C_C(v)=\\dfrac{r}{n-1}\\cdot\\dfrac{r}{\\sum_u d(v,u)}", desc: "Kedekatan v ke vertex yang dapat dijangkaunya (r) — seberapa cepat pengaruh menyebar." },
      { key: "pr", name: "PageRank", formula: "PR(v)=\\dfrac{1-d}{n}+d\\sum_{u\\to v}\\dfrac{PR(u)}{\\deg^+(u)}", desc: "v penting jika ditunjuk oleh vertex penting; pengaruh dibagi ke edge keluar (d = 0,85)." },
      { key: "eig", name: "Eigenvector centrality", formula: "x_v=\\dfrac{1}{\\lambda}\\sum_{u\\to v}x_u", desc: "Kepentingan v sebanding dengan kepentingan vertex yang menunjuknya." },
    ],
  },
  s08: {
    eyebrow: "Metode Utama",
    title: "Adjusted Loop Centrality (ALC)",
    lead: "Metrik konvensional menilai posisi vertex dalam jaringan. ALC menambahkan sudut pandang struktur feedback loop.",
    ideas: [
      { title: "Keterlibatan vertex", desc: "Vertex yang terlibat dalam banyak feedback loop berpotensi memengaruhi dinamika sistem." },
      { title: "Kemiripan antarloop", desc: "Loop yang saling tumpang tindih ikut dievaluasi dalam penyesuaian skor." },
    ],
    flow: [
      { title: "Identifikasi loop", desc: "Menemukan feedback loop dalam graf" },
      { title: "Analisis keterlibatan vertex", desc: "Mencatat vertex pada setiap loop" },
      { title: "Evaluasi kemiripan loop", desc: "Membandingkan loop yang tumpang tindih" },
      { title: "Penggabungan skor", desc: "Menyatukan hasil menjadi skor per vertex" },
      { title: "Interpretasi", desc: "Menentukan vertex strategis" },
    ],
    note: "Rumus dan detail algoritma ALC mengikuti jurnal asli dan tidak direproduksi di sini.",
  },
  s09: {
    eyebrow: "Rekonstruksi Graf",
    title: "Graf ilustratif sistem FEW dengan 7 vertex",
    badge: "Contoh ilustratif — bukan graf asli penelitian",
  },
  s10: {
    eyebrow: "Simulasi Perhitungan Manual",
    title: "Menghitung derajat dan betweenness",
    /** Vertex contoh untuk perhitungan bertahap */
    degreeExample: "E",
    betweennessExample: "E",
  },
  s11: {
    eyebrow: "Alur Penelitian",
    title: "Dari pendapat ahli menuju leverage points",
    flow: [
      { title: "Pengumpulan Data", desc: "Pemodelan partisipatif bersama 10 ahli" },
      { title: "Pembentukan CLD", desc: "Variabel dan hubungan sebab-akibat bertanda" },
      { title: "Konversi Graf", desc: "CLD menjadi graf berarah tanpa bobot" },
      { title: "Analisis Metrik Graf dan ALC", desc: "Metrik konvensional dan struktur loop" },
      { title: "Hasil", desc: "Peringkat vertex dan cluster" },
      { title: "Interpretasi", desc: "Identifikasi leverage points" },
    ],
  },
  s12: {
    eyebrow: "Karakteristik Graf",
    title: "Struktur graf sistem FEW dalam penelitian",
    badge: "Angka dari materi — perlu diverifikasi terhadap jurnal asli",
    metrics: [
      { name: "Vertex", value: 85, decimals: 0, desc: "Jumlah variabel dalam model." },
      { name: "Edge", value: 160, decimals: 0, desc: "Jumlah hubungan sebab-akibat berarah." },
      { name: "Density", value: 0.022, decimals: 3, desc: "Proporsi edge terhadap semua edge yang mungkin; graf tergolong jarang." },
      { name: "Diameter", value: 19, decimals: 0, desc: "Jarak terpendek terpanjang antara dua vertex." },
      { name: "Average path length", value: 6.531, decimals: 3, desc: "Rata-rata panjang lintasan terpendek antarpasangan vertex." },
      { name: "Modularity", value: 0.629, decimals: 3, desc: "Kekuatan pembagian graf menjadi komunitas; struktur cluster cukup jelas." },
    ],
  },
  s13: {
    eyebrow: "Hasil dan Interpretasi",
    title: "Penggerak dan penyebar perubahan",
    roles: [
      { title: "Change initiators", subtitle: "Pemicu Perubahan", desc: "Variabel yang berpotensi memulai perubahan dan memengaruhi banyak bagian sistem." },
      { title: "Change disseminators", subtitle: "Penghubung Perubahan", desc: "Variabel yang berperan meneruskan dan menyebarkan perubahan antarbagian sistem." },
    ],
    /** Tabel 4 jurnal: tiga peringkat teratas tiap peran */
    variablesTitle: "Hasil Analisis Variabel Penting",
    variablesNote: "Tabel 4",
    initiators: [
      { name: "Non-commodity local food products", metric: "Outdegree 7" },
      { name: "Commodity crops", metric: "Outdegree 7" },
      { name: "Urbanization", metric: "Outdegree 7" },
    ],
    disseminators: [
      { name: "Climate activism", metric: "Peringkat 1" },
      { name: "Recreational space", metric: "Peringkat 2" },
      { name: "Water pollution", metric: "Peringkat 3" },
    ],
    disseminatorsNote: "Peringkat betweenness centrality dan ALC",
    rolesSummary:
      "Change initiators berpotensi memulai perubahan, sedangkan change disseminators menyebarkan pengaruhnya ke bagian sistem lain.",
    /** Tabel 5 dan Gambar 6 jurnal */
    clustersTitle: "Tujuh cluster",
    clustersNote: "jumlah vertex per cluster · Tabel 5",
    clusters: [
      { name: "Iklim & Ekosistem", vertices: 13 },
      { name: "Kebijakan Energi", vertices: 13 },
      { name: "Pertanian", vertices: 16 },
      { name: "Ekonomi & Air", vertices: 12 },
      { name: "Konsumsi Pangan", vertices: 16 },
      { name: "Perikanan", vertices: 3, isolated: true },
      { name: "Urbanisasi", vertices: 12 },
    ],
    figure: {
      title: "Gambar 6 — Visualisasi Cluster Graf",
      /** Gambar asli dari PDF jurnal (objek gambar Fig. 6, tanpa modifikasi isi) */
      src: "/figures/rozhkov-2025-gambar-6.webp",
      width: 1800,
      height: 1326,
      alt: "Gambar 6 jurnal Rozhkov dkk. (2025): graf FEW dengan warna vertex menurut cluster dan ukuran vertex menurut betweenness centrality.",
      caption: "Visualisasi modularity dan betweenness centrality pada graf FEW.",
      source: "Sumber: Rozhkov dkk. (2025).",
      notes: ["7 cluster", "modularity = 0,629", "warna simpul = cluster", "ukuran simpul = betweenness"],
    },
    takeaway: "Perubahan sistem FEW membutuhkan pemicu perubahan dan penghubung yang memperluas dampaknya.",
  },
  s14: {
    eyebrow: "Kritik dan Alternatif Metode",
    title: "Kekuatan, keterbatasan, dan langkah lanjutan",
    columns: [
      {
        heading: "Kelebihan",
        tone: "green",
        items: ["Analisis graf memetakan sistem kompleks secara terstruktur.", "ALC melengkapi metrik konvensional dengan perspektif feedback loop."],
      },
      {
        heading: "Keterbatasan",
        tone: "warm",
        items: [
          "Data didasarkan pada penilaian ahli sehingga bergantung pada persepsi peserta.",
          "Efektivitas kebijakan belum diuji secara langsung menurut materi yang tersedia.",
        ],
      },
      {
        heading: "Alternatif",
        tone: "navy",
        items: ["Simulasi sistem dinamis (system dynamics) untuk mengevaluasi skenario kebijakan dari waktu ke waktu."],
      },
    ],
  },
  s15: {
    eyebrow: "Kesimpulan",
    title: "Struktur sistem menunjukkan di mana perubahan paling bermakna",
    points: [
      "Teori graf mengubah CLD yang kompleks menjadi struktur yang dapat dianalisis secara kuantitatif.",
      "Metrik konvensional menunjukkan posisi vertex; ALC menambahkan perspektif feedback loop.",
      "Kombinasi keduanya membantu mengidentifikasi variabel strategis dalam sistem FEW.",
    ],
    quote: "Memahami hubungan dalam suatu sistem adalah langkah awal untuk menemukan titik perubahan yang paling strategis.",
  },
  s16: {
    eyebrow: "Penutup",
    title: "Terima kasih",
    subtitle: "Pertanyaan dan diskusi dipersilakan.",
  },
} as const;

export const slides: SlideMeta[] = [
  {
    id: "s01",
    label: "Judul Penelitian",
    notes:
      "Perkenalkan kelompok. Presentasi ini membahas artikel Rozhkov dkk. (2025) di jurnal Environmental Science and Policy tentang penggunaan teori graf untuk menemukan leverage points pada sistem Food–Energy–Water.",
  },
  {
    id: "s02",
    label: "Latar Belakang",
    notes:
      "Tekankan bahwa pangan, energi, dan air tidak dapat dikelola terpisah. Contoh: kekeringan menurunkan ketersediaan air, sehingga irigasi dan pendinginan pembangkit ikut terdampak.",
  },
  {
    id: "s03",
    label: "Permasalahan dan Tujuan",
    notes:
      "Dalam sistem yang berisi puluhan variabel, intuisi saja tidak cukup untuk menentukan variabel mana yang paling strategis. Karena itu penelitian menggunakan pendekatan teori graf.",
  },
  {
    id: "s04",
    label: "Data Penelitian",
    notes:
      "Data berasal dari pemodelan partisipatif bersama 10 ahli untuk kawasan Chicago dan pedesaan sekitarnya. Hasilnya 85 variabel dan 160 hubungan sebab-akibat.",
  },
  {
    id: "s05",
    label: "Pemodelan Graf",
    notes:
      "Jelaskan pemetaan: variabel → vertex, hubungan sebab-akibat → edge berarah. Tanda + dan − berasal dari CLD; analisis struktur memperlakukan setiap edge tanpa bobot.",
  },
  {
    id: "s06",
    label: "Dasar Teori Graf",
    notes:
      "Path adalah barisan edge searah. Cycle adalah path yang kembali ke awal. Pada CLD, cycle disebut feedback loop: reinforcing jika jumlah tanda negatif genap, balancing jika ganjil.",
  },
  {
    id: "s07",
    label: "Metrik Graf",
    steps: 7,
    notes:
      "Tekan → untuk menelusuri tiap metrik. Perhatikan bahwa vertex tertinggi berbeda-beda: C untuk indegree, F untuk outdegree, D untuk betweenness, dan E untuk PageRank. Setiap metrik menangkap aspek kepentingan yang berbeda.",
  },
  {
    id: "s08",
    label: "Adjusted Loop Centrality",
    steps: 5,
    notes:
      "ALC berfokus pada keterlibatan vertex dalam feedback loop. Telusuri kelima tahap dengan tombol →. Detail rumus mengacu pada jurnal asli.",
  },
  {
    id: "s09",
    label: "Rekonstruksi Graf",
    notes:
      "Ini graf ilustratif buatan kelompok, bukan graf asli penelitian. Terdapat 7 vertex dan 10 edge berarah. Tiga feedback loop terbentuk dan semuanya balancing. Warna vertex menunjukkan sektor: pangan, air, energi, dan sosial/kebijakan.",
  },
  {
    id: "s10",
    label: "Simulasi Perhitungan",
    /** Satu langkah per pasangan (s, t) yang lintasan terpendeknya melewati vertex contoh */
    steps: betweennessBreakdown(fewGraph, content.s10.betweennessExample).length,
    notes:
      "Semua angka dihitung langsung dari graf Slide 9. Contoh: vertex E memiliki indegree 3 dan outdegree 1. Tekan → untuk menyorot tiap pasangan (s, t) beserta vertex pada jalurnya. Betweenness E = 4, termasuk dua pasangan yang memiliki dua lintasan terpendek sehingga masing-masing bernilai ½.",
  },
  {
    id: "s11",
    label: "Alur Penelitian",
    steps: 6,
    notes: "Ringkas alur penelitian dari pengumpulan data hingga interpretasi leverage points.",
  },
  {
    id: "s12",
    label: "Karakteristik Graf",
    notes:
      "Density rendah menunjukkan graf jarang. Diameter 19 dan rata-rata panjang lintasan 6,531 menunjukkan pengaruh bisa merambat melalui rantai panjang. Modularity 0,629 menunjukkan struktur komunitas yang cukup kuat.",
  },
  {
    id: "s13",
    label: "Hasil dan Interpretasi",
    notes:
      "Jelaskan dua peran: change initiators dan change disseminators. Tekankan Climate activism sebagai jembatan utama antarcluster (betweenness tertinggi) dan Fishing sebagai satu-satunya cluster terisolasi.",
  },
  {
    id: "s14",
    label: "Kritik dan Alternatif",
    notes:
      "Kelebihan: pemetaan sistem dan pelengkap metrik. Keterbatasan: berbasis penilaian ahli dan belum menguji kebijakan. Alternatif: simulasi system dynamics.",
  },
  {
    id: "s15",
    label: "Kesimpulan",
    notes: "Tutup dengan kalimat penutup, lalu buka sesi tanya jawab.",
  },
  {
    id: "s16",
    label: "Terima kasih",
    notes: "Ucapkan terima kasih atas perhatian audiens, lalu persilakan pertanyaan.",
  },
];
