"use client";

import {
  Award,
  BriefcaseBusiness,
  CirclePlus,
  GraduationCap,
  GripVertical,
  Layers3,
  LogOut,
  Save,
  Trash2,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useMemo, useState } from "react";
import type { AdminPortfolioData } from "@/server/admin";

type Project = AdminPortfolioData["projects"][number];
type Experience = AdminPortfolioData["experience"][number];
type Skill = AdminPortfolioData["skills"][number];
type Stat = AdminPortfolioData["profile"]["stats"][number];

const emptyProject: Project = {
  slug: "",
  title: "",
  year: "",
  blurb: "",
  stack: [],
  highlights: [],
  role: "",
  featured: false,
  repo: "",
  demo: "",
  images: [],
};

const emptyExperience: Experience = {
  role: "",
  company: "",
  location: "",
  period: "",
  bullets: [],
  tags: [],
};

const emptySkill: Skill = {
  group: "",
  items: [],
};

function lines(value: string[]) {
  return value.join("\n");
}

function parseLines(value: string) {
  return value.split("\n").map((item) => item.trim()).filter(Boolean);
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-fg-muted">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg"
      />
    </label>
  );
}

function Area({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-fg-muted">
        {label}
      </span>
      <textarea
        value={lines(value)}
        onChange={(event) => onChange(parseLines(event.target.value))}
        rows={rows}
        className="w-full resize-y rounded-md border border-border bg-bg px-3 py-2 text-sm leading-6 text-fg"
      />
    </label>
  );
}

function Section({
  id,
  title,
  icon,
  children,
}: {
  id: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="border-b border-border py-8 last:border-b-0">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-bg-elev text-accent">
          {icon}
        </div>
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export function AdminDashboard({ initialData }: { initialData: AdminPortfolioData }) {
  const router = useRouter();
  const [data, setData] = useState(initialData);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const counts = useMemo(() => ({
    projects: data.projects.length,
    experience: data.experience.length,
    skills: data.skills.reduce((total, group) => total + group.items.length, 0),
  }), [data]);

  function updateProfile<K extends keyof AdminPortfolioData["profile"]>(
    key: K,
    value: AdminPortfolioData["profile"][K],
  ) {
    setData((current) => ({
      ...current,
      profile: { ...current.profile, [key]: value },
    }));
  }

  function updateProject(index: number, next: Partial<Project>) {
    setData((current) => ({
      ...current,
      projects: current.projects.map((project, itemIndex) => (
        itemIndex === index ? { ...project, ...next } : project
      )),
    }));
  }

  function updateExperience(index: number, next: Partial<Experience>) {
    setData((current) => ({
      ...current,
      experience: current.experience.map((item, itemIndex) => (
        itemIndex === index ? { ...item, ...next } : item
      )),
    }));
  }

  function updateSkill(index: number, next: Partial<Skill>) {
    setData((current) => ({
      ...current,
      skills: current.skills.map((skill, itemIndex) => (
        itemIndex === index ? { ...skill, ...next } : skill
      )),
    }));
  }

  function updateStat(index: number, next: Partial<Stat>) {
    updateProfile("stats", data.profile.stats.map((stat, itemIndex) => (
      itemIndex === index ? { ...stat, ...next } : stat
    )));
  }

  function removeFrom<K extends "projects" | "experience" | "skills">(key: K, index: number) {
    setData((current) => ({
      ...current,
      [key]: current[key].filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  async function save() {
    setSaving(true);
    setMessage("");

    const response = await fetch("/api/admin/portfolio", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const body = await response.json().catch(() => null);

    if (!response.ok) {
      setMessage(body?.error ?? "Save failed");
      setSaving(false);
      return;
    }

    setData(body.portfolio);
    setMessage("Saved");
    setSaving(false);
    router.refresh();
  }

  async function logout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-bg text-fg">
      <header className="sticky top-0 z-30 border-b border-border bg-bg/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Portfolio admin
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">Content dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            {message ? <p className="hidden text-sm font-medium text-fg-muted sm:block">{message}</p> : null}
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="inline-flex h-10 items-center gap-2 rounded-md bg-fg px-4 text-sm font-semibold text-bg disabled:opacity-60"
            >
              <Save size={16} />
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={logout}
              className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-bg-elev px-3 text-sm font-medium text-fg"
              aria-label="Sign out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-6 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <nav className="sticky top-24 space-y-1">
            {[
              ["Profile", "#profile"],
              ["Projects", "#projects"],
              ["Experience", "#experience"],
              ["Skills", "#skills"],
            ].map(([label, href]) => (
              <a key={href} href={href} className="block rounded-md px-3 py-2 text-sm text-fg-muted hover:bg-bg-elev hover:text-fg">
                {label}
              </a>
            ))}
          </nav>
        </aside>

        <main className="rounded-md border border-border bg-bg-elev/70 px-5 sm:px-7">
          <div className="grid gap-3 border-b border-border py-5 sm:grid-cols-3">
            <div className="rounded-md border border-border bg-bg p-4">
              <p className="text-2xl font-semibold">{counts.projects}</p>
              <p className="text-sm text-fg-muted">Projects</p>
            </div>
            <div className="rounded-md border border-border bg-bg p-4">
              <p className="text-2xl font-semibold">{counts.experience}</p>
              <p className="text-sm text-fg-muted">Experience entries</p>
            </div>
            <div className="rounded-md border border-border bg-bg p-4">
              <p className="text-2xl font-semibold">{counts.skills}</p>
              <p className="text-sm text-fg-muted">Skills</p>
            </div>
          </div>

          <Section id="profile" title="Profile" icon={<UserRound size={18} />}>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Name" value={data.profile.name} onChange={(value) => updateProfile("name", value)} />
              <Field label="Title" value={data.profile.title} onChange={(value) => updateProfile("title", value)} />
              <Field label="Location" value={data.profile.location} onChange={(value) => updateProfile("location", value)} />
              <Field label="Email" value={data.profile.email} onChange={(value) => updateProfile("email", value)} type="email" />
              <Field label="Phone" value={data.profile.phone} onChange={(value) => updateProfile("phone", value)} />
              <Field label="LinkedIn" value={data.profile.linkedin} onChange={(value) => updateProfile("linkedin", value)} />
              <Field label="GitHub" value={data.profile.github} onChange={(value) => updateProfile("github", value)} />
              <div className="md:col-span-2">
                <Field
                  label="Resume Google Drive URL"
                  value={data.profile.resumeUrl ?? ""}
                  onChange={(value) => updateProfile("resumeUrl", value)}
                />
              </div>
              <div className="md:col-span-2">
                <Field label="Tagline" value={data.profile.tagline} onChange={(value) => updateProfile("tagline", value)} />
              </div>
              <div className="md:col-span-2">
                <Area label="About" value={data.profile.about} onChange={(value) => updateProfile("about", value)} rows={6} />
              </div>
              <Area label="Education" value={data.profile.education} onChange={(value) => updateProfile("education", value)} />
              <Area label="Awards" value={data.profile.awards} onChange={(value) => updateProfile("awards", value)} />
            </div>

            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <GraduationCap size={16} />
                  Stats
                </h3>
                <button
                  type="button"
                  onClick={() => updateProfile("stats", [...data.profile.stats, { value: "", label: "" }])}
                  className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-bg px-3 text-sm"
                >
                  <CirclePlus size={15} />
                  Add
                </button>
              </div>
              {data.profile.stats.map((stat, index) => (
                <div key={index} className="grid gap-3 rounded-md border border-border bg-bg p-3 md:grid-cols-[1fr_2fr_auto]">
                  <Field label="Value" value={stat.value} onChange={(value) => updateStat(index, { value })} />
                  <Field label="Label" value={stat.label} onChange={(value) => updateStat(index, { label: value })} />
                  <button
                    type="button"
                    onClick={() => updateProfile("stats", data.profile.stats.filter((_, itemIndex) => itemIndex !== index))}
                    className="mt-5 inline-flex h-10 items-center justify-center rounded-md border border-border px-3 text-accent-4"
                    aria-label="Remove stat"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </Section>

          <Section id="projects" title="Projects" icon={<Layers3 size={18} />}>
            <div className="mb-4 flex justify-end">
              <button
                type="button"
                onClick={() => setData((current) => ({ ...current, projects: [...current.projects, emptyProject] }))}
                className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-bg px-3 text-sm"
              >
                <CirclePlus size={15} />
                Add project
              </button>
            </div>
            <div className="space-y-4">
              {data.projects.map((project, index) => (
                <div key={project.id ?? index} className="rounded-md border border-border bg-bg p-4">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2">
                      <GripVertical size={16} className="shrink-0 text-fg-muted" />
                      <h3 className="truncate text-base font-semibold">{project.title || "Untitled project"}</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFrom("projects", index)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-accent-4"
                      aria-label="Remove project"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Title" value={project.title} onChange={(value) => updateProject(index, { title: value })} />
                    <Field label="Slug" value={project.slug} onChange={(value) => updateProject(index, { slug: value })} />
                    <Field label="Year" value={project.year} onChange={(value) => updateProject(index, { year: value })} />
                    <Field label="Role" value={project.role} onChange={(value) => updateProject(index, { role: value })} />
                    <Field label="Repo" value={project.repo ?? ""} onChange={(value) => updateProject(index, { repo: value })} />
                    <Field label="Demo" value={project.demo ?? ""} onChange={(value) => updateProject(index, { demo: value })} />
                    <label className="flex items-center gap-3 rounded-md border border-border bg-bg-elev px-3 py-2 text-sm font-medium">
                      <input
                        type="checkbox"
                        checked={project.featured}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => updateProject(index, { featured: event.target.checked })}
                        className="h-4 w-4 accent-fg"
                      />
                      Featured
                    </label>
                    <div className="md:col-span-2">
                      <Field label="Blurb" value={project.blurb} onChange={(value) => updateProject(index, { blurb: value })} />
                    </div>
                    <Area label="Stack" value={project.stack} onChange={(value) => updateProject(index, { stack: value })} />
                    <Area label="Highlights" value={project.highlights} onChange={(value) => updateProject(index, { highlights: value })} />
                    <div className="md:col-span-2">
                      <Area label="Images" value={project.images ?? []} onChange={(value) => updateProject(index, { images: value })} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section id="experience" title="Experience" icon={<BriefcaseBusiness size={18} />}>
            <div className="mb-4 flex justify-end">
              <button
                type="button"
                onClick={() => setData((current) => ({ ...current, experience: [...current.experience, emptyExperience] }))}
                className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-bg px-3 text-sm"
              >
                <CirclePlus size={15} />
                Add experience
              </button>
            </div>
            <div className="space-y-4">
              {data.experience.map((item, index) => (
                <div key={item.id ?? index} className="rounded-md border border-border bg-bg p-4">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h3 className="truncate text-base font-semibold">{item.role || "Untitled role"}</h3>
                    <button
                      type="button"
                      onClick={() => removeFrom("experience", index)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-accent-4"
                      aria-label="Remove experience"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Role" value={item.role} onChange={(value) => updateExperience(index, { role: value })} />
                    <Field label="Company" value={item.company} onChange={(value) => updateExperience(index, { company: value })} />
                    <Field label="Location" value={item.location} onChange={(value) => updateExperience(index, { location: value })} />
                    <Field label="Period" value={item.period} onChange={(value) => updateExperience(index, { period: value })} />
                    <Area label="Bullets" value={item.bullets} onChange={(value) => updateExperience(index, { bullets: value })} />
                    <Area label="Tags" value={item.tags} onChange={(value) => updateExperience(index, { tags: value })} />
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section id="skills" title="Skills" icon={<Award size={18} />}>
            <div className="mb-4 flex justify-end">
              <button
                type="button"
                onClick={() => setData((current) => ({ ...current, skills: [...current.skills, emptySkill] }))}
                className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-bg px-3 text-sm"
              >
                <CirclePlus size={15} />
                Add group
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {data.skills.map((skill, index) => (
                <div key={skill.id ?? index} className="rounded-md border border-border bg-bg p-4">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h3 className="truncate text-base font-semibold">{skill.group || "Untitled group"}</h3>
                    <button
                      type="button"
                      onClick={() => removeFrom("skills", index)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-accent-4"
                      aria-label="Remove skill group"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <Field label="Group" value={skill.group} onChange={(value) => updateSkill(index, { group: value })} />
                    <Area label="Items" value={skill.items} onChange={(value) => updateSkill(index, { items: value })} rows={7} />
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </main>
      </div>
    </div>
  );
}
