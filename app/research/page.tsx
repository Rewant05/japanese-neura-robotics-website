import type { Metadata } from "next";
import { InteriorPage } from "@/components/shared/interior-page";

export const metadata: Metadata = {
  title: "研究",
  description: "身体性人工知能、神経機械インターフェース、群知能の研究計画。",
};

export default function Page() {
  return <InteriorPage pageKey="research" />;
}
