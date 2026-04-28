"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { FileText } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  ["About", "#about"],
  ["Work", "#experience"],
  ["Projects", "#projects"],
  ["Skills", "#skills"],
  ["Contact", "#contact"],
];

export function Navbar() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setHidden(latest > previous && latest > 120);
  });

  return (
    <motion.header
      animate={{ y: hidden ? -96 : 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-40 border-b border-border/70 bg-bg/75 backdrop-blur-xl"
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 md:px-10">
        <a href="#home" className="font-mono text-sm font-semibold tracking-[0.24em] text-fg">
          Prakhar Nagpal
        </a>
        <div className="hidden items-center gap-6 md:flex">
          {links.map(([label, href]) => (
            <a key={href} href={href} className="text-sm text-fg-muted transition hover:text-fg">
              {label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <a
            href="/resume"
            className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-bg-elev/80 px-4 text-sm font-medium text-fg transition hover:border-accent hover:text-accent"
          >
            <FileText size={16} />
            <span className="hidden sm:inline">Resume</span>
          </a>
        </div>
      </nav>
    </motion.header>
  );
}
