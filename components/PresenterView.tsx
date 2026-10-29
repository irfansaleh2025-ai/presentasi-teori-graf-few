"use client";

import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { slides } from "@/data/slides";
import { deck, requestSync, TOTAL, useDeck } from "@/lib/deck-store";
import { useShortcuts } from "@/lib/use-shortcuts";
import { StaticProvider } from "./anim";
import { SlideRenderer } from "./SlideRenderer";
import { SlideStage } from "./SlideStage";

function useElapsed() {
  const [start, setStart] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  useEffect(() => {
    const t0 = Date.now();
    const id = setInterval(() => {
      setNow(Date.now());
      setStart((s) => s ?? t0);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  const seconds = start === null ? 0 : Math.max(0, Math.floor((now - start) / 1000));
  const label = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  return { label, reset: () => setStart(Date.now()) };
}

/** Jendela presenter: slide aktif, slide berikutnya, catatan, dan timer. Tersinkron dengan jendela utama. */
export function PresenterView() {
  const { index, step } = useDeck();
  const timer = useElapsed();
  const meta = slides[index];
  const steps = meta.steps ?? 1;

  useEffect(() => {
    requestSync();
  }, []);

  useShortcuts({
    arrowright: deck.next,
    arrowleft: deck.prev,
    pagedown: deck.next,
    pageup: deck.prev,
    " ": deck.next,
    home: deck.first,
    end: deck.last,
  });

  return (
    <main className="grid h-screen grid-cols-[1fr_420px] gap-6 bg-sage/60 p-6 text-charcoal">
      <section className="flex min-h-0 flex-col gap-3">
        <div className="flex items-center justify-between font-mono text-[13px] tracking-[0.14em] text-muted uppercase">
          <span>
            Slide {String(index + 1).padStart(2, "0")} / {TOTAL} · {meta.label}
          </span>
          {steps > 1 && (
            <span className="text-forest">
              langkah {step + 1} / {steps}
            </span>
          )}
        </div>
        <div className="min-h-0 flex-1 overflow-hidden rounded-md border border-line bg-cream">
          <SlideStage>
            <SlideRenderer key={index} index={index} step={step} onStep={deck.setStep} />
          </SlideStage>
        </div>
      </section>

      <aside className="flex min-h-0 flex-col gap-5">
        <div className="flex items-center justify-between rounded-md border border-line bg-white px-5 py-4">
          <span className="font-mono text-[34px] tabular-nums">{timer.label}</span>
          <button type="button" onClick={timer.reset} className="rounded-full p-2 text-muted hover:bg-sage" title="Reset timer">
            <RotateCcw className="h-5 w-5" />
          </button>
        </div>

        <div>
          <div className="mb-2 font-mono text-[12px] tracking-[0.14em] text-muted uppercase">Berikutnya</div>
          <div className="aspect-video overflow-hidden rounded-md border border-line bg-cream">
            {index < TOTAL - 1 ? (
              <StaticProvider value>
                <SlideStage>
                  <SlideRenderer index={index + 1} />
                </SlideStage>
              </StaticProvider>
            ) : (
              <div className="flex h-full items-center justify-center text-muted">Akhir presentasi</div>
            )}
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto rounded-md border border-line bg-white p-5">
          <div className="mb-2 font-mono text-[12px] tracking-[0.14em] text-muted uppercase">Catatan pembicara</div>
          <p className="text-[18px] leading-relaxed">{meta.notes}</p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={deck.prev}
            className="flex flex-1 items-center justify-center gap-2 rounded-md border border-line bg-white py-3 hover:bg-sage"
          >
            <ChevronLeft className="h-5 w-5" /> Sebelumnya
          </button>
          <button
            type="button"
            onClick={deck.next}
            className="flex flex-1 items-center justify-center gap-2 rounded-md bg-forest py-3 text-white hover:bg-forest/90"
          >
            Berikutnya <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </aside>
    </main>
  );
}
