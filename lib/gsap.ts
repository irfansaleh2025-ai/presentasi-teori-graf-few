"use client";

/*
 * Registrasi GSAP sekali saja. Impor dari sini hanya di Client Component.
 *
 * Pembagian kepemilikan animasi (jangan dicampur pada elemen + properti yang sama):
 * - GSAP   : timeline masuk slide (kerangka, judul split-line, backdrop, parallax),
 *            gambar edge SVG, reveal figur.
 * - Motion : presence/transisi antarslide, konten FadeUp, state interaktif & UI kontrol.
 */
import { gsap } from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, SplitText, DrawSVGPlugin);

export { gsap, SplitText, useGSAP };

/** Kurva dan tempo bersama untuk seluruh slide. */
export const CINE = {
  ease: "expo.out",
  easeInOut: "expo.inOut",
  /** Durasi baris judul naik dari mask */
  line: 1.05,
  lineStagger: 0.09,
} as const;
