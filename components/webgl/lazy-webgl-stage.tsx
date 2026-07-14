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

  useEffect(() => {
    setWebgl(hasWebGLSupport());
    if (!active) return;

    const timer = window.setTimeout(() => setCanRender(true), 780);
    return () => window.clearTimeout(timer);
  }, [active]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 overflow-hidden bg-graphite"
    >
      <Image
        src="/images/neura-lab-poster.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-55"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,6,7,.86),rgba(5,6,7,.35)_42%,rgba(5,6,7,.82))]" />
      {canRender && webgl ? <HomeExperience /> : null}
      {!webgl ? (
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,6,7,.1),rgba(5,6,7,.72))]" />
      ) : null}
    </div>
  );
}
