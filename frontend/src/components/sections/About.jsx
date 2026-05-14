import { ArrowUpRight } from "lucide-react";
import { useSection } from "@/lib/content";
import { resolveImage } from "@/lib/api";

export default function About() {
  const d = useSection("about");
  if (!d) return null;
  const skills = d.skills || [];

  return (
    <section id="about" data-testid="about-section" className="py-24 md:py-32 max-w-[1440px] mx-auto px-6 md:px-12">
      <div className="grid grid-cols-12 gap-6 md:gap-12">
        <div className="col-span-12 md:col-span-5">
          <div className="relative aspect-[4/5] border border-border overflow-hidden bg-card">
            {d.portrait && (
              <img
                src={resolveImage(d.portrait)}
                alt="Portrait"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
              />
            )}
            <div className="absolute top-4 left-4 font-mono-label text-[10px] text-foreground/80">● PORTRAIT</div>
            <div className="absolute bottom-4 right-4 font-mono-label text-[10px] text-foreground/80">EDITOR · 2025</div>
          </div>
        </div>

        <div className="col-span-12 md:col-span-7 flex flex-col justify-between">
          <div>
            <p className="font-mono-label text-[10px] text-muted-foreground mb-6">08 — À propos</p>
            <h2 className="font-serif-display text-4xl md:text-6xl tracking-tight leading-[1.05]">
              {d.title_line1}<br />
              <span className="italic text-muted-foreground">{d.title_line2}</span>{d.title_line3}
            </h2>
          </div>

          <div className="mt-10 md:mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{d.paragraph1}</p>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{d.paragraph2}</p>
          </div>

          {skills.length > 0 && (
            <div className="mt-12 flex flex-wrap gap-3">
              {skills.map((t, i) => (
                <span
                  key={i}
                  data-testid={`skill-${i}`}
                  className="font-mono-label text-[10px] px-4 py-2 border border-border text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
          )}

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
