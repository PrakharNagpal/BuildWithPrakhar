"use client";

import { useState } from "react";
import { DetailModal, type DetailModalContent, OpenHint } from "@/components/ui/DetailModal";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { ExperienceItem } from "@/types/portfolio";

const experienceStories = [
  {
    mission: "Owned the high-stakes platform layer for a multi-business B2B app, balancing InfoSec constraints, dealer workflows, and peak-season pressure.",
    proof: "The work connected 8 verticals, migrated 80K+ users with zero downtime, and kept .NET APIs steady at 1M+ daily hits.",
    metric: "80K+",
    metricLabel: "users migrated",
  },
  {
    mission: "Shipped finance product lines inside mobile experiences used daily by dealers, field teams, and business operators.",
    proof: "Latency dropped 25%, seasonal engagement improved through Firebase-led campaigns, and business launches pushed peak DAU beyond 50K.",
    metric: "50K+",
    metricLabel: "peak DAU",
  },
  {
    mission: "Moved from trainee to production contributor by working on secure onboarding, biometric verification, and approval workflows.",
    proof: "Face-auth and e-KYC pipelines reached 100K+ customers while approval time improved by 30%.",
    metric: "30%",
    metricLabel: "faster approvals",
  },
  {
    mission: "Helped modernize a health and wellness product while exploring identity flows and cross-platform app performance.",
    proof: "Built an OAuth 2.0 proof of concept and supported the migration path from native Android to Flutter.",
    metric: "30%",
    metricLabel: "UI performance gain",
  },
  {
    mission: "Built product surfaces for a children’s mental wellness platform with a focus on clean, reusable Flutter UI.",
    proof: "Contributed widgets and screens for Pupl.io during an early product-building internship.",
    metric: "UI",
    metricLabel: "Flutter delivery",
  },
] as const;

const experienceDetails: DetailModalContent[] = [
  {
    eyebrow: "Experience deep dive",
    title: "Senior Software Engineer · Bajaj Finserv",
    subtitle:
      "A role centered on platform architecture, secure login redesign, high-throughput APIs, and multi-business app delivery.",
    metric: "1M+",
    metricLabel: "daily API hits",
    tags: [".NET", "InfoSec", "Architecture", "B2B finance"],
    sections: [
      {
        title: "The Challenge",
        body:
          "The B2B platform served dealers and off-roll employees across multiple finance verticals. The work needed to support scale, security, and a fast-changing business roadmap without disrupting existing users.",
      },
      {
        title: "The Build",
        body:
          "I designed the login migration path, aligned the structure with InfoSec expectations, and shipped REST APIs across core modules. The architecture had to absorb seasonal 2x-3x traffic spikes while keeping dealer workflows predictable.",
      },
      {
        title: "The Outcome",
        body:
          "The new login structure reached 80K+ users with zero downtime. API systems handled 1M+ hits per day, and new finance vertical launches helped the app cross 50K daily active users in peak seasons.",
      },
    ],
  },
  {
    eyebrow: "Experience deep dive",
    title: "Software Engineer · Bajaj Finserv",
    subtitle:
      "A production-heavy mobile engineering phase across Android, Flutter, Firebase, and business launch workflows.",
    metric: "25%",
    metricLabel: "latency reduction",
    tags: ["Android", "Kotlin", "Flutter", "Firebase"],
    sections: [
      {
        title: "The Product Surface",
        body:
          "The mobile app supported field teams and dealers who needed fast loan journeys, reliable updates, and seasonal engagement experiences during high-volume windows.",
      },
      {
        title: "The Engineering Work",
        body:
          "I worked on scalable mobile modules, force-update flows, Firebase-led festive campaigns, and finance-line launches across car, tractor, commercial vehicle, and solar products.",
      },
      {
        title: "The Impact",
        body:
          "The app supported 20K+ DAU and 180K+ MAU, latency improved by 25%, and engagement increased during campaign periods while uptime stayed at 99.9%.",
      },
    ],
  },
  {
    eyebrow: "Experience deep dive",
    title: "Byte Trainee Technology · Bajaj Finserv",
    subtitle:
      "A security and workflow-focused entry into production systems, biometric identity, and approval optimization.",
    metric: "100K+",
    metricLabel: "customers reached",
    tags: ["e-KYC", "Biometrics", "Security"],
    sections: [
      {
        title: "The Domain",
        body:
          "Identity verification and approval systems are unforgiving: they need accuracy, traceability, and a smooth path for business users who depend on them daily.",
      },
      {
        title: "The Work",
        body:
          "I contributed to UIDAI biometric and face-auth e-KYC pipelines, optimized approval workflows, and presented engineering ideas through DevTalk 2.0 to senior leadership.",
      },
      {
        title: "The Result",
        body:
          "The pipelines reached 90% accuracy across 100K+ customers, while secure approval time improved by 30% for B2B workflows.",
      },
    ],
  },
  {
    eyebrow: "Experience deep dive",
    title: "Software Development Intern · Bunkerfit",
    subtitle:
      "An internship focused on identity, cross-platform migration, and product performance in a wellness app.",
    metric: "30%",
    metricLabel: "UI performance gain",
    tags: ["Flutter", "OAuth", "REST"],
    sections: [
      {
        title: "The Product",
        body:
          "Bunkerfit brought training, nutrition, yoga, and mindfulness into a consumer wellness experience that needed to feel responsive across platforms.",
      },
      {
        title: "The Contribution",
        body:
          "I integrated an OAuth 2.0 proof of concept and supported the Android-to-Flutter migration path, focusing on cleaner cross-platform UI delivery.",
      },
      {
        title: "The Learning",
        body:
          "This was an early lesson in how authentication, UI performance, and mobile product polish all shape user trust.",
      },
    ],
  },
  {
    eyebrow: "Experience deep dive",
    title: "Flutter Developer Intern · Incend Digital",
    subtitle:
      "A product-building internship for Pupl.io, a children’s mental wellness platform.",
    metric: "Flutter",
    metricLabel: "UI delivery",
    tags: ["Flutter", "Dart", "Product UI"],
    sections: [
      {
        title: "The Context",
        body:
          "Pupl.io needed approachable, reliable mobile UI for a sensitive domain: children’s mental wellness.",
      },
      {
        title: "The Work",
        body:
          "I built widgets and screens with attention to reusable structure, visual clarity, and predictable interaction patterns.",
      },
      {
        title: "The Takeaway",
        body:
          "The internship strengthened my taste for clean component boundaries and user-facing polish early in my engineering path.",
      },
    ],
  },
];

type ExperienceProps = {
  experience: ExperienceItem[];
};

export function Experience({ experience }: ExperienceProps) {
  const [selected, setSelected] = useState<DetailModalContent | null>(null);

  return (
    <section id="experience" className="border-y border-border bg-bg-elev/40 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <Reveal>
          <SectionHeading
            eyebrow="Work"
            title="Built where scale, security, and velocity mattered."
            copy="A timeline of shipped systems, production launches, and measurable business impact."
          />
        </Reveal>
        <div className="relative">
          <div className="absolute left-3 top-2 h-full w-px bg-gradient-to-b from-accent via-highlight to-transparent md:left-1/2" />
          <div className="space-y-8">
            {experience.map((item, index) => (
              <Reveal key={`${item.role}-${item.period}`} delay={index * 0.05}>
                <article className={`relative md:w-[46%] ${index % 2 === 0 ? "md:mr-auto" : "md:ml-auto"}`}>
                  <div className="absolute -left-[1.9rem] top-6 h-3 w-3 rounded-full border border-accent bg-bg md:hidden" />
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelected(experienceDetails[index] ?? null)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelected(experienceDetails[index] ?? null);
                      }
                    }}
                    className="hover-magnify cursor-pointer rounded-lg border border-border bg-bg p-6 shadow-xl shadow-black/5 hover:border-accent"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-fg">{item.role}</h3>
                        <p className="mt-1 text-sm text-fg-muted">{item.company} · {item.location}</p>
                      </div>
                      <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent">{item.period}</p>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-[0.75fr_1fr]">
                      <div className="hover-magnify-sm rounded-lg border border-border bg-bg-elev p-4 hover:border-accent">
                        <p className="text-3xl font-semibold tracking-tight text-fg">
                          {(experienceStories[index] ?? experienceStories[0]).metric}
                        </p>
                        <p className="mt-2 text-xs uppercase tracking-[0.18em] text-fg-muted">
                          {(experienceStories[index] ?? experienceStories[0]).metricLabel}
                        </p>
                      </div>
                      <div className="space-y-3">
                        <p className="text-sm leading-6 text-fg">
                          {(experienceStories[index] ?? experienceStories[0]).mission}
                        </p>
                        <p className="text-sm leading-6 text-fg-muted">
                          {(experienceStories[index] ?? experienceStories[0]).proof}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <span key={tag} className="hover-magnify-sm rounded-full border border-border px-3 py-1 text-xs text-fg-muted hover:border-accent hover:text-fg">{tag}</span>
                      ))}
                    </div>
                    <OpenHint>Open story</OpenHint>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
      <DetailModal content={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
