const items = ["TypeScript", "Kotlin", ".NET", "AI", "NUS", "Bajaj Finserv", "Firebase", "Flutter", "Python", "Security", "React", "REST APIs"];
const accents = ["hover:border-accent", "hover:border-accent-2", "hover:border-accent-3", "hover:border-accent-4"];

export function Marquee() {
  const track = [...items, ...items];

  return (
    <div className="border-y border-border bg-bg-elev/55 py-4">
      <div className="mask-fade overflow-hidden">
        <div className="animate-marquee flex w-max gap-4 hover:[animation-play-state:paused]">
          {track.map((item, index) => (
            <span key={`${item}-${index}`} className={`hover-magnify-sm rounded-full border border-border px-5 py-2 font-mono text-xs uppercase tracking-[0.2em] text-fg-muted hover:text-fg ${accents[index % accents.length]}`}>
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
