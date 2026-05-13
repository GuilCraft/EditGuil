const stats = [
  { value: "12M+", label: "Vues générées", sub: "sur les chaînes clients" },
  { value: "240+", label: "Vidéos livrées", sub: "long-form & shorts" },
  { value: "48h", label: "Délai moyen", sub: "premier cut" },
  { value: "98%", label: "Taux de retour", sub: "clients satisfaits" },
];

export default function Stats() {
  return (
    <section
      data-testid="stats-section"
      className="py-24 md:py-32 border-y border-border bg-background"
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <p className="font-mono-label text-[10px] text-muted-foreground mb-12">
          07 — Chiffres
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={i}
              data-testid={`stat-${i}`}
              className="p-6 md:p-10 border-l border-border first:border-l-0 lg:[&:nth-child(odd)]:border-l-0 lg:[&:nth-child(n+2)]:border-l"
            >
              <p className="font-serif-display text-6xl md:text-7xl lg:text-8xl tracking-tight leading-none">
                {s.value}
              </p>
              <p className="font-mono-label text-[10px] text-muted-foreground mt-4">
                {s.label}
              </p>
              <p className="text-sm text-muted-foreground mt-1">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
