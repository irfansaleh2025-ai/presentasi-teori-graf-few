import type { Metadata } from "next";
import { PrintDeck } from "@/components/PrintDeck";

export const metadata: Metadata = { title: "Cetak PDF — Teori Graf & ALC" };

export default function PrintPage() {
  return <PrintDeck />;
}
