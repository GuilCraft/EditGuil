import { ArrowDownRight, Play } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="top"
      data-testid="hero-section"
      className="relative pt-32 md:pt-40 pb-20 md:pb-32 overflow-hidden vignette"
    >
      {/* Background image */}
      <div className="absolute inset-0 -z-10">
        <img
          src="https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=2000&auto=format&fit=crop"
          alt=""
          className="w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-12 gap-6">
        {/* Top metadata strip */}
        <div className="col-span-12 flex items-center justify-between mb-12 reveal">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-foreground rec-dot" />
            <span className="font-mono-label text-[10px] text-muted-foreground">
              SCENE 01 — INT.STUDIO
            </span>
          </div>
          <span className="font-mono-label text-[10px] text-muted-foreground hidden md:inline">
            TAKE 02 / 24FPS / 4K
          </span>
        </div>

        {/* Headline */}
        <div className="col-span-12 lg:col-span-9 reveal reveal-delay-1">
          <h1
            data-testid="hero-headline"
            className="font-serif-display text-[3.25rem] sm:text-7xl md:text-8xl lg:text-[9.5rem] leading-[0.95] tracking-tight"
          >
            Guildwen
            <br />
            <span className="italic font-light text-muted-foreground">Marot</span>
            <span className="inline-block ml-3 align-top font-mono-label text-[10px] text-muted-foreground translate-y-4">
              [EditGuil]
            </span>
          </h1>
        </div>

        <div className="col-span-12 lg:col-span-3 lg:pl-6 lg:border-l lg:border-border lg:pt-4 reveal reveal-delay-2">
          <p className="font-mono-label text-[10px] text-muted-foreground mb-3">
            01 — Profil
          </p>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Monteur vidéo spécialisé <span className="text-foreground">YouTube</span>.
            Je transforme des heures de rushes en formats qui retiennent l'attention et
            font grimper les vues.
          </p>
        </div>

        {/* Sub line */}
        <div className="col-span-12 mt-16 lg:mt-24 flex flex-col md:flex-row items-start md:items-end justify-between gap-8 reveal reveal-delay-3">
          <div className="max-w-xl">
            <p className="font-mono-label text-[10px] text-muted-foreground mb-4">
              02 — Spécialités
            </p>
            <p className="font-serif-display text-2xl md:text-4xl leading-tight">
              Long-form,{" "}
              <span className="italic text-muted-foreground">Shorts</span>,
              vlogs cinématiques & <br className="hidden md:block" />
              storytelling sur mesure.
            </p>
          </div>

          <div className="flex flex-col items-start gap-4">
            <a
              href="#showreel"
              data-testid="hero-cta-showreel"
              className="group flex items-center gap-3 px-6 py-4 bg-foreground text-background font-mono-label text-[11px] hover:bg-muted-foreground transition-colors"
            >
              <Play size={14} strokeWidth={1.5} fill="currentColor" />
              Voir le showreel
            </a>
            <a
              href="#contact"
              data-testid="hero-cta-contact"
              className="group flex items-center gap-2 font-mono-label text-[11px] text-muted-foreground hover:text-foreground transition-colors"
            >
              Travailler ensemble
              <ArrowDownRight size={14} strokeWidth={1.5} className="group-hover:translate-x-1 group-hover:translate-y-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
