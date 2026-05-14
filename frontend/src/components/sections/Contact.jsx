import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Mail, MapPin, Youtube, Instagram, Send } from "lucide-react";
import { useSection } from "@/lib/content";

const projectTypes = [
  "Long-form YouTube", "YouTube Shorts", "Vlog cinématique",
  "Motion graphics", "Stratégie de chaîne", "Autre",
];
const budgets = ["< 300€", "300 – 800€", "800 – 2000€", "2000€+", "Abonnement"];

function TikTokIcon({ size = 20, strokeWidth = 1.25 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}

export default function Contact() {
  const d = useSection("contact");
  const [form, setForm] = useState({
    name: "", email: "", channel: "", project_type: "", budget: "", message: "",
  });
  const [loading, setLoading] = useState(false);
  if (!d) return null;

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Merci de remplir nom, email et message.");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/contact", form);
      if (res.data?.id) {
        toast.success("Message envoyé. Je reviens vers toi sous 24h.");
        setForm({ name: "", email: "", channel: "", project_type: "", budget: "", message: "" });
      } else {
        toast.error("Une erreur est survenue. Réessaie.");
      }
    } catch (err) {
      const detail = err?.response?.data?.detail;
      toast.error(typeof detail === "string" ? detail : "Erreur d'envoi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" data-testid="contact-section" className="py-24 md:py-32 max-w-[1440px] mx-auto px-6 md:px-12">
      <div className="grid grid-cols-12 gap-6 md:gap-12">
        <div className="col-span-12 lg:col-span-5">
          <p className="font-mono-label text-[10px] text-muted-foreground mb-4">12 — Contact</p>
          <h2 className="font-serif-display text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[0.95]">
            {d.title_line1}<br />
            <span className="italic text-muted-foreground">{d.title_line2?.replace(/\s*\?\s*$/, "")}</span>{d.title_line2?.endsWith("?") ? " ?" : ""}
          </h2>
          <p className="mt-8 max-w-md text-sm md:text-base text-muted-foreground">{d.intro}</p>

          <div className="mt-12 space-y-5">
            {d.email && (
              <a href={`mailto:${d.email}`} data-testid="contact-email" className="flex items-center gap-4 group">
                <Mail size={18} strokeWidth={1.25} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                <span className="link-underline">{d.email}</span>
              </a>
            )}
            {d.location && (
              <div className="flex items-center gap-4 text-muted-foreground">
                <MapPin size={18} strokeWidth={1.25} />
                <span>{d.location}</span>
              </div>
            )}
            <div className="flex items-center gap-6 pt-4">
              {d.youtube_url && (
                <a href={d.youtube_url} target="_blank" rel="noopener noreferrer" data-testid="social-youtube" aria-label="YouTube" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Youtube size={20} strokeWidth={1.25} />
                </a>
              )}
              {d.instagram_url && (
                <a href={d.instagram_url} target="_blank" rel="noopener noreferrer" data-testid="social-instagram" aria-label="Instagram" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Instagram size={20} strokeWidth={1.25} />
                </a>
              )}
              {d.tiktok_url && (
                <a href={d.tiktok_url} target="_blank" rel="noopener noreferrer" data-testid="social-tiktok" aria-label="TikTok" className="text-muted-foreground hover:text-foreground transition-colors">
                  <TikTokIcon size={20} />
                </a>
              )}
            </div>
          </div>

          <div className="mt-16 border-t border-border pt-6 font-mono-label text-[10px] text-muted-foreground space-y-2">
            {d.status && (
              <div className="flex justify-between">
                <span>Status</span>
                <span className="text-foreground">● {d.status}</span>
              </div>
            )}
            {d.response_time && (
              <div className="flex justify-between">
                <span>Délai de réponse</span>
                <span className="text-foreground">{d.response_time}</span>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={onSubmit} data-testid="contact-form" className="col-span-12 lg:col-span-7 mt-12 lg:mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
            <div className="md:col-span-1">
              <label htmlFor="name" className="font-mono-label text-[10px] text-muted-foreground">Nom *</label>
              <input id="name" name="name" value={form.name} onChange={onChange} required data-testid="input-name" placeholder="Ton nom"
                className="mt-3 w-full bg-transparent border-0 border-b border-border focus:border-foreground outline-none py-3 text-base placeholder:text-muted-foreground/40" />
            </div>
            <div className="md:col-span-1">
              <label htmlFor="email" className="font-mono-label text-[10px] text-muted-foreground">Email *</label>
              <input id="email" name="email" type="email" value={form.email} onChange={onChange} required data-testid="input-email" placeholder="ton@email.com"
                className="mt-3 w-full bg-transparent border-0 border-b border-border focus:border-foreground outline-none py-3 text-base placeholder:text-muted-foreground/40" />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="channel" className="font-mono-label text-[10px] text-muted-foreground">Chaîne YouTube / Site (optionnel)</label>
              <input id="channel" name="channel" value={form.channel} onChange={onChange} data-testid="input-channel" placeholder="youtube.com/@..."
                className="mt-3 w-full bg-transparent border-0 border-b border-border focus:border-foreground outline-none py-3 text-base placeholder:text-muted-foreground/40" />
            </div>
            <div className="md:col-span-1">
              <label htmlFor="project_type" className="font-mono-label text-[10px] text-muted-foreground">Type de projet</label>
              <select id="project_type" name="project_type" value={form.project_type} onChange={onChange} data-testid="input-project-type"
                className="mt-3 w-full bg-transparent border-0 border-b border-border focus:border-foreground outline-none py-3 text-base">
                <option value="" className="bg-background">Sélectionner…</option>
                {projectTypes.map((t) => <option key={t} value={t} className="bg-background">{t}</option>)}
              </select>
            </div>
            <div className="md:col-span-1">
              <label htmlFor="budget" className="font-mono-label text-[10px] text-muted-foreground">Budget indicatif</label>
              <select id="budget" name="budget" value={form.budget} onChange={onChange} data-testid="input-budget"
                className="mt-3 w-full bg-transparent border-0 border-b border-border focus:border-foreground outline-none py-3 text-base">
                <option value="" className="bg-background">Sélectionner…</option>
                {budgets.map((b) => <option key={b} value={b} className="bg-background">{b}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="message" className="font-mono-label text-[10px] text-muted-foreground">Parle-moi de ton projet *</label>
              <textarea id="message" name="message" value={form.message} onChange={onChange} required rows={5} data-testid="input-message" placeholder="Le ton, la longueur, les références qui t'inspirent…"
                className="mt-3 w-full bg-transparent border-0 border-b border-border focus:border-foreground outline-none py-3 text-base placeholder:text-muted-foreground/40 resize-none" />
            </div>
            <div className="md:col-span-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pt-4">
              <p className="font-mono-label text-[10px] text-muted-foreground">* Champs obligatoires</p>
              <button type="submit" disabled={loading} data-testid="submit-contact"
                className="inline-flex items-center gap-3 px-8 py-4 bg-foreground text-background font-mono-label text-[11px] hover:bg-muted-foreground transition-colors disabled:opacity-50">
                {loading ? "Envoi en cours…" : (<>Envoyer le message <Send size={14} strokeWidth={1.5} /></>)}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
