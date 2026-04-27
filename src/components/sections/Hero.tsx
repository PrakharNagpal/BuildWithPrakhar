"use client";

import dynamic from "next/dynamic";
import { ArrowDown, Send } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { profile } from "@/data/profile";

const HeroScene = dynamic(() => import("@/components/three/HeroScene").then((mod) => mod.HeroScene), {
  ssr: false,
});

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section id="home" className="hero-field relative min-h-screen overflow-hidden pt-28">
      <div className="absolute inset-x-0 top-0 h-52 bg-gradient-to-b from-bg to-transparent" />
      <div className="mx-auto grid min-h-[calc(100vh-7rem)] max-w-6xl items-center gap-10 px-6 pb-16 md:grid-cols-[1.05fr_0.95fr] md:px-10">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10"
        >
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-accent">
            Software Engineer · Systems · AI · Product Engineering
          </p>
          <h1 className="mt-6 max-w-4xl text-6xl font-semibold tracking-tight text-fg md:text-8xl">
            {profile.name}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-fg-muted md:text-xl">
            {profile.tagline}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <MagneticButton href="#projects">View work</MagneticButton>
            <MagneticButton href="#contact" variant="secondary">
              <Send size={16} />
              Get in touch
            </MagneticButton>
          </div>
        </motion.div>

        <div className="relative h-[360px] min-h-[360px] md:h-[620px]">
          {reduce ? (
            <div className="absolute inset-8 rounded-full bg-[radial-gradient(circle,hsl(var(--accent)/0.34),transparent_62%)]" />
          ) : (
            <HeroScene />
          )}
        </div>
      </div>
      <a
        href="#about"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-xs uppercase tracking-[0.24em] text-fg-muted transition hover:text-accent md:flex"
      >
        <ArrowDown size={14} />
        Scroll
      </a>
    </section>
  );
}
