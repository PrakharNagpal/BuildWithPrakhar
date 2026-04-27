import { Code2, Link2, Mail } from "lucide-react";
import { profile } from "@/data/profile";

export function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 text-sm text-fg-muted md:flex-row md:items-center md:justify-between md:px-10">
        <p>© 2026 Prakhar Nagpal. Built with Next.js, Three.js, and careful taste.</p>
        <div className="flex gap-3">
          <a aria-label="Email" href={`mailto:${profile.email}`} className="rounded-full border border-border p-2 transition hover:border-accent hover:text-accent">
            <Mail size={17} />
          </a>
          <a aria-label="LinkedIn" href={profile.linkedin} className="rounded-full border border-border p-2 transition hover:border-accent hover:text-accent">
            <Link2 size={17} />
          </a>
          <a aria-label="GitHub" href={profile.github} className="rounded-full border border-border p-2 transition hover:border-accent hover:text-accent">
            <Code2 size={17} />
          </a>
        </div>
      </div>
    </footer>
  );
}
