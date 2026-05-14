# EditGuil — Portfolio + Back-office Admin (Guildwen Marot)

## Original Problem Statement
> créer un portfolio de monteur vidéo pour trouver et avoir des client

## User Choices
- Style: Minimaliste & élégant (editorial, dark cinematic, Swiss-inspired)
- Identité: **Guildwen MAROT** / pseudo **EditGuil**
- Spécialité: Monteur vidéo YouTube
- Formulaire de contact: MongoDB + Resend email
- Langue: Français
- ✅ **Back-office admin pour modifier soi-même** (ajouté itération 2)

## Architecture
- **Backend** FastAPI + Motor (async MongoDB) + Resend SDK
- **Auth**: JWT (HS256, 7 jours) en localStorage, Bearer Authorization
- **Content**: singleton MongoDB doc `content/_singleton=portfolio` avec toutes les sections éditables
- **Uploads**: static files `/app/backend/uploads/` servis via `/api/uploads/...`

### API Endpoints
**Public**
- `GET /api/` — health
- `GET /api/content` — retourne tout le contenu du portfolio
- `POST /api/contact` — soumission formulaire de contact

**Auth**
- `POST /api/auth/login` — `{email,password}` → `{token, user}`
- `GET /api/auth/me` — Bearer required

**Admin (Bearer required)**
- `PUT /api/content` — `{data:{...}}` upsert singleton
- `GET /api/admin/contacts` — liste des soumissions
- `DELETE /api/admin/contacts/{id}` — supprimer une soumission
- `POST /api/admin/upload` — multipart `file` → `{url, filename}`

### Frontend Routes
- `/` — portfolio public (fetch /api/content via ContentProvider)
- `/admin/login` — formulaire de connexion
- `/admin` — dashboard protégé (14 onglets)

### Admin Dashboard Tabs
Accueil · Bandeau · Showreel · Projets · Services · Process · Stats · À propos · Témoignages · Tarifs · FAQ · Contact · Footer · **Messages reçus**

Pour chaque section : champs texte/textarea, image URL + upload, listes avec add/remove/reorder.

## What's Implemented
### Iteration 1 (2026-05-13)
- 12 sections : Hero, Marquee, Showreel, PortfolioGrid, Services, Process, Stats, About, Testimonials, Pricing, FAQ, Contact, Footer
- Contact form → MongoDB + Resend email à guildwen.marot@gmail.com
- Tests : 100% backend (6/6) + 100% frontend

### Iteration 2 (2026-05-14)
- ✅ Auth JWT (admin seed idempotent : guildwen.marot@gmail.com / Guil13Craft)
- ✅ ContentProvider : sections lisent depuis /api/content
- ✅ Dashboard /admin avec 14 onglets éditables
- ✅ Upload d'images (jpg/png/webp/gif) avec preview
- ✅ ListEditor pour add/remove/reorder éléments
- ✅ Vue Messages reçus avec aperçu + delete + reply mailto
- ✅ Embed YouTube auto sur Showreel + Projets (lien `youtube_url`)
- ✅ Tests : 26/26 backend + e2e admin flow validé
- ✅ Fix HTML : remplacé `<button>` parent par `<div role=button>` dans ContactsList

## Test Credentials
Voir `/app/memory/test_credentials.md`
- Admin : `guildwen.marot@gmail.com` / `Guil13Craft`

## Prioritized Backlog
- **P1**:
  - Page de changement de mot de passe depuis le dashboard
  - Validation du schéma de contenu (allow-list des sections) côté PUT /api/content
  - Limite de taille d'upload (10MB max)
  - Rate limit / hCaptcha sur POST /api/contact
- **P2**:
  - Vérifier un domaine custom sur Resend (livrer à n'importe quel destinataire)
  - Page case-study individuelle par projet (slug-based)
  - Export CSV des messages reçus
  - SEO meta tags dynamiques depuis le contenu admin
- **P3**:
  - Multi-langue EN/FR
  - Stripe deposit sur "Demander un devis"
  - Lifespan handler à la place de @app.on_event (deprecated)
