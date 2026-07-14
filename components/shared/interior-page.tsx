import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CircleDot, Cpu, FlaskConical, RadioTower } from "lucide-react";
import {
  labZones,
  pages,
  productLines,
  roles,
  timeline,
} from "@/lib/site";
import { InteriorMotionStage } from "@/components/shared/interior-motion-stage";

export type InteriorPageKey = keyof typeof pages;

export function InteriorPage({ pageKey }: { pageKey: InteriorPageKey }) {
  const page = pages[pageKey];

  return (
    <main data-interior-page className="relative min-h-screen overflow-hidden pt-20">
      <InteriorMotionStage pageKey={pageKey} />
      <section className="interior-hero relative z-10 flex min-h-[76vh] items-end overflow-hidden pb-16 pt-32">
        <Image
          src="/images/neura-lab-poster.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="interior-hero-media object-cover opacity-44"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,6,7,.94),rgba(5,6,7,.55)_52%,rgba(5,6,7,.88))]" />
        <div className="container-x interior-reveal relative z-10">
          <p className="hud-label text-cyan">{page.label}</p>
          <h1 className="mt-5 max-w-5xl text-5xl font-semibold uppercase leading-tight text-white md:text-7xl">
            {page.title}
          </h1>
          <p className="jp-label mt-5 text-2xl text-cyan">{page.jpTitle}</p>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-white/68">
            {page.summary}
          </p>
        </div>
      </section>

      <section className="relative z-10 border-y border-white/10 bg-black/32 py-5">
        <div className="container-x grid gap-3 md:grid-cols-3">
          {page.stats.map((stat, index) => (
            <div key={stat} className="interior-stat flex items-center justify-between py-3">
              <span className="font-mono text-sm text-cyan">
                {(index + 1).toString().padStart(2, "0")}
              </span>
              <span className="text-right text-sm text-white/70">{stat}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x relative z-10 py-24">
        <div className="grid gap-12 lg:grid-cols-[.72fr_1fr]">
          <aside className="interior-reveal sticky top-28 h-fit">
            <p className="hud-label text-cyan">システム概要</p>
            <h2 className="mt-4 text-3xl font-semibold uppercase text-white md:text-5xl">
              ひとつのロボティクス知能スタックとして構築。
            </h2>
            <p className="mt-6 leading-7 text-white/58">
              各ページでは、仮想ニューラ基盤の異なる側面を展開します。
              ハードウェア、人工知能、研究、研究所運用、そしてシステムを
              信頼できるものにするチームを扱います。
            </p>
          </aside>
          <div className="space-y-5">
            {page.sections.map((section, index) => (
              <article key={section.title} className="interior-card tech-border p-6 md:p-8">
                <div className="flex items-start gap-5">
                  <span className="grid h-11 w-11 shrink-0 place-items-center border border-cyan/35 text-cyan">
                    {index === 0 ? (
                      <Cpu size={18} />
                    ) : index === 1 ? (
                      <FlaskConical size={18} />
                    ) : (
                      <RadioTower size={18} />
                    )}
                  </span>
                  <div>
                    <h3 className="text-2xl font-semibold uppercase text-white">
                      {section.title}
                    </h3>
                    <p className="mt-4 leading-7 text-white/62">{section.body}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <PageSpecific pageKey={pageKey} />

      <section className="container-x relative z-10 pb-24">
        <div className="interior-card tech-border grid gap-8 p-6 md:p-9 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="hud-label text-cyan">次の窓口</p>
            <h2 className="mt-4 text-3xl font-semibold uppercase text-white md:text-5xl">
              東京研究所へつなぐ。
            </h2>
            <p className="mt-5 max-w-2xl leading-7 text-white/58">
              提携、研究説明、募集職種、メディア対応、一般的なご相談は、
              すべてお問い合わせ窓口から始まります。
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex h-fit items-center gap-3 self-end border border-cyan/45 bg-cyan/10 px-6 py-4 text-sm font-semibold text-cyan transition hover:bg-cyan/18"
          >
            お問い合わせを開く
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>
    </main>
  );
}

function PageSpecific({ pageKey }: { pageKey: InteriorPageKey }) {
  if (pageKey === "robotics") {
    return (
      <section className="container-x relative z-10 pb-24">
        <div className="grid gap-4 md:grid-cols-2">
          {productLines.map((product) => (
            <div key={product.name} className="interior-card border-t border-white/12 py-6">
              <p className="font-mono text-sm text-cyan">{product.code}</p>
              <h3 className="mt-3 text-2xl font-semibold uppercase text-white">
                {product.name}
              </h3>
              <p className="jp-label mt-1 text-sm text-white/42">{product.jp}</p>
              <p className="mt-4 leading-7 text-white/58">{product.detail}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (pageKey === "research") {
    return (
      <section className="container-x relative z-10 pb-24">
        <div className="border-l border-cyan/35 pl-7">
          {timeline.slice(0, 5).map((item) => (
            <div key={item.year} className="interior-card relative pb-10">
              <span className="absolute -left-[33px] top-1 h-2.5 w-2.5 bg-cyan" />
              <p className="font-mono text-cyan">{item.year}</p>
              <h3 className="mt-2 text-2xl font-semibold uppercase text-white">
                {item.title}
              </h3>
              <p className="mt-3 max-w-3xl leading-7 text-white/58">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (pageKey === "laboratory") {
    return (
      <section className="container-x relative z-10 pb-24">
        <div className="grid gap-4 lg:grid-cols-5">
          {labZones.map((zone) => (
            <div key={zone.name} className="interior-card tech-border min-h-56 p-5">
              <p className="jp-label text-sm text-cyan">{zone.jp}</p>
              <h3 className="mt-4 text-xl font-semibold uppercase text-white">
                {zone.name}
              </h3>
              <p className="mt-4 text-sm leading-6 text-white/56">{zone.detail}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (pageKey === "careers") {
    return (
      <section className="container-x relative z-10 pb-24">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {roles.map((role) => (
            <Link
              key={role}
              href="/contact"
              className="interior-card group flex min-h-40 flex-col justify-between border border-white/12 bg-white/[.03] p-5 transition hover:border-cyan/45 hover:bg-cyan/[.05]"
            >
              <CircleDot size={18} className="text-cyan" />
              <span className="text-xl font-semibold text-white group-hover:text-cyan">
                {role}
              </span>
            </Link>
          ))}
        </div>
      </section>
    );
  }

  if (pageKey === "news") {
    return (
      <section className="container-x relative z-10 pb-24">
        <div className="grid gap-5 lg:grid-cols-3">
          {pages.news.sections.map((item, index) => (
            <article key={item.title} className="interior-card tech-border min-h-72 p-6">
              <p className="font-mono text-xs text-cyan">通信-0{index + 1}</p>
              <h3 className="mt-5 text-2xl font-semibold uppercase text-white">
                {item.title}
              </h3>
              <p className="mt-5 leading-7 text-white/58">{item.body}</p>
            </article>
          ))}
        </div>
      </section>
    );
  }

  return null;
}
