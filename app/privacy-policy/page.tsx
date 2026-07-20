import type { Metadata } from "next";
import { InteriorMotionStage } from "@/components/shared/interior-motion-stage";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: "仮想企業ニューラ・ロボティクスサイトのプライバシーポリシー。",
};

const sections = [
  [
    "収集する情報",
    "お問い合わせ送信には、お名前、メールアドレス、組織名、お問い合わせ種別、本文が含まれる場合があります。この仮想サイトでは機微な個人情報を求めません。",
  ],
  [
    "情報の利用目的",
    "送信された情報は、研究提携、採用、メディア対応、一般的なご相談を適切なニューラ担当チームへ振り分けるために使用されます。",
  ],
  [
    "データ保持",
    "お問い合わせ記録は、この仮想体験における連絡、監査、正当な運用目的に必要な期間だけ保持されます。",
  ],
  [
    "セキュリティ",
    "本サイトは、入力検証、必要最小限の項目、安全な通信を前提とした本番実装に適した設計を想定しています。",
  ],
  [
    "選択肢",
    "訪問者は、お問い合わせページを通じて送信情報の訂正または削除を依頼できます。",
  ],
];

export default function Page() {
  return (
    <main data-interior-page className="relative min-h-screen overflow-hidden pt-28">
      <InteriorMotionStage pageKey="legal" />
      <div className="container-x relative z-10">
        <div className="interior-reveal">
          <p className="hud-label text-cyan">法務 / プライバシー</p>
          <h1 className="mt-5 text-5xl font-semibold uppercase text-white md:text-7xl">
            プライバシーポリシー
          </h1>
          <p className="mt-6 max-w-3xl leading-7 text-white/62">
            この方針は、仮想サイトであるニューラ・ロボティクスが
            お問い合わせ画面から送信された情報をどのように扱うかを説明します。
          </p>
        </div>
        <div className="mt-12 space-y-4 pb-16 md:pb-20">
          {sections.map(([title, body]) => (
            <section key={title} className="interior-card border-t border-white/12 py-7">
              <h2 className="text-2xl font-semibold uppercase text-white">{title}</h2>
              <p className="mt-4 max-w-4xl leading-7 text-white/60">{body}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
