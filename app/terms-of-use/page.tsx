import type { Metadata } from "next";
import { InteriorMotionStage } from "@/components/shared/interior-motion-stage";

export const metadata: Metadata = {
  title: "利用規約",
  description: "仮想企業ニューラ・ロボティクスサイトの利用規約。",
};

const sections = [
  [
    "仮想体験",
    "ニューラ・ロボティクスは、インタラクティブなウェブ体験のために作成された仮想企業です。製品説明、到達点、連絡先、所在地は説明用の設定です。",
  ],
  [
    "許可される利用",
    "訪問者は、本サイトを閲覧し、適切なお問い合わせを送信し、評価またはデモ目的でこの体験を参照できます。",
  ],
  [
    "コンテンツの扱い",
    "サイト本文、インターフェース構想、生成画像、コードは、別途ライセンスが示されない限り、このプロジェクト成果物の一部です。",
  ],
  [
    "保証の否認",
    "本サイトは、デモおよび創造的技術表現の目的で現状のまま提供され、可用性や適合性を保証しません。",
  ],
  [
    "お問い合わせ経路",
    "フォーム送信はアプリケーション内で検証され、受信確認が返されますが、表示される連絡先は仮想のものです。",
  ],
];

export default function Page() {
  return (
    <main data-interior-page className="relative min-h-screen overflow-hidden pt-32">
      <InteriorMotionStage pageKey="legal" />
      <div className="container-x relative z-10">
        <div className="interior-reveal">
          <p className="hud-label text-cyan">法務 / 利用規約</p>
          <h1 className="mt-5 text-5xl font-semibold uppercase text-white md:text-7xl">
            利用規約
          </h1>
          <p className="mt-6 max-w-3xl leading-7 text-white/62">
            この規約は、仮想サイトであるニューラ・ロボティクスと
            そのインタラクティブなロボティクスコンテンツの利用について定めます。
          </p>
        </div>
        <div className="mt-14 space-y-5 pb-24">
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
