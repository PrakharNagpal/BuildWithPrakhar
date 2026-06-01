"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { DetailModal, type DetailModalContent, OpenHint } from "@/components/ui/DetailModal";
import { TiltCard } from "@/components/ui/TiltCard";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Project } from "@/types/portfolio";

const projectSignals: Record<string, string[]> = {
  "equal-miles": ["Real travel-time fairness", "Grab Directions API", "Live Flutter map UX"],
  "hdb-price-prediction": ["EDA-heavy pipeline", "Boosting ensemble", "RMSE-focused evaluation"],
  "isd-cia": ["8 finance verticals", "5K+ dealer rollout", "Loan journey unification"],
  bunkerfit: ["100K+ downloads", "Cross-platform app", "Wellness product"],
  wittrade: ["Student marketplace", "Buy, rent, sell", "Firebase-backed"],
  "health-app": ["QR medical records", "Appointment alerts", "Android native"],
};

const signalAccents = ["bg-accent/12 text-accent", "bg-accent-2/12 text-accent-2", "bg-accent-3/12 text-accent-3", "bg-accent-4/12 text-accent-4"];

const projectDetails: Record<string, DetailModalContent> = {
  "equal-miles": {
    eyebrow: "Project deep dive",
    title: "Equal Miles",
    subtitle:
      "A Grab Maps Hackathon project that helps friend groups choose fair meetup spots using real travel times instead of misleading geometric midpoints.",
    metric: "Fairness",
    metricLabel: "longest trip minus shortest trip",
    tags: ["Flutter Web", "Dart / Shelf", "Grab Maps SDK", "MapLibre GL JS", "Docker"],
    links: [
      { label: "Live demo", href: "https://prakharnagpal.github.io/Grab_Maps_Hacakthon/" },
      { label: "GitHub", href: "https://github.com/PrakharNagpal/Grab_Maps_Hacakthon" },
    ],
    sections: [
      {
        title: "Problem",
        body:
          "Meeting halfway is rarely fair because roads, routing, and transport modes distort the real effort each person spends. Equal Miles reframes the meetup problem around actual travel-time spread.",
      },
      {
        title: "System",
        body:
          "The app lets users place friends on a live map, resolves addresses, compares venue categories, calls directions for every friend-to-venue pair, and ranks candidates by a fairness score.",
      },
      {
        title: "Experience",
        body:
          "Results show fairness gap, maximum trip, average trip, badges like fairest or fastest, and a comparison against the naive geographic center so the group can understand the trade-off instantly.",
      },
    ],
  },
  "hdb-price-prediction": {
    eyebrow: "Project deep dive",
    title: "Predictive Modeling for HDB Prices",
    subtitle:
      "An ML pipeline for Singapore HDB resale price forecasting using careful feature engineering and ensemble modeling.",
    metric: "ML",
    metricLabel: "forecasting pipeline",
    tags: ["Python", "LightGBM", "Pandas", "scikit-learn"],
    sections: [
      {
        title: "Question",
        body:
          "The project explores how location, flat characteristics, time, and market signals can be transformed into a reliable prediction system for resale prices.",
      },
      {
        title: "Approach",
        body:
          "I built a pipeline around EDA, feature engineering, baseline comparison, and a LightGBM plus histogram gradient boosting ensemble to improve RMSE.",
      },
      {
        title: "Outcome",
        body:
          "The final work emphasizes both predictive performance and explainability, with a technical report covering architecture, assumptions, and metrics.",
      },
    ],
  },
  "isd-cia": {
    eyebrow: "Project deep dive",
    title: "ISD-CIA",
    subtitle:
      "A unified B2B Android app for Bajaj dealers and off-role employees, integrating multiple finance businesses into one loan-processing experience.",
    metric: "8",
    metricLabel: "business verticals",
    tags: ["Kotlin", "Jetpack Compose", "MVVM", ".NET APIs"],
    sections: [
      {
        title: "Context",
        body:
          "Dealers needed a consolidated app for finance workflows that previously lived across fragmented surfaces and business-specific processes.",
      },
      {
        title: "Build",
        body:
          "The product unified car, tractor, commercial vehicle, solar, and other finance journeys with Android UI, MVVM structure, and backend API integration.",
      },
      {
        title: "Impact",
        body:
          "The app shipped to 5K+ dealers and helped streamline end-to-end loan processing across multiple business lines.",
      },
    ],
  },
  bunkerfit: {
    eyebrow: "Project deep dive",
    title: "Bunkerfit",
    subtitle:
      "A health and wellness app spanning training, nutrition, yoga, and mindfulness, built during an internship phase.",
    metric: "100K+",
    metricLabel: "downloads",
    tags: ["Flutter", "Dart", "REST"],
    sections: [
      {
        title: "Product",
        body:
          "Bunkerfit aimed to bring multiple wellness journeys into one app experience, requiring approachable UI and reliable cross-platform behavior.",
      },
      {
        title: "Contribution",
        body:
          "I worked on Flutter migration and OAuth exploration, helping improve the app’s interface performance and authentication direction.",
      },
      {
        title: "Learning",
        body:
          "The project sharpened my understanding of consumer app polish, mobile performance, and cross-platform delivery trade-offs.",
      },
    ],
  },
  wittrade: {
    eyebrow: "Project deep dive",
    title: "Wittrade",
    subtitle:
      "A college e-commerce concept for students to buy, rent, and sell items within a campus community.",
    metric: "Campus",
    metricLabel: "marketplace",
    tags: ["Flutter", "Firebase"],
    sections: [
      {
        title: "Idea",
        body:
          "Students often need temporary access to books, devices, and everyday items. Wittrade made that exchange more local and cost-conscious.",
      },
      {
        title: "Build",
        body:
          "The app used Flutter for the interface and Firebase for backend needs, supporting listing, discovery, and student-to-student exchange flows.",
      },
      {
        title: "Product Thinking",
        body:
          "This was a compact exercise in community marketplaces, trust, and designing around repeated lightweight transactions.",
      },
    ],
  },
  "health-app": {
    eyebrow: "Project deep dive",
    title: "Health App",
    subtitle:
      "An Android health utility covering e-prescriptions, medicine alerts, appointment reminders, QR medical records, and BMI calculation.",
    metric: "Android",
    metricLabel: "native app",
    tags: ["Java", "Android"],
    sections: [
      {
        title: "Scope",
        body:
          "The app bundled practical health utilities into one mobile experience, focused on reminders, records, and simple patient-facing workflows.",
      },
      {
        title: "Features",
        body:
          "It included e-prescription handling, medicine notifications, appointment alerts, QR-based medical record access, and BMI calculation.",
      },
      {
        title: "Foundation",
        body:
          "This project helped establish my early Android fundamentals and interest in building useful software around real human routines.",
      },
    ],
  },
};

function ProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  return (
    <TiltCard
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen();
        }
      }}
      className="surface flex h-full cursor-pointer flex-col"
    >
      {project.images?.length ? (
        <div className="mb-7 grid gap-4 md:grid-cols-[1.05fr_0.95fr]">
          {project.images.map((image, imageIndex) => (
            <div
              key={image}
              className={`hover-magnify relative overflow-hidden rounded-lg border border-border bg-bg hover:border-accent ${
                imageIndex === 0 ? "aspect-[16/10]" : "aspect-[16/10] md:translate-y-8"
              }`}
            >
              <Image
                src={image}
                alt={`${project.title} screenshot ${imageIndex + 1}`}
                fill
                sizes="(min-width: 768px) 520px, 100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      ) : null}
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent">{project.year} · {project.role}</p>
          <h3 className="mt-4 text-2xl font-semibold tracking-tight text-fg">{project.title}</h3>
        </div>
        {project.demo ? (
          <a
            href={project.demo}
            onClick={(event) => event.stopPropagation()}
            aria-label={`Open ${project.title} live demo`}
            className="rounded-full border border-border p-2 text-fg-muted transition hover:border-accent hover:text-accent"
          >
            <ArrowUpRight size={20} />
          </a>
        ) : (
          <ArrowUpRight className="shrink-0 text-fg-muted transition group-hover:text-accent" size={22} />
        )}
      </div>
      <p className="mt-5 text-sm leading-7 text-fg-muted md:text-base">{project.blurb}</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {project.stack.map((item) => (
          <span key={item} className="hover-magnify-sm rounded-full border border-border bg-bg/70 px-3 py-1 text-xs text-fg-muted hover:border-accent hover:text-fg">{item}</span>
        ))}
      </div>
      <div className="mt-7 grid gap-3">
        {(projectSignals[project.slug] ?? project.highlights).map((signal, signalIndex) => (
          <div key={signal} className="hover-magnify flex items-center gap-3 rounded-lg border border-border bg-bg/55 px-3 py-2 hover:border-accent">
            <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-[11px] ${signalAccents[signalIndex % signalAccents.length]}`}>
              0{signalIndex + 1}
            </span>
            <span className="text-sm text-fg-muted">{signal}</span>
          </div>
        ))}
      </div>
      {project.repo || project.demo ? (
        <div className="mt-6 flex flex-wrap gap-3">
          {project.demo ? (
            <a href={project.demo} onClick={(event) => event.stopPropagation()} className="rounded-full border border-accent bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-highlight">
              Live demo
            </a>
          ) : null}
          {project.repo ? (
            <a href={project.repo} onClick={(event) => event.stopPropagation()} className="rounded-full border border-border px-4 py-2 text-sm font-medium text-fg transition hover:border-accent hover:text-accent">
              GitHub
            </a>
          ) : null}
        </div>
      ) : null}
      <OpenHint>Open case card</OpenHint>
    </TiltCard>
  );
}

type ProjectsProps = {
  projects: Project[];
};

export function Projects({ projects }: ProjectsProps) {
  const [selected, setSelected] = useState<DetailModalContent | null>(null);
  const open = (slug: string) => setSelected(projectDetails[slug] ?? null);

  return (
    <section id="projects" className="mx-auto max-w-6xl px-6 py-24 md:px-10 md:py-32">
      <Reveal>
        <SectionHeading
          eyebrow="Projects"
          title="Selected work across AI, finance, mobile, and secure platforms."
          copy="A bento-style overview of the systems and products that best represent my range."
        />
      </Reveal>
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project, index) => (
          <Reveal
            key={project.slug}
            delay={index * 0.05}
            className={project.slug === "equal-miles" ? "md:col-span-2" : ""}
          >
            <ProjectCard project={project} onOpen={() => open(project.slug)} />
          </Reveal>
        ))}
      </div>
      <DetailModal content={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
