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
  const rotateX = useSpring(useMotionValue(0), { stiffness: 170, damping: 24 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 170, damping: 24 });
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);
  const glow = useMotionTemplate`radial-gradient(circle at ${glowX}% ${glowY}%, hsl(var(--highlight) / 0.2), transparent 34%)`;

  return (
    <motion.div
      {...props}
      style={reduce ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
      whileHover={reduce ? undefined : { scale: 1.025 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      onMouseMove={(event) => {
        if (reduce) return;
        const rect = event.currentTarget.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;
        rotateX.set((0.5 - py) * 8);
        rotateY.set((px - 0.5) * 8);
        glowX.set(px * 100);
        glowY.set(py * 100);
      }}
      onMouseLeave={() => {
        rotateX.set(0);
        rotateY.set(0);
      }}
      className={`group relative overflow-hidden rounded-lg border border-border bg-bg-elev p-6 shadow-2xl shadow-black/5 ${className}`}
    >
      <motion.div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: glow }} />
      <div className="relative">{children}</div>
    </motion.div>
  );
}
