import { useSection } from "@/lib/content";

export default function Process() {
  const d = useSection("process");
  if (!d) return null;
  const steps = d.steps || [];

  return (
    <section data-testid="process-section" className="py-24 md:py-32 max-w-[1440px] mx-auto px-6 md:px-12">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4 mb-10 lg:mb-0">
          <p className="font-mono-label text-[10px] text-muted-foreground mb-4">06 — Méthode</p>
          <h2 className="font-serif-display text-5xl md:text-6xl tracking-tight">
            {d.title_line1}<br />
            <span className="italic text-muted-foreground">{d.title_line2}</span>.
          </h2>
          {d.subtitle && <p className="mt-6 max-w-sm text-sm text-muted-foreground">{d.subtitle}</p>}
        </div>

        <div className="col-span-12 lg:col-span-8 border-t border-border">
          {steps.map((s, i) => (
            <div key={i} data-testid={`process-${s.n}`} className="grid grid-cols-12 gap-6 py-8 border-b border-border group hover:bg-card/40 transition-colors">
              <div className="col-span-2 md:col-span-2 font-mono-label text-[10px] text-muted-foreground pt-2">{s.n}</div>
              <h3 className="col-span-10 md:col-span-4 font-serif-display text-2xl md:text-3xl">{s.title}</h3>
              <p className="col-span-12 md:col-span-6 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
