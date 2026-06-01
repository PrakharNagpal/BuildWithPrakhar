import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TiltCard } from "@/components/ui/TiltCard";
import type { SkillGroup } from "@/types/portfolio";

type SkillsProps = {
  skills: SkillGroup[];
};

export function Skills({ skills }: SkillsProps) {
  return (
    <section id="skills" className="border-y border-border bg-bg-elev/40 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <Reveal>
          <SectionHeading
            eyebrow="Skills"
            title="A toolkit for shipping robust, modern software."
            copy="The stack spans frontend craft, mobile products, backend systems, AI workflows, and security-aware delivery."
          />
        </Reveal>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {skills.map((group, index) => (
            <Reveal key={group.group} delay={index * 0.05}>
              <TiltCard className="surface h-full">
                <h3 className="text-lg font-semibold text-fg">{group.group}</h3>
                <div className="mt-5 flex flex-wrap gap-2">
                  {group.items.map((skill) => (
                    <span key={skill} className="hover-magnify-sm rounded-full border border-border px-3 py-1.5 text-sm text-fg-muted hover:border-accent hover:text-fg">
                      {skill}
                    </span>
                  ))}
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
