from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import asyncio
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import resend


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Resend setup
RESEND_API_KEY = os.environ.get('RESEND_API_KEY')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
OWNER_EMAIL = os.environ.get('OWNER_EMAIL', 'guildwen.marot@gmail.com')
if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

# App
app = FastAPI()
api_router = APIRouter(prefix="/api")

# ---------- Models ----------
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


# ---------- Helpers ----------
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


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "EditGuil portfolio API", "status": "ok"}


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


@api_router.get("/contacts", response_model=List[Contact])
async def list_contacts():
    rows = await db.contacts.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    for r in rows:
        if isinstance(r.get('created_at'), str):
            try:
                r['created_at'] = datetime.fromisoformat(r['created_at'])
            except Exception:
                r['created_at'] = datetime.now(timezone.utc)
    return rows


# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
