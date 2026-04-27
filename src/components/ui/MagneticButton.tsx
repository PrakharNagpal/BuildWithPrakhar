"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

type Props = Omit<HTMLMotionProps<"a">, "children"> & {
  children: ReactNode;
  variant?: "primary" | "secondary";
};

export function MagneticButton({ children, variant = "primary", className = "", ...props }: Props) {
  const reduce = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 160, damping: 18 });
  const y = useSpring(useMotionValue(0), { stiffness: 160, damping: 18 });

  return (
    <motion.a
      {...props}
      style={reduce ? undefined : { x, y }}
      whileHover={reduce ? undefined : { scale: 1.06 }}
      transition={{ type: "spring", stiffness: 260, damping: 16 }}
      onMouseMove={(event) => {
        if (reduce) return;
        const rect = event.currentTarget.getBoundingClientRect();
        x.set((event.clientX - rect.left - rect.width / 2) * 0.16);
        y.set((event.clientY - rect.top - rect.height / 2) * 0.16);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className={`inline-flex min-h-12 items-center justify-center rounded-full border px-5 text-sm font-medium transition ${
        variant === "primary"
          ? "border-accent bg-accent text-white shadow-[0_0_32px_hsl(var(--accent)/0.28)] hover:bg-highlight"
          : "border-border bg-bg-elev/70 text-fg hover:border-accent"
      } ${className}`}
    >
      {children}
    </motion.a>
  );
}
