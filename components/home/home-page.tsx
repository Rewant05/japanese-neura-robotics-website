"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowDown,
  ArrowRight,
  Check,
  ChevronRight,
  CircleDot,
  Crosshair,
  Factory,
  Hand,
  Minus,
  Plus,
  Radar,
  Send,
} from "lucide-react";
import { CinematicLoader } from "@/components/home/cinematic-loader";
import { LazyWebGLStage } from "@/components/webgl/lazy-webgl-stage";
import {
  anatomy,
  labZones,
  neuralStats,
  productLines,
  roles,
  timeline,
} from "@/lib/site";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const chapters = [
  { id: "hero", label: "導入" },
  { id: "robotics-platform", label: "基盤" },
  { id: "neural-engine", label: "神経" },
  { id: "anatomy", label: "構造" },
  { id: "industrial", label: "工場" },
  { id: "augmentation", label: "拡張" },
  { id: "swarm", label: "群制御" },
  { id: "timeline", label: "年表" },
  { id: "laboratory", label: "研究所" },
  { id: "manifesto", label: "宣言" },
  { id: "careers", label: "採用" },
  { id: "contact", label: "窓口" },
];

export function HomePage() {
  const [loaderDone, setLoaderDone] = useState(false);
  const [activeChapter, setActiveChapter] = useState("hero");
  const rootRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!rootRef.current) return;

    const ctx = gsap.context(() => {
      const revealBlocks = gsap.utils.toArray<HTMLElement>(".reveal-block");
      revealBlocks.forEach((block) => {
        gsap.fromTo(
          block,
          { autoAlpha: 0, y: reduceMotion ? 0 : 20 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.58,
            ease: "power3.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: block,
              start: "top 96%",
              once: true,
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-counter]").forEach((node) => {
        const target = Number(node.dataset.target ?? "0");
        const state = { value: 0 };
        gsap.to(state, {
          value: target,
          duration: 1.35,
          ease: "power2.out",
          onUpdate: () => {
            node.textContent = Math.round(state.value)
              .toString()
              .padStart(2, "0");
          },
          scrollTrigger: {
            trigger: node,
            start: "top 88%",
          },
        });
      });

      chapters.forEach((chapter) => {
        ScrollTrigger.create({
          trigger: `#${chapter.id}`,
          start: "top center",
          end: "bottom center",
          onEnter: () => setActiveChapter(chapter.id),
          onEnterBack: () => setActiveChapter(chapter.id),
        });
      });

      const track = document.querySelector<HTMLElement>(".product-track");
      const trackShell = document.querySelector<HTMLElement>(".product-track-shell");
      if (
        track &&
        trackShell &&
        window.matchMedia("(min-width: 1024px)").matches &&
        !reduceMotion
      ) {
        const panels = gsap.utils.toArray<HTMLElement>(".product-panel");
        gsap.set(panels, { autoAlpha: 1, y: 0 });
        gsap.to(track, {
          x: () =>
            -Math.max(
              0,
              track.scrollWidth - Math.min(window.innerWidth - 32, 1440),
            ),
          ease: "none",
          scrollTrigger: {
            trigger: trackShell,
            start: "top 16%",
            end: () =>
              `+=${Math.max(
                620,
                track.scrollWidth - Math.min(window.innerWidth - 32, 1440) + 120,
              )}`,
            scrub: 0.45,
            pin: trackShell,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      }

      gsap.utils.toArray<HTMLElement>(".callout-line").forEach((line) => {
        gsap.fromTo(
          line,
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: line,
              start: "top 76%",
            },
          },
        );
      });
    }, rootRef);

    const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 120);

    return () => {
      window.clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, [reduceMotion]);

  const handleLoaderDone = useCallback(() => setLoaderDone(true), []);

  return (
    <div ref={rootRef} id="home-story" className="relative min-h-screen">
      <CinematicLoader onDone={handleLoaderDone} />
      <LazyWebGLStage active={loaderDone} />
      <ChapterRail activeChapter={activeChapter} />
      <main className="relative z-10">
        <HeroSection loaderDone={loaderDone} />
        <RoboticsPlatform />
        <NeuralEngine />
        <HumanoidAnatomy />
        <IndustrialRobotics />
        <HumanAugmentation />
        <SwarmIntelligence />
        <ResearchTimeline />
        <Laboratory />
        <FutureManifesto />
        <Careers />
        <ContactHandoff />
      </main>
    </div>
  );
}

function ChapterRail({ activeChapter }: { activeChapter: string }) {
  return (
    <aside
      className="fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-3 2xl:flex"
      aria-label="ホームページ章ナビゲーション"
    >
      {chapters.map((chapter, index) => (
        <a
          key={chapter.id}
          href={`#${chapter.id}`}
          className={cn(
            "group flex items-center gap-3 text-xs text-white/40 transition hover:text-white",
            activeChapter === chapter.id && "text-cyan",
          )}
        >
          <span className="font-mono">{(index + 1).toString().padStart(2, "0")}</span>
          <span
            className={cn(
              "h-px w-8 bg-white/20 transition group-hover:w-12 group-hover:bg-white",
              activeChapter === chapter.id && "w-12 bg-cyan",
            )}
          />
          <span>{chapter.label}</span>
        </a>
      ))}
    </aside>
  );
}

function HeroSection({ loaderDone }: { loaderDone: boolean }) {
  return (
    <section
      id="hero"
      className="chapter-section container-x relative flex min-h-screen items-center pt-28"
    >
      <motion.div
        initial={false}
        animate={{ opacity: loaderDone ? 1 : 0.98, y: 0 }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-5xl pb-16"
      >
        <div className="mb-8 grid max-w-full gap-3 text-xs text-white/62 sm:flex sm:flex-wrap sm:items-center">
          <span className="w-fit max-w-full border border-cyan/35 bg-cyan/10 px-3 py-2 text-cyan">
            NR-H01 // 第一世代
          </span>
          <span className="w-fit max-w-full border border-white/14 bg-white/[.03] px-3 py-2">
            東京研究所 状態: 稼働中
          </span>
          <span className="w-fit max-w-full border border-laser/40 bg-laser/10 px-3 py-2 text-laser">
            安全カーネル 稼働中
          </span>
        </div>
        <h1 className="max-w-4xl break-words text-4xl font-semibold uppercase leading-[1.02] text-white sm:text-6xl md:text-8xl lg:text-9xl">
          知性に、身体を。
        </h1>
        <p className="jp-label mt-6 text-2xl text-cyan md:text-4xl">
          自律する機械の新しいかたち。
        </p>
        <p className="mt-7 max-w-2xl text-lg leading-8 text-white/70 md:text-xl">
          人を知覚し、環境に適応し、人と共に進化するよう設計された自律機械。
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/robotics"
            className="inline-flex items-center justify-center gap-3 border border-cyan/45 bg-cyan/10 px-6 py-4 text-sm font-semibold text-cyan transition hover:bg-cyan/18"
          >
            ロボティクスを見る
            <ArrowRight size={18} />
          </Link>
          <a
            href="#laboratory"
            className="inline-flex items-center justify-center gap-3 border border-white/18 bg-white/[.04] px-6 py-4 text-sm font-semibold text-white transition hover:border-white/42 hover:bg-white/[.08]"
          >
            研究所へ入る
            <ChevronRight size={18} />
          </a>
        </div>
        <div className="mt-12 grid max-w-3xl grid-cols-2 gap-3 md:grid-cols-4">
          {[
            ["遅延", "42", "ms"],
            ["センサー系統", "128", ""],
            ["関節自由度", "47", "自由度"],
            ["群制御機体", "256", ""],
          ].map(([label, value, unit]) => (
            <div key={label} className="tech-border p-4">
              <p className="hud-label">{label}</p>
              <p className="mt-3 font-mono text-2xl text-white">
                <span data-counter data-target={value}>
                  00
                </span>
                <span className="text-sm text-cyan">{unit}</span>
              </p>
            </div>
          ))}
        </div>
      </motion.div>
      <a
        href="#robotics-platform"
        className="absolute bottom-8 left-0 flex items-center gap-3 text-xs uppercase text-white/50"
        aria-label="ロボティクス基盤へスクロール"
      >
        <span className="grid h-9 w-9 place-items-center border border-white/18">
          <ArrowDown size={15} />
        </span>
        スクロールシーケンス
      </a>
    </section>
  );
}

function SectionIntro({
  eyebrow,
  title,
  jp,
  body,
  compact = false,
}: {
  eyebrow: string;
  title: string;
  jp?: string;
  body: string;
  compact?: boolean;
}) {
  return (
    <div className="reveal-block max-w-4xl">
      <p className="hud-label text-cyan">{eyebrow}</p>
      <h2
        className={cn(
          "mt-4 font-semibold uppercase leading-tight text-white",
          compact ? "text-3xl md:text-5xl" : "text-4xl md:text-6xl",
        )}
      >
        {title}
      </h2>
      {jp ? <p className="jp-label mt-4 text-xl text-white/42">{jp}</p> : null}
      <p
        className={cn(
          "max-w-2xl text-base leading-7 text-white/62 md:text-lg",
          compact ? "mt-4" : "mt-6",
        )}
      >
        {body}
      </p>
    </div>
  );
}

function RoboticsPlatform() {
  return (
    <section
      id="robotics-platform"
      className="chapter-section relative min-h-[74vh] overflow-hidden py-12 md:py-14"
    >
      <div className="container-x">
        <SectionIntro
          eyebrow="01 / ロボティクス基盤"
          title="四つの身体を、ひとつの知能層で動かす。"
          jp="ロボットの身体、ひとつの知能。"
          body="ニューラのシステムは共通の知覚と制御スタックを共有しながら、人の空間、工場、リハビリ、分散点検に合わせて身体の形を変えます。"
          compact
        />
      </div>
      <div className="product-track-shell container-x mt-4 overflow-visible">
        <div className="product-track flex flex-col gap-5 lg:w-max lg:flex-row">
          {productLines.map((product, index) => (
            <ProductPanel key={product.name} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductPanel({
  product,
  index,
}: {
  product: (typeof productLines)[number];
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="product-panel group tech-border grid min-h-[360px] w-full grid-cols-1 overflow-hidden will-change-transform lg:w-[580px] lg:grid-cols-[.8fr_1fr]">
      <div className="relative min-h-[190px] border-b border-white/10 bg-black/40 p-4 lg:border-b-0 lg:border-r">
        <MiniModel index={index} />
        <div className="absolute left-5 top-5 border border-cyan/30 bg-graphite/70 px-3 py-2 font-mono text-xs text-cyan">
          {product.code}
        </div>
        <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between border border-white/12 bg-black/50 px-4 py-3 text-xs text-white/62">
          <span>{product.status}</span>
          <span className="h-2 w-2 bg-cyan shadow-[0_0_20px_rgba(56,232,255,.9)]" />
        </div>
      </div>
      <div className="flex flex-col p-5">
        <p className="jp-label text-sm text-cyan">{product.jp}</p>
        <h3 className="mt-2 text-2xl font-semibold uppercase text-white">
          {product.name}
        </h3>
        <p className="mt-4 text-sm leading-6 text-white/62">{product.detail}</p>
        <div className="mt-5 space-y-2">
          {product.metrics.map((metric) => (
            <div
              key={metric}
              className="flex items-center justify-between border-t border-white/10 py-2 text-sm"
            >
              <span className="text-white/56">{metric}</span>
              <Check size={16} className="text-cyan" />
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="mt-auto inline-flex w-fit items-center gap-3 border border-white/16 px-4 py-2.5 text-sm text-white transition hover:border-cyan/45 hover:text-cyan"
        >
          {expanded ? <Minus size={16} /> : <Plus size={16} />}
          技術詳細
        </button>
        {expanded ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="mt-5 overflow-hidden border-l border-cyan/40 pl-4 text-sm leading-6 text-white/58"
          >
            共通の自律ランタイム、冗長安全ループ、暗号化テレメトリ、
            デジタルツイン同期、現場保守可能なモジュール、劣化環境向けの
            低電力退避モードを備えます。
          </motion.div>
        ) : null}
      </div>
    </article>
  );
}

function MiniModel({ index }: { index: number }) {
  return (
    <div className="absolute inset-0 grid place-items-center overflow-hidden">
      <div className="absolute inset-8 border border-white/10" />
      <div className="absolute inset-x-0 top-1/2 h-px bg-cyan/24" />
      <div
        className={cn(
          "relative h-48 w-40 transition duration-500 group-hover:scale-105",
          index === 1 && "w-56",
          index === 2 && "h-56",
          index === 3 && "w-60",
        )}
        style={{ perspective: "700px" }}
      >
        {index === 0 ? (
          <div className="absolute inset-x-12 top-4 h-40 border border-cyan/35 bg-white/[.04] shadow-hud">
            <div className="mx-auto mt-5 h-12 w-14 border border-white/22 bg-black" />
            <div className="mx-auto mt-4 h-24 w-20 border border-white/16 bg-cyan/10" />
          </div>
        ) : null}
        {index === 1 ? (
          <div className="absolute left-8 top-20 h-10 w-44 border border-cyan/35 bg-cyan/10">
            <div className="absolute -right-8 -top-16 h-24 w-10 origin-bottom rotate-[-28deg] border border-white/18 bg-white/[.04]" />
            <div className="absolute left-10 -top-20 h-28 w-9 origin-bottom rotate-[32deg] border border-white/18 bg-white/[.04]" />
          </div>
        ) : null}
        {index === 2 ? (
          <div className="absolute inset-x-14 top-4 h-52 border border-cyan/35 bg-black/50">
            <div className="absolute left-[-28px] top-16 h-24 w-7 border border-white/18 bg-white/[.04]" />
            <div className="absolute right-[-28px] top-16 h-24 w-7 border border-white/18 bg-white/[.04]" />
            <div className="absolute inset-x-3 bottom-4 h-28 border border-laser/30" />
          </div>
        ) : null}
        {index === 3 ? (
          <div className="grid h-full grid-cols-8 content-center gap-2">
            {Array.from({ length: 56 }).map((_, node) => (
              <span
                key={node}
                className="h-2 w-2 bg-cyan/70 shadow-[0_0_12px_rgba(56,232,255,.7)]"
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function NeuralEngine() {
  return (
    <section id="neural-engine" className="chapter-section py-20 md:py-24">
      <div className="container-x grid items-center gap-12 lg:grid-cols-[.9fr_1.1fr]">
        <SectionIntro
          eyebrow="02 / 神経知能エンジン"
          title="知覚、計画、記憶、制御。"
          jp="見る、考える、覚える、動く。"
          body="エッジ人工知能ランタイムが、階層推論、継続的な強化学習、決定論的な制御方策を通じてセンサーストリームを安全な行動へ変換します。"
        />
        <NeuralNetworkPanel />
      </div>
    </section>
  );
}

function NeuralNetworkPanel() {
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const layers = [5, 7, 6, 5, 4];
  const labels = ["知覚", "計画", "制御", "記憶", "学習"];

  return (
    <div
      className="tech-border relative min-h-[540px] overflow-hidden p-6"
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setCursor({
          x: (event.clientX - rect.left) / rect.width - 0.5,
          y: (event.clientY - rect.top) / rect.height - 0.5,
        });
      }}
    >
      <div className="absolute inset-0 opacity-50 [background-image:linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,.06)_1px,transparent_1px)] [background-size:42px_42px]" />
      <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
        {layers.slice(0, -1).map((count, layerIndex) =>
          Array.from({ length: count }).flatMap((_, nodeIndex) =>
            Array.from({ length: layers[layerIndex + 1] }).map((__, nextIndex) => {
              const x1 = 11 + layerIndex * 19.5;
              const x2 = 11 + (layerIndex + 1) * 19.5;
              const y1 = 18 + (nodeIndex * 64) / Math.max(1, count - 1);
              const y2 =
                18 +
                (nextIndex * 64) / Math.max(1, layers[layerIndex + 1] - 1);
              return (
                <line
                  key={`${layerIndex}-${nodeIndex}-${nextIndex}`}
                  x1={`${x1}%`}
                  y1={`${y1}%`}
                  x2={`${x2}%`}
                  y2={`${y2}%`}
                  stroke="rgba(56,232,255,.16)"
                  strokeWidth="1"
                />
              );
            }),
          ),
        )}
      </svg>
      <div className="relative z-10 grid h-[360px] grid-cols-5 items-center gap-5">
        {layers.map((count, layerIndex) => (
          <div key={labels[layerIndex]} className="flex h-full flex-col justify-around">
            {Array.from({ length: count }).map((_, nodeIndex) => (
              <span
                key={nodeIndex}
                className="mx-auto block h-4 w-4 border border-cyan/80 bg-cyan/20 shadow-[0_0_18px_rgba(56,232,255,.62)]"
                style={{
                  transform: `translate3d(${cursor.x * (layerIndex + 1) * 8}px, ${cursor.y * (nodeIndex + 1) * 4}px, 0)`,
                }}
              />
            ))}
            <p className="mt-4 text-center text-xs text-white/58">
              {labels[layerIndex]}
            </p>
          </div>
        ))}
      </div>
      <div className="relative z-10 mt-8 grid gap-3 sm:grid-cols-2">
        {neuralStats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center justify-between border-t border-white/10 py-3"
          >
            <span className="text-sm text-white/55">{stat.label}</span>
            <span className="font-mono text-sm text-cyan">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HumanoidAnatomy() {
  return (
    <section id="anatomy" className="chapter-section py-20 md:py-24">
      <div className="container-x grid gap-12 lg:grid-cols-[.85fr_1.15fr]">
        <SectionIntro
          eyebrow="03 / 人型構造"
          title="人間スケールで読める分解システム。"
          jp="人体寸法で読める機械構造。"
          body="ヒューマノイドのフレームは知覚、計算、駆動、電力、触覚層へ分かれ、物理的な知能がどのように組み上がるかを示します。"
        />
        <div className="relative min-h-[660px]">
          <div className="absolute left-1/2 top-10 h-[560px] w-56 -translate-x-1/2 border border-cyan/20 bg-cyan/[.03]" />
          {anatomy.map((item, index) => (
            <div
              key={item}
              className={cn(
                "reveal-block absolute flex items-center gap-4",
                index % 2 === 0
                  ? "left-0 text-left"
                  : "right-0 flex-row-reverse text-right",
              )}
              style={{ top: 52 + index * 88 }}
            >
              <div className="callout-line h-px w-28 bg-cyan/65 md:w-40" />
              <div className="w-56 border border-white/14 bg-black/62 p-4">
                <p className="font-mono text-xs text-cyan">
                  A-{(index + 1).toString().padStart(2, "0")}
                </p>
                <p className="mt-2 text-sm text-white/78">{item}</p>
              </div>
            </div>
          ))}
          <div className="absolute left-1/2 top-16 h-20 w-24 -translate-x-1/2 border border-white/22 bg-black" />
          <div className="absolute left-1/2 top-44 h-48 w-32 -translate-x-1/2 border border-cyan/35 bg-white/[.04]" />
          <div className="absolute left-[calc(50%-112px)] top-48 h-44 w-9 border border-white/18 bg-white/[.04]" />
          <div className="absolute left-[calc(50%+76px)] top-48 h-44 w-9 border border-white/18 bg-white/[.04]" />
          <div className="absolute left-[calc(50%-54px)] top-[374px] h-52 w-8 border border-white/18 bg-white/[.04]" />
          <div className="absolute left-[calc(50%+22px)] top-[374px] h-52 w-8 border border-white/18 bg-white/[.04]" />
        </div>
      </div>
    </section>
  );
}

function IndustrialRobotics() {
  return (
    <section id="industrial" className="chapter-section py-20 md:py-24">
      <div className="container-x">
        <SectionIntro
          eyebrow="04 / 産業ロボティクス"
          title="動きながら再構成する工場セル。"
          jp="動きながら組み替わる生産セル。"
          body="ロボットアーム、自律搬送ロボット、視覚ゲート、デジタルツイン表示が、ライン全体を止めずに精密組立を協調させます。"
        />
        <div className="mt-14 grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
          <div className="tech-border relative min-h-[520px] overflow-hidden p-6">
            <div className="absolute inset-8 border border-white/10" />
            <div className="absolute left-12 right-12 top-1/2 h-px bg-cyan/30" />
            <div className="absolute left-1/4 top-20 h-72 w-10 origin-bottom rotate-[-24deg] border border-cyan/35 bg-white/[.04]" />
            <div className="absolute left-[38%] top-36 h-52 w-9 origin-bottom rotate-[38deg] border border-white/18 bg-white/[.04]" />
            <div className="absolute right-1/4 top-24 h-64 w-10 origin-bottom rotate-[28deg] border border-laser/35 bg-laser/10" />
            <motion.div
              className="absolute bottom-24 left-12 h-9 w-16 border border-cyan/45 bg-cyan/10"
              animate={{ x: [0, 420, 120, 520, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute bottom-36 left-20 h-9 w-16 border border-white/20 bg-white/[.04]"
              animate={{ x: [320, 40, 460, 180, 320] }}
              transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute bottom-8 left-8 right-8 grid grid-cols-3 gap-3">
              {["精密組立", "機械視覚", "デジタルツイン"].map((item) => (
                <div key={item} className="border border-white/12 bg-black/50 p-3 text-xs text-white/62">
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-5">
            {[
              ["ライン処理量", "18,400個/日"],
              ["欠陥検出", "99.82%"],
              ["再構成", "11分"],
              ["ロボット稼働率", "98.7%"],
            ].map(([label, value]) => (
              <div key={label} className="tech-border p-6">
                <p className="hud-label">{label}</p>
                <p className="mt-5 font-mono text-3xl text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function HumanAugmentation() {
  return (
    <section id="augmentation" className="chapter-section py-20 md:py-24">
      <div className="container-x grid gap-12 lg:grid-cols-2">
        <div>
          <SectionIntro
            eyebrow="05 / 人間拡張"
            title="意図を予測する外骨格。"
            jp="意図を予測する外骨格。"
            body="NR-X4は力が必要になる前に運動信号を読み取り、装着者の主導権を保ちながら身体の周囲に支援構造を組み上げます。"
          />
          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {[
              "筋力増幅",
              "動作予測",
              "リハビリ計画",
              "生体テレメトリ",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 border-t border-white/10 py-4 text-white/62">
                <CircleDot size={16} className="text-cyan" />
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="tech-border relative min-h-[620px] overflow-hidden p-6">
          <div className="absolute left-1/2 top-16 h-[480px] w-36 -translate-x-1/2 border border-white/12 bg-white/[.03]" />
          <motion.div
            className="absolute left-[calc(50%-98px)] top-28 h-64 w-10 border border-cyan/45 bg-cyan/10"
            initial={false}
            animate={{ x: [-28, 0, -28] }}
            transition={{ duration: 4.5, repeat: Infinity }}
          />
          <motion.div
            className="absolute left-[calc(50%+58px)] top-28 h-64 w-10 border border-cyan/45 bg-cyan/10"
            animate={{ x: [28, 0, 28] }}
            transition={{ duration: 4.5, repeat: Infinity }}
          />
          <motion.div
            className="absolute left-[calc(50%-48px)] top-[340px] h-48 w-10 border border-laser/45 bg-laser/10"
            animate={{ y: [28, 0, 28] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
          <motion.div
            className="absolute left-[calc(50%+16px)] top-[340px] h-48 w-10 border border-laser/45 bg-laser/10"
            animate={{ y: [28, 0, 28] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
          <div className="absolute right-6 top-6 w-52 space-y-3 font-mono text-xs">
            {["心拍 72拍/分", "支援 +380%", "歩行 安定", "荷重 41kg"].map((metric) => (
              <div key={metric} className="border border-white/12 bg-black/50 px-3 py-2 text-cyan">
                {metric}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SwarmIntelligence() {
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  return (
    <section
      id="swarm"
      className="chapter-section py-20 md:py-24"
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setCursor({
          x: (event.clientX - rect.left) / rect.width - 0.5,
          y: (event.clientY - rect.top) / rect.height - 0.5,
        });
      }}
    >
      <div className="container-x grid gap-12 lg:grid-cols-[.9fr_1.1fr]">
        <SectionIntro
          eyebrow="06 / 群知能"
          title="多数の小さな機械を、ひとつの意図へ。"
          jp="小さな機械群、ひとつの意図。"
          body="数百のマイクロロボットが、局所ルールと共有テレメトリによって経路を交渉し、障害物を避け、幾何学的な隊列へ再編成します。"
        />
        <div className="tech-border relative min-h-[560px] overflow-hidden p-6">
          <div className="absolute inset-8 border border-white/10" />
          <div className="relative z-10 grid h-[390px] grid-cols-16 content-center gap-2">
            {Array.from({ length: 192 }).map((_, index) => {
              const row = Math.floor(index / 16);
              const col = index % 16;
              const dx = cursor.x * (col - 8) * 1.8;
              const dy = cursor.y * (row - 6) * 1.8;
              const isLogo = (row === 5 && col > 3 && col < 12) || (col === 4 && row > 5 && row < 11) || (col === 11 && row > 5 && row < 11);
              return (
                <span
                  key={index}
                  className={cn(
                    "h-2.5 w-2.5 bg-white/24 transition-transform duration-200",
                    isLogo && "bg-cyan shadow-[0_0_14px_rgba(56,232,255,.8)]",
                  )}
                  style={{ transform: `translate3d(${dx}px, ${dy}px, 0)` }}
                />
              );
            })}
          </div>
          <div className="relative z-10 grid gap-3 sm:grid-cols-3">
            {[
              ["機体数", "256"],
              ["合意形成", "18ヘルツ"],
              ["障害物地図", "ライブ"],
            ].map(([label, value]) => (
              <div key={label} className="border border-white/12 bg-black/48 p-4">
                <p className="hud-label">{label}</p>
                <p className="mt-3 font-mono text-2xl text-cyan">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ResearchTimeline() {
  return (
    <section id="timeline" className="chapter-section py-20 md:py-24">
      <div className="container-x">
        <SectionIntro
          eyebrow="07 / 研究年表"
          title="試作機から共有能力へ進む軌跡。"
          jp="試作機から共有能力へ。"
          body="この仮想ロードマップは、ニューラが研究所の突破口を実用的な身体性知能へ変えていく流れを描きます。"
        />
        <div className="mt-16 border-l border-cyan/35">
          {timeline.map((item, index) => (
            <div key={item.year} className="reveal-block relative grid gap-5 pb-14 pl-8 md:grid-cols-[180px_1fr]">
              <span className="absolute -left-[5px] top-1 h-2.5 w-2.5 bg-cyan" />
              <div className="font-mono text-3xl text-cyan">{item.year}</div>
              <div className="max-w-3xl">
                <h3 className="text-2xl font-semibold uppercase text-white">
                  {item.title}
                </h3>
                <p className="mt-3 leading-7 text-white/62">{item.text}</p>
                <div className="mt-5 h-px w-full bg-white/10">
                  <motion.div
                    className="h-full bg-cyan"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${38 + index * 8}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1 }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Laboratory() {
  const [activeZone, setActiveZone] = useState(0);
  const zone = labZones[activeZone];

  return (
    <section id="laboratory" className="chapter-section py-20 md:py-24">
      <div className="container-x grid gap-12 lg:grid-cols-[.9fr_1.1fr]">
        <SectionIntro
          eyebrow="08 / 研究所"
          title="五つの部屋、ひとつのサイバネティック研究循環。"
          jp="五つの部屋、ひとつの研究循環。"
          body="ニューラの仮想研究所は、人工知能研究、機械、シミュレーション、材料、人間ロボット協調を連続した試験環境へ接続します。"
        />
        <div className="tech-border min-h-[560px] p-6">
          <div className="grid gap-3 sm:grid-cols-2">
            {labZones.map((item, index) => (
              <button
                key={item.name}
                type="button"
                onClick={() => setActiveZone(index)}
                className={cn(
                  "min-h-28 border border-white/12 bg-white/[.03] p-4 text-left transition hover:border-cyan/40",
                  activeZone === index && "border-cyan/55 bg-cyan/10 text-cyan",
                )}
              >
                <span className="jp-label block text-xs text-white/42">
                  {item.jp}
                </span>
                <span className="mt-3 block text-lg font-semibold text-white">
                  {item.name}
                </span>
              </button>
            ))}
          </div>
          <motion.div
            key={zone.name}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 grid gap-6 border-t border-white/10 pt-8 md:grid-cols-[.85fr_1fr]"
          >
            <div className="relative min-h-64 border border-white/12 bg-black/36">
              <div className="absolute inset-8 border border-cyan/20" />
              <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 border border-cyan/55 bg-cyan/10" />
              <div className="absolute inset-x-8 top-1/2 h-px bg-laser/45" />
              <div className="absolute inset-y-8 left-1/2 w-px bg-cyan/45" />
            </div>
            <div>
              <p className="hud-label">稼働中の区画</p>
              <h3 className="mt-4 text-3xl font-semibold uppercase text-white">
                {zone.name}
              </h3>
              <p className="jp-label mt-2 text-cyan">{zone.jp}</p>
              <p className="mt-6 leading-7 text-white/62">{zone.detail}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FutureManifesto() {
  return (
    <section id="manifesto" className="chapter-section relative overflow-hidden py-20 md:py-24">
      <div className="absolute inset-x-0 top-12 text-center text-6xl font-semibold uppercase text-white/[.035] md:text-9xl">
        人間の未来を拡張する知能
      </div>
      <div className="container-x relative z-10">
        <p className="hud-label text-cyan">09 / 未来宣言</p>
        <blockquote className="mt-8 max-w-6xl text-5xl font-semibold uppercase leading-tight text-white md:text-7xl">
          私たちは、人間を置き換えるために機械をつくるのではありません。
          <br />
          <br />
          人間がなり得るものを拡張する知能をつくっています。
        </blockquote>
      </div>
    </section>
  );
}

function Careers() {
  return (
    <section id="careers" className="chapter-section py-20 md:py-24">
      <div className="container-x grid gap-12 lg:grid-cols-[.85fr_1.15fr]">
        <SectionIntro
          eyebrow="10 / 採用"
          title="身体と知能が交差する研究所へ。"
          jp="身体と知能が交差する研究所へ。"
          body="募集領域は、ロボティクス、人工知能、制御システム、工業デザイン、シミュレーション、人間ロボット協調に広がっています。"
        />
        <div className="grid gap-4 md:grid-cols-2">
          {roles.map((role, index) => (
            <Link
              key={role}
              href="/careers"
              className="group tech-border min-h-36 p-5 transition hover:border-cyan/45 hover:bg-cyan/[.05]"
            >
              <span className="font-mono text-xs text-cyan">
                R-{(index + 1).toString().padStart(2, "0")}
              </span>
              <h3 className="mt-5 text-xl font-semibold text-white group-hover:text-cyan">
                {role}
              </h3>
              <p className="mt-4 text-sm text-white/52">
                東京研究所 / 身体性人工知能基盤。
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactHandoff() {
  return (
    <section id="contact" className="chapter-section pb-20 pt-8 md:pb-24">
      <div className="container-x">
        <div className="tech-border grid gap-10 overflow-hidden p-6 md:p-10 lg:grid-cols-[1fr_.8fr]">
          <div>
            <p className="hud-label text-cyan">11 / お問い合わせ</p>
            <h2 className="mt-5 max-w-4xl text-4xl font-semibold uppercase text-white md:text-6xl">
              研究、メディア、採用の窓口を開く。
            </h2>
            <p className="mt-6 max-w-2xl leading-7 text-white/62">
              提携相談、採用のお問い合わせ、メディア依頼、一般的なご質問を、
              東京研究所の通信インターフェースへ送ります。
            </p>
            <Link
              href="/contact"
              className="mt-9 inline-flex items-center gap-3 border border-cyan/45 bg-cyan/10 px-6 py-4 text-sm font-semibold text-cyan transition hover:bg-cyan/18"
            >
              お問い合わせ画面を開く
              <Send size={17} />
            </Link>
          </div>
          <div className="grid gap-4">
            {[
              ["研究提携", Crosshair],
              ["東京研究所", Radar],
              ["産業導入", Factory],
              ["人間拡張", Hand],
            ].map(([label, Icon]) => (
              <div key={label as string} className="flex items-center gap-4 border border-white/12 bg-black/36 p-4">
                <span className="grid h-11 w-11 place-items-center border border-cyan/35 text-cyan">
                  <Icon size={19} />
                </span>
                <span className="text-white/72">{label as string}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
