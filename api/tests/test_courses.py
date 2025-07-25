# tests/test_courses.py
from fastapi.testclient import TestClient
from unittest.mock import MagicMock, patch


FAKE_COURSE_DATA = {
    "title": "Nowy Kurs o Pydantic",
    "author": "Eryk Pydant",
    "sections": [
        {
            "number": "1.1",
            "title": "Wprowadzenie do modeli",
            "content": "Tutaj znajduje się treść pierwszej sekcji kursu."
        },
        {
            "number": "1.2",
            "title": "Zaawansowana walidacja",
            "content": "Opisujemy zaawansowane techniki walidacji danych."
        }
    ],
    "video_url": "http://example.com/new-video"
}

FAKE_COURSE_IN_DB = {
    "id": "course1",
    **FAKE_COURSE_DATA
}

ADMIN_TOKEN = "sekretny-klucz-admina-123"
AUTH_HEADER = {"Authorization": f"Bearer {ADMIN_TOKEN}"}


@patch("app.routes.courses.db")
def test_get_courses(mock_db: MagicMock, client: TestClient):
    """Testuje pobieranie wszystkich kursów z nową strukturą."""
    mock_doc = MagicMock()
    mock_doc.id = "course1"
   
    mock_doc.to_dict.return_value = FAKE_COURSE_DATA.copy()
    mock_db.collection.return_value.stream.return_value = [mock_doc]

    response = client.get("/courses")

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1

    assert data[0] == FAKE_COURSE_IN_DB
    mock_db.collection.assert_called_with("courses")

@patch("app.routes.courses.db")
def test_add_course_success(mock_db: MagicMock, client: TestClient):
    """Testuje dodawanie kursu z nową strukturą przez admina."""
    response = client.post(
        "/courses",
        json=FAKE_COURSE_DATA,  
        headers=AUTH_HEADER
    )

    assert response.status_code == 201
    assert response.json() == {"message": "Course added successfully"}


    mock_db.collection.return_value.add.assert_called_once_with(FAKE_COURSE_DATA)

@patch("app.routes.courses.db")
def test_add_course_unauthorized(mock_db: MagicMock, client: TestClient):
    """Testuje próbę dodania kursu z nową strukturą bez autoryzacji."""

    response = client.post("/courses", json=FAKE_COURSE_DATA)
    
    assert response.status_code == 403
    assert "Invalid or missing token" in response.json()["detail"]
    mock_db.collection.return_value.add.assert_not_called()

@patch("app.routes.courses.db")
def test_delete_course_not_found(mock_db: MagicMock, client: TestClient):
    """Testuje próbę usunięcia nieistniejącego kursu."""
    mock_doc_ref = mock_db.collection.return_value.document.return_value
    mock_doc_ref.get.return_value.exists = False
    
    response = client.delete("/courses/nonexistent-id", headers=AUTH_HEADER)
    
    assert response.status_code == 404
    assert response.json() == {"detail": "Course not found"}
    mock_doc_ref.delete.assert_not_called()