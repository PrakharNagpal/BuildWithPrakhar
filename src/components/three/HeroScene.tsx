"use client";

import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Environment, Float, Lightformer, OrbitControls, RoundedBox, Stars } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import type { Group } from "three";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function cssHsl(variable: string) {
  if (typeof window === "undefined") return "#6366f1";
  const value = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  return value ? `hsl(${value})` : "#6366f1";
}

function Robot() {
  const groupRef = useRef<Group>(null);
  const leftArmRef = useRef<Group>(null);
  const rightArmRef = useRef<Group>(null);
  const antennaRef = useRef<Group>(null);
  const { resolvedTheme } = useTheme();
  const [accent, setAccent] = useState("#6366f1");
  const [highlight, setHighlight] = useState("#5b7cff");
  const [spark, setSpark] = useState("#f59e0b");

  useEffect(() => {
    const id = window.setTimeout(() => {
      setAccent(cssHsl("--accent"));
      setHighlight(cssHsl("--highlight"));
      setSpark(cssHsl("--spark"));
    }, 0);
    return () => window.clearTimeout(id);
  }, [resolvedTheme]);

  useFrame(({ clock }, delta) => {
    const time = clock.getElapsedTime();
    const damp = Math.min(1, delta * 4);

    if (groupRef.current) {
      // Gentle breathing float. Rotation is handled by OrbitControls (drag + auto-rotate).
      groupRef.current.position.y = lerp(groupRef.current.position.y, Math.sin(time * 0.9) * 0.08, damp);
    }

    if (leftArmRef.current) {
      leftArmRef.current.rotation.z = 0.18 + Math.sin(time * 1.4) * 0.08;
    }

    if (rightArmRef.current) {
      rightArmRef.current.rotation.z = -0.18 - Math.sin(time * 1.4) * 0.08;
    }

    if (antennaRef.current) {
      antennaRef.current.rotation.z = Math.sin(time * 1.8) * 0.08;
    }
  });

  return (
    <Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.7}>
      <group ref={groupRef} scale={1.0} position={[0, -0.08, 0]}>
        <group position={[0, 1.05, 0]}>
          <RoundedBox args={[1.55, 1.08, 0.78]} radius={0.16} smoothness={8}>
            <meshStandardMaterial color={accent} metalness={0.62} roughness={0.2} />
          </RoundedBox>
          <RoundedBox args={[1.12, 0.36, 0.08]} radius={0.08} smoothness={8} position={[0, 0.08, 0.4]}>
            <meshStandardMaterial color="#050816" emissive={highlight} emissiveIntensity={0.45} roughness={0.12} />
          </RoundedBox>
          <mesh position={[-0.32, 0.1, 0.46]}>
            <sphereGeometry args={[0.08, 24, 24]} />
            <meshStandardMaterial color={spark} emissive={spark} emissiveIntensity={2.1} />
          </mesh>
          <mesh position={[0.32, 0.1, 0.46]}>
            <sphereGeometry args={[0.08, 24, 24]} />
            <meshStandardMaterial color={spark} emissive={spark} emissiveIntensity={2.1} />
          </mesh>
          <group ref={antennaRef} position={[0, 0.64, 0]}>
            <mesh position={[0, 0.22, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 0.45, 16]} />
              <meshStandardMaterial color={accent} metalness={0.55} roughness={0.24} />
            </mesh>
            <mesh position={[0, 0.48, 0]}>
              <sphereGeometry args={[0.09, 24, 24]} />
              <meshStandardMaterial color={highlight} emissive={highlight} emissiveIntensity={1.3} />
            </mesh>
          </group>
        </group>

        <group position={[0, -0.1, 0]}>
          <RoundedBox args={[1.22, 1.34, 0.68]} radius={0.18} smoothness={8}>
            <meshStandardMaterial color="#111827" metalness={0.42} roughness={0.28} />
          </RoundedBox>
          <RoundedBox args={[0.68, 0.18, 0.08]} radius={0.05} smoothness={8} position={[0, 0.28, 0.37]}>
            <meshStandardMaterial color={highlight} emissive={highlight} emissiveIntensity={0.65} />
          </RoundedBox>
          <mesh position={[0, -0.18, 0.39]}>
            <torusGeometry args={[0.2, 0.018, 16, 64]} />
            <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.2} />
          </mesh>
        </group>

        <group ref={leftArmRef} position={[-0.84, 0.02, 0]}>
          <mesh position={[0, -0.18, 0]} rotation={[0, 0, -0.16]}>
            <capsuleGeometry args={[0.12, 0.76, 12, 24]} />
            <meshStandardMaterial color={accent} metalness={0.52} roughness={0.24} />
          </mesh>
          <mesh position={[-0.1, -0.64, 0]}>
            <sphereGeometry args={[0.15, 24, 24]} />
            <meshStandardMaterial color={highlight} emissive={highlight} emissiveIntensity={0.45} />
          </mesh>
        </group>

        <group ref={rightArmRef} position={[0.84, 0.02, 0]}>
          <mesh position={[0, -0.18, 0]} rotation={[0, 0, 0.16]}>
            <capsuleGeometry args={[0.12, 0.76, 12, 24]} />
            <meshStandardMaterial color={accent} metalness={0.52} roughness={0.24} />
          </mesh>
          <mesh position={[0.1, -0.64, 0]}>
            <sphereGeometry args={[0.15, 24, 24]} />
            <meshStandardMaterial color={highlight} emissive={highlight} emissiveIntensity={0.45} />
          </mesh>
        </group>

        <group position={[-0.34, -1.05, 0]}>
          <mesh>
            <capsuleGeometry args={[0.13, 0.62, 12, 24]} />
            <meshStandardMaterial color={accent} metalness={0.48} roughness={0.24} />
          </mesh>
        </group>
        <group position={[0.34, -1.05, 0]}>
          <mesh>
            <capsuleGeometry args={[0.13, 0.62, 12, 24]} />
            <meshStandardMaterial color={accent} metalness={0.48} roughness={0.24} />
          </mesh>
        </group>

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.52, 0]}>
          <torusGeometry args={[0.92, 0.01, 12, 96]} />
          <meshStandardMaterial color={highlight} emissive={highlight} emissiveIntensity={0.75} transparent opacity={0.72} />
        </mesh>
      </group>
    </Float>
  );
}

export function HeroScene() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <Canvas
      aria-hidden="true"
      dpr={[1, 2]}
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      className="h-full w-full"
    >
      <ambientLight intensity={isDark ? 0.35 : 0.65} />
      <directionalLight position={[5, 5, 5]} intensity={isDark ? 1.1 : 1.4} />
      <pointLight position={[-3, -2, 4]} intensity={1.2} color="#5b7cff" />
      <pointLight position={[3, -1, 2]} intensity={0.8} color="#f59e0b" />

      {/* Procedural studio environment — gives the metal real reflections, no network/HDR fetch */}
      <Environment resolution={256}>
        <Lightformer intensity={isDark ? 2.4 : 3.2} position={[0, 3, 2]} scale={[8, 3, 1]} color="#ffffff" />
        <Lightformer intensity={isDark ? 2.2 : 2.6} position={[-4, 1, 2]} scale={[3, 6, 1]} color="#6366f1" />
        <Lightformer intensity={isDark ? 1.8 : 2.0} position={[4, -1, 1]} scale={[3, 4, 1]} color="#5b7cff" />
        <Lightformer intensity={1.4} position={[2, -3, 3]} scale={[4, 2, 1]} color="#f59e0b" />
      </Environment>

      {isDark ? <Stars radius={45} depth={22} count={700} factor={2.6} fade speed={0.4} /> : null}
      <Robot />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.9}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.9}
      />
      <EffectComposer enableNormalPass={false}>
        <Bloom
          intensity={isDark ? 0.7 : 0.35}
          luminanceThreshold={isDark ? 0.22 : 0.4}
          luminanceSmoothing={0.6}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  );
}
