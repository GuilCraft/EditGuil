import { ArrowUpRight, Play } from "lucide-react";
import { useSection } from "@/lib/content";
import { resolveImage } from "@/lib/api";

export default function PortfolioGrid() {
  const d = useSection("projects");
  const items = d?.items || [];
  if (items.length === 0) return null;

  return (
    <section
      id="work"
      data-testid="portfolio-section"
      className="py-24 md:py-32 max-w-[1440px] mx-auto px-6 md:px-12"
    >
      <div className="flex items-end justify-between mb-14">
        <div>
          <p className="font-mono-label text-[10px] text-muted-foreground mb-4">04 — Travaux sélectionnés</p>
          <h2 className="font-serif-display text-5xl md:text-7xl tracking-tight">
            Quelques cuts<br />
            <span className="italic text-muted-foreground">récents</span>.
          </h2>
        </div>
        <a
          href="#contact"
          className="hidden md:flex font-mono-label text-[10px] text-muted-foreground hover:text-foreground items-center gap-2 link-underline"
        >
          Voir plus sur demande
          <ArrowUpRight size={14} strokeWidth={1.5} />
        </a>
      </div>

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {items.map((p, i) => {
          const Wrapper = p.youtube_url ? "a" : "article";
          const wrapperProps = p.youtube_url
            ? { href: p.youtube_url, target: "_blank", rel: "noopener noreferrer" }
            : {};
          return (
            <Wrapper
              key={p.id || i}
              data-testid={`project-${p.id || i}`}
              {...wrapperProps}
              className={`portfolio-item group relative overflow-hidden border border-border bg-card ${p.span || "col-span-12 md:col-span-4"}`}
            >
              <div className={`relative ${p.aspect || "aspect-[4/5]"} overflow-hidden`}>
                {p.image && (
                  <img src={resolveImage(p.image)} alt={p.title} className="w-full h-full object-cover" />
                )}
                <div className="absolute top-3 left-3 w-3 h-3 border-l border-t border-foreground/70 z-10" />
                <div className="absolute top-3 right-3 w-3 h-3 border-r border-t border-foreground/70 z-10" />
                <div className="absolute bottom-3 left-3 w-3 h-3 border-l border-b border-foreground/70 z-10" />
                <div className="absolute bottom-3 right-3 w-3 h-3 border-r border-b border-foreground/70 z-10" />
                <div className="absolute top-3 inset-x-3 flex items-center justify-between font-mono-label text-[9px] text-foreground/80">
                  <span>● {String(p.type || "").toUpperCase()}</span>
                  <span>{p.duration}</span>
                </div>
                {p.youtube_url && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 border border-foreground/80 backdrop-blur-md bg-black/30 flex items-center justify-center">
                      <Play size={20} strokeWidth={1.25} fill="currentColor" className="ml-0.5" />
                    </div>
                  </div>
                )}
              </div>
              <div className="p-5 border-t border-border flex items-end justify-between gap-4">
                <div>
                  <p className="font-mono-label text-[9px] text-muted-foreground mb-2">
                    {String(i + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")} — {p.client}
                  </p>
                  <h3 className="font-serif-display text-2xl md:text-3xl leading-tight">{p.title}</h3>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-mono-label text-[9px] text-muted-foreground">Vues</p>
                  <p className="font-serif-display text-xl md:text-2xl">{p.views}</p>
                </div>
              </div>
            </Wrapper>
          );
        })}
      </div>
    </section>
  );
}
