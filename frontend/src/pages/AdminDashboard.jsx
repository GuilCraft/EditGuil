import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useContent } from "@/lib/content";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { LogOut, Save, ExternalLink, Mail, Trash2, Eye } from "lucide-react";
import { TextField, ToggleField } from "@/components/admin/Field";
import ImageInput from "@/components/admin/ImageInput";
import ListEditor from "@/components/admin/ListEditor";

const TABS = [
  { key: "hero", label: "Accueil" },
  { key: "marquee", label: "Bandeau" },
  { key: "showreel", label: "Showreel" },
  { key: "projects", label: "Projets" },
  { key: "services", label: "Services" },
  { key: "process", label: "Process" },
  { key: "stats", label: "Stats" },
  { key: "about", label: "À propos" },
  { key: "testimonials", label: "Témoignages" },
  { key: "pricing", label: "Tarifs" },
  { key: "faq", label: "FAQ" },
  { key: "contact", label: "Contact" },
  { key: "footer", label: "Footer" },
  { key: "_messages", label: "Messages reçus" },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { content, reload } = useContent();
  const [local, setLocal] = useState(null);
  const [tab, setTab] = useState("hero");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (content) setLocal(JSON.parse(JSON.stringify(content)));
  }, [content]);

  if (!local) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground font-mono-label text-[10px]">Chargement…</div>;
  }

  const setSection = (key, data) => setLocal((l) => ({ ...l, [key]: data }));
  const setField = (sectionKey, field, value) =>
    setLocal((l) => ({ ...l, [sectionKey]: { ...l[sectionKey], [field]: value } }));

  const save = async () => {
    setSaving(true);
    try {
      await api.put("/content", { data: local });
      toast.success("Modifications sauvegardées");
      reload();
    } catch (err) {
      const d = err?.response?.data?.detail;
      toast.error(typeof d === "string" ? d : "Échec de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-mono-label text-[10px] text-muted-foreground rec-dot">● ADMIN</span>
            <span className="font-serif-display text-2xl">EditGuil<span className="italic text-muted-foreground">.</span></span>
            <span className="hidden md:inline font-mono-label text-[10px] text-muted-foreground">/ {user?.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="view-site"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 border border-border hover:border-foreground font-mono-label text-[10px]"
            >
              <Eye size={12} strokeWidth={1.5} /> Voir le site
            </a>
            <button
              onClick={save}
              disabled={saving}
              data-testid="save-content"
              className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background font-mono-label text-[10px] hover:bg-muted-foreground disabled:opacity-50"
            >
              <Save size={12} strokeWidth={1.5} />
              {saving ? "Sauvegarde…" : "Sauvegarder"}
            </button>
            <button
              onClick={logout}
              data-testid="logout-btn"
              className="inline-flex items-center gap-2 px-4 py-2 border border-border hover:border-foreground font-mono-label text-[10px]"
            >
              <LogOut size={12} strokeWidth={1.5} /> Déconnexion
            </button>
          </div>
        </div>
        {/* Tabs */}
        <div className="border-t border-border overflow-x-auto">
          <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex gap-1">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                data-testid={`tab-${t.key}`}
                className={`px-4 py-3 font-mono-label text-[10px] whitespace-nowrap border-b-2 transition-colors ${
                  tab === t.key ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="max-w-[1440px] mx-auto px-6 md:px-12 py-10 md:py-14">
        {tab === "hero" && <HeroEditor data={local.hero} onChange={(d) => setSection("hero", d)} set={(k, v) => setField("hero", k, v)} />}
        {tab === "marquee" && <MarqueeEditor data={local.marquee} onChange={(d) => setSection("marquee", d)} />}
        {tab === "showreel" && <ShowreelEditor data={local.showreel} onChange={(d) => setSection("showreel", d)} set={(k, v) => setField("showreel", k, v)} />}
        {tab === "projects" && <ProjectsEditor data={local.projects} onChange={(d) => setSection("projects", d)} />}
        {tab === "services" && <ServicesEditor data={local.services} onChange={(d) => setSection("services", d)} set={(k, v) => setField("services", k, v)} />}
        {tab === "process" && <ProcessEditor data={local.process} onChange={(d) => setSection("process", d)} set={(k, v) => setField("process", k, v)} />}
        {tab === "stats" && <StatsEditor data={local.stats} onChange={(d) => setSection("stats", d)} />}
        {tab === "about" && <AboutEditor data={local.about} onChange={(d) => setSection("about", d)} set={(k, v) => setField("about", k, v)} />}
        {tab === "testimonials" && <TestimonialsEditor data={local.testimonials} onChange={(d) => setSection("testimonials", d)} />}
        {tab === "pricing" && <PricingEditor data={local.pricing} onChange={(d) => setSection("pricing", d)} />}
        {tab === "faq" && <FAQEditor data={local.faq} onChange={(d) => setSection("faq", d)} />}
        {tab === "contact" && <ContactEditor data={local.contact} set={(k, v) => setField("contact", k, v)} />}
        {tab === "footer" && <FooterEditor data={local.footer} set={(k, v) => setField("footer", k, v)} />}
        {tab === "_messages" && <ContactsList />}
      </main>
    </div>
  );
}

// ---------- Section editors ----------

function SectionShell({ title, hint, children }) {
  return (
    <div>
      <div className="mb-8">
        <p className="font-mono-label text-[10px] text-muted-foreground mb-2">SECTION</p>
        <h2 className="font-serif-display text-4xl md:text-5xl">{title}</h2>
        {hint && <p className="text-sm text-muted-foreground mt-3 max-w-2xl">{hint}</p>}
      </div>
      <div className="space-y-6 max-w-3xl">{children}</div>
    </div>
  );
}

function HeroEditor({ data, set }) {
  return (
    <SectionShell title="Section Accueil" hint="Les premiers mots que les visiteurs voient. Sois percutant.">
      <TextField label="Label haut gauche" value={data.scene_label} onChange={(v) => set("scene_label", v)} />
      <TextField label="Label haut droite" value={data.take_label} onChange={(v) => set("take_label", v)} />
      <TextField label="Nom — ligne 1" value={data.name_line1} onChange={(v) => set("name_line1", v)} />
      <TextField label="Nom — ligne 2 (italique)" value={data.name_line2} onChange={(v) => set("name_line2", v)} />
      <TextField label="Pseudo (entre crochets)" value={data.pseudo} onChange={(v) => set("pseudo", v)} />
      <TextField label="Texte profil (droite)" value={data.profile_text} onChange={(v) => set("profile_text", v)} multiline rows={4} />
      <TextField label="Texte spécialités" value={data.specialties_text} onChange={(v) => set("specialties_text", v)} multiline rows={2} />
      <ImageInput label="Image de fond" value={data.background_image} onChange={(v) => set("background_image", v)} />
    </SectionShell>
  );
}

function MarqueeEditor({ data, onChange }) {
  return (
    <SectionShell title="Bandeau défilant" hint="Liste des spécialités/mots-clés qui défilent en boucle.">
      <ListEditor
        label="Mots-clés"
        items={data.items || []}
        onChange={(items) => onChange({ ...data, items })}
        newItem={() => "Nouveau"}
        renderItem={(item, idx, update) => (
          <input
            type="text"
            value={item}
            onChange={(e) => {
              const next = [...(data.items || [])];
              next[idx] = e.target.value;
              onChange({ ...data, items: next });
            }}
            className="w-full bg-card border border-border focus:border-foreground outline-none p-3 text-sm rounded-none"
          />
        )}
      />
    </SectionShell>
  );
}

function ShowreelEditor({ data, set }) {
  return (
    <SectionShell title="Showreel" hint="La vidéo vitrine. Colle un lien YouTube pour l'intégrer (ou laisse vide pour l'image placeholder).">
      <TextField label="Titre — ligne 1" value={data.title_line1} onChange={(v) => set("title_line1", v)} />
      <TextField label="Titre — ligne 2 (italique)" value={data.title_line2} onChange={(v) => set("title_line2", v)} />
      <TextField label="Lien YouTube (embed ou watch)" value={data.youtube_url} onChange={(v) => set("youtube_url", v)} placeholder="https://www.youtube.com/watch?v=..." />
      <ImageInput label="Image (si pas de YouTube)" value={data.image} onChange={(v) => set("image", v)} />
      <TextField label="Runtime" value={data.runtime} onChange={(v) => set("runtime", v)} />
      <TextField label="Format" value={data.fmt} onChange={(v) => set("fmt", v)} />
      <TextField label="Note en bas" value={data.note} onChange={(v) => set("note", v)} />
    </SectionShell>
  );
}

const SPAN_PRESETS = [
  { v: "col-span-12 md:col-span-4", label: "Petit (1/3)" },
  { v: "col-span-12 md:col-span-5", label: "Moyen-petit" },
  { v: "col-span-12 md:col-span-6", label: "Moitié (1/2)" },
  { v: "col-span-12 md:col-span-7", label: "Moyen-grand" },
  { v: "col-span-12 md:col-span-8", label: "Grand (2/3)" },
  { v: "col-span-12", label: "Pleine largeur" },
];
const ASPECT_PRESETS = [
  { v: "aspect-[4/5]", label: "Portrait (4:5)" },
  { v: "aspect-[16/9]", label: "YouTube (16:9)" },
  { v: "aspect-[16/10]", label: "Cinéma (16:10)" },
  { v: "aspect-square", label: "Carré (1:1)" },
];

function ProjectsEditor({ data, onChange }) {
  return (
    <SectionShell title="Projets / Portfolio" hint="Ajoute, supprime ou réordonne tes vidéos. Colle un lien YouTube pour que le visiteur puisse la lire en cliquant.">
      <ListEditor
        label="Projets"
        items={data.items || []}
        onChange={(items) => onChange({ ...data, items })}
        newItem={() => ({
          id: String(Date.now()), title: "Nouveau projet", client: "Client",
          type: "Long-form", views: "0", duration: "00:00", image: "",
          youtube_url: "", span: "col-span-12 md:col-span-4", aspect: "aspect-[4/5]",
        })}
        renderItem={(p, idx, update) => (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField label="Titre" value={p.title} onChange={(v) => update({ title: v })} />
              <TextField label="Client" value={p.client} onChange={(v) => update({ client: v })} />
              <TextField label="Type (Long-form, Short, Promo…)" value={p.type} onChange={(v) => update({ type: v })} />
              <TextField label="Vues (ex: 1.2M)" value={p.views} onChange={(v) => update({ views: v })} />
              <TextField label="Durée (ex: 14:22)" value={p.duration} onChange={(v) => update({ duration: v })} />
              <TextField label="Lien YouTube (optionnel)" value={p.youtube_url} onChange={(v) => update({ youtube_url: v })} placeholder="https://youtube.com/watch?v=..." />
            </div>
            <ImageInput label="Miniature" value={p.image} onChange={(v) => update({ image: v })} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-mono-label text-[10px] text-muted-foreground block mb-2">Taille de la carte</label>
                <select value={p.span} onChange={(e) => update({ span: e.target.value })} className="w-full bg-card border border-border p-3 text-sm rounded-none">
                  {SPAN_PRESETS.map((s) => <option key={s.v} value={s.v}>{s.label}</option>)}
                </select>
              </div>
              <div>
                <label className="font-mono-label text-[10px] text-muted-foreground block mb-2">Format de l'image</label>
                <select value={p.aspect} onChange={(e) => update({ aspect: e.target.value })} className="w-full bg-card border border-border p-3 text-sm rounded-none">
                  {ASPECT_PRESETS.map((s) => <option key={s.v} value={s.v}>{s.label}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}
      />
    </SectionShell>
  );
}

function ServicesEditor({ data, onChange, set }) {
  return (
    <SectionShell title="Services" hint="La liste des prestations que tu proposes.">
      <TextField label="Titre — ligne 1" value={data.title_line1} onChange={(v) => set("title_line1", v)} />
      <TextField label="Titre — ligne 2 (italique)" value={data.title_line2} onChange={(v) => set("title_line2", v)} />
      <TextField label="Sous-titre" value={data.subtitle} onChange={(v) => set("subtitle", v)} multiline rows={2} />
      <ListEditor
        label="Services"
        items={data.items || []}
        onChange={(items) => onChange({ ...data, items })}
        newItem={() => ({ n: String((data.items?.length || 0) + 1).padStart(2, "0"), title: "Nouveau service", desc: "", deliv: "" })}
        renderItem={(s, idx, update) => (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField label="N°" value={s.n} onChange={(v) => update({ n: v })} />
            <TextField label="Titre" value={s.title} onChange={(v) => update({ title: v })} />
            <div className="md:col-span-2">
              <TextField label="Description" value={s.desc} onChange={(v) => update({ desc: v })} multiline rows={3} />
            </div>
            <div className="md:col-span-2">
              <TextField label="Livrable" value={s.deliv} onChange={(v) => update({ deliv: v })} />
            </div>
          </div>
        )}
      />
    </SectionShell>
  );
}

function ProcessEditor({ data, onChange, set }) {
  return (
    <SectionShell title="Méthode / Process" hint="Les étapes de ton workflow.">
      <TextField label="Titre — ligne 1" value={data.title_line1} onChange={(v) => set("title_line1", v)} />
      <TextField label="Titre — ligne 2 (italique)" value={data.title_line2} onChange={(v) => set("title_line2", v)} />
      <TextField label="Sous-titre" value={data.subtitle} onChange={(v) => set("subtitle", v)} multiline rows={2} />
      <ListEditor
        label="Étapes"
        items={data.steps || []}
        onChange={(steps) => onChange({ ...data, steps })}
        newItem={() => ({ n: String((data.steps?.length || 0) + 1).padStart(2, "0"), title: "Nouvelle étape", desc: "" })}
        renderItem={(s, idx, update) => (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField label="N°" value={s.n} onChange={(v) => update({ n: v })} />
            <TextField label="Titre" value={s.title} onChange={(v) => update({ title: v })} />
            <div className="md:col-span-2">
              <TextField label="Description" value={s.desc} onChange={(v) => update({ desc: v })} multiline rows={3} />
            </div>
          </div>
        )}
      />
    </SectionShell>
  );
}

function StatsEditor({ data, onChange }) {
  return (
    <SectionShell title="Chiffres clés" hint="Les statistiques affichées en gros sur la page.">
      <ListEditor
        label="Chiffres"
        items={data.items || []}
        onChange={(items) => onChange({ ...data, items })}
        newItem={() => ({ value: "0", label: "Nouveau chiffre", sub: "" })}
        renderItem={(s, idx, update) => (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TextField label="Valeur (ex: 12M+)" value={s.value} onChange={(v) => update({ value: v })} />
            <TextField label="Label" value={s.label} onChange={(v) => update({ label: v })} />
            <TextField label="Sous-titre" value={s.sub} onChange={(v) => update({ sub: v })} />
          </div>
        )}
      />
    </SectionShell>
  );
}

function AboutEditor({ data, onChange, set }) {
  return (
    <SectionShell title="À propos" hint="Ta bio, ta photo, tes skills.">
      <TextField label="Titre — ligne 1" value={data.title_line1} onChange={(v) => set("title_line1", v)} />
      <TextField label="Titre — ligne 2 (italique)" value={data.title_line2} onChange={(v) => set("title_line2", v)} />
      <TextField label="Titre — fin (ex: ' et obsédé du détail.')" value={data.title_line3} onChange={(v) => set("title_line3", v)} />
      <TextField label="Paragraphe 1" value={data.paragraph1} onChange={(v) => set("paragraph1", v)} multiline rows={4} />
      <TextField label="Paragraphe 2" value={data.paragraph2} onChange={(v) => set("paragraph2", v)} multiline rows={4} />
      <ImageInput label="Photo de toi (portrait)" value={data.portrait} onChange={(v) => set("portrait", v)} />
      <ListEditor
        label="Compétences / Outils"
        items={data.skills || []}
        onChange={(skills) => onChange({ ...data, skills })}
        newItem={() => "Nouvel outil"}
        renderItem={(skill, idx, update) => (
          <input
            type="text"
            value={skill}
            onChange={(e) => {
              const next = [...(data.skills || [])];
              next[idx] = e.target.value;
              onChange({ ...data, skills: next });
            }}
            className="w-full bg-card border border-border p-3 text-sm rounded-none"
          />
        )}
      />
    </SectionShell>
  );
}

function TestimonialsEditor({ data, onChange }) {
  return (
    <SectionShell title="Témoignages" hint="Ce que tes clients disent de toi.">
      <ListEditor
        label="Témoignages"
        items={data.items || []}
        onChange={(items) => onChange({ ...data, items })}
        newItem={() => ({ quote: "", name: "", role: "" })}
        renderItem={(t, idx, update) => (
          <div className="space-y-3">
            <TextField label="Citation" value={t.quote} onChange={(v) => update({ quote: v })} multiline rows={4} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField label="Nom" value={t.name} onChange={(v) => update({ name: v })} />
              <TextField label="Rôle / Description" value={t.role} onChange={(v) => update({ role: v })} />
            </div>
          </div>
        )}
      />
    </SectionShell>
  );
}

function PricingEditor({ data, onChange }) {
  return (
    <SectionShell title="Tarifs" hint="Les formules que tu proposes. Active 'Mise en avant' sur la formule principale.">
      <ListEditor
        label="Formules"
        items={data.items || []}
        onChange={(items) => onChange({ ...data, items })}
        newItem={() => ({ name: "Nouvelle formule", price: "à partir de …", desc: "", features: [], highlighted: false })}
        renderItem={(p, idx, update) => (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField label="Nom" value={p.name} onChange={(v) => update({ name: v })} />
              <TextField label="Prix" value={p.price} onChange={(v) => update({ price: v })} />
            </div>
            <TextField label="Description" value={p.desc} onChange={(v) => update({ desc: v })} multiline rows={2} />
            <ToggleField label="Mise en avant (formule populaire)" value={!!p.highlighted} onChange={(v) => update({ highlighted: v })} />
            <div>
              <p className="font-mono-label text-[10px] text-muted-foreground mb-2">Inclus dans cette formule</p>
              <ListEditor
                label="Lignes"
                items={p.features || []}
                onChange={(features) => update({ features })}
                newItem={() => "Nouvelle ligne"}
                renderItem={(feat, fIdx) => (
                  <input
                    type="text"
                    value={feat}
                    onChange={(e) => {
                      const next = [...(p.features || [])];
                      next[fIdx] = e.target.value;
                      update({ features: next });
                    }}
                    className="w-full bg-card border border-border p-3 text-sm rounded-none"
                  />
                )}
              />
            </div>
          </div>
        )}
      />
    </SectionShell>
  );
}

function FAQEditor({ data, onChange }) {
  return (
    <SectionShell title="FAQ" hint="Les questions fréquentes que tes prospects te posent.">
      <ListEditor
        label="Questions"
        items={data.items || []}
        onChange={(items) => onChange({ ...data, items })}
        newItem={() => ({ q: "", a: "" })}
        renderItem={(f, idx, update) => (
          <div className="space-y-3">
            <TextField label="Question" value={f.q} onChange={(v) => update({ q: v })} />
            <TextField label="Réponse" value={f.a} onChange={(v) => update({ a: v })} multiline rows={4} />
          </div>
        )}
      />
    </SectionShell>
  );
}

function ContactEditor({ data, set }) {
  return (
    <SectionShell title="Section Contact" hint="Les infos affichées dans la section contact du site.">
      <TextField label="Titre — ligne 1" value={data.title_line1} onChange={(v) => set("title_line1", v)} />
      <TextField label="Titre — ligne 2 (italique)" value={data.title_line2} onChange={(v) => set("title_line2", v)} />
      <TextField label="Texte d'intro" value={data.intro} onChange={(v) => set("intro", v)} multiline rows={3} />
      <TextField label="Email" value={data.email} onChange={(v) => set("email", v)} />
      <TextField label="Localisation" value={data.location} onChange={(v) => set("location", v)} />
      <TextField label="Lien YouTube" value={data.youtube_url} onChange={(v) => set("youtube_url", v)} placeholder="https://youtube.com/@..." />
      <TextField label="Lien Instagram" value={data.instagram_url} onChange={(v) => set("instagram_url", v)} placeholder="https://instagram.com/..." />
      <TextField label="Lien TikTok" value={data.tiktok_url} onChange={(v) => set("tiktok_url", v)} placeholder="https://tiktok.com/@..." />
      <TextField label="Statut (ex: Slots ouverts — 2025)" value={data.status} onChange={(v) => set("status", v)} />
      <TextField label="Délai de réponse" value={data.response_time} onChange={(v) => set("response_time", v)} />
    </SectionShell>
  );
}

function FooterEditor({ data, set }) {
  return (
    <SectionShell title="Footer" hint="Le pied de page du site.">
      <TextField label="Tagline" value={data.tagline} onChange={(v) => set("tagline", v)} multiline rows={3} />
      <TextField label="Texte des droits (ex: TOUS DROITS RÉSERVÉS)" value={data.rights} onChange={(v) => set("rights", v)} />
      <TextField label="Signature (en bas à droite)" value={data.signature} onChange={(v) => set("signature", v)} />
    </SectionShell>
  );
}

function ContactsList() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [opened, setOpened] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/contacts");
      setList(data);
    } catch (err) {
      toast.error("Échec du chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id) => {
    if (!window.confirm("Supprimer définitivement ce message ?")) return;
    try {
      await api.delete(`/admin/contacts/${id}`);
      toast.success("Message supprimé");
      load();
    } catch {
      toast.error("Échec de la suppression");
    }
  };

  return (
    <SectionShell title="Messages reçus" hint="Toutes les demandes de contact envoyées depuis ton portfolio.">
      {loading ? (
        <p className="text-sm text-muted-foreground">Chargement…</p>
      ) : list.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucun message pour l'instant.</p>
      ) : (
        <div className="space-y-3">
          {list.map((c) => (
            <div key={c.id} data-testid={`contact-${c.id}`} className="border border-border bg-card">
              <button
                onClick={() => setOpened(opened === c.id ? null : c.id)}
                className="w-full p-4 flex items-center justify-between gap-4 text-left hover:bg-background transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <Mail size={14} strokeWidth={1.5} className="shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    <p className="font-mono-label text-[10px] text-muted-foreground">
                      {new Date(c.created_at).toLocaleString("fr-FR")}
                      {c.email_sent ? " · ✓ Email envoyé" : " · ⚠ Email non envoyé"}
                    </p>
                    <p className="font-serif-display text-xl truncate">{c.name} <span className="text-muted-foreground text-sm">— {c.email}</span></p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`mailto:${c.email}`}
                    onClick={(e) => e.stopPropagation()}
                    className="px-3 py-2 border border-border hover:border-foreground font-mono-label text-[10px] inline-flex items-center gap-2"
                  >
                    <ExternalLink size={12} strokeWidth={1.5} /> Répondre
                  </a>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); remove(c.id); }}
                    className="w-9 h-9 border border-border hover:border-destructive hover:text-destructive flex items-center justify-center"
                    aria-label="Supprimer"
                  >
                    <Trash2 size={12} strokeWidth={1.5} />
                  </button>
                </div>
              </button>
              {opened === c.id && (
                <div className="border-t border-border p-5 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                  <Info label="Chaîne / Lien" value={c.channel} />
                  <Info label="Type de projet" value={c.project_type} />
                  <Info label="Budget" value={c.budget} />
                  <Info label="Email envoyé" value={c.email_sent ? "Oui" : "Non"} />
                  <div className="md:col-span-2">
                    <p className="font-mono-label text-[10px] text-muted-foreground mb-2">Message</p>
                    <p className="whitespace-pre-wrap leading-relaxed">{c.message}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </SectionShell>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="font-mono-label text-[10px] text-muted-foreground">{label}</p>
      <p>{value || "—"}</p>
    </div>
  );
}
