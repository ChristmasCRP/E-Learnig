# tests/test_chat.py
from fastapi.testclient import TestClient
from unittest.mock import MagicMock, patch

@patch("app.routes.chat.openai")
@patch("app.routes.chat.db")
@patch("app.routes.chat.os.getenv")
def test_chat_success(mock_getenv: MagicMock, mock_db: MagicMock, mock_openai: MagicMock, client: TestClient):
    """Testuje pomyślną odpowiedź z chatu, gdy wszystkie usługi działają."""
  
    mock_getenv.return_value = "fake-api-key"
    
 
    mock_course_doc = MagicMock()
    mock_course_doc.id = "course1"
    mock_course_doc.to_dict.return_value = {
        "title": "Python dla początkujących",
        "section_one": "Zmienne i typy danych.",
        "section_two": "Pętle i instrukcje warunkowe."
    }
    mock_db.collection.return_value.stream.return_value = [mock_course_doc]
    
    
    mock_chat_response = MagicMock()
    mock_chat_response.choices[0].message.content = "Odpowiedź bota na podstawie kursu Python."
    mock_openai.chat.completions.create.return_value = mock_chat_response
    
    response = client.post("/chat", json={"prompt": "Czym są zmienne w Python?"})

    assert response.status_code == 200
    data = response.json()
    assert data["response"] == "Odpowiedź bota na podstawie kursu Python."
    
    assert mock_openai.api_key == "fake-api-key"
    
   
    mock_openai.chat.completions.create.assert_called_once()
   
    call_args = mock_openai.chat.completions.create.call_args
    system_prompt = call_args[1]['messages'][0]['content']
    assert "Python dla początkujących" in system_prompt
    assert "Zmienne i typy danych." in system_prompt

@patch("app.routes.chat.os.getenv")
def test_chat_no_api_key(mock_getenv: MagicMock, client: TestClient):
    """Testuje sytuację, gdy brakuje klucza API OpenAI."""
    mock_getenv.return_value = None 
    
    response = client.post("/chat", json={"prompt": "test"})
    
    assert response.status_code == 500
    assert "Klucz API OpenAI nie jest skonfigurowany" in response.json()["detail"]

@patch("app.routes.chat.openai")
@patch("app.routes.chat.get_all_courses_from_db") 
@patch("app.routes.chat.os.getenv")
def test_chat_no_courses_in_db(mock_getenv: MagicMock, mock_get_courses: MagicMock, mock_openai: MagicMock, client: TestClient):
    """Testuje sytuację, gdy baza danych nie zwraca żadnych kursów."""
    mock_getenv.return_value = "fake-api-key"
    mock_get_courses.return_value = []
    
    response = client.post("/chat", json={"prompt": "test"})
    
    assert response.status_code == 503
    assert "Brak dostępnych kursów do rozmowy" in response.json()["detail"]
    mock_openai.chat.completions.create.assert_not_called()