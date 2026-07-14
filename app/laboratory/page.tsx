import type { Metadata } from "next";
import { InteriorPage } from "@/components/shared/interior-page";

export const metadata: Metadata = {
  title: "研究所",
  description: "人工知能、機械、シミュレーション、材料、人間ロボット協調の仮想東京研究所。",
};

export default function Page() {
  return <InteriorPage pageKey="laboratory" />;
}
