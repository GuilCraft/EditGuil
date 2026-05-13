const services = [
  {
    n: "01",
    title: "Long-form YouTube",
    desc: "Montage narratif, rythme, B-roll, sound design pour vidéos 8 à 30 min orientées rétention et watchtime.",
    deliv: "Vidéo 1080p/4K",
  },
  {
    n: "02",
    title: "YouTube Shorts",
    desc: "Hook 3 secondes, cuts rapides, sous-titres dynamiques, optimisé pour le scroll vertical et la rediffusion.",
    deliv: "Vertical 1080×1920",
  },
  {
    n: "03",
    title: "Vlog cinématique",
    desc: "Color grading film, transitions invisibles, musique soigneusement choisie pour une vibe premium.",
    deliv: "Master ProRes + H.264",
  },
  {
    n: "04",
    title: "Motion graphics",
    desc: "Titrages, lower-thirds, animations infographiques et brand assets pour renforcer ton identité visuelle.",
    deliv: "After Effects",
  },
  {
    n: "05",
    title: "Thumbnails strategy",
    desc: "Concept de miniatures CTR-first, A/B testing, alignement titre/visuel pour maximiser le clic.",
    deliv: "3 variantes / vidéo",
  },
  {
    n: "06",
    title: "Stratégie de chaîne",
    desc: "Audit, recommandations format & narration, intro/outro packs, identité éditoriale cohérente.",
    deliv: "Rapport + 1 call",
  },
];

export default function Services() {
  return (
    <section
      id="services"
      data-testid="services-section"
      className="py-24 md:py-32 border-y border-border bg-card/40"
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="flex items-end justify-between mb-14">
          <div>
            <p className="font-mono-label text-[10px] text-muted-foreground mb-4">
              05 — Services
            </p>
            <h2 className="font-serif-display text-5xl md:text-7xl tracking-tight">
              Ce que je
              <br />
              <span className="italic text-muted-foreground">livre</span>.
            </h2>
          </div>
          <p className="hidden md:block max-w-xs text-sm text-muted-foreground">
            Des prestations pensées pour les créateurs et marques qui veulent grandir
            sur YouTube avec un montage qui sort du lot.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-l border-t border-border">
          {services.map((s) => (
            <div
              key={s.n}
              data-testid={`service-${s.n}`}
              className="group relative p-8 md:p-10 border-r border-b border-border hover:bg-background transition-colors"
            >
              <p className="font-mono-label text-[10px] text-muted-foreground mb-6">
                {s.n}
              </p>
              <h3 className="font-serif-display text-3xl md:text-4xl mb-4 group-hover:italic transition-all">
                {s.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                {s.desc}
              </p>
              <p className="font-mono-label text-[10px] text-foreground/80 pt-4 border-t border-border">
                Livrable — <span className="text-muted-foreground">{s.deliv}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
