"use client";

import { Printer } from "lucide-react";
import { useEffect, useRef } from "react";
import { slides } from "@/data/slides";
import { StaticProvider } from "./anim";
import { SlideRenderer } from "./SlideRenderer";
import { SLIDE_H, SLIDE_W } from "./SlideStage";

/**
 * Semua slide dalam keadaan akhir (tanpa animasi) untuk dicetak / disimpan sebagai PDF.
 * Ukuran halaman diatur di globals.css (@page 1600×900 px).
 */
export function PrintDeck() {
  const rootRef = useRef<HTMLDivElement>(null);

  // Skala pratinjau layar disimpan sebagai CSS variable; saat dicetak transform dinonaktifkan (globals.css).
  useEffect(() => {
    const update = () => {
      const width = Math.min(SLIDE_W, window.innerWidth - 64);
      rootRef.current?.style.setProperty("--print-scale", String(width / SLIDE_W));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (window.location.hash !== "#auto") return;
    let cancelled = false;
    void document.fonts.ready.then(() => {
      setTimeout(() => !cancelled && window.print(), 400);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <StaticProvider value>
      <div ref={rootRef} className="min-h-screen bg-[#ecece8] print:bg-white">
        <div className="no-print sticky top-0 z-10 flex items-center justify-between border-b border-line bg-white/95 px-8 py-4 backdrop-blur">
          <span className="text-[15px] text-muted">
            Pratinjau cetak · {slides.length} halaman · pilih <b>Save as PDF</b>, orientasi landscape, margin none
          </span>
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-2 rounded-full bg-forest px-5 py-2 text-[15px] text-white hover:bg-forest/90"
          >
            <Printer className="h-4 w-4" /> Cetak / Simpan PDF
          </button>
        </div>
        <div className="flex flex-col items-center gap-8 py-8 print:block print:p-0">
          {slides.map((s, i) => (
            <div key={s.id} className="print-page print-frame bg-cream shadow-sm print:shadow-none">
              <div className="print-inner relative bg-cream" style={{ width: SLIDE_W, height: SLIDE_H }}>
                <SlideRenderer index={i} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </StaticProvider>
  );
}
