"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";

const HomeExperience = dynamic(
  () => import("@/components/webgl/home-experience").then((mod) => mod.HomeExperience),
  {
    ssr: false,
    loading: () => null,
  },
);

function hasWebGLSupport() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2") || canvas.getContext("webgl"),
    );
  } catch {
    return false;
  }
}

export function LazyWebGLStage({ active }: { active: boolean }) {
  const [canRender, setCanRender] = useState(false);
  const [webgl, setWebgl] = useState(true);
  const [liteMode, setLiteMode] = useState(false);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 768px)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cancelRender = () => {};

    const update = () => {
      cancelRender();
      cancelRender = () => {};

      const supportsWebGL = hasWebGLSupport();
      const isMobile = mobileQuery.matches;
      const prefersReducedMotion = motionQuery.matches;
      const lowPowerDevice = (navigator.hardwareConcurrency ?? 4) <= 4;
      const useLiteMode = isMobile || prefersReducedMotion || lowPowerDevice;

      setWebgl(supportsWebGL);
      setLiteMode(useLiteMode);
      setCanRender(false);

      if (!active || !supportsWebGL || useLiteMode) return;

      let cancelled = false;
      const startRender = () => {
        if (!cancelled) setCanRender(true);
      };

      if ("requestIdleCallback" in window) {
        const idleId = window.requestIdleCallback(startRender, { timeout: 1800 });
        cancelRender = () => {
          cancelled = true;
          window.cancelIdleCallback(idleId);
        };
        return;
      }

      const timer = setTimeout(startRender, 1200);
      cancelRender = () => {
        cancelled = true;
        clearTimeout(timer);
      };
    };

    update();
    mobileQuery.addEventListener("change", update);
    motionQuery.addEventListener("change", update);

    return () => {
      cancelRender();
      mobileQuery.removeEventListener("change", update);
      motionQuery.removeEventListener("change", update);
    };
  }, [active]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 overflow-hidden bg-graphite"
    >
      <Image
        src="/images/neura-lab-poster-lcp.jpg"
        alt=""
        fill
        priority
        quality={72}
        sizes="100vw"
        className="object-cover opacity-70 saturate-125"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,6,7,.7),rgba(5,6,7,.26)_44%,rgba(5,6,7,.72)),linear-gradient(180deg,rgba(5,6,7,.18),rgba(5,6,7,.58))]" />
      {canRender && webgl && !liteMode ? <HomeExperience /> : null}
      {!webgl || liteMode ? (
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,6,7,.04),rgba(5,6,7,.5))]" />
      ) : null}
    </div>
  );
}
