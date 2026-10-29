"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { slides } from "@/data/slides";
import { deck, TOTAL, useDeck } from "@/lib/deck-store";
import { toggleDecor, useDecorEnabled } from "@/lib/decor-store";
import { useShortcuts } from "@/lib/use-shortcuts";
import { EASE, useIsStatic } from "./anim";
import { SlideControls } from "./SlideControls";
import { SlideOverview } from "./SlideOverview";
import { SlideRenderer } from "./SlideRenderer";
import { SlideStage } from "./SlideStage";

const HIDE_DELAY = 2500;

export function openPresenter() {
  window.open(`/presenter${window.location.hash || "#1"}`, "few-presenter", "width=1360,height=820");
}

export function Presentation() {
  const { index, step, dir } = useDeck();
  const isStatic = useIsStatic();
  const decorOn = useDecorEnabled();
  const [overview, setOverview] = useState(false);
  const [notes, setNotes] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void document.documentElement.requestFullscreen?.().catch(() => {});
  }, []);

  const showControls = useCallback(() => {
    setControlsVisible(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setControlsVisible(false), HIDE_DELAY);
  }, []);

  useEffect(() => {
    const onFs = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFs);
    window.addEventListener("mousemove", showControls);
    hideTimer.current = setTimeout(() => setControlsVisible(false), HIDE_DELAY);
    return () => {
      document.removeEventListener("fullscreenchange", onFs);
      window.removeEventListener("mousemove", showControls);
      clearTimeout(hideTimer.current);
    };
  }, [showControls]);

  const selectFromOverview = (i: number) => {
    deck.goTo(i);
    setOverview(false);
  };

  useShortcuts(
    overview
      ? {
          arrowright: () => deck.goTo(index + 1),
          arrowleft: () => deck.goTo(index - 1),
          arrowdown: () => deck.goTo(index + 5),
          arrowup: () => deck.goTo(index - 5),
          home: deck.first,
          end: deck.last,
          enter: () => setOverview(false),
          escape: () => setOverview(false),
          o: () => setOverview(false),
          f: toggleFullscreen,
        }
      : {
          arrowright: deck.next,
          arrowleft: deck.prev,
          pagedown: deck.next,
          pageup: deck.prev,
          " ": deck.next,
          home: deck.first,
          end: deck.last,
          f: toggleFullscreen,
          o: () => setOverview(true),
          n: () => setNotes((v) => !v),
          s: openPresenter,
          m: toggleDecor,
          escape: () => setNotes(false),
        },
  );

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: isStatic ? 0 : d * 64 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: isStatic ? 0 : d * -64 }),
  };

  return (
    <main
      className={`fixed inset-0 overflow-hidden bg-cream select-none ${isFullscreen && !controlsVisible ? "cursor-none" : ""}`}
    >
      {/* Progress bar */}
      <div className="no-print absolute inset-x-0 top-0 z-20 h-[4px] bg-sage/70">
        <motion.div
          className="h-full rounded-r-full bg-gradient-to-r from-forest via-leaf to-fresh"
          initial={false}
          animate={{ width: `${((index + 1) / TOTAL) * 100}%` }}
          transition={{ duration: 0.4, ease: EASE }}
        />
      </div>

      <SlideStage>
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.div
            key={index}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: EASE }}
            className="absolute inset-0"
          >
            <SlideRenderer index={index} step={step} onStep={deck.setStep} />
          </motion.div>
        </AnimatePresence>
        {/* Indikator slide selalu tampil, samar */}
        <div className="pointer-events-none absolute right-[112px] bottom-[30px] rounded-full bg-white/75 px-3 py-1 font-mono text-[15px] tracking-wider text-muted tabular-nums backdrop-blur-sm">
          <span className="font-semibold text-forest">{String(index + 1).padStart(2, "0")}</span> / {String(TOTAL).padStart(2, "0")}
        </div>
      </SlideStage>

      <AnimatePresence>
        {notes && (
          <motion.aside
            className="no-print fixed inset-x-0 bottom-0 z-30 border-t-4 border-leaf bg-cream/95 px-10 pt-5 pb-20 backdrop-blur"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <div className="mx-auto max-w-[1100px]">
              <div className="font-mono text-[12px] tracking-[0.14em] text-muted uppercase">
                Catatan pembicara · {slides[index].label}
                {(slides[index].steps ?? 1) > 1 && ` · langkah ${step + 1}/${slides[index].steps}`}
              </div>
              <p className="mt-2 text-[17px] leading-relaxed text-charcoal/85">{slides[index].notes}</p>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <SlideControls
        index={index}
        total={TOTAL}
        visible={controlsVisible || overview || notes}
        isFullscreen={isFullscreen}
        notesOpen={notes}
        decorOn={decorOn}
        onDecor={toggleDecor}
        onPrev={deck.prev}
        onNext={deck.next}
        onOverview={() => setOverview((v) => !v)}
        onFullscreen={toggleFullscreen}
        onNotes={() => setNotes((v) => !v)}
        onPresenter={openPresenter}
        onPrint={() => window.open("/print#auto", "_blank")}
      />

      <AnimatePresence>
        {overview && <SlideOverview current={index} onSelect={selectFromOverview} onClose={() => setOverview(false)} />}
      </AnimatePresence>
    </main>
  );
}
