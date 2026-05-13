import { ArrowUpRight } from "lucide-react";

export default function About() {
  return (
    <section
      id="about"
      data-testid="about-section"
      className="py-24 md:py-32 max-w-[1440px] mx-auto px-6 md:px-12"
    >
      <div className="grid grid-cols-12 gap-6 md:gap-12">
        <div className="col-span-12 md:col-span-5">
          <div className="relative aspect-[4/5] border border-border overflow-hidden bg-card">
            <img
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1000&auto=format&fit=crop"
              alt="Guildwen Marot — EditGuil"
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
            />
            <div className="absolute top-4 left-4 font-mono-label text-[10px] text-foreground/80">
              ● GUILDWEN MAROT
            </div>
            <div className="absolute bottom-4 right-4 font-mono-label text-[10px] text-foreground/80">
              EDITOR · 2025
            </div>
          </div>
        </div>

        <div className="col-span-12 md:col-span-7 flex flex-col justify-between">
          <div>
            <p className="font-mono-label text-[10px] text-muted-foreground mb-6">
              08 — À propos
            </p>
            <h2 className="font-serif-display text-4xl md:text-6xl tracking-tight leading-[1.05]">
              Je suis Guildwen,
              <br />
              <span className="italic text-muted-foreground">
                monteur vidéo
              </span>{" "}
              et obsédé du détail.
            </h2>
          </div>

          <div className="mt-10 md:mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              Depuis plusieurs années, j'accompagne des créateurs YouTube et des marques
              à transformer leurs idées en vidéos qui captent l'attention dès la
              première seconde et la gardent jusqu'à la fin.
            </p>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              Ma signature : un montage rythmé, un sound design soigné, et un sens
              cinématographique du cadre. L'objectif n'est pas juste de couper des
              clips — c'est de raconter une histoire qui fait grandir une chaîne.
            </p>
          </div>

          <div className="mt-12 flex flex-wrap gap-3">
            {[
              "Premiere Pro",
              "DaVinci Resolve",
              "After Effects",
              "Photoshop",
              "Frame.io",
            ].map((t) => (
              <span
                key={t}
                data-testid={`skill-${t.replace(/\s+/g, "-").toLowerCase()}`}
                className="font-mono-label text-[10px] px-4 py-2 border border-border text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </div>

          <a
            href="#contact"
            data-testid="about-cta"
            className="mt-12 inline-flex items-center gap-2 font-mono-label text-[11px] text-foreground link-underline w-fit"
          >
            On discute de ton projet
            <ArrowUpRight size={14} strokeWidth={1.5} />
          </a>
        </div>
      </div>
    </section>
  );
}
