import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Quel est ton délai moyen pour livrer une vidéo ?",
    a: "Pour une long-form YouTube (10–15 min), compte 4 à 7 jours après réception des rushes. Pour un Short, 24 à 48h. En mode express, on peut s'arranger.",
  },
  {
    q: "Comment je t'envoie mes rushes ?",
    a: "Google Drive, Frame.io, WeTransfer ou Dropbox — au choix. Je te fournis un brief template à remplir pour gagner du temps des deux côtés.",
  },
  {
    q: "Combien de révisions sont incluses ?",
    a: "Deux tours de révisions sont inclus dans chaque formule. Le feedback timecodé est encouragé : ça permet d'aller droit au but.",
  },
  {
    q: "Tu travailles avec des chaînes débutantes ?",
    a: "Oui — si la volonté de progresser est là. Je préfère travailler avec des créateurs ambitieux qu'avec une chaîne déjà énorme mais sans direction.",
  },
  {
    q: "Tu fournis la musique et les sons ?",
    a: "Oui, je travaille avec des banques sous licence (Artlist, Epidemic Sound) et je peux utiliser les tiennes si tu as déjà un abonnement.",
  },
  {
    q: "Et si je ne suis pas satisfait du résultat ?",
    a: "On revoit ensemble jusqu'à ce que la vidéo te convienne (dans la limite des révisions incluses). En 5 ans, ce n'est jamais arrivé qu'on ne trouve pas un terrain d'entente.",
  },
];

export default function FAQ() {
  return (
    <section
      data-testid="faq-section"
      className="py-24 md:py-32 border-y border-border bg-card/40"
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-12 gap-12">
        <div className="col-span-12 md:col-span-4">
          <p className="font-mono-label text-[10px] text-muted-foreground mb-4">
            11 — Questions
          </p>
          <h2 className="font-serif-display text-5xl md:text-6xl tracking-tight">
            FAQ.
          </h2>
          <p className="mt-6 max-w-sm text-sm text-muted-foreground">
            Une question pas listée ? Envoie-moi un message — je réponds en moins de
            24h.
          </p>
        </div>

        <div className="col-span-12 md:col-span-8">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                data-testid={`faq-${i}`}
                className="border-border"
              >
                <AccordionTrigger className="text-left font-serif-display text-xl md:text-2xl hover:no-underline py-6">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm md:text-base text-muted-foreground leading-relaxed pb-6">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
