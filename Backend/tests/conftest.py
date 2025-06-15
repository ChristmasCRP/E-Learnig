# tests/conftest.py
import pytest
from fastapi.testclient import TestClient
from app.main import app 

@pytest.fixture(scope="module")
def client():
    """
    Tworzy klienta testowego dla naszej aplikacji FastAPI.
    'scope="module"' oznacza, że klient zostanie stworzony raz na cały plik testowy.
    """
    with TestClient(app) as c:
        yield c