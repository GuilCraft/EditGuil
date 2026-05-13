const testimonials = [
  {
    quote:
      "Guildwen a transformé mon contenu. Mes vidéos retiennent l'audience deux fois plus longtemps qu'avant — c'est devenu une part essentielle de la stratégie de la chaîne.",
    name: "Léo M.",
    role: "Créateur YouTube · 480K abonnés",
  },
  {
    quote:
      "Précis, rapide, et un vrai sens du storytelling. Il comprend ce qu'on veut dire avant qu'on le dise. Le genre de monteur qu'on garde précieusement.",
    name: "Sarah D.",
    role: "Brand manager · DTC skincare",
  },
  {
    quote:
      "Mon premier Short édité par EditGuil a fait 1.8M de vues en 3 jours. Pas un hasard : le hook, le rythme, le sound design — tout est calibré.",
    name: "Antoine R.",
    role: "Gaming creator",
  },
];

export default function Testimonials() {
  return (
    <section
      data-testid="testimonials-section"
      className="py-24 md:py-32 border-y border-border bg-card/40"
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="flex items-end justify-between mb-14">
          <div>
            <p className="font-mono-label text-[10px] text-muted-foreground mb-4">
              09 — Témoignages
            </p>
            <h2 className="font-serif-display text-5xl md:text-7xl tracking-tight">
              Ce qu'ils
              <br />
              <span className="italic text-muted-foreground">en disent</span>.
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-border">
          {testimonials.map((t, i) => (
            <figure
              key={i}
              data-testid={`testimonial-${i}`}
              className="bg-background p-8 md:p-10 flex flex-col justify-between gap-8"
            >
              <blockquote className="font-serif-display text-2xl md:text-3xl leading-snug">
                <span className="text-muted-foreground">“</span>
                {t.quote}
                <span className="text-muted-foreground">”</span>
              </blockquote>
              <figcaption>
                <p className="font-mono-label text-[10px] text-foreground">{t.name}</p>
                <p className="font-mono-label text-[10px] text-muted-foreground mt-1">
                  {t.role}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
