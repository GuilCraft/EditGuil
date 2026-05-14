import { ArrowUpRight, Check } from "lucide-react";
import { useSection } from "@/lib/content";

export default function Pricing() {
  const d = useSection("pricing");
  const items = d?.items || [];
  if (items.length === 0) return null;

  return (
    <section id="pricing" data-testid="pricing-section" className="py-24 md:py-32 max-w-[1440px] mx-auto px-6 md:px-12">
      <div className="flex items-end justify-between mb-14">
        <div>
          <p className="font-mono-label text-[10px] text-muted-foreground mb-4">10 — Tarifs</p>
          <h2 className="font-serif-display text-5xl md:text-7xl tracking-tight">
            Des formules<br />
            <span className="italic text-muted-foreground">claires</span>.
          </h2>
        </div>
        <p className="hidden md:block max-w-xs text-sm text-muted-foreground">
          Indicatif. Chaque projet a sa complexité : on en parle ensemble pour un devis précis.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border">
        {items.map((p, i) => (
          <div
            key={i}
            data-testid={`plan-${p.name?.toLowerCase()}`}
            className={`p-8 md:p-10 flex flex-col gap-6 ${p.highlighted ? "bg-foreground text-background" : "bg-background"}`}
          >
            <div className="flex items-start justify-between">
              <h3 className="font-serif-display text-3xl md:text-4xl">{p.name}</h3>
              {p.highlighted && (
                <span className="font-mono-label text-[9px] px-2 py-1 border border-background/30">Populaire</span>
              )}
            </div>
            <p className={`font-mono-label text-[10px] ${p.highlighted ? "text-background/70" : "text-muted-foreground"}`}>{p.price}</p>
            <p className={`text-sm leading-relaxed ${p.highlighted ? "text-background/80" : "text-muted-foreground"}`}>{p.desc}</p>
            {(p.features || []).length > 0 && (
              <ul className={`space-y-3 text-sm border-t pt-6 mt-2 ${p.highlighted ? "border-background/20" : "border-border"}`}>
                {p.features.map((f, fi) => (
                  <li key={fi} className="flex items-start gap-3">
                    <Check size={14} strokeWidth={1.5} className="mt-1 shrink-0" />
                    <span className={p.highlighted ? "text-background/90" : ""}>{f}</span>
                  </li>
                ))}
              </ul>
            )}
            <a
              href="#contact"
              data-testid={`plan-cta-${p.name?.toLowerCase()}`}
              className={`mt-auto inline-flex items-center justify-between gap-2 px-5 py-4 font-mono-label text-[10px] ${
                p.highlighted
                  ? "bg-background text-foreground hover:bg-card"
                  : "bg-foreground text-background hover:bg-muted-foreground"
              } transition-colors`}
            >
              Demander un devis
              <ArrowUpRight size={14} strokeWidth={1.5} />
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
