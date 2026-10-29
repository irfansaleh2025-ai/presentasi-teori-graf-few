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
/** Jeda minimum antarnavigasi agar tombol yang ditekan cepat tidak menumpuk transisi. */
const NAV_GAP = 320;
/** Kurva wipe antarslide (in-out tajam, mendekati expo.inOut GSAP). */
const WIPE_EASE = [0.76, 0, 0.24, 1] as const;
const WIPE_DURATION = 0.8;

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
  const lastNav = useRef(0);

  const throttled = useCallback((fn: () => void) => {
    return () => {
      const now = performance.now();
      if (now - lastNav.current < NAV_GAP) return;
      lastNav.current = now;
      fn();
    };
  }, []);
  const next = throttled(deck.next);
  const prev = throttled(deck.prev);

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
          arrowright: next,
          arrowleft: prev,
          pagedown: next,
          pageup: prev,
          " ": next,
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

  // Slide baru dibuka dengan mask dari arah navigasi di atas slide lama; slide lama mundur ke kedalaman.
  const variants = isStatic
    ? {
        enter: { opacity: 0, zIndex: 2 },
        center: { opacity: 1, zIndex: 2, transition: { duration: 0.3 } },
        exit: { opacity: 0, zIndex: 1, transition: { duration: 0.3 } },
      }
    : {
        enter: (d: number) => ({ clipPath: d > 0 ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)", x: d * 80, zIndex: 2 }),
        center: {
          clipPath: "inset(0% 0% 0% 0%)",
          x: 0,
          zIndex: 2,
          transition: { duration: WIPE_DURATION, ease: WIPE_EASE },
        },
        exit: (d: number) => ({
          x: d * -120,
          scale: 0.96,
          opacity: 0.6,
          zIndex: 1,
          transition: { duration: WIPE_DURATION, ease: WIPE_EASE },
        }),
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
        <div className="absolute inset-0 bg-forest" aria-hidden />
        <AnimatePresence custom={dir} initial={false}>
          <motion.div
            key={index}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 origin-center bg-cream"
          >
            <SlideRenderer index={index} step={step} onStep={deck.setStep} />
          </motion.div>
        </AnimatePresence>
        {/* Garis pemandu yang menempel di tepi wipe, lalu memudar: transisi terasa sebagai satu struktur. */}
        {!isStatic && (
          <AnimatePresence initial={false}>
            <motion.div
              key={index}
              aria-hidden
              className="pointer-events-none absolute inset-y-0 z-10 w-[3px] bg-gradient-to-b from-fresh via-leaf to-wheat"
              initial={{ left: dir > 0 ? "100%" : "0%", opacity: 1 }}
              animate={{ left: dir > 0 ? "0%" : "100%", opacity: [1, 1, 0] }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
              transition={{ left: { duration: WIPE_DURATION, ease: WIPE_EASE }, opacity: { duration: WIPE_DURATION + 0.25, times: [0, 0.75, 1] } }}
            />
          </AnimatePresence>
        )}
        {/* Indikator slide selalu tampil, samar */}
        <div className="pointer-events-none absolute right-[112px] bottom-[30px] z-20 rounded-full bg-white/75 px-3 py-1 font-mono text-[15px] tracking-wider text-muted tabular-nums backdrop-blur-sm">
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
        onPrev={prev}
        onNext={next}
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
