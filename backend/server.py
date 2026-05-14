from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, UploadFile, File
from fastapi.staticfiles import StaticFiles
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import asyncio
import logging
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional, Dict, Any
import uuid
import bcrypt
import jwt
from datetime import datetime, timezone, timedelta
import resend
import shutil

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

# ---------- ENV ----------
mongo_url = os.environ['MONGO_URL']
DB_NAME = os.environ['DB_NAME']
JWT_SECRET = os.environ['JWT_SECRET']
JWT_ALGO = "HS256"
ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', 'guildwen.marot@gmail.com').lower()
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'admin123')
RESEND_API_KEY = os.environ.get('RESEND_API_KEY')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
OWNER_EMAIL = os.environ.get('OWNER_EMAIL', 'guildwen.marot@gmail.com')
if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

client = AsyncIOMotorClient(mongo_url)
db = client[DB_NAME]

UPLOAD_DIR = ROOT_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

app = FastAPI()
app.mount("/api/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")
api_router = APIRouter(prefix="/api")


# ---------- AUTH HELPERS ----------
def hash_password(pw: str) -> str:
    return bcrypt.hashpw(pw.encode(), bcrypt.gensalt()).decode()


def verify_password(pw: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(pw.encode(), hashed.encode())
    except Exception:
        return False


def create_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGO)


async def get_current_admin(request: Request) -> Dict[str, Any]:
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Non authentifié")
    token = auth[7:]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGO])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Session expirée")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token invalide")
    user = await db.users.find_one({"id": payload.get("sub")}, {"_id": 0, "password_hash": 0})
    if not user:
        raise HTTPException(status_code=401, detail="Utilisateur introuvable")
    return user


# ---------- MODELS ----------
class LoginPayload(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    token: str
    user: Dict[str, Any]


class ContactCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    channel: Optional[str] = Field(default=None, max_length=200)
    project_type: Optional[str] = Field(default=None, max_length=120)
    budget: Optional[str] = Field(default=None, max_length=80)
    message: str = Field(min_length=1, max_length=4000)


class Contact(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    channel: Optional[str] = None
    project_type: Optional[str] = None
    budget: Optional[str] = None
    message: str
    email_sent: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ContentPayload(BaseModel):
    """Free-form portfolio content blob."""
    data: Dict[str, Any]


# ---------- DEFAULT CONTENT ----------
DEFAULT_CONTENT: Dict[str, Any] = {
    "hero": {
        "scene_label": "SCENE 01 — INT.STUDIO",
        "take_label": "TAKE 02 / 24FPS / 4K",
        "name_line1": "Guildwen",
        "name_line2": "Marot",
        "pseudo": "[EDITGUIL]",
        "profile_text": "Monteur vidéo spécialisé YouTube. Je transforme des heures de rushes en formats qui retiennent l'attention et font grimper les vues.",
        "specialties_text": "Long-form, Shorts, vlogs cinématiques & storytelling sur mesure.",
        "background_image": "https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=2000&auto=format&fit=crop",
    },
    "marquee": {
        "items": [
            "MrBeast-style edits", "Vlog cinématique", "Storytelling", "Sound design",
            "Motion graphics", "YouTube Shorts", "Thumbnail strategy", "Color grading",
            "Long-form retention", "Tiktok / Reels",
        ]
    },
    "showreel": {
        "title_line1": "Une sélection",
        "title_line2": "en mouvement",
        "youtube_url": "",
        "image": "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2000&auto=format&fit=crop",
        "runtime": "02:48",
        "fmt": "4K · DOLBY · 2025",
        "note": "* Vidéo placeholder — sera remplacée par le showreel final.",
    },
    "projects": {
        "items": [
            {"id": "1", "title": "Vlog cinématique", "client": "Lifestyle creator", "type": "Long-form", "views": "1.2M", "duration": "14:22", "image": "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1200&auto=format&fit=crop", "youtube_url": "", "span": "col-span-12 md:col-span-8 row-span-2", "aspect": "aspect-[16/10]"},
            {"id": "2", "title": "Gaming highlight", "client": "FPS creator", "type": "Short", "views": "640K", "duration": "0:58", "image": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop", "youtube_url": "", "span": "col-span-12 md:col-span-4", "aspect": "aspect-[4/5]"},
            {"id": "3", "title": "Tech review", "client": "Tech reviewer", "type": "Long-form", "views": "320K", "duration": "09:41", "image": "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1200&auto=format&fit=crop", "youtube_url": "", "span": "col-span-12 md:col-span-4", "aspect": "aspect-[4/5]"},
            {"id": "4", "title": "Documentary cut", "client": "Travel channel", "type": "Long-form", "views": "890K", "duration": "21:08", "image": "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop", "youtube_url": "", "span": "col-span-12 md:col-span-5", "aspect": "aspect-[16/10]"},
            {"id": "5", "title": "Brand storytelling", "client": "DTC brand", "type": "Promo", "views": "240K", "duration": "02:12", "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop", "youtube_url": "", "span": "col-span-12 md:col-span-7", "aspect": "aspect-[16/9]"},
            {"id": "6", "title": "Music vlog", "client": "Music creator", "type": "Short", "views": "1.8M", "duration": "0:42", "image": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop", "youtube_url": "", "span": "col-span-12 md:col-span-4", "aspect": "aspect-[4/5]"},
            {"id": "7", "title": "Fitness series", "client": "Wellness coach", "type": "Long-form", "views": "510K", "duration": "12:34", "image": "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1200&auto=format&fit=crop", "youtube_url": "", "span": "col-span-12 md:col-span-8", "aspect": "aspect-[16/9]"},
        ]
    },
    "services": {
        "title_line1": "Ce que je",
        "title_line2": "livre",
        "subtitle": "Des prestations pensées pour les créateurs et marques qui veulent grandir sur YouTube avec un montage qui sort du lot.",
        "items": [
            {"n": "01", "title": "Long-form YouTube", "desc": "Montage narratif, rythme, B-roll, sound design pour vidéos 8 à 30 min orientées rétention et watchtime.", "deliv": "Vidéo 1080p/4K"},
            {"n": "02", "title": "YouTube Shorts", "desc": "Hook 3 secondes, cuts rapides, sous-titres dynamiques, optimisé pour le scroll vertical et la rediffusion.", "deliv": "Vertical 1080×1920"},
            {"n": "03", "title": "Vlog cinématique", "desc": "Color grading film, transitions invisibles, musique soigneusement choisie pour une vibe premium.", "deliv": "Master ProRes + H.264"},
            {"n": "04", "title": "Motion graphics", "desc": "Titrages, lower-thirds, animations infographiques et brand assets pour renforcer ton identité visuelle.", "deliv": "After Effects"},
            {"n": "05", "title": "Thumbnails strategy", "desc": "Concept de miniatures CTR-first, A/B testing, alignement titre/visuel pour maximiser le clic.", "deliv": "3 variantes / vidéo"},
            {"n": "06", "title": "Stratégie de chaîne", "desc": "Audit, recommandations format & narration, intro/outro packs, identité éditoriale cohérente.", "deliv": "Rapport + 1 call"},
        ]
    },
    "process": {
        "title_line1": "Du rush",
        "title_line2": "au master",
        "subtitle": "Un process clair en cinq temps, conçu pour que tu saches toujours où on en est et ce qui vient ensuite.",
        "steps": [
            {"n": "01", "title": "Brief & rushes", "desc": "Tu m'envoies tes rushes via Frame.io ou Drive. On clarifie la vision, le ton, la durée, les références."},
            {"n": "02", "title": "Cut narratif", "desc": "Je structure l'histoire, choisis les meilleurs takes et pose un premier montage axé rétention."},
            {"n": "03", "title": "Sound & color", "desc": "Sound design, musique sous licence, étalonnage cinéma. La couche émotionnelle qui change tout."},
            {"n": "04", "title": "Révisions", "desc": "Deux tours de retouches inclus. Feedback timecodé pour aller vite et droit au but."},
            {"n": "05", "title": "Livraison", "desc": "Master 4K + variantes Shorts / Reels si besoin. Thumbnail livré en option."},
        ]
    },
    "stats": {
        "items": [
            {"value": "12M+", "label": "Vues générées", "sub": "sur les chaînes clients"},
            {"value": "240+", "label": "Vidéos livrées", "sub": "long-form & shorts"},
            {"value": "48h", "label": "Délai moyen", "sub": "premier cut"},
            {"value": "98%", "label": "Taux de retour", "sub": "clients satisfaits"},
        ]
    },
    "about": {
        "title_line1": "Je suis Guildwen,",
        "title_line2": "monteur vidéo",
        "title_line3": " et obsédé du détail.",
        "paragraph1": "Depuis plusieurs années, j'accompagne des créateurs YouTube et des marques à transformer leurs idées en vidéos qui captent l'attention dès la première seconde et la gardent jusqu'à la fin.",
        "paragraph2": "Ma signature : un montage rythmé, un sound design soigné, et un sens cinématographique du cadre. L'objectif n'est pas juste de couper des clips — c'est de raconter une histoire qui fait grandir une chaîne.",
        "portrait": "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1000&auto=format&fit=crop",
        "skills": ["Premiere Pro", "DaVinci Resolve", "After Effects", "Photoshop", "Frame.io"],
    },
    "testimonials": {
        "items": [
            {"quote": "Guildwen a transformé mon contenu. Mes vidéos retiennent l'audience deux fois plus longtemps qu'avant — c'est devenu une part essentielle de la stratégie de la chaîne.", "name": "Léo M.", "role": "Créateur YouTube · 480K abonnés"},
            {"quote": "Précis, rapide, et un vrai sens du storytelling. Il comprend ce qu'on veut dire avant qu'on le dise. Le genre de monteur qu'on garde précieusement.", "name": "Sarah D.", "role": "Brand manager · DTC skincare"},
            {"quote": "Mon premier Short édité par EditGuil a fait 1.8M de vues en 3 jours. Pas un hasard : le hook, le rythme, le sound design — tout est calibré.", "name": "Antoine R.", "role": "Gaming creator"},
        ]
    },
    "pricing": {
        "items": [
            {"name": "Short", "price": "à partir de 80€", "desc": "YouTube Shorts / Reels / TikTok. Idéal pour booster la portée d'une chaîne existante.", "features": ["Vidéo verticale 60s max", "Hook 3 secondes optimisé", "Sous-titres dynamiques", "Sound design + musique", "2 révisions incluses"], "highlighted": False},
            {"name": "Long-form", "price": "à partir de 290€", "desc": "L'offre principale. Vidéo YouTube 8–20 min, narration & rétention au centre.", "features": ["Montage narratif structuré", "B-roll, color grading film", "Sound design + musique licenciée", "Motion graphics légers", "2 révisions incluses", "Délai express possible"], "highlighted": True},
            {"name": "Abonnement", "price": "sur devis", "desc": "Pour les chaînes qui publient régulièrement. Tarif dégressif, slots prioritaires.", "features": ["2 à 8 vidéos / mois", "Slot dédié dans le planning", "Cohérence éditoriale garantie", "Reporting mensuel", "Thumbnails inclus"], "highlighted": False},
        ]
    },
    "faq": {
        "items": [
            {"q": "Quel est ton délai moyen pour livrer une vidéo ?", "a": "Pour une long-form YouTube (10–15 min), compte 4 à 7 jours après réception des rushes. Pour un Short, 24 à 48h. En mode express, on peut s'arranger."},
            {"q": "Comment je t'envoie mes rushes ?", "a": "Google Drive, Frame.io, WeTransfer ou Dropbox — au choix. Je te fournis un brief template à remplir pour gagner du temps des deux côtés."},
            {"q": "Combien de révisions sont incluses ?", "a": "Deux tours de révisions sont inclus dans chaque formule. Le feedback timecodé est encouragé : ça permet d'aller droit au but."},
            {"q": "Tu travailles avec des chaînes débutantes ?", "a": "Oui — si la volonté de progresser est là. Je préfère travailler avec des créateurs ambitieux qu'avec une chaîne déjà énorme mais sans direction."},
            {"q": "Tu fournis la musique et les sons ?", "a": "Oui, je travaille avec des banques sous licence (Artlist, Epidemic Sound) et je peux utiliser les tiennes si tu as déjà un abonnement."},
            {"q": "Et si je ne suis pas satisfait du résultat ?", "a": "On revoit ensemble jusqu'à ce que la vidéo te convienne (dans la limite des révisions incluses)."},
        ]
    },
    "contact": {
        "title_line1": "On",
        "title_line2": "tourne ?",
        "intro": "Que tu sois créateur YouTube en pleine croissance ou marque qui veut une vidéo qui marque les esprits — raconte-moi ton projet, je reviens vers toi en moins de 24h.",
        "email": "guildwen.marot@gmail.com",
        "location": "France — disponible en remote",
        "youtube_url": "",
        "instagram_url": "",
        "tiktok_url": "",
        "status": "Slots ouverts — 2025",
        "response_time": "≤ 24h",
    },
    "footer": {
        "tagline": "Monteur vidéo freelance — basé en France, dispo partout. Spécialisé YouTube long-form, Shorts et vlogs cinématiques.",
        "rights": "TOUS DROITS RÉSERVÉS",
        "signature": "CRAFTED FRAME BY FRAME ◆ EDITGUIL",
    },
}


# ---------- HELPERS ----------
def _format_email_html(c: Contact) -> str:
    return f"""
    <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif; background:#0A0A0A; color:#F5F5F0; padding:24px;">
      <tr><td>
        <h2 style="font-family:Georgia,serif;font-weight:400;color:#F5F5F0;margin:0 0 8px 0;">Nouvelle demande client — EditGuil</h2>
        <p style="color:#8C8C8C;margin:0 0 24px 0;font-size:12px;letter-spacing:2px;text-transform:uppercase;">Portfolio Contact Form</p>
        <table cellpadding="8" cellspacing="0" style="width:100%;border-collapse:collapse;background:#121212;border:1px solid #2A2A2A;">
          <tr><td style="color:#8C8C8C;width:160px;border-bottom:1px solid #2A2A2A;">Nom</td><td style="color:#F5F5F0;border-bottom:1px solid #2A2A2A;">{c.name}</td></tr>
          <tr><td style="color:#8C8C8C;border-bottom:1px solid #2A2A2A;">Email</td><td style="color:#F5F5F0;border-bottom:1px solid #2A2A2A;">{c.email}</td></tr>
          <tr><td style="color:#8C8C8C;border-bottom:1px solid #2A2A2A;">Chaîne / Lien</td><td style="color:#F5F5F0;border-bottom:1px solid #2A2A2A;">{c.channel or '—'}</td></tr>
          <tr><td style="color:#8C8C8C;border-bottom:1px solid #2A2A2A;">Type de projet</td><td style="color:#F5F5F0;border-bottom:1px solid #2A2A2A;">{c.project_type or '—'}</td></tr>
          <tr><td style="color:#8C8C8C;border-bottom:1px solid #2A2A2A;">Budget</td><td style="color:#F5F5F0;border-bottom:1px solid #2A2A2A;">{c.budget or '—'}</td></tr>
          <tr><td style="color:#8C8C8C;vertical-align:top;">Message</td><td style="color:#F5F5F0;white-space:pre-wrap;">{c.message}</td></tr>
        </table>
        <p style="color:#8C8C8C;font-size:11px;margin-top:16px;">Reçu le {c.created_at.strftime('%Y-%m-%d %H:%M UTC')} — ID {c.id}</p>
      </td></tr>
    </table>
    """


async def _send_email_async(contact: Contact) -> bool:
    if not RESEND_API_KEY:
        return False
    params = {
        "from": SENDER_EMAIL,
        "to": [OWNER_EMAIL],
        "reply_to": contact.email,
        "subject": f"Nouvelle demande — {contact.name}",
        "html": _format_email_html(contact),
    }
    try:
        await asyncio.to_thread(resend.Emails.send, params)
        return True
    except Exception as e:
        logger.error(f"Resend send failed: {e}")
        return False


# ---------- ROUTES — PUBLIC ----------
@api_router.get("/")
async def root():
    return {"message": "EditGuil portfolio API", "status": "ok"}


@api_router.get("/content")
async def get_content():
    doc = await db.content.find_one({"_singleton": "portfolio"}, {"_id": 0, "_singleton": 0})
    if not doc:
        return DEFAULT_CONTENT
    return doc.get("data", DEFAULT_CONTENT)


@api_router.post("/contact", response_model=Contact)
async def create_contact(payload: ContactCreate):
    contact = Contact(**payload.model_dump())
    sent = await _send_email_async(contact)
    contact.email_sent = sent
    doc = contact.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['email'] = str(doc['email'])
    try:
        await db.contacts.insert_one(doc)
    except Exception as e:
        logger.error(f"Mongo insert failed: {e}")
        raise HTTPException(status_code=500, detail="Erreur enregistrement")
    return contact


# ---------- ROUTES — AUTH ----------
@api_router.post("/auth/login", response_model=LoginResponse)
async def login(payload: LoginPayload):
    email = payload.email.lower()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")
    token = create_token(user["id"], user["email"])
    return LoginResponse(token=token, user={"id": user["id"], "email": user["email"], "name": user.get("name", "Admin")})


@api_router.get("/auth/me")
async def me(admin=Depends(get_current_admin)):
    return admin


# ---------- ROUTES — ADMIN ----------
@api_router.put("/content")
async def update_content(payload: ContentPayload, admin=Depends(get_current_admin)):
    await db.content.update_one(
        {"_singleton": "portfolio"},
        {"$set": {"_singleton": "portfolio", "data": payload.data, "updated_at": datetime.now(timezone.utc).isoformat()}},
        upsert=True,
    )
    return {"ok": True, "updated_at": datetime.now(timezone.utc).isoformat()}


@api_router.get("/admin/contacts", response_model=List[Contact])
async def list_contacts(admin=Depends(get_current_admin)):
    rows = await db.contacts.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    for r in rows:
        if isinstance(r.get('created_at'), str):
            try:
                r['created_at'] = datetime.fromisoformat(r['created_at'])
            except Exception:
                r['created_at'] = datetime.now(timezone.utc)
    return rows


@api_router.delete("/admin/contacts/{contact_id}")
async def delete_contact(contact_id: str, admin=Depends(get_current_admin)):
    res = await db.contacts.delete_one({"id": contact_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Introuvable")
    return {"ok": True}


ALLOWED_IMG_EXT = {".jpg", ".jpeg", ".png", ".webp", ".gif"}


@api_router.post("/admin/upload")
async def upload_image(file: UploadFile = File(...), admin=Depends(get_current_admin)):
    ext = Path(file.filename or "").suffix.lower()
    if ext not in ALLOWED_IMG_EXT:
        raise HTTPException(status_code=400, detail="Format non supporté (jpg/png/webp/gif)")
    filename = f"{uuid.uuid4().hex}{ext}"
    dest = UPLOAD_DIR / filename
    try:
        with dest.open("wb") as f:
            shutil.copyfileobj(file.file, f)
    finally:
        await file.close()
    return {"url": f"/api/uploads/{filename}", "filename": filename}


# ---------- STARTUP ----------
@app.on_event("startup")
async def startup():
    # Indexes
    try:
        await db.users.create_index("email", unique=True)
        await db.users.create_index("id", unique=True)
        await db.contacts.create_index("id", unique=True)
        await db.content.create_index("_singleton", unique=True)
    except Exception as e:
        logger.warning(f"Index creation: {e}")

    # Seed admin (idempotent)
    existing = await db.users.find_one({"email": ADMIN_EMAIL})
    if not existing:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": ADMIN_EMAIL,
            "password_hash": hash_password(ADMIN_PASSWORD),
            "name": "Guildwen",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info(f"Admin seeded: {ADMIN_EMAIL}")
    else:
        # Update password if .env changed
        if not verify_password(ADMIN_PASSWORD, existing.get("password_hash", "")):
            await db.users.update_one(
                {"email": ADMIN_EMAIL},
                {"$set": {"password_hash": hash_password(ADMIN_PASSWORD)}},
            )
            logger.info(f"Admin password updated: {ADMIN_EMAIL}")

    # Seed default content (idempotent — only if no content doc yet)
    has_content = await db.content.find_one({"_singleton": "portfolio"})
    if not has_content:
        await db.content.insert_one({
            "_singleton": "portfolio",
            "data": DEFAULT_CONTENT,
            "updated_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info("Default content seeded")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()


# Mount router + CORS
app.include_router(api_router)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)
