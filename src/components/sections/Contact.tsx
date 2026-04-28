"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Code2, Link2, Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Profile } from "@/types/portfolio";

const schema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.string().email("Please enter a valid email."),
  message: z.string().min(10, "Message should be at least 10 characters.").max(1000),
  website: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

type ContactProps = {
  profile: Profile;
};

export function Contact({ profile }: ContactProps) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { website: "" } });

  const onSubmit = async (values: FormValues) => {
    setStatus("idle");
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      setStatus("error");
      return;
    }

    reset();
    setStatus("success");
  };

  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 py-24 md:px-10 md:py-32">
      <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <SectionHeading
            eyebrow="Contact"
            title="Let's build something ambitious."
            copy="I am open to software engineering, AI engineering, and systems-focused opportunities."
          />
          <div className="space-y-3 text-sm text-fg-muted">
            <a className="flex items-center gap-3 transition hover:text-accent" href={`mailto:${profile.email}`}><Mail size={17} />{profile.email}</a>
            <a className="flex items-center gap-3 transition hover:text-accent" href={profile.linkedin}><Link2 size={17} />LinkedIn</a>
            <a className="flex items-center gap-3 transition hover:text-accent" href={profile.github}><Code2 size={17} />GitHub</a>
          </div>
          <div className="mt-8">
            <MagneticButton href={`mailto:${profile.email}`} variant="secondary">Email directly</MagneticButton>
          </div>
        </Reveal>

        <Reveal>
          <form onSubmit={handleSubmit(onSubmit)} className="rounded-lg border border-border bg-bg-elev p-6">
            <input type="text" tabIndex={-1} autoComplete="off" className="hidden" {...register("website")} />
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="space-y-2 text-sm">
                <span className="text-fg">Name</span>
                <input className="h-12 w-full rounded-lg border border-border bg-bg px-4 text-fg transition focus:border-accent" {...register("name")} />
                {errors.name ? <span className="text-xs text-highlight">{errors.name.message}</span> : null}
              </label>
              <label className="space-y-2 text-sm">
                <span className="text-fg">Email</span>
                <input className="h-12 w-full rounded-lg border border-border bg-bg px-4 text-fg transition focus:border-accent" {...register("email")} />
                {errors.email ? <span className="text-xs text-highlight">{errors.email.message}</span> : null}
              </label>
            </div>
            <label className="mt-5 block space-y-2 text-sm">
              <span className="text-fg">Message</span>
              <textarea rows={7} className="w-full resize-none rounded-lg border border-border bg-bg px-4 py-3 text-fg transition focus:border-accent" {...register("message")} />
              {errors.message ? <span className="text-xs text-highlight">{errors.message.message}</span> : null}
            </label>
            <button type="submit" disabled={isSubmitting} className="mt-5 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-accent px-6 text-sm font-medium text-white transition hover:bg-highlight disabled:cursor-not-allowed disabled:opacity-60">
              {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : null}
              Send message
            </button>
            {status === "success" ? <p className="mt-4 text-sm text-accent">Message sent. I will get back to you soon.</p> : null}
            {status === "error" ? <p className="mt-4 text-sm text-highlight">Could not send right now. Email me directly instead.</p> : null}
          </form>
        </Reveal>
      </div>
    </section>
  );
}
