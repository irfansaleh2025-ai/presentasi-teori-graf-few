export interface SlideProps {
  /** Langkah sorotan aktif di dalam slide */
  step: number;
  /** Mengubah langkah sorotan (misalnya ketika item diklik) */
  onStep: (step: number) => void;
}
