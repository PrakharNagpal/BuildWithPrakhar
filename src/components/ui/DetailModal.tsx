"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, X } from "lucide-react";
import type { ReactNode } from "react";

type DetailSection = {
  title: string;
  body: string;
};

export type DetailModalContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  metric?: string;
  metricLabel?: string;
  sections: DetailSection[];
  tags?: readonly string[];
  links?: readonly {
    label: string;
    href: string;
  }[];
};

export function DetailModal({
  content,
  onClose,
}: {
  content: DetailModalContent | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {content ? (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-black/60 p-4 backdrop-blur-md md:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={content.title}
            className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg border border-border bg-bg p-5 shadow-2xl shadow-black/30 md:p-7"
            initial={{ opacity: 0, y: 34, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.24em] text-accent">
                  {content.eyebrow}
                </p>
                <h3 className="mt-3 text-3xl font-semibold tracking-tight text-fg md:text-5xl">
                  {content.title}
                </h3>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-fg-muted md:text-base">
                  {content.subtitle}
                </p>
              </div>
              <button
                type="button"
                aria-label="Close detail card"
                onClick={onClose}
                className="shrink-0 rounded-full border border-border p-2 text-fg-muted transition hover:border-accent hover:text-accent"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-7 grid gap-5 md:grid-cols-[0.72fr_1.28fr]">
              <aside className="space-y-4">
                {content.metric ? (
                  <div className="rounded-lg border border-border bg-bg-elev p-5">
                    <p className="text-4xl font-semibold tracking-tight text-fg">{content.metric}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.2em] text-fg-muted">
                      {content.metricLabel}
                    </p>
                  </div>
                ) : null}

                {content.tags?.length ? (
                  <div className="rounded-lg border border-border bg-bg-elev p-5">
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
                      Stack / Focus
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {content.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-border bg-bg px-3 py-1 text-xs text-fg-muted"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                {content.links?.length ? (
                  <div className="flex flex-wrap gap-3">
                    {content.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-fg transition hover:border-accent hover:text-accent"
                      >
                        {link.label}
                        <ExternalLink size={14} />
                      </a>
                    ))}
                  </div>
                ) : null}
              </aside>

              <div className="grid gap-4">
                {content.sections.map((section, index) => (
                  <motion.section
                    key={section.title}
                    className="rounded-lg border border-border bg-bg-elev p-5"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06 * index }}
                  >
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
                      {section.title}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-fg-muted md:text-base">{section.body}</p>
                  </motion.section>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function OpenHint({ children }: { children: ReactNode }) {
  return (
    <span className="mt-5 inline-flex text-xs uppercase tracking-[0.2em] text-accent">
      {children}
    </span>
  );
}
