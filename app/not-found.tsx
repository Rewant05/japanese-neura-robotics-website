import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="container-x flex min-h-screen items-center pt-28">
      <section className="max-w-3xl">
        <p className="hud-label">404 / 信号消失</p>
        <h1 className="mt-6 text-5xl font-semibold text-white md:text-7xl">
          研究所経路を利用できません。
        </h1>
        <p className="mt-6 text-lg text-white/62">
          要求されたシステム経路は、ニューラのナビゲーション網に登録されていません。
        </p>
        <Link
          href="/"
          className="mt-10 inline-flex items-center gap-3 border border-cyan/40 px-5 py-3 text-sm text-cyan hover:bg-cyan/10"
        >
          <ArrowLeft size={18} />
          ホームへ戻る
        </Link>
      </section>
    </main>
  );
}
