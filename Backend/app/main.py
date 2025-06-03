from fastapi import FastAPI
from app.firebase import db

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Welcome to the E-Learning API"}

@app.post("/course")
def add_course(course: dict):
    db.collection("courses").add(course)
    return {"message": "Course added"}