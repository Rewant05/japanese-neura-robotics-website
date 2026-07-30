"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const InteriorWebGLStage = dynamic(
  () => import("@/components/shared/interior-webgl-stage").then((mod) => mod.InteriorWebGLStage),
  {
    ssr: false,
    loading: () => null,
  },
);

const accents: Record<string, { primary: string; secondary: string }> = {
  about: { primary: "#38e8ff", secondary: "#ff2f46" },
  robotics: { primary: "#38e8ff", secondary: "#ffffff" },
  "ai-platform": { primary: "#82fff2", secondary: "#ff2f46" },
  research: { primary: "#b7f7ff", secondary: "#38e8ff" },
  laboratory: { primary: "#38e8ff", secondary: "#7cffd4" },
  careers: { primary: "#ff5b6d", secondary: "#38e8ff" },
  news: { primary: "#f4f8fa", secondary: "#38e8ff" },
  contact: { primary: "#38e8ff", secondary: "#ff2f46" },
  legal: { primary: "#9befff", secondary: "#ffffff" },
};

function hasWebGLSupport() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export function InteriorMotionStage({ pageKey }: { pageKey: string }) {
  const [canRender, setCanRender] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const palette = accents[pageKey] ?? accents.legal;

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 768px)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setMobile(mobileQuery.matches);
      setReducedMotion(motionQuery.matches);
    };
    update();
    mobileQuery.addEventListener("change", update);
    motionQuery.addEventListener("change", update);
    return () => {
      mobileQuery.removeEventListener("change", update);
      motionQuery.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    setCanRender(hasWebGLSupport());
  }, []);

  useEffect(() => {
    let active = true;
    let cleanup = () => {};

    void (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (!active) return;

      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".interior-reveal").forEach((node) => {
        gsap.fromTo(
          node,
          { autoAlpha: 0, y: reducedMotion ? 0 : 18 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.56,
            ease: "power3.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: node,
              start: "top 98%",
              once: true,
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>(".interior-card").forEach((node, index) => {
        gsap.fromTo(
          node,
          {
            autoAlpha: 0,
            y: reducedMotion ? 0 : 16,
            rotateX: reducedMotion ? 0 : -3,
          },
          {
            autoAlpha: 1,
            y: 0,
            rotateX: 0,
            duration: 0.48,
            delay: Math.min(index * 0.02, 0.1),
            ease: "power2.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: node,
              start: "top 98%",
              once: true,
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>(".interior-stat").forEach((node, index) => {
        gsap.fromTo(
          node,
          { xPercent: reducedMotion ? 0 : index % 2 === 0 ? -6 : 6, autoAlpha: 0 },
          {
            xPercent: 0,
            autoAlpha: 1,
            duration: 0.65,
            ease: "power2.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: node,
              start: "top 94%",
              once: true,
            },
          },
        );
      });

      gsap.to(".interior-gridline", {
        scaleX: 1,
        opacity: 0.75,
        stagger: 0.08,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-interior-page]",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      const hero = document.querySelector<HTMLElement>(".interior-hero");
      const heroMedia = document.querySelector<HTMLElement>(".interior-hero-media");
      if (hero && heroMedia) {
        gsap.to(heroMedia, {
          yPercent: reducedMotion ? 0 : 9,
          scale: reducedMotion ? 1 : 1.08,
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
      }, document.body);

      cleanup = () => ctx.revert();
    })();

    return () => {
      active = false;
      cleanup();
    };
  }, [reducedMotion]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#0b0f12]"
    >
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,6,7,.68),rgba(5,6,7,.18)_50%,rgba(5,6,7,.72)),linear-gradient(180deg,rgba(255,255,255,.035),rgba(5,6,7,.42))]" />
      <div
        className="interior-gridline absolute left-0 top-[28%] h-px w-full origin-left scale-x-0 bg-cyan/24 opacity-0"
        style={{ backgroundColor: palette.primary }}
      />
      <div
        className="interior-gridline absolute left-0 top-[64%] h-px w-full origin-right scale-x-0 opacity-0"
        style={{ backgroundColor: palette.secondary }}
      />
      {canRender && !mobile ? (
        <InteriorWebGLStage
          mobile={mobile}
          pageKey={pageKey}
          palette={palette}
          reducedMotion={reducedMotion}
        />
      ) : null}
    </div>
  );
}
