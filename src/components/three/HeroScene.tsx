"use client";

import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Float, OrbitControls, RoundedBox, Stars } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import type { Group } from "three";

function cssHsl(variable: string) {
  if (typeof window === "undefined") return "#8b5cf6";
  const value = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  return value ? `hsl(${value})` : "#8b5cf6";
}

function Robot() {
  const groupRef = useRef<Group>(null);
  const leftArmRef = useRef<Group>(null);
  const rightArmRef = useRef<Group>(null);
  const antennaRef = useRef<Group>(null);
  const { resolvedTheme } = useTheme();
  const [accent, setAccent] = useState("#a78bfa");
  const [highlight, setHighlight] = useState("#22d3ee");

  useEffect(() => {
    const id = window.setTimeout(() => {
      setAccent(cssHsl("--accent"));
      setHighlight(cssHsl("--highlight"));
    }, 0);
    return () => window.clearTimeout(id);
  }, [resolvedTheme]);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(time * 0.45) * 0.18;
      groupRef.current.position.y = Math.sin(time * 0.9) * 0.08;
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
    <Float speed={1.15} rotationIntensity={0.35} floatIntensity={0.9}>
      <group ref={groupRef} scale={1.08} position={[0, -0.08, 0]}>
        <group position={[0, 1.05, 0]}>
          <RoundedBox args={[1.55, 1.08, 0.78]} radius={0.16} smoothness={8}>
            <meshStandardMaterial color={accent} metalness={0.62} roughness={0.2} />
          </RoundedBox>
          <RoundedBox args={[1.12, 0.36, 0.08]} radius={0.08} smoothness={8} position={[0, 0.08, 0.4]}>
            <meshStandardMaterial color="#050816" emissive={highlight} emissiveIntensity={0.45} roughness={0.12} />
          </RoundedBox>
          <mesh position={[-0.32, 0.1, 0.46]}>
            <sphereGeometry args={[0.08, 24, 24]} />
            <meshStandardMaterial color={highlight} emissive={highlight} emissiveIntensity={1.9} />
          </mesh>
          <mesh position={[0.32, 0.1, 0.46]}>
            <sphereGeometry args={[0.08, 24, 24]} />
            <meshStandardMaterial color={highlight} emissive={highlight} emissiveIntensity={1.9} />
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

  return (
    <Canvas
      aria-hidden="true"
      dpr={[1, 2]}
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      className="h-full w-full"
    >
      <ambientLight intensity={0.42} />
      <directionalLight position={[5, 5, 5]} intensity={1.15} />
      <pointLight position={[-3, -2, 4]} intensity={1.25} color="#22d3ee" />
      <Stars radius={45} depth={22} count={900} factor={3} fade speed={0.45} />
      <Robot />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.45} />
      {resolvedTheme === "dark" ? (
        <EffectComposer>
          <Bloom intensity={0.55} luminanceThreshold={0.24} luminanceSmoothing={0.55} />
        </EffectComposer>
      ) : null}
    </Canvas>
  );
}
