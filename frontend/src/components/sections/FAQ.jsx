import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useSection } from "@/lib/content";

export default function FAQ() {
  const d = useSection("faq");
  const items = d?.items || [];
  if (items.length === 0) return null;

  return (
    <section data-testid="faq-section" className="py-24 md:py-32 border-y border-border bg-card/40">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-12 gap-12">
        <div className="col-span-12 md:col-span-4">
          <p className="font-mono-label text-[10px] text-muted-foreground mb-4">11 — Questions</p>
          <h2 className="font-serif-display text-5xl md:text-6xl tracking-tight">FAQ.</h2>
          <p className="mt-6 max-w-sm text-sm text-muted-foreground">
            Une question pas listée ? Envoie-moi un message — je réponds en moins de 24h.
          </p>
        </div>

        <div className="col-span-12 md:col-span-8">
          <Accordion type="single" collapsible className="w-full">
            {items.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} data-testid={`faq-${i}`} className="border-border">
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
