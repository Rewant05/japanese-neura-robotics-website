import type { Metadata } from "next";
import { InteriorPage } from "@/components/shared/interior-page";

export const metadata: Metadata = {
  title: "企業情報",
  description: "ニューラ・ロボティクスの企業ストーリーと運営体制。",
};

export default function Page() {
  return <InteriorPage pageKey="about" />;
}
