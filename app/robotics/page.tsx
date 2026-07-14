import type { Metadata } from "next";
import { InteriorPage } from "@/components/shared/interior-page";

export const metadata: Metadata = {
  title: "ロボティクス",
  description: "人型、産業、外骨格、群制御のロボティクス基盤。",
};

export default function Page() {
  return <InteriorPage pageKey="robotics" />;
}
