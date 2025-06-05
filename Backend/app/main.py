from fastapi import FastAPI
from app.firebase import db
from app.routes import auth, courses
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.include_router(auth.router)
app.include_router(courses.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the E-Learning API"}

@app.post("/course")
def add_course(course: dict):
    db.collection("courses").add(course)
    return {"message": "Course added"}