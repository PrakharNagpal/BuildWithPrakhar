export function SectionHeading({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: string;
  copy?: string;
}) {
  return (
    <div className="mb-10 max-w-3xl">
      <p className="font-mono text-xs uppercase tracking-[0.28em] text-accent">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-fg md:text-5xl">
        {title}
      </h2>
      {copy ? <p className="mt-4 text-base leading-8 text-fg-muted md:text-lg">{copy}</p> : null}
    </div>
  );
}
