import type { Metadata } from "next";
import { InteriorPage } from "@/components/shared/interior-page";

export const metadata: Metadata = {
  title: "ニュース",
  description: "仮想企業ニューラ・ロボティクスの発表、研究ノート、研究所更新情報。",
};

export default function Page() {
  return <InteriorPage pageKey="news" />;
}
