import type { Metadata } from "next";
import { InteriorPage } from "@/components/shared/interior-page";

export const metadata: Metadata = {
  title: "採用",
  description: "ニューラのロボティクス、人工知能、制御、シミュレーション、設計、協調研究の採用情報。",
};

export default function Page() {
  return <InteriorPage pageKey="careers" />;
}
