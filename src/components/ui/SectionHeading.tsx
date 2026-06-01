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
    <div className="mb-6 max-w-4xl">
      <p className="font-mono text-xl font-semibold uppercase tracking-[0.22em] text-accent sm:text-2xl md:text-3xl">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-4xl font-semibold leading-[1.05] tracking-tight text-fg sm:text-5xl md:text-6xl lg:text-7xl">
        {title}
      </h2>
      {copy ? (
        <p className="mt-4 text-lg leading-8 text-fg-muted md:text-xl">{copy}</p>
      ) : null}
    </div>
  );
}
