from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from app.firebase import db

router = APIRouter()

ADMIN_AUTH_TOKEN = "sekretny-klucz-admina-123"


class Course(BaseModel):
    title: str
    author: str
    sections: list[str]
    video_url: str

class CourseInDB(Course):
    id: str


def verify_admin_token(request: Request):
    """Pomocnicza funkcja do weryfikacji tokena admina"""
    auth_header = request.headers.get("Authorization")
    expected_header_value = f"Bearer {ADMIN_AUTH_TOKEN}"
    if auth_header != expected_header_value:
        raise HTTPException(status_code=403, detail="Permission denied. Invalid or missing token.")

@router.get("/courses")
def get_courses():
    """Zwraca listę wszystkich kursów z pełnymi danymi."""
    docs = db.collection("courses").stream()
    course_list = []
    for doc in docs:
        course_data = doc.to_dict()
        course_data["id"] = doc.id
        course_list.append(course_data)
    return course_list

@router.get("/courses/{course_id}", response_model=CourseInDB)
def get_course(course_id: str):
    """Zwraca pełne dane jednego, konkretnego kursu."""
    doc_ref = db.collection("courses").document(course_id)
    doc = doc_ref.get()
    if doc.exists:
        course_data = doc.to_dict()
        course_data["id"] = doc.id
        return course_data
    raise HTTPException(status_code=404, detail="Course not found")

@router.post("/courses", status_code=201)
def add_course(course: Course, request: Request):
    """Dodaje nowy kurs. Wymaga danych w nowym, płaskim formacie."""
    verify_admin_token(request)  
    db.collection("courses").add(course.model_dump())
    return {"message": "Course added successfully"}

@router.put("/courses/{course_id}")
def update_course(course_id: str, course: Course, request: Request):
    """Aktualizuje istniejący kurs."""
    verify_admin_token(request)  
    doc_ref = db.collection("courses").document(course_id)
    if not doc_ref.get().exists:
        raise HTTPException(status_code=404, detail="Course not found")
    doc_ref.update(course.model_dump())
    return {"message": "Course updated successfully"}

@router.delete("/courses/{course_id}")
def delete_course(course_id: str, request: Request):
    """Usuwa kurs."""
    verify_admin_token(request)  
    doc_ref = db.collection("courses").document(course_id)
    if not doc_ref.get().exists:
        raise HTTPException(status_code=404, detail="Course not found")
    doc_ref.delete()
    return {"message": "Course deleted successfully"}