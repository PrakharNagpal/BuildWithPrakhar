"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const x = useSpring(useMotionValue(-100), { stiffness: 320, damping: 32 });
  const y = useSpring(useMotionValue(-100), { stiffness: 320, damping: 32 });

  useEffect(() => {
    const canUse = window.matchMedia("(pointer: fine)").matches;
    if (!canUse) return;
    const id = window.setTimeout(() => setEnabled(true), 0);

    const onMove = (event: MouseEvent) => {
      x.set(event.clientX - 9);
      y.set(event.clientY - 9);
    };

    window.addEventListener("mousemove", onMove);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("mousemove", onMove);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[60] h-[18px] w-[18px] rounded-full border border-accent/70 bg-highlight/20 mix-blend-difference"
      style={{ x, y }}
    />
  );
}
