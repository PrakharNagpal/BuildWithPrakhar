import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Profile } from "@/types/portfolio";

type AboutProps = {
  profile: Profile;
};

export function About({ profile }: AboutProps) {
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-24 md:px-10 md:py-32">
      <Reveal>
        <SectionHeading
          eyebrow="About"
          title="Engineering depth with a product-maker's eye."
          copy="I like systems that are measurable, resilient, and pleasant to use."
        />
      </Reveal>
      <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr]">
        <Reveal className="space-y-6 text-base leading-8 text-fg-muted md:text-lg">
          {profile.about.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2">
          {profile.stats.map((stat, index) => (
            <Reveal key={stat.value} delay={index * 0.06}>
              <div className="hover-magnify min-h-36 rounded-lg border border-border bg-bg-elev p-5 hover:border-accent">
                <p className="text-4xl font-semibold text-fg">{stat.value}</p>
                <p className="mt-3 text-sm leading-6 text-fg-muted">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
