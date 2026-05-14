import { useSection } from "@/lib/content";

export default function Services() {
  const d = useSection("services");
  if (!d) return null;
  const items = d.items || [];

  return (
    <section id="services" data-testid="services-section" className="py-24 md:py-32 border-y border-border bg-card/40">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="flex items-end justify-between mb-14">
          <div>
            <p className="font-mono-label text-[10px] text-muted-foreground mb-4">05 — Services</p>
            <h2 className="font-serif-display text-5xl md:text-7xl tracking-tight">
              {d.title_line1}<br />
              <span className="italic text-muted-foreground">{d.title_line2}</span>.
            </h2>
          </div>
          {d.subtitle && (
            <p className="hidden md:block max-w-xs text-sm text-muted-foreground">{d.subtitle}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-l border-t border-border">
          {items.map((s, i) => (
            <div
              key={i}
              data-testid={`service-${s.n}`}
              className="group relative p-8 md:p-10 border-r border-b border-border hover:bg-background transition-colors"
            >
              <p className="font-mono-label text-[10px] text-muted-foreground mb-6">{s.n}</p>
              <h3 className="font-serif-display text-3xl md:text-4xl mb-4 group-hover:italic transition-all">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">{s.desc}</p>
              {s.deliv && (
                <p className="font-mono-label text-[10px] text-foreground/80 pt-4 border-t border-border">
                  Livrable — <span className="text-muted-foreground">{s.deliv}</span>
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
