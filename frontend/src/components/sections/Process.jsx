const steps = [
  {
    n: "01",
    title: "Brief & rushes",
    desc: "Tu m'envoies tes rushes via Frame.io ou Drive. On clarifie la vision, le ton, la durée, les références.",
  },
  {
    n: "02",
    title: "Cut narratif",
    desc: "Je structure l'histoire, choisis les meilleurs takes et pose un premier montage axé rétention.",
  },
  {
    n: "03",
    title: "Sound & color",
    desc: "Sound design, musique sous licence, étalonnage cinéma. La couche émotionnelle qui change tout.",
  },
  {
    n: "04",
    title: "Révisions",
    desc: "Deux tours de retouches inclus. Feedback timecodé pour aller vite et droit au but.",
  },
  {
    n: "05",
    title: "Livraison",
    desc: "Master 4K + variantes Shorts / Reels si besoin. Thumbnail livré en option.",
  },
];

export default function Process() {
  return (
    <section
      data-testid="process-section"
      className="py-24 md:py-32 max-w-[1440px] mx-auto px-6 md:px-12"
    >
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4 mb-10 lg:mb-0">
          <p className="font-mono-label text-[10px] text-muted-foreground mb-4">
            06 — Méthode
          </p>
          <h2 className="font-serif-display text-5xl md:text-6xl tracking-tight">
            Du rush
            <br />
            <span className="italic text-muted-foreground">au master</span>.
          </h2>
          <p className="mt-6 max-w-sm text-sm text-muted-foreground">
            Un process clair en cinq temps, conçu pour que tu saches toujours où on en
            est et ce qui vient ensuite.
          </p>
        </div>

        <div className="col-span-12 lg:col-span-8 border-t border-border">
          {steps.map((s) => (
            <div
              key={s.n}
              data-testid={`process-${s.n}`}
              className="grid grid-cols-12 gap-6 py-8 border-b border-border group hover:bg-card/40 transition-colors"
            >
              <div className="col-span-2 md:col-span-2 font-mono-label text-[10px] text-muted-foreground pt-2">
                {s.n}
              </div>
              <h3 className="col-span-10 md:col-span-4 font-serif-display text-2xl md:text-3xl">
                {s.title}
              </h3>
              <p className="col-span-12 md:col-span-6 text-sm text-muted-foreground leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
