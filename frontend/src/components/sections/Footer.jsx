export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      data-testid="site-footer"
      className="border-t border-border bg-background"
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-16 grid grid-cols-12 gap-8">
        <div className="col-span-12 md:col-span-6">
          <p className="font-serif-display text-6xl md:text-8xl tracking-tight leading-none">
            EditGuil<span className="italic text-muted-foreground">.</span>
          </p>
          <p className="mt-6 max-w-md text-sm text-muted-foreground">
            Monteur vidéo freelance — basé en France, dispo partout. Spécialisé
            YouTube long-form, Shorts et vlogs cinématiques.
          </p>
        </div>

        <div className="col-span-6 md:col-span-3 space-y-3">
          <p className="font-mono-label text-[10px] text-muted-foreground mb-4">
            Naviguer
          </p>
          {[
            { href: "#showreel", label: "Showreel" },
            { href: "#work", label: "Travaux" },
            { href: "#services", label: "Services" },
            { href: "#pricing", label: "Tarifs" },
            { href: "#contact", label: "Contact" },
          ].map((l) => (
            <a
              key={l.href}
              href={l.href}
              data-testid={`footer-nav-${l.label.toLowerCase()}`}
              className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="col-span-6 md:col-span-3 space-y-3">
          <p className="font-mono-label text-[10px] text-muted-foreground mb-4">
            Contact direct
          </p>
          <a
            href="mailto:guildwen.marot@gmail.com"
            className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            guildwen.marot@gmail.com
          </a>
          <p className="text-sm text-muted-foreground">France — Remote worldwide</p>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="font-mono-label text-[10px] text-muted-foreground">
            © {year} GUILDWEN MAROT — TOUS DROITS RÉSERVÉS
          </p>
          <p className="font-mono-label text-[10px] text-muted-foreground">
            CRAFTED FRAME BY FRAME ◆ EDITGUIL
          </p>
        </div>
      </div>
    </footer>
  );
}
