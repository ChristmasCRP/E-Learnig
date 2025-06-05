from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from app.firebase import db

router = APIRouter()

class Course(BaseModel):
    title: str
    description: str
    author: str

@router.get("/courses")
def get_courses():
    docs = db.collection("courses").stream()
    return [doc.to_dict() | {"id": doc.id} for doc in docs]

@router.get("/courses/{course_id}")
def get_course(course_id: str):
    doc = db.collection("courses").document(course_id).get()
    if doc.exists:
        return doc.to_dict() | {"id": doc.id}
    raise HTTPException(status_code=404, detail="Course not found")

@router.post("/courses")
def add_course(course: Course, request: Request):
    role = request.headers.get("X-User-Role")
    if role != "admin":
        raise HTTPException(status_code=403, detail="Permission denied")
    db.collection("courses").add(course.dict())
    return {"message": "Course added"}

@router.put("/courses/{course_id}")
def update_course(course_id: str, course: Course, request: Request):
    role = request.headers.get("X-User-Role")
    if role != "admin":
        raise HTTPException(status_code=403, detail="Permission denied")
    doc_ref = db.collection("courses").document(course_id)
    if not doc_ref.get().exists:
        raise HTTPException(status_code=404, detail="Course not found")
    doc_ref.update(course.dict())
    return {"message": "Course updated"}

@router.delete("/courses/{course_id}")
def delete_course(course_id: str, request: Request):
    role = request.headers.get("X-User-Role")
    if role != "admin":
        raise HTTPException(status_code=403, detail="Permission denied")
    doc_ref = db.collection("courses").document(course_id)
    if not doc_ref.get().exists:
        raise HTTPException(status_code=404, detail="Course not found")
    doc_ref.delete()
    return {"message": "Course deleted"}
