import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useSection } from "@/lib/content";

const links = [
  { href: "#showreel", label: "Showreel" },
  { href: "#work", label: "Travaux" },
  { href: "#services", label: "Services" },
  { href: "#about", label: "À propos" },
  { href: "#pricing", label: "Tarifs" },
  { href: "#contact", label: "Contact" },
];

export default function Header() {
  const hero = useSection("hero");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    const t = setInterval(() => {
      const d = new Date();
      const hh = String(d.getUTCHours()).padStart(2, "0");
      const mm = String(d.getUTCMinutes()).padStart(2, "0");
      const ss = String(d.getUTCSeconds()).padStart(2, "0");
      setTime(`${hh}:${mm}:${ss} UTC`);
    }, 1000);
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearInterval(t);
    };
  }, []);

  const pseudo = hero?.pseudo?.replace(/^\[|\]$/g, "") || "EditGuil";

  return (
    <header
      data-testid="site-header"
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-black/70 backdrop-blur-xl border-b border-white/10" : "bg-transparent"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
        <a href="#top" data-testid="header-logo" className="flex items-center gap-3 group">
          <span className="font-mono-label text-[10px] text-muted-foreground rec-dot">● REC</span>
          <span className="font-serif-display text-2xl tracking-tight">
            {pseudo}<span className="italic text-muted-foreground">.</span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              data-testid={`nav-${l.label.toLowerCase()}`}
              className="font-mono-label text-[11px] text-muted-foreground hover:text-foreground transition-colors link-underline"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-6">
          <span className="font-mono-label text-[10px] text-muted-foreground tabular-nums">{time}</span>
          <a
            href="#contact"
            data-testid="header-cta"
            className="font-mono-label text-[10px] px-5 py-3 bg-foreground text-background hover:bg-muted-foreground transition-colors"
          >
            Démarrer un projet
          </a>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          data-testid="mobile-menu-toggle"
          className="md:hidden text-foreground"
          aria-label="Menu"
        >
          {open ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
        </button>
      </div>

      {open && (
        <div data-testid="mobile-menu" className="md:hidden border-t border-white/10 bg-black/95 backdrop-blur-xl">
          <div className="px-6 py-8 flex flex-col gap-6">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                data-testid={`mobile-nav-${l.label.toLowerCase()}`}
                className="font-serif-display text-3xl"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              data-testid="mobile-header-cta"
              className="mt-4 font-mono-label text-[11px] py-4 bg-foreground text-background text-center"
            >
              Démarrer un projet
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
