import type { Metadata } from "next";
import { HomePage } from "@/components/home/home-page";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `${site.name} / ${site.jpName}`,
  description:
    "人型、産業自律、外骨格、群ロボットを構築する日本発の仮想企業による、ロボティクスと人工知能のシネマティック体験。",
};

export default function Page() {
  return <HomePage />;
}
