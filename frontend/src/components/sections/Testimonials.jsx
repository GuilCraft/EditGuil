import { useSection } from "@/lib/content";

export default function Testimonials() {
  const d = useSection("testimonials");
  const items = d?.items || [];
  if (items.length === 0) return null;

  return (
    <section data-testid="testimonials-section" className="py-24 md:py-32 border-y border-border bg-card/40">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="flex items-end justify-between mb-14">
          <div>
            <p className="font-mono-label text-[10px] text-muted-foreground mb-4">09 — Témoignages</p>
            <h2 className="font-serif-display text-5xl md:text-7xl tracking-tight">
              Ce qu'ils<br />
              <span className="italic text-muted-foreground">en disent</span>.
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-border">
          {items.map((t, i) => (
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
                <p className="font-mono-label text-[10px] text-muted-foreground mt-1">{t.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
