import { useSection } from "@/lib/content";

export default function Marquee() {
  const d = useSection("marquee");
  const items = d?.items || [];
  if (items.length === 0) return null;
  const loop = [...items, ...items];
  return (
    <section data-testid="marquee-section" className="border-y border-border py-6 overflow-hidden bg-card/40">
      <div className="flex marquee-track gap-12 whitespace-nowrap">
        {loop.map((it, i) => (
          <div key={i} className="flex items-center gap-12 shrink-0">
            <span className="font-serif-display italic text-2xl md:text-3xl text-foreground">{it}</span>
            <span className="font-mono-label text-[10px] text-muted-foreground">◆</span>
          </div>
        ))}
      </div>
    </section>
  );
}
