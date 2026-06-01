"use client";

import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

type TiltCardProps = Omit<HTMLMotionProps<"div">, "children"> & {
  children: ReactNode;
  className?: string;
};

export function TiltCard({ children, className = "", ...props }: TiltCardProps) {
  const reduce = useReducedMotion();
  const rotateX = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);
  const glow = useMotionTemplate`radial-gradient(circle at ${glowX}% ${glowY}%, hsl(var(--accent) / 0.22), transparent 45%)`;
  // A moving sheen across the surface, like light catching glass.
  const sheen = useMotionTemplate`linear-gradient(${glowX}deg, transparent 30%, hsl(0 0% 100% / 0.06) 50%, transparent 70%)`;

  return (
    <motion.div
      {...props}
      style={
        reduce
          ? undefined
          : { rotateX, rotateY, transformStyle: "preserve-3d", transformPerspective: 900 }
      }
      whileHover={reduce ? undefined : { scale: 1.03, z: 30 }}
      transition={{ type: "spring", stiffness: 200, damping: 16 }}
      onMouseMove={(event) => {
        if (reduce) return;
        const rect = event.currentTarget.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;
        rotateX.set((0.5 - py) * 16);
        rotateY.set((px - 0.5) * 16);
        glowX.set(px * 100);
        glowY.set(py * 100);
      }}
      onMouseLeave={() => {
        rotateX.set(0);
        rotateY.set(0);
      }}
      className={`group relative overflow-hidden rounded-2xl border border-border bg-bg-elev p-6 ${className}`}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: glow }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: sheen }}
      />
      <div className="relative" style={reduce ? undefined : { transform: "translateZ(40px)" }}>
        {children}
      </div>
    </motion.div>
  );
}
