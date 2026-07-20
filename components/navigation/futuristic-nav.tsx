"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, RadioTower, ShieldCheck, X } from "lucide-react";
import { useEffect, useState } from "react";
import { navItems, site } from "@/lib/site";
import { cn } from "@/lib/utils";

export function FuturisticNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[70] border-b border-white/10 bg-graphite/[.82] backdrop-blur-xl">
        <nav
          className="container-x flex h-20 items-center justify-between gap-5"
          aria-label="メインナビゲーション"
        >
          <Link
            href="/"
            aria-label="ニューラ・ロボティクス ホーム"
            className="group flex min-w-0 items-center gap-3"
          >
            <motion.span
              className="grid h-10 w-10 shrink-0 place-items-center border border-cyan/40 bg-cyan/10 text-cyan"
              animate={{ rotate: [0, 0, 90, 90, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
            >
              <RadioTower size={20} />
            </motion.span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-white">
                {site.name}
              </span>
              <span className="jp-label block text-xs text-white/50">
                {site.jpName}
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 xl:flex">
            {navItems.slice(1, 8).map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-3 py-2 text-xs text-white/62 transition hover:text-white",
                    active && "text-cyan",
                  )}
                >
                  <span>{item.label}</span>
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-3 -bottom-1 h-px bg-cyan"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className="hidden items-center gap-2 border border-cyan/35 px-4 py-2 text-xs text-cyan transition hover:bg-cyan/10 md:inline-flex"
            >
              お問い合わせ
              <ArrowUpRight size={15} />
            </Link>
            <button
              type="button"
              aria-label={open ? "メニューを閉じる" : "メニューを開く"}
              aria-expanded={open}
              onClick={() => setOpen((value) => !value)}
              className="grid h-11 w-11 place-items-center border border-white/16 bg-white/[.03] text-white transition hover:border-cyan/40 hover:text-cyan"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] overflow-y-auto bg-graphite/[.98] pt-20 text-white"
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="container-x grid min-h-[calc(100svh-80px)] grid-cols-1 gap-8 py-6 lg:grid-cols-[1fr_.62fr] lg:py-8">
              <div className="flex flex-col justify-start">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.035 }}
                  >
                    <Link
                      href={item.href}
                      className="group flex items-end justify-between gap-4 border-t border-white/10 py-3 text-3xl font-semibold uppercase leading-none text-white transition hover:text-cyan sm:text-4xl md:py-4 md:text-5xl xl:text-6xl"
                    >
                      <span className="min-w-0 break-words">{item.label}</span>
                      <span className="jp-label shrink-0 text-right text-xs font-normal text-white/40 group-hover:text-cyan sm:text-sm">
                        {item.jp}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>
              <aside className="tech-border scanline self-start p-5 md:p-6 lg:sticky lg:top-24">
                <p className="hud-label">東京研究所リンク</p>
                <p className="mt-5 max-w-md text-xl text-white/82">
                  人を知覚し、環境に適応し、人と共に進化する自律機械。
                </p>
                <div className="mt-8 grid grid-cols-2 gap-4 text-sm text-white/58">
                  <span>システム状態</span>
                  <span className="text-right text-cyan">稼働中</span>
                  <span>安全経路</span>
                  <span className="text-right text-laser">スキャン中</span>
                </div>
                <div className="mt-8 border-t border-white/10 pt-5">
                  <p className="hud-label">法務リンク</p>
                  <div className="mt-4 grid gap-3 text-sm text-white/62">
                    <Link
                      href="/privacy-policy"
                      className="inline-flex items-center gap-3 transition hover:text-cyan"
                    >
                      <ShieldCheck size={16} className="text-cyan" />
                      プライバシーポリシー
                    </Link>
                    <Link
                      href="/terms-of-service"
                      className="inline-flex items-center gap-3 transition hover:text-cyan"
                    >
                      <ShieldCheck size={16} className="text-cyan" />
                      利用規約
                    </Link>
                  </div>
                </div>
              </aside>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
