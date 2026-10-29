import type { Metadata } from "next";
import { PresenterView } from "@/components/PresenterView";

export const metadata: Metadata = { title: "Mode Presenter — Teori Graf & ALC" };

export default function PresenterPage() {
  return <PresenterView />;
}
