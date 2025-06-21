from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import openai
import os
from ..firebase import db

router = APIRouter()

class ChatRequest(BaseModel):
    prompt: str

def get_all_courses_from_db():
    """Pobiera pełne dane wszystkich kursów z Firebase."""
    try:
        docs = db.collection("courses").stream()
        courses = []
        for doc in docs:
            course_data = doc.to_dict()
            course_data["id"] = doc.id
            courses.append(course_data)
        return courses
    except Exception as e:
        print(f"Błąd podczas pobierania kursów z Firebase: {e}")
        return []

@router.post("/chat")
async def handle_chat_request(request: ChatRequest):
    """
    Endpoint do obsługi zapytań do chatbota.
    Używa treści kursów jako kontekstu do odpowiedzi (logika RAG).
    """
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="Klucz API OpenAI nie jest skonfigurowany na serwerze.")
    
    openai.api_key = api_key

    all_courses = get_all_courses_from_db()
    if not all_courses:
        raise HTTPException(status_code=503, detail="Brak dostępnych kursów do rozmowy.")

    context = ""
    course_titles = []
    for course in all_courses:
        course_titles.append(course.get('title', ''))
        context += f"Tytuł kursu: {course.get('title', '')}\n"
        context += f"Treść sekcji 1: {course.get('section_one', '')}\n"
        context += f"Treść sekcji 2: {course.get('section_two', '')}\n\n"

    system_prompt = f"""
    Jesteś 'Asystentem Kursów'. Twoim zadaniem jest odpowiadanie na pytania użytkowników,
    korzystając WYŁĄCZNIE z wiedzy zawartej w poniższym kontekście.
    
    KONTEKST (treść dostępnych kursów):
    ---
    {context}
    ---
    
    ZASADY:
    1. Odpowiadaj tylko na pytania, na które odpowiedź można znaleźć w powyższym KONTEKŚCIE.
    2. Jeśli pytanie dotyczy czegoś spoza kontekstu (np. pogody, historii, sportu), grzecznie odmów.
    3. Nie wymyślaj informacji. Jeśli nie znasz odpowiedzi na podstawie kontekstu, powiedz "Niestety, nie znalazłem odpowiedzi na to pytanie w dostępnych materiałach kursowych."
    4. Odpowiadaj zwięźle i na temat.
    
    Przykład odmowy: "Przepraszam, ale to pytanie wykracza poza tematykę naszych kursów. Czy mogę pomóc w czymś innym dotyczącym tematyki naszych kursów?"
    """

    try:
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": request.prompt}
            ],
            max_tokens=250
        )
        
        bot_response = response.choices[0].message.content
        return {"response": bot_response}

    except Exception as e:
        print(f"Wystąpił błąd API OpenAI: {e}")
        raise HTTPException(status_code=503, detail="Serwis AI jest chwilowo niedostępny.")