import type { Metadata } from "next";
import { InteriorPage } from "@/components/shared/interior-page";

export const metadata: Metadata = {
  title: "人工知能基盤",
  description: "知覚、計画、記憶、制御を担う実時間の身体性人工知能基盤。",
};

export default function Page() {
  return <InteriorPage pageKey="ai-platform" />;
}
