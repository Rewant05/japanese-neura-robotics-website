import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="relative z-20 border-t border-white/10 bg-graphite/[.86] py-7 backdrop-blur-xl">
      <div className="container-x flex flex-col gap-5 text-sm text-white/56 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold text-white">{site.name}</p>
          <p className="jp-label mt-1 text-xs text-white/42">{site.jpName}</p>
        </div>
        <nav className="flex flex-wrap gap-4" aria-label="法務ナビゲーション">
          <Link href="/privacy-policy" className="inline-flex items-center gap-2 transition hover:text-cyan">
            プライバシーポリシー
            <ArrowUpRight size={14} />
          </Link>
          <Link href="/terms-of-service" className="inline-flex items-center gap-2 transition hover:text-cyan">
            利用規約
            <ArrowUpRight size={14} />
          </Link>
          <Link href="/contact" className="inline-flex items-center gap-2 transition hover:text-cyan">
            お問い合わせ
            <ArrowUpRight size={14} />
          </Link>
        </nav>
      </div>
    </footer>
  );
}
