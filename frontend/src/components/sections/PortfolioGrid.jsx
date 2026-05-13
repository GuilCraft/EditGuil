import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    id: 1,
    title: "Vlog cinématique",
    client: "Lifestyle creator",
    type: "Long-form",
    views: "1.2M",
    duration: "14:22",
    image:
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1200&auto=format&fit=crop",
    span: "col-span-12 md:col-span-8 row-span-2",
    aspect: "aspect-[16/10]",
  },
  {
    id: 2,
    title: "Gaming highlight",
    client: "FPS creator",
    type: "Short",
    views: "640K",
    duration: "0:58",
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop",
    span: "col-span-12 md:col-span-4",
    aspect: "aspect-[4/5]",
  },
  {
    id: 3,
    title: "Tech review",
    client: "Tech reviewer",
    type: "Long-form",
    views: "320K",
    duration: "09:41",
    image:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1200&auto=format&fit=crop",
    span: "col-span-12 md:col-span-4",
    aspect: "aspect-[4/5]",
  },
  {
    id: 4,
    title: "Documentary cut",
    client: "Travel channel",
    type: "Long-form",
    views: "890K",
    duration: "21:08",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
    span: "col-span-12 md:col-span-5",
    aspect: "aspect-[16/10]",
  },
  {
    id: 5,
    title: "Brand storytelling",
    client: "DTC brand",
    type: "Promo",
    views: "240K",
    duration: "02:12",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop",
    span: "col-span-12 md:col-span-7",
    aspect: "aspect-[16/9]",
  },
  {
    id: 6,
    title: "Music vlog",
    client: "Music creator",
    type: "Short",
    views: "1.8M",
    duration: "0:42",
    image:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop",
    span: "col-span-12 md:col-span-4",
    aspect: "aspect-[4/5]",
  },
  {
    id: 7,
    title: "Fitness series",
    client: "Wellness coach",
    type: "Long-form",
    views: "510K",
    duration: "12:34",
    image:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1200&auto=format&fit=crop",
    span: "col-span-12 md:col-span-8",
    aspect: "aspect-[16/9]",
  },
];

export default function PortfolioGrid() {
  return (
    <section
      id="work"
      data-testid="portfolio-section"
      className="py-24 md:py-32 max-w-[1440px] mx-auto px-6 md:px-12"
    >
      <div className="flex items-end justify-between mb-14">
        <div>
          <p className="font-mono-label text-[10px] text-muted-foreground mb-4">
            04 — Travaux sélectionnés
          </p>
          <h2 className="font-serif-display text-5xl md:text-7xl tracking-tight">
            Quelques cuts
            <br />
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
        {projects.map((p) => (
          <article
            key={p.id}
            data-testid={`project-${p.id}`}
            className={`portfolio-item group relative overflow-hidden border border-border bg-card ${p.span}`}
          >
            <div className={`relative ${p.aspect} overflow-hidden`}>
              <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
              {/* Corner frame */}
              <div className="absolute top-3 left-3 w-3 h-3 border-l border-t border-foreground/70 z-10" />
              <div className="absolute top-3 right-3 w-3 h-3 border-r border-t border-foreground/70 z-10" />
              <div className="absolute bottom-3 left-3 w-3 h-3 border-l border-b border-foreground/70 z-10" />
              <div className="absolute bottom-3 right-3 w-3 h-3 border-r border-b border-foreground/70 z-10" />

              {/* Top label */}
              <div className="absolute top-3 inset-x-3 flex items-center justify-between font-mono-label text-[9px] text-foreground/80">
                <span>● {p.type.toUpperCase()}</span>
                <span>{p.duration}</span>
              </div>
            </div>

            {/* Caption */}
            <div className="p-5 border-t border-border flex items-end justify-between gap-4">
              <div>
                <p className="font-mono-label text-[9px] text-muted-foreground mb-2">
                  {String(p.id).padStart(2, "0")} / {String(projects.length).padStart(2, "0")} — {p.client}
                </p>
                <h3 className="font-serif-display text-2xl md:text-3xl leading-tight">
                  {p.title}
                </h3>
              </div>
              <div className="text-right shrink-0">
                <p className="font-mono-label text-[9px] text-muted-foreground">Vues</p>
                <p className="font-serif-display text-xl md:text-2xl">{p.views}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
