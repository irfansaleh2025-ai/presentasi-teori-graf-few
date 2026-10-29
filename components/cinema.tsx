"use client";

import { useRef, type ReactNode } from "react";
import { CINE, gsap, SplitText, useGSAP } from "@/lib/gsap";
import { useIsStatic } from "./anim";

/*
 * Orkestrasi masuk slide (GSAP). Elemen ditandai dengan atribut `data-cine`:
 *
 *   backdrop  lapisan dekorasi: naik pelan dari kedalaman
 *   badge     nomor slide: muncul dengan sedikit pantulan
 *   rule      garis pendek: digambar dari kiri (`rule-v`: garis tegak, tumbuh dari atas)
 *   eyebrow   label bagian
 *   title     judul: per baris naik dari mask dengan kemiringan kecil
 *   quote     kutipan penutup: sama seperti judul, lebih lambat
 *   aside     badge di kanan atas
 *   figure    wadah figur raster: dibuka dengan mask dari atas; anaknya
 *             `data-cine="figure-media"` sedikit membesar lalu kembali
 *
 * `data-cine-at="0.4"` menggeser posisi mulai (detik). Konten lain tetap memakai
 * FadeUp (Motion), jadi GSAP tidak pernah menyentuh elemen yang sama.
 * Parallax pointer: `data-cine-depth="10"` (px) pada pembungkus yang tidak dianimasikan GSAP lain.
 */

const at = (el: Element, fallback: number) => {
  const v = (el as HTMLElement).dataset.cineAt;
  return v === undefined ? fallback : Number(v);
};

function splitLines(el: HTMLElement, delay: number, duration: number) {
  SplitText.create(el, {
    type: "lines",
    mask: "lines",
    aria: "none",
    autoSplit: true,
    onSplit(self) {
      return gsap.from(self.lines, {
        yPercent: 112,
        rotation: 2.5,
        transformOrigin: "0% 100%",
        duration,
        ease: CINE.ease,
        stagger: CINE.lineStagger,
        delay,
        // Kembalikan DOM asli setelah selesai: tanpa pembungkus mask, huruf turun tidak terpotong.
        onComplete: () => self.revert(),
      });
    },
  });
}

export function useCinematic(scope: React.RefObject<HTMLElement | null>) {
  const isStatic = useIsStatic();

  useGSAP(
    () => {
      const root = scope.current;
      if (!root || isStatic) return;
      const all = (name: string) => [...root.querySelectorAll<HTMLElement>(`[data-cine="${name}"]`)];

      for (const el of all("backdrop")) {
        gsap.from(el, { autoAlpha: 0, y: 28, scale: 1.035, duration: 1.5, ease: CINE.ease, delay: at(el, 0), transformOrigin: "50% 100%" });
      }
      for (const el of all("badge")) {
        gsap.from(el, { scale: 0, autoAlpha: 0, duration: 0.6, ease: "back.out(2.2)", delay: at(el, 0.05) });
      }
      for (const el of all("rule")) {
        gsap.from(el, { scaleX: 0, transformOrigin: "0% 50%", duration: 0.7, ease: CINE.easeInOut, delay: at(el, 0.12) });
      }
      for (const el of all("rule-v")) {
        gsap.from(el, { scaleY: 0, transformOrigin: "50% 0%", duration: 0.9, ease: CINE.easeInOut, delay: at(el, 0.5) });
      }
      for (const el of all("eyebrow")) {
        gsap.from(el, { autoAlpha: 0, x: -14, duration: 0.7, ease: CINE.ease, delay: at(el, 0.22) });
      }
      for (const el of all("aside")) {
        gsap.from(el, { autoAlpha: 0, y: -10, duration: 0.7, ease: CINE.ease, delay: at(el, 0.5) });
      }
      for (const el of all("title")) splitLines(el, at(el, 0.12), CINE.line);
      for (const el of all("quote")) splitLines(el, at(el, 0.6), 1.25);

      for (const el of all("figure")) {
        const d = at(el, 0.4);
        gsap.fromTo(
          el,
          { clipPath: "inset(0% 0% 100% 0% round 16px)" },
          { clipPath: "inset(0% 0% 0% 0% round 16px)", duration: 1.3, ease: CINE.easeInOut, delay: d, clearProps: "clipPath" },
        );
        const media = el.querySelector<HTMLElement>('[data-cine="figure-media"]');
        if (media) gsap.from(media, { scale: 1.12, duration: 1.8, ease: CINE.ease, delay: d, transformOrigin: "50% 40%" });
      }

      // Parallax pointer yang sangat halus untuk lapisan dekorasi (hanya perangkat dengan pointer presisi).
      const layers = [...root.querySelectorAll<HTMLElement>("[data-cine-depth]")];
      if (!layers.length || !window.matchMedia("(pointer: fine)").matches) return;
      const movers = layers.map((el) => {
        const depth = Number(el.dataset.cineDepth) || 8;
        return {
          depth,
          x: gsap.quickTo(el, "x", { duration: 1.4, ease: "power3.out" }),
          y: gsap.quickTo(el, "y", { duration: 1.4, ease: "power3.out" }),
        };
      });
      const onMove = (e: PointerEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        for (const m of movers) {
          m.x(-nx * m.depth);
          m.y(-ny * m.depth * 0.6);
        }
      };
      window.addEventListener("pointermove", onMove);
      return () => window.removeEventListener("pointermove", onMove);
    },
    { scope, dependencies: [isStatic], revertOnUpdate: true },
  );
}

/** Pembungkus <div> yang menjalankan `useCinematic` untuk turunannya. */
export function Cinematic({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useCinematic(ref);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
