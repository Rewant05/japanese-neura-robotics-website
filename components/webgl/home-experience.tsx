"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Line, Sparkles } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useMemo, useRef, useState } from "react";
import type { MutableRefObject } from "react";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

type ProgressRef = MutableRefObject<number>;
type PointerRef = MutableRefObject<{ x: number; y: number }>;

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function rangeProgress(progress: number, start: number, end: number) {
  return clamp((progress - start) / (end - start));
}

export function HomeExperience() {
  const [inView, setInView] = useState(true);
  const [mobile, setMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

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
    const target = document.getElementById("home-story");
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.02 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <Canvas
      className="absolute inset-0"
      camera={{ position: [0, 1.25, 7], fov: mobile ? 46 : 38 }}
      dpr={[1, mobile ? 1 : 1.18]}
      frameloop={inView ? "always" : "demand"}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: "default",
      }}
    >
      <color attach="background" args={["#050607"]} />
      <fog attach="fog" args={["#050607", 7, 18]} />
      <ambientLight intensity={0.24} />
      <directionalLight position={[4, 6, 3]} intensity={2.2} color="#eafcff" />
      <pointLight position={[-4, 2.2, 3]} intensity={1.7} color="#38e8ff" />
      <pointLight position={[2.5, 0.6, -1]} intensity={1.2} color="#ff2f46" />
      <ScrollScene mobile={mobile} reducedMotion={reducedMotion} />
    </Canvas>
  );
}

function ScrollScene({
  mobile,
  reducedMotion,
}: {
  mobile: boolean;
  reducedMotion: boolean;
}) {
  const progress = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);
  const lookAt = useMemo(() => new THREE.Vector3(0, 0.75, 0), []);

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: "#home-story",
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
    const p = reducedMotion ? 0.08 : progress.current;
    const phase = Math.sin(clock.elapsedTime * 0.45) * 0.08;
    target.set(
      THREE.MathUtils.lerp(0, mobile ? 1.6 : 2.5, rangeProgress(p, 0.45, 0.78)),
      THREE.MathUtils.lerp(1.25, 0.65, rangeProgress(p, 0.1, 0.45)),
      THREE.MathUtils.lerp(7, mobile ? 5.2 : 3.1, rangeProgress(p, 0.12, 0.42)) +
        phase,
    );
    camera.position.lerp(target, 1 - Math.pow(0.001, delta));
    lookAt.set(
      THREE.MathUtils.lerp(0, 1.2, rangeProgress(p, 0.22, 0.42)),
      THREE.MathUtils.lerp(0.8, 0.2, rangeProgress(p, 0.52, 0.86)),
      THREE.MathUtils.lerp(0, -1.6, rangeProgress(p, 0.45, 0.78)),
    );
    camera.lookAt(lookAt);
  });

  return (
    <group>
      <LaboratoryChamber progress={progress} />
      <HumanoidRobot
        progress={progress}
        pointer={pointer}
        reducedMotion={reducedMotion}
      />
      <NeuralGraph progress={progress} reducedMotion={reducedMotion} />
      <FactoryScene progress={progress} />
      <SwarmAndHands progress={progress} pointer={pointer} mobile={mobile} />
      <ParticleField count={mobile ? 36 : 120} />
    </group>
  );
}

function LaboratoryChamber({ progress }: { progress: ProgressRef }) {
  const chamber = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!chamber.current) return;
    const p = progress.current;
    chamber.current.visible = p < 0.58;
    chamber.current.rotation.y = THREE.MathUtils.lerp(0, -0.35, rangeProgress(p, 0, 0.35));
  });

  return (
    <group ref={chamber}>
      <mesh position={[0, 0.9, -0.18]}>
        <boxGeometry args={[2.35, 4.5, 0.06]} />
        <meshStandardMaterial color="#111820" metalness={0.8} roughness={0.28} transparent opacity={0.32} />
      </mesh>
      <mesh position={[0, 0.9, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[1.52, 0.012, 8, 128]} />
        <meshStandardMaterial color="#38e8ff" emissive="#38e8ff" emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[0, 0.9, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.72, 0.01, 8, 128]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.25} />
      </mesh>
      {[-1.55, 1.55].map((x) => (
        <group key={x} position={[x, 0.55, -0.1]}>
          <mesh rotation={[0, 0, x > 0 ? -0.6 : 0.6]}>
            <cylinderGeometry args={[0.035, 0.055, 1.9, 12]} />
            <meshStandardMaterial color="#dce8ee" metalness={0.9} roughness={0.22} />
          </mesh>
          <mesh position={[x > 0 ? -0.45 : 0.45, -0.6, 0]} rotation={[0, 0, x > 0 ? 0.55 : -0.55]}>
            <cylinderGeometry args={[0.03, 0.04, 1.2, 12]} />
            <meshStandardMaterial color="#7b868c" metalness={0.9} roughness={0.25} />
          </mesh>
          <mesh position={[x > 0 ? -0.88 : 0.88, -1.03, 0]}>
            <boxGeometry args={[0.25, 0.12, 0.18]} />
            <meshStandardMaterial color="#111417" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      ))}
      <ScanningLines />
      <HolographicPanels />
    </group>
  );
}

function ScanningLines() {
  return (
    <group>
      {Array.from({ length: 9 }).map((_, index) => (
        <mesh key={index} position={[0, -1.25 + index * 0.46, 0.04]}>
          <boxGeometry args={[2.8, 0.006, 0.006]} />
          <meshBasicMaterial color={index % 2 ? "#38e8ff" : "#ff2f46"} transparent opacity={0.2} />
        </mesh>
      ))}
    </group>
  );
}

function HolographicPanels() {
  const panels = [
    [-1.85, 1.45, 0.25, 0.58, 0.42],
    [1.82, 0.8, 0.18, 0.52, 0.78],
    [-1.72, -0.35, 0.34, 0.68, 0.34],
  ];

  return (
    <group>
      {panels.map(([x, y, z, width, height], index) => (
        <mesh key={index} position={[x, y, z]} rotation={[0, x > 0 ? -0.32 : 0.32, 0]}>
          <planeGeometry args={[width, height]} />
          <meshBasicMaterial color={index === 1 ? "#ff2f46" : "#38e8ff"} transparent opacity={0.16} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

function HumanoidRobot({
  progress,
  pointer,
  reducedMotion,
}: {
  progress: ProgressRef;
  pointer: PointerRef;
  reducedMotion: boolean;
}) {
  const robot = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const eye = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }) => {
    if (!robot.current) return;
    const p = progress.current;
    const sideTurn = rangeProgress(p, 0.05, 0.24);
    const zoomEye = rangeProgress(p, 0.18, 0.38);
    robot.current.visible = p < 0.63;
    robot.current.rotation.y =
      THREE.MathUtils.lerp(0.04, Math.PI * 0.72, sideTurn) +
      pointer.current.x * 0.08;
    robot.current.position.y =
      (reducedMotion ? 0 : Math.sin(clock.elapsedTime * 1.15) * 0.035) -
      zoomEye * 0.15;
    robot.current.scale.setScalar(THREE.MathUtils.lerp(1, 1.55, zoomEye));

    if (head.current) {
      head.current.rotation.y = pointer.current.x * 0.18;
      head.current.rotation.x = pointer.current.y * 0.08;
    }
    if (eye.current) {
      eye.current.emissiveIntensity = 1.4 + Math.sin(clock.elapsedTime * 4) * 0.7;
    }
  });

  return (
    <group ref={robot} position={[0, 0, 0]}>
      <group ref={head} position={[0, 1.42, 0]}>
        <mesh>
          <boxGeometry args={[0.58, 0.42, 0.48]} />
          <meshStandardMaterial color="#dfe8ec" metalness={0.86} roughness={0.18} />
        </mesh>
        <mesh position={[0, 0.02, 0.255]}>
          <boxGeometry args={[0.28, 0.08, 0.035]} />
          <meshStandardMaterial ref={eye} color="#38e8ff" emissive="#38e8ff" emissiveIntensity={1.8} />
        </mesh>
        <mesh position={[0, -0.24, 0]}>
          <cylinderGeometry args={[0.13, 0.18, 0.18, 16]} />
          <meshStandardMaterial color="#9ba8ad" metalness={0.9} roughness={0.22} />
        </mesh>
      </group>

      <mesh position={[0, 0.68, 0]}>
        <boxGeometry args={[0.78, 1.08, 0.38]} />
        <meshStandardMaterial color="#f1f6f7" metalness={0.72} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.66, 0.21]}>
        <boxGeometry args={[0.46, 0.64, 0.035]} />
        <meshStandardMaterial color="#071014" emissive="#38e8ff" emissiveIntensity={0.24} />
      </mesh>
      <CircuitLines />
      <Limb side={-1} />
      <Limb side={1} />
      <Leg side={-1} />
      <Leg side={1} />
    </group>
  );
}

function CircuitLines() {
  const paths = [
    [
      [-0.18, 0.95, 0.24],
      [-0.08, 0.76, 0.25],
      [-0.18, 0.56, 0.24],
    ],
    [
      [0.2, 0.92, 0.24],
      [0.1, 0.7, 0.25],
      [0.24, 0.5, 0.24],
    ],
    [
      [-0.3, 0.45, 0.24],
      [0, 0.36, 0.25],
      [0.28, 0.45, 0.24],
    ],
  ].map((points) => points.map(([x, y, z]) => new THREE.Vector3(x, y, z)));

  return (
    <group>
      {paths.map((points, index) => (
        <Line
          key={index}
          points={points}
          color="#38e8ff"
          lineWidth={1.8}
          transparent
          opacity={0.78}
        />
      ))}
    </group>
  );
}

function Limb({ side }: { side: -1 | 1 }) {
  return (
    <group position={[side * 0.55, 0.92, 0]}>
      <mesh rotation={[0, 0, side * 0.22]}>
        <cylinderGeometry args={[0.075, 0.095, 0.82, 14]} />
        <meshStandardMaterial color="#cfd8dc" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[side * 0.13, -0.54, 0]} rotation={[0, 0, side * -0.16]}>
        <cylinderGeometry args={[0.065, 0.08, 0.78, 14]} />
        <meshStandardMaterial color="#7e8a90" metalness={0.9} roughness={0.24} />
      </mesh>
      <mesh position={[side * 0.25, -0.98, 0.02]}>
        <boxGeometry args={[0.16, 0.12, 0.12]} />
        <meshStandardMaterial color="#f4f8fa" metalness={0.6} roughness={0.22} />
      </mesh>
    </group>
  );
}

function Leg({ side }: { side: -1 | 1 }) {
  return (
    <group position={[side * 0.22, 0.02, 0]}>
      <mesh rotation={[0, 0, side * -0.04]}>
        <cylinderGeometry args={[0.08, 0.11, 0.96, 14]} />
        <meshStandardMaterial color="#d8e1e5" metalness={0.82} roughness={0.18} />
      </mesh>
      <mesh position={[side * 0.05, -0.78, 0]} rotation={[0, 0, side * 0.08]}>
        <cylinderGeometry args={[0.07, 0.09, 0.9, 14]} />
        <meshStandardMaterial color="#8b969c" metalness={0.85} roughness={0.22} />
      </mesh>
      <mesh position={[side * 0.08, -1.29, 0.1]}>
        <boxGeometry args={[0.26, 0.1, 0.34]} />
        <meshStandardMaterial color="#f3f7f8" metalness={0.62} roughness={0.2} />
      </mesh>
    </group>
  );
}

function NeuralGraph({
  progress,
  reducedMotion,
}: {
  progress: ProgressRef;
  reducedMotion: boolean;
}) {
  const graph = useRef<THREE.Group>(null);
  const nodes = useMemo(() => {
    const result: THREE.Vector3[] = [];
    for (let layer = 0; layer < 5; layer += 1) {
      const count = 4 + (layer % 2) * 2;
      for (let node = 0; node < count; node += 1) {
        result.push(
          new THREE.Vector3(
            (layer - 2) * 0.72,
            (node - count / 2) * 0.32,
            Math.sin(layer + node) * 0.28,
          ),
        );
      }
    }
    return result;
  }, []);

  const lines = useMemo(() => {
    const result: [THREE.Vector3, THREE.Vector3][] = [];
    for (let i = 0; i < nodes.length - 5; i += 1) {
      if (i % 2 === 0) result.push([nodes[i], nodes[i + 5]]);
      if (i % 3 === 0) result.push([nodes[i], nodes[Math.min(nodes.length - 1, i + 6)]]);
    }
    return result;
  }, [nodes]);

  useFrame(({ clock }) => {
    if (!graph.current) return;
    const p = progress.current;
    const appear = rangeProgress(p, 0.24, 0.44);
    const fade = 1 - rangeProgress(p, 0.62, 0.74);
    graph.current.visible = appear > 0.02 && fade > 0.02;
    const scale = THREE.MathUtils.lerp(0.22, 1.45, appear) * fade;
    graph.current.scale.setScalar(scale);
    graph.current.rotation.y =
      (reducedMotion ? 0.2 : clock.elapsedTime * 0.12) +
      rangeProgress(p, 0.42, 0.58) * 0.8;
    graph.current.position.set(0, 0.75, THREE.MathUtils.lerp(0.25, -1.6, rangeProgress(p, 0.36, 0.62)));
  });

  return (
    <group ref={graph}>
      {nodes.map((node, index) => (
        <mesh key={index} position={node}>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshStandardMaterial color="#38e8ff" emissive="#38e8ff" emissiveIntensity={1.2} />
        </mesh>
      ))}
      {lines.map(([start, end], index) => (
        <Line
          key={index}
          points={[start, end]}
          color={index % 4 === 0 ? "#ff2f46" : "#38e8ff"}
          lineWidth={0.8}
          transparent
          opacity={0.42}
        />
      ))}
    </group>
  );
}

function FactoryScene({ progress }: { progress: ProgressRef }) {
  const factory = useRef<THREE.Group>(null);
  const armA = useRef<THREE.Group>(null);
  const armB = useRef<THREE.Group>(null);
  const vehicleA = useRef<THREE.Group>(null);
  const vehicleB = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!factory.current) return;
    const p = progress.current;
    const appear = rangeProgress(p, 0.52, 0.66);
    const fade = 1 - rangeProgress(p, 0.78, 0.88);
    factory.current.visible = appear > 0.02 && fade > 0.02;
    factory.current.position.set(0, -1.1, THREE.MathUtils.lerp(-2.2, 0.2, appear));
    factory.current.scale.setScalar(THREE.MathUtils.lerp(0.7, 1.15, appear) * fade);
    if (armA.current) armA.current.rotation.z = Math.sin(clock.elapsedTime * 1.1) * 0.22;
    if (armB.current) armB.current.rotation.z = -Math.sin(clock.elapsedTime * 1.4) * 0.18;
    if (vehicleA.current) vehicleA.current.position.x = Math.sin(clock.elapsedTime * 0.7) * 1.8;
    if (vehicleB.current) vehicleB.current.position.x = Math.cos(clock.elapsedTime * 0.65) * 2.2;
  });

  return (
    <group ref={factory}>
      <mesh position={[0, -0.08, -0.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6.4, 4.2, 12, 8]} />
        <meshStandardMaterial color="#0c1013" metalness={0.3} roughness={0.65} />
      </mesh>
      {[-2, -1, 0, 1, 2].map((x) => (
        <Line
          key={x}
          points={[new THREE.Vector3(x, 0, -2), new THREE.Vector3(x, 0, 2)]}
          color="#38e8ff"
          lineWidth={0.8}
          transparent
          opacity={0.22}
        />
      ))}
      <FactoryArm refValue={armA} position={[-1.75, 0.72, -0.6]} color="#38e8ff" />
      <FactoryArm refValue={armB} position={[1.75, 0.72, -0.75]} color="#ff2f46" />
      <group ref={vehicleA} position={[0, 0.12, 0.9]}>
        <mesh>
          <boxGeometry args={[0.48, 0.16, 0.32]} />
          <meshStandardMaterial color="#38e8ff" emissive="#38e8ff" emissiveIntensity={0.35} />
        </mesh>
      </group>
      <group ref={vehicleB} position={[0, 0.12, 1.45]}>
        <mesh>
          <boxGeometry args={[0.42, 0.16, 0.28]} />
          <meshStandardMaterial color="#e7eef1" metalness={0.7} roughness={0.28} />
        </mesh>
      </group>
    </group>
  );
}

function FactoryArm({
  refValue,
  position,
  color,
}: {
  refValue: MutableRefObject<THREE.Group | null>;
  position: [number, number, number];
  color: string;
}) {
  return (
    <group ref={refValue} position={position}>
      <mesh position={[0, -0.45, 0]}>
        <cylinderGeometry args={[0.08, 0.12, 0.9, 12]} />
        <meshStandardMaterial color="#dfe8ec" metalness={0.88} roughness={0.22} />
      </mesh>
      <mesh position={[0.38, 0.05, 0]} rotation={[0, 0, -0.75]}>
        <cylinderGeometry args={[0.055, 0.07, 1.05, 12]} />
        <meshStandardMaterial color="#87939a" metalness={0.9} roughness={0.24} />
      </mesh>
      <mesh position={[0.78, -0.38, 0]} rotation={[0, 0, -0.2]}>
        <boxGeometry args={[0.22, 0.12, 0.18]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.38} />
      </mesh>
    </group>
  );
}

function SwarmAndHands({
  progress,
  pointer,
  mobile,
}: {
  progress: ProgressRef;
  pointer: PointerRef;
  mobile: boolean;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!group.current) return;
    const p = progress.current;
    const appear = rangeProgress(p, 0.72, 0.86);
    group.current.visible = appear > 0.02;
    group.current.position.y = THREE.MathUtils.lerp(-0.65, 0.05, appear);
    group.current.scale.setScalar(THREE.MathUtils.lerp(0.72, 1.05, appear));
  });

  return (
    <group ref={group}>
      <SwarmBots progress={progress} pointer={pointer} count={mobile ? 72 : 220} />
      <ApproachingHands progress={progress} />
    </group>
  );
}

function SwarmBots({
  progress,
  pointer,
  count,
}: {
  progress: ProgressRef;
  pointer: PointerRef;
  count: number;
}) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const p = progress.current;
    const logo = rangeProgress(p, 0.78, 0.92);
    for (let i = 0; i < count; i += 1) {
      const angle = (i / count) * Math.PI * 2;
      const ring = 1.2 + ((i % 17) / 17) * 1.5;
      const gridX = ((i % 30) - 15) * 0.11;
      const gridY = (Math.floor(i / 30) - 6) * 0.09;
      const x =
        THREE.MathUtils.lerp(
          Math.cos(angle + clock.elapsedTime * 0.18) * ring,
          gridX,
          logo,
        ) + pointer.current.x * 0.16;
      const y =
        THREE.MathUtils.lerp(
          Math.sin(angle * 2) * 0.58,
          gridY,
          logo,
        ) + pointer.current.y * 0.08;
      const z = THREE.MathUtils.lerp(Math.sin(angle) * ring, -1.2, logo);
      dummy.position.set(x, y + 0.25, z - 0.4);
      dummy.rotation.set(0, angle, 0);
      dummy.scale.setScalar(0.55 + (i % 5) * 0.035);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <boxGeometry args={[0.06, 0.025, 0.1]} />
      <meshStandardMaterial color="#38e8ff" emissive="#38e8ff" emissiveIntensity={0.42} />
    </instancedMesh>
  );
}

function ApproachingHands({ progress }: { progress: ProgressRef }) {
  const left = useRef<THREE.Group>(null);
  const right = useRef<THREE.Group>(null);

  useFrame(() => {
    const p = progress.current;
    const hand = rangeProgress(p, 0.88, 1);
    if (left.current) {
      left.current.visible = hand > 0.02;
      left.current.position.x = THREE.MathUtils.lerp(-2.7, -0.72, hand);
    }
    if (right.current) {
      right.current.visible = hand > 0.02;
      right.current.position.x = THREE.MathUtils.lerp(2.7, 0.72, hand);
    }
  });

  return (
    <group position={[0, -0.35, -0.2]}>
      <group ref={left} rotation={[0, 0, -0.1]}>
        <mesh>
          <boxGeometry args={[0.86, 0.18, 0.24]} />
          <meshStandardMaterial color="#e8d2c3" roughness={0.52} />
        </mesh>
        {[-0.28, -0.08, 0.12, 0.32].map((x) => (
          <mesh key={x} position={[0.52, x, 0]} rotation={[0, 0, 0.18]}>
            <boxGeometry args={[0.48, 0.06, 0.07]} />
            <meshStandardMaterial color="#e8d2c3" roughness={0.52} />
          </mesh>
        ))}
      </group>
      <group ref={right} rotation={[0, Math.PI, 0.1]}>
        <mesh>
          <boxGeometry args={[0.86, 0.18, 0.24]} />
          <meshStandardMaterial color="#f2f7f8" metalness={0.78} roughness={0.2} />
        </mesh>
        {[-0.28, -0.08, 0.12, 0.32].map((x) => (
          <mesh key={x} position={[0.52, x, 0]} rotation={[0, 0, 0.18]}>
            <boxGeometry args={[0.48, 0.06, 0.07]} />
            <meshStandardMaterial color="#cfd8dc" metalness={0.8} roughness={0.22} />
          </mesh>
        ))}
        <Line
          points={[
            new THREE.Vector3(-0.05, 0.14, 0.13),
            new THREE.Vector3(0.32, 0.18, 0.13),
            new THREE.Vector3(0.62, 0.14, 0.13),
          ]}
          color="#38e8ff"
          lineWidth={1.5}
          transparent
          opacity={0.7}
        />
      </group>
    </group>
  );
}

function ParticleField({ count }: { count: number }) {
  return (
    <Sparkles
      count={count}
      speed={0.18}
      opacity={0.48}
      color="#38e8ff"
      size={1.3}
      scale={[7, 4, 7]}
      position={[0, 0.6, -1]}
    />
  );
}
