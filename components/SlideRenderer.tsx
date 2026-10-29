"use client";

import type { ComponentType } from "react";
import { slides } from "@/data/slides";
import { CalculationSlide, ReconstructionSlide } from "./slides/calc";
import { BackgroundSlide, DataSlide, ProblemSlide, TitleSlide } from "./slides/intro";
import { CharacteristicsSlide, ConclusionSlide, CritiqueSlide, ResultsSlide, WorkflowSlide } from "./slides/results";
import { AlcSlide, MetricsSlide, ModelingSlide, TheorySlide } from "./slides/theory";
import type { SlideProps } from "./slides/types";

const registry: Record<string, ComponentType<SlideProps>> = {
  s01: TitleSlide,
  s02: BackgroundSlide,
  s03: ProblemSlide,
  s04: DataSlide,
  s05: ModelingSlide,
  s06: TheorySlide,
  s07: MetricsSlide,
  s08: AlcSlide,
  s09: ReconstructionSlide,
  s10: CalculationSlide,
  s11: WorkflowSlide,
  s12: CharacteristicsSlide,
  s13: ResultsSlide,
  s14: CritiqueSlide,
  s15: ConclusionSlide,
};

const noop = () => {};

export function SlideRenderer({ index, step = 0, onStep = noop }: { index: number; step?: number; onStep?: (s: number) => void }) {
  const Slide = registry[slides[index].id];
  return <Slide step={step} onStep={onStep} />;
}
