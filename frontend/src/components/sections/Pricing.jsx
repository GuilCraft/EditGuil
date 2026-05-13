import { ArrowUpRight, Check } from "lucide-react";

const plans = [
  {
    name: "Short",
    price: "à partir de 80€",
    desc: "YouTube Shorts / Reels / TikTok. Idéal pour booster la portée d'une chaîne existante.",
    features: [
      "Vidéo verticale 60s max",
      "Hook 3 secondes optimisé",
      "Sous-titres dynamiques",
      "Sound design + musique",
      "2 révisions incluses",
    ],
    highlighted: false,
  },
  {
    name: "Long-form",
    price: "à partir de 290€",
    desc: "L'offre principale. Vidéo YouTube 8–20 min, narration & rétention au centre.",
    features: [
      "Montage narratif structuré",
      "B-roll, color grading film",
      "Sound design + musique licenciée",
      "Motion graphics légers",
      "2 révisions incluses",
      "Délai express possible",
    ],
    highlighted: true,
  },
  {
    name: "Abonnement",
    price: "sur devis",
    desc: "Pour les chaînes qui publient régulièrement. Tarif dégressif, slots prioritaires.",
    features: [
      "2 à 8 vidéos / mois",
      "Slot dédié dans le planning",
      "Cohérence éditoriale garantie",
      "Reporting mensuel",
      "Thumbnails inclus",
    ],
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <section
      id="pricing"
      data-testid="pricing-section"
      className="py-24 md:py-32 max-w-[1440px] mx-auto px-6 md:px-12"
    >
      <div className="flex items-end justify-between mb-14">
        <div>
          <p className="font-mono-label text-[10px] text-muted-foreground mb-4">
            10 — Tarifs
          </p>
          <h2 className="font-serif-display text-5xl md:text-7xl tracking-tight">
            Des formules
            <br />
            <span className="italic text-muted-foreground">claires</span>.
          </h2>
        </div>
        <p className="hidden md:block max-w-xs text-sm text-muted-foreground">
          Indicatif. Chaque projet a sa complexité : on en parle ensemble pour un devis
          précis.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border">
        {plans.map((p) => (
          <div
            key={p.name}
            data-testid={`plan-${p.name.toLowerCase()}`}
            className={`p-8 md:p-10 flex flex-col gap-6 ${
              p.highlighted ? "bg-foreground text-background" : "bg-background"
            }`}
          >
            <div className="flex items-start justify-between">
              <h3 className="font-serif-display text-3xl md:text-4xl">{p.name}</h3>
              {p.highlighted && (
                <span className={`font-mono-label text-[9px] px-2 py-1 border ${p.highlighted ? "border-background/30" : "border-border"}`}>
                  Populaire
                </span>
              )}
            </div>
            <p className={`font-mono-label text-[10px] ${p.highlighted ? "text-background/70" : "text-muted-foreground"}`}>
              {p.price}
            </p>
            <p className={`text-sm leading-relaxed ${p.highlighted ? "text-background/80" : "text-muted-foreground"}`}>
              {p.desc}
            </p>
            <ul className={`space-y-3 text-sm border-t pt-6 mt-2 ${p.highlighted ? "border-background/20" : "border-border"}`}>
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <Check size={14} strokeWidth={1.5} className="mt-1 shrink-0" />
                  <span className={p.highlighted ? "text-background/90" : ""}>{f}</span>
                </li>
              ))}
            </ul>
            <a
              href="#contact"
              data-testid={`plan-cta-${p.name.toLowerCase()}`}
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
