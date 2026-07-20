import type { Metadata } from "next";
import { Mail, MapPin, Newspaper, Radio } from "lucide-react";
import { ContactForms } from "@/components/contact/contact-forms";
import { InteriorMotionStage } from "@/components/shared/interior-motion-stage";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description: "研究提携、採用、メディア、一般お問い合わせのニューラ・ロボティクス窓口。",
};

export default function Page() {
  return (
    <main data-interior-page className="relative min-h-screen overflow-hidden pt-24">
      <InteriorMotionStage pageKey="contact" />
      <section className="container-x interior-reveal relative z-10 py-12 md:py-14">
        <p className="hud-label text-cyan">お問い合わせ / 東京研究所</p>
        <h1 className="mt-5 max-w-5xl text-5xl font-semibold uppercase leading-tight text-white md:text-7xl">
          安全な通信窓口を開く。
        </h1>
        <p className="mt-7 max-w-3xl text-lg leading-8 text-white/62">
          研究提携、採用のお問い合わせ、メディア対応、一般的なご相談は、
          東京研究所の共通インターフェースへ送られます。
        </p>
      </section>

      <section className="container-x relative z-10 grid gap-6 pb-14 md:pb-20 lg:grid-cols-[.82fr_1.18fr]">
        <div className="interior-card tech-border relative min-h-[420px] overflow-hidden p-5 md:min-h-[520px] md:p-6">
          <div className="absolute inset-8 border border-white/10" />
          <div className="absolute left-[56%] top-[42%] h-4 w-4 bg-cyan shadow-[0_0_28px_rgba(56,232,255,.9)]" />
          <div className="absolute left-[52%] top-[38%] h-28 w-28 border border-cyan/35" />
          <div className="absolute left-[18%] top-[30%] h-36 w-52 border border-white/10" />
          <div className="absolute bottom-[22%] right-[16%] h-40 w-64 border border-white/10" />
          <div className="absolute inset-x-6 top-1/2 h-px bg-cyan/24" />
          <div className="absolute inset-y-6 left-1/2 w-px bg-laser/24" />
          <div className="relative z-10 grid h-full content-end gap-4">
            {[
              ["東京研究所", "品川研究地区", MapPin],
              ["研究提携", "pilot@neura.example", Radio],
              ["メディア窓口", "press@neura.example", Newspaper],
              ["一般お問い合わせ", "hello@neura.example", Mail],
            ].map(([label, value, Icon]) => (
              <div key={label as string} className="flex items-center gap-4 border border-white/12 bg-black/55 p-4">
                <span className="grid h-11 w-11 place-items-center border border-cyan/35 text-cyan">
                  <Icon size={18} />
                </span>
                <div>
                  <p className="text-sm text-white/48">{label as string}</p>
                  <p className="mt-1 text-white">{value as string}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <ContactForms />
      </section>
    </main>
  );
}
