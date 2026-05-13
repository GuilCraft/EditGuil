"""Backend API tests for EditGuil portfolio (root, contact CRUD, validation, persistence)."""
import os
import time
import requests
import pytest

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')
if not BASE_URL:
    # Fallback: read from frontend .env so tests can run locally
    try:
        with open('/app/frontend/.env') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    BASE_URL = line.split('=', 1)[1].strip().rstrip('/')
                    break
    except Exception:
        pass

API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---------- Root ----------
class TestRoot:
    def test_root_returns_ok(self, client):
        r = client.get(f"{API}/")
        assert r.status_code == 200, r.text
        data = r.json()
        assert data.get("status") == "ok"
        assert "message" in data


# ---------- Contact CRUD ----------
class TestContact:
    def test_create_contact_valid(self, client):
        payload = {
            "name": "TEST_Jean Test",
            "email": "test.jean@example.com",
            "channel": "https://youtube.com/@test",
            "project_type": "long-form",
            "budget": "500-1000",
            "message": "Bonjour, ceci est un test automatisé.",
        }
        r = client.post(f"{API}/contact", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["name"] == payload["name"]
        assert data["email"] == payload["email"]
        assert data["message"] == payload["message"]
        assert isinstance(data.get("id"), str) and len(data["id"]) > 0
        assert "email_sent" in data and isinstance(data["email_sent"], bool)
        # Resend should accept this in test mode; expect True if API key set
        assert data["email_sent"] is True, "email_sent should be True when Resend API key is configured"
        # Save id for later check
        pytest.created_contact_id = data["id"]
        pytest.created_contact_name = payload["name"]

    def test_create_contact_missing_fields(self, client):
        # Missing message
        r = client.post(f"{API}/contact", json={"name": "X", "email": "x@y.com"})
        assert r.status_code == 422, r.text
        # Missing email
        r = client.post(f"{API}/contact", json={"name": "X", "message": "hi"})
        assert r.status_code == 422
        # Missing name
        r = client.post(f"{API}/contact", json={"email": "x@y.com", "message": "hi"})
        assert r.status_code == 422

    def test_create_contact_invalid_email(self, client):
        r = client.post(f"{API}/contact", json={
            "name": "X", "email": "not-an-email", "message": "hello"
        })
        assert r.status_code == 422, r.text

    def test_create_contact_empty_strings(self, client):
        r = client.post(f"{API}/contact", json={
            "name": "", "email": "a@b.com", "message": ""
        })
        assert r.status_code == 422

    def test_list_contacts_contains_created(self, client):
        # Give Mongo a beat
        time.sleep(0.5)
        r = client.get(f"{API}/contacts")
        assert r.status_code == 200, r.text
        rows = r.json()
        assert isinstance(rows, list)
        # No _id leakage from Mongo
        for row in rows[:5]:
            assert "_id" not in row
        # Created contact persisted
        created_id = getattr(pytest, "created_contact_id", None)
        if created_id:
            ids = [row.get("id") for row in rows]
            assert created_id in ids, "Created contact not found in /api/contacts"
