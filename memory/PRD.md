# EditGuil — Portfolio Monteur Vidéo (Guildwen Marot)

## Original Problem Statement
> créer un portfolio de monteur vidéo pour trouver et avoir des client

## User Choices
- Style visuel: Minimaliste & élégant (editorial, Swiss-inspired, dark cinematic)
- Identité: **Guildwen MAROT** (nom) / **EditGuil** (pseudo)
- Spécialité: Monteur vidéo YouTube (long-form + shorts + vlog)
- Formulaire de contact: BOTH (MongoDB storage + Resend email)
- Showreel: placeholders (à remplacer plus tard par le user)
- Langue: Français

## Architecture
- **Backend**: FastAPI + Motor (async MongoDB) + Resend SDK (async via asyncio.to_thread)
  - `GET /api/` — health check
  - `POST /api/contact` — store + send email to owner
  - `GET /api/contacts` — list (no _id)
- **Frontend**: React 19 + Tailwind + Shadcn (Accordion, Sonner toast)
  - Single page `/` → `Portfolio.jsx`
  - 12 sections composed from `/app/frontend/src/components/sections/`
- **Design tokens** (from /app/design_guidelines.json):
  - Bg `#0A0A0A`, text `#F5F5F0`, muted `#8C8C8C`, border `#2A2A2A`
  - Typo: Cormorant Garamond (headings, italic accents) + Outfit (body) + JetBrains Mono (labels uppercase tracking-wide)
  - rounded-none everywhere, film grain overlay, vignette, marquee, frame corners on media

## User Personas
1. **YouTube creator** (300K–1M subs) cherchant un monteur fiable pour long-form
2. **Brand / DTC** cherchant un vidéaste cinématique pour storytelling
3. **Gaming / lifestyle creator** ayant besoin de Shorts performants

## What's Implemented (2026-05-13)
- Hero éditorial massif (Cormorant Garamond, layout asymétrique 9/3 cols)
- Marquee infini des spécialités
- Showreel placeholder avec frame corners + play/pause toggle
- Portfolio Tetris grid (7 projets, hover grayscale → color)
- Services grid (6 services, border-grid pattern)
- Process (5 étapes) en grid divisée
- Stats (12M+ vues / 240+ vidéos / 48h / 98%)
- About avec portrait + skills tags
- Testimonials (3 quotes, 3-col)
- Pricing (Short / Long-form / Abonnement — Long-form highlighted)
- FAQ Accordion (6 questions)
- Contact form (nom, email, channel, type projet, budget, message) → POST /api/contact → Resend email + Mongo
- Footer
- Header sticky avec horloge UTC + mobile menu
- Toaster sonner (style brutaliste cohérent)

## Test Status
- Backend: 100% — 6/6 pytest cases (health, CRUD, validation 422, Mongo persistence, _id excluded, Resend email_sent=true)
- Frontend: 100% — Playwright tested form submission, FAQ accordion, mobile menu, all section anchors

## Prioritized Backlog
- **P1**:
  - Remplacer les liens vidéos YouTube placeholders par les vrais embeds (iframe YouTube/Vimeo)
  - Vérifier un domaine custom sur Resend pour livrer les emails ailleurs que sur le compte Resend
  - Ajouter un dashboard admin (auth-protected) pour consulter `GET /api/contacts`
- **P2**:
  - Rate limit / hCaptcha sur `POST /api/contact`
  - SEO meta tags (og:image, description, title custom)
  - Page case-study individuelle par projet
  - Intégration Stripe pour deposit / acompte
- **P3**:
  - Multi-langue EN/FR
  - Animation Framer Motion plus avancée (Lenis smooth scroll)
  - Newsletter / lead magnet
