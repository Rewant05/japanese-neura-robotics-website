"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useMemo, useRef, useState } from "react";
import type { MutableRefObject } from "react";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

type ProgressRef = MutableRefObject<number>;
type PointerRef = MutableRefObject<{ x: number; y: number }>;

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

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function rangeProgress(progress: number, start: number, end: number) {
  return clamp((progress - start) / (end - start));
}

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
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".interior-reveal").forEach((node) => {
        gsap.fromTo(
          node,
          { autoAlpha: 0, y: reducedMotion ? 0 : 36 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.85,
            ease: "power3.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: node,
              start: "top 92%",
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
            y: reducedMotion ? 0 : 28,
            rotateX: reducedMotion ? 0 : -7,
          },
          {
            autoAlpha: 1,
            y: 0,
            rotateX: 0,
            duration: 0.7,
            delay: Math.min(index * 0.035, 0.18),
            ease: "power2.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: node,
              start: "top 92%",
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

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-graphite"
    >
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,6,7,.88),rgba(5,6,7,.42)_50%,rgba(5,6,7,.9))]" />
      <div
        className="interior-gridline absolute left-0 top-[28%] h-px w-full origin-left scale-x-0 bg-cyan/24 opacity-0"
        style={{ backgroundColor: palette.primary }}
      />
      <div
        className="interior-gridline absolute left-0 top-[64%] h-px w-full origin-right scale-x-0 opacity-0"
        style={{ backgroundColor: palette.secondary }}
      />
      {canRender && !mobile ? (
        <Canvas
          className="absolute inset-0 opacity-[.46]"
          camera={{ position: [0, 0.9, 6.2], fov: 39 }}
          dpr={[1, 1.12]}
          gl={{ antialias: false, alpha: true, powerPreference: "default" }}
        >
          <color attach="background" args={["#050607"]} />
          <fog attach="fog" args={["#050607", 7, 17]} />
          <ambientLight intensity={0.28} />
          <pointLight position={[3, 3, 3]} intensity={2} color={palette.primary} />
          <pointLight position={[-3, 1.4, -2]} intensity={1.4} color={palette.secondary} />
          <InteriorScene
            mobile={mobile}
            pageKey={pageKey}
            palette={palette}
            reducedMotion={reducedMotion}
          />
        </Canvas>
      ) : null}
    </div>
  );
}

function InteriorScene({
  mobile,
  pageKey,
  palette,
  reducedMotion,
}: {
  mobile: boolean;
  pageKey: string;
  palette: { primary: string; secondary: string };
  reducedMotion: boolean;
}) {
  const progress = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);
  const lookAt = useMemo(() => new THREE.Vector3(0, 0.35, 0), []);

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: "[data-interior-page]",
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        progress.current = self.progress;
      },
    });

    const move = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.current.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", move, { passive: true });

    return () => {
      trigger.kill();
      window.removeEventListener("pointermove", move);
    };
  }, []);

  useFrame(({ clock }, delta) => {
    const p = reducedMotion ? 0.32 : progress.current;
    target.set(
      THREE.MathUtils.lerp(-0.45, mobile ? 0.75 : 1.8, rangeProgress(p, 0.1, 0.82)),
      THREE.MathUtils.lerp(0.85, -0.15, rangeProgress(p, 0.18, 0.92)),
      THREE.MathUtils.lerp(mobile ? 7.4 : 6.2, mobile ? 5.4 : 3.7, rangeProgress(p, 0.2, 0.9)) +
        Math.sin(clock.elapsedTime * 0.35) * 0.08,
    );
    camera.position.lerp(target, 1 - Math.pow(0.001, delta));
    lookAt.set(pointer.current.x * 0.12, 0.25 + pointer.current.y * 0.08, -0.75);
    camera.lookAt(lookAt);
  });

  return (
    <group>
      <KineticRings progress={progress} palette={palette} reducedMotion={reducedMotion} />
      <DataConstellation
        progress={progress}
        pointer={pointer}
        count={mobile ? 0 : 108}
        pageKey={pageKey}
        palette={palette}
      />
      <ScannerSheets progress={progress} palette={palette} />
      <TelemetryRails progress={progress} palette={palette} />
    </group>
  );
}

function KineticRings({
  progress,
  palette,
  reducedMotion,
}: {
  progress: ProgressRef;
  palette: { primary: string; secondary: string };
  reducedMotion: boolean;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const p = progress.current;
    group.current.rotation.x = THREE.MathUtils.lerp(0.35, 1.15, rangeProgress(p, 0, 0.7));
    group.current.rotation.y =
      THREE.MathUtils.lerp(-0.25, 1.1, rangeProgress(p, 0.12, 1)) +
      (reducedMotion ? 0 : clock.elapsedTime * 0.07);
    group.current.position.z = THREE.MathUtils.lerp(-1.8, -0.35, rangeProgress(p, 0.12, 0.72));
    group.current.scale.setScalar(THREE.MathUtils.lerp(0.72, 1.35, rangeProgress(p, 0.08, 0.86)));
  });

  return (
    <group ref={group} position={[0, 0.25, -1.2]}>
      {[0.95, 1.35, 1.78].map((radius, index) => (
        <mesh
          key={radius}
          rotation={[index * 0.45, index * 0.3, index * 0.18]}
        >
          <torusGeometry args={[radius, 0.009 + index * 0.002, 8, 96]} />
          <meshBasicMaterial
            color={index === 1 ? palette.secondary : palette.primary}
            transparent
            opacity={0.34 - index * 0.06}
          />
        </mesh>
      ))}
      <mesh>
        <icosahedronGeometry args={[0.42, 1]} />
        <meshStandardMaterial
          color="#111820"
          emissive={palette.primary}
          emissiveIntensity={0.18}
          metalness={0.72}
          roughness={0.28}
          transparent
          opacity={0.72}
        />
      </mesh>
    </group>
  );
}

function DataConstellation({
  progress,
  pointer,
  count,
  pageKey,
  palette,
}: {
  progress: ProgressRef;
  pointer: PointerRef;
  count: number;
  pageKey: string;
  palette: { primary: string; secondary: string };
}) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const seed = useMemo(
    () => pageKey.split("").reduce((total, letter) => total + letter.charCodeAt(0), 0),
    [pageKey],
  );

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const p = progress.current;
    const spiral = rangeProgress(p, 0.18, 0.76);
    for (let i = 0; i < count; i += 1) {
      const angle = (i / count) * Math.PI * 2 + seed * 0.01;
      const row = Math.floor(i / 19);
      const column = i % 19;
      const ring = 1.2 + ((i + seed) % 23) * 0.055;
      const gridX = (column - 9) * 0.18;
      const gridY = (row - count / 38) * 0.16;
      const wave = Math.sin(clock.elapsedTime * 0.65 + i * 0.17) * 0.12;
      const x =
        THREE.MathUtils.lerp(Math.cos(angle + clock.elapsedTime * 0.12) * ring, gridX, spiral) +
        pointer.current.x * 0.18;
      const y =
        THREE.MathUtils.lerp(Math.sin(angle * 1.8) * 0.9, gridY, spiral) +
        pointer.current.y * 0.1 +
        wave;
      const z = THREE.MathUtils.lerp(Math.sin(angle) * ring - 1.1, -1.9, spiral);
      dummy.position.set(x, y + 0.35, z);
      dummy.rotation.set(angle * 0.2, angle, clock.elapsedTime * 0.16);
      dummy.scale.setScalar(0.45 + (i % 5) * 0.045);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <boxGeometry args={[0.035, 0.035, 0.035]} />
      <meshStandardMaterial
        color={palette.primary}
        emissive={palette.secondary}
        emissiveIntensity={0.35}
        transparent
        opacity={0.78}
      />
    </instancedMesh>
  );
}

function ScannerSheets({
  progress,
  palette,
}: {
  progress: ProgressRef;
  palette: { primary: string; secondary: string };
}) {
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const p = progress.current;
    group.current.position.y = THREE.MathUtils.lerp(1.6, -1.25, rangeProgress(p, 0, 1));
    group.current.rotation.z = Math.sin(clock.elapsedTime * 0.28) * 0.08;
  });

  return (
    <group ref={group} position={[0, 0.8, -2.25]}>
      {[0, 1, 2].map((index) => (
        <mesh
          key={index}
          position={[index * 0.64 - 0.64, index * 0.18, 0]}
          rotation={[0, 0, index * 0.18]}
        >
          <planeGeometry args={[0.42 + index * 0.28, 2.8]} />
          <meshBasicMaterial
            color={index === 1 ? palette.secondary : palette.primary}
            transparent
            opacity={0.06}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

function TelemetryRails({
  progress,
  palette,
}: {
  progress: ProgressRef;
  palette: { primary: string; secondary: string };
}) {
  const group = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!group.current) return;
    const p = progress.current;
    group.current.rotation.y = THREE.MathUtils.lerp(-0.5, 0.55, rangeProgress(p, 0.05, 0.95));
    group.current.position.x = THREE.MathUtils.lerp(-1.25, 1.15, rangeProgress(p, 0.2, 0.88));
  });

  return (
    <group ref={group} position={[0, -0.6, -2.5]}>
      {[-1.2, -0.4, 0.4, 1.2].map((y, index) => (
        <mesh key={y} position={[0, y, 0]}>
          <boxGeometry args={[5.4, 0.008, 0.008]} />
          <meshBasicMaterial
            color={index % 2 ? palette.secondary : palette.primary}
            transparent
            opacity={0.18}
          />
        </mesh>
      ))}
    </group>
  );
}
