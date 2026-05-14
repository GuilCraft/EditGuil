"""Backend API tests for EditGuil admin features: auth, content CRUD, contacts admin, upload."""
import os
import io
import time
import requests
import pytest

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')
if not BASE_URL:
    try:
        with open('/app/frontend/.env') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    BASE_URL = line.split('=', 1)[1].strip().rstrip('/')
                    break
    except Exception:
        pass

API = f"{BASE_URL}/api"
ADMIN_EMAIL = "guildwen.marot@gmail.com"
ADMIN_PASSWORD = "Guil13Craft"


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def admin_token(client):
    r = client.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    if r.status_code != 200:
        pytest.skip(f"Admin login failed: {r.status_code} {r.text}")
    return r.json()["token"]


@pytest.fixture(scope="module")
def auth_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}", "Content-Type": "application/json"}


# ---------- Root / Public ----------
class TestRoot:
    def test_root_ok(self, client):
        r = client.get(f"{API}/")
        assert r.status_code == 200
        assert r.json().get("status") == "ok"


class TestPublicContent:
    EXPECTED_SECTIONS = [
        "hero", "marquee", "showreel", "projects", "services", "process",
        "stats", "about", "testimonials", "pricing", "faq", "contact", "footer",
    ]

    def test_get_content_returns_all_sections(self, client):
        r = client.get(f"{API}/content")
        assert r.status_code == 200, r.text
        data = r.json()
        assert isinstance(data, dict)
        for k in self.EXPECTED_SECTIONS:
            assert k in data, f"Missing section: {k}"
        # spot-check hero fields
        assert "name_line1" in data["hero"]
        assert "name_line2" in data["hero"]


# ---------- Auth ----------
class TestAuth:
    def test_login_valid(self, client):
        r = client.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        assert r.status_code == 200, r.text
        data = r.json()
        assert "token" in data and isinstance(data["token"], str) and len(data["token"]) > 20
        assert data["user"]["email"] == ADMIN_EMAIL
        assert "id" in data["user"]

    def test_login_wrong_password(self, client):
        r = client.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "wrong-password"})
        assert r.status_code == 401

    def test_login_unknown_email(self, client):
        r = client.post(f"{API}/auth/login", json={"email": "nobody@example.com", "password": "x"})
        assert r.status_code == 401

    def test_me_without_token(self, client):
        r = requests.get(f"{API}/auth/me")
        assert r.status_code == 401

    def test_me_with_invalid_token(self, client):
        r = requests.get(f"{API}/auth/me", headers={"Authorization": "Bearer not.a.real.token"})
        assert r.status_code == 401

    def test_me_with_valid_token(self, auth_headers):
        r = requests.get(f"{API}/auth/me", headers=auth_headers)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["email"] == ADMIN_EMAIL
        # ensure password hash not leaked
        assert "password_hash" not in data
        assert "_id" not in data


# ---------- Content PUT (admin) ----------
class TestContentUpdate:
    def test_put_without_token_unauthorized(self, client):
        r = client.put(f"{API}/content", json={"data": {"hero": {"name_line1": "X"}}})
        assert r.status_code == 401

    def test_put_with_token_persists(self, client, auth_headers):
        # Read current
        cur = client.get(f"{API}/content").json()
        original = cur["hero"]["name_line1"]
        marker = f"TEST_{int(time.time())}"
        cur["hero"]["name_line1"] = marker
        r = requests.put(f"{API}/content", headers=auth_headers, json={"data": cur})
        assert r.status_code == 200, r.text
        assert r.json().get("ok") is True

        # GET back & verify persistence
        time.sleep(0.3)
        after = client.get(f"{API}/content").json()
        assert after["hero"]["name_line1"] == marker
        # all sections still present
        for k in TestPublicContent.EXPECTED_SECTIONS:
            assert k in after

        # restore
        after["hero"]["name_line1"] = original
        restore = requests.put(f"{API}/content", headers=auth_headers, json={"data": after})
        assert restore.status_code == 200


# ---------- Public contact creation + admin contacts ----------
class TestAdminContacts:
    created_id = None

    def test_public_contact_create_still_works(self, client):
        payload = {
            "name": "TEST_AdminFlow",
            "email": "testadmin@example.com",
            "channel": "https://yt/test",
            "project_type": "long-form",
            "budget": "100",
            "message": "Admin test message",
        }
        r = client.post(f"{API}/contact", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["name"] == "TEST_AdminFlow"
        assert "id" in data
        TestAdminContacts.created_id = data["id"]

    def test_admin_contacts_requires_auth(self, client):
        r = client.get(f"{API}/admin/contacts")
        assert r.status_code == 401

    def test_admin_contacts_lists(self, auth_headers):
        r = requests.get(f"{API}/admin/contacts", headers=auth_headers)
        assert r.status_code == 200, r.text
        rows = r.json()
        assert isinstance(rows, list)
        if TestAdminContacts.created_id:
            ids = [x["id"] for x in rows]
            assert TestAdminContacts.created_id in ids
        for row in rows[:5]:
            assert "_id" not in row

    def test_admin_delete_requires_auth(self, client):
        r = client.delete(f"{API}/admin/contacts/some-id")
        assert r.status_code == 401

    def test_admin_delete_contact(self, auth_headers):
        assert TestAdminContacts.created_id, "Need a contact created first"
        r = requests.delete(f"{API}/admin/contacts/{TestAdminContacts.created_id}", headers=auth_headers)
        assert r.status_code == 200, r.text
        assert r.json().get("ok") is True

        # verify gone
        r2 = requests.get(f"{API}/admin/contacts", headers=auth_headers)
        ids = [x["id"] for x in r2.json()]
        assert TestAdminContacts.created_id not in ids

    def test_admin_delete_nonexistent(self, auth_headers):
        r = requests.delete(f"{API}/admin/contacts/does-not-exist-xyz", headers=auth_headers)
        assert r.status_code == 404


# ---------- Image upload ----------
class TestUpload:
    def test_upload_requires_auth(self):
        r = requests.post(f"{API}/admin/upload", files={"file": ("x.png", b"123", "image/png")})
        assert r.status_code == 401

    def test_upload_valid_png(self, admin_token):
        # Minimal valid PNG header bytes
        png_bytes = (
            b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR"
            b"\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4"
            b"\x89\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4"
            b"\x00\x00\x00\x00IEND\xaeB`\x82"
        )
        files = {"file": ("test.png", io.BytesIO(png_bytes), "image/png")}
        r = requests.post(
            f"{API}/admin/upload",
            files=files,
            headers={"Authorization": f"Bearer {admin_token}"},
        )
        assert r.status_code == 200, r.text
        data = r.json()
        assert "url" in data and data["url"].startswith("/api/uploads/")
        assert "filename" in data
        # Verify the uploaded file is served back
        full = f"{BASE_URL}{data['url']}"
        get_r = requests.get(full)
        assert get_r.status_code == 200
        assert get_r.content[:4] == b"\x89PNG"

    def test_upload_invalid_extension(self, admin_token):
        files = {"file": ("test.exe", io.BytesIO(b"MZbad"), "application/octet-stream")}
        r = requests.post(
            f"{API}/admin/upload",
            files=files,
            headers={"Authorization": f"Bearer {admin_token}"},
        )
        assert r.status_code == 400


# ---------- Idempotent admin seed (login still works after assumed restart) ----------
class TestIdempotency:
    def test_login_works_repeatedly(self, client):
        # Multiple logins shouldn't fail (no duplicate admin)
        for _ in range(3):
            r = client.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
            assert r.status_code == 200
