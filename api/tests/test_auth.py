# tests/test_auth.py
from fastapi.testclient import TestClient


def test_login_admin_success(client: TestClient):
    """Testuje pomyślne logowanie admina."""
    response = client.post(
        "/login",
        json={"username": "admin", "password": "admin"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "authToken" in data
    assert data["authToken"] == "sekretny-klucz-admina-123"

def test_login_guest_success(client: TestClient):
    """Testuje pomyślne logowanie gościa."""
    response = client.post(
        "/login",
        json={"username": "guest", "password": "guest"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["role"] == "guest"

def test_login_invalid_credentials(client: TestClient):
    """Testuje próbę logowania z błędnymi danymi."""
    response = client.post(
        "/login",
        json={"username": "admin", "password": "wrong_password"}
    )
    assert response.status_code == 401
    assert response.json() == {"detail": "Invalid credentials"}

def test_login_nonexistent_user(client: TestClient):
    """Testuje próbę logowania nieistniejącym użytkownikiem."""
    response = client.post(
        "/login",
        json={"username": "hacker", "password": "password"}
    )
    assert response.status_code == 401
    assert response.json() == {"detail": "Invalid credentials"}