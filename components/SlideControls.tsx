"use client";

import { ChevronLeft, ChevronRight, LayoutGrid, Leaf, Maximize, Minimize, MonitorPlay, Printer, StickyNote } from "lucide-react";
import type { ComponentType, ReactNode } from "react";

interface SlideControlsProps {
  index: number;
  total: number;
  visible: boolean;
  isFullscreen: boolean;
  notesOpen: boolean;
  decorOn: boolean;
  onDecor: () => void;
  onPrev: () => void;
  onNext: () => void;
  onOverview: () => void;
  onFullscreen: () => void;
  onNotes: () => void;
  onPresenter: () => void;
  onPrint: () => void;
}

function IconButton({
  label,
  shortcut,
  onClick,
  Icon,
  active = false,
  disabled = false,
}: {
  label: string;
  shortcut?: string;
  onClick: () => void;
  Icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  active?: boolean;
  disabled?: boolean;
}) {
  const title = shortcut ? `${label} (${shortcut})` : label;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-200 disabled:opacity-30 ${
        active ? "bg-forest text-cream shadow-sm" : "text-forest hover:bg-sage hover:text-forest"
      }`}
    >
      <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
    </button>
  );
}

function Group({ children }: { children: ReactNode }) {
  return <div className="flex items-center gap-1 rounded-full border border-forest/15 bg-white/90 p-1 shadow-[0_8px_24px_-14px_rgba(35,75,53,0.45)] backdrop-blur">{children}</div>;
}

export function SlideControls(props: SlideControlsProps) {
  const { index, total, visible } = props;
  return (
    <div
      className={`no-print pointer-events-none fixed inset-x-0 bottom-0 z-30 flex items-end justify-between p-5 transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className={`flex gap-2 ${visible ? "pointer-events-auto" : ""}`}>
        <Group>
          <IconButton label="Overview" shortcut="O" Icon={LayoutGrid} onClick={props.onOverview} />
          <IconButton label="Catatan pembicara" shortcut="N" Icon={StickyNote} onClick={props.onNotes} active={props.notesOpen} />
          <IconButton
            label={props.decorOn ? "Matikan animasi dekoratif" : "Nyalakan animasi dekoratif"}
            shortcut="M"
            Icon={Leaf}
            onClick={props.onDecor}
            active={props.decorOn}
          />
          <IconButton label="Mode presenter" shortcut="S" Icon={MonitorPlay} onClick={props.onPresenter} />
          <IconButton label="Cetak / simpan PDF" Icon={Printer} onClick={props.onPrint} />
          <IconButton
            label={props.isFullscreen ? "Keluar fullscreen" : "Fullscreen"}
            shortcut="F"
            Icon={props.isFullscreen ? Minimize : Maximize}
            onClick={props.onFullscreen}
          />
        </Group>
      </div>
      <div className={`flex items-center gap-3 ${visible ? "pointer-events-auto" : ""}`}>
        <Group>
          <IconButton label="Sebelumnya" shortcut="←" Icon={ChevronLeft} onClick={props.onPrev} disabled={index === 0} />
          <span className="min-w-[84px] text-center font-mono text-[14px] text-muted tabular-nums">
            <span className="text-[16px] font-semibold text-forest">{String(index + 1).padStart(2, "0")}</span> /{" "}
            {String(total).padStart(2, "0")}
          </span>
          <IconButton label="Berikutnya" shortcut="→ / Space" Icon={ChevronRight} onClick={props.onNext} />
        </Group>
      </div>
    </div>
  );
}
