from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/login")
def login(data: LoginRequest):
    if data.username == "admin" and data.password == "admin":
        return {"success": True, "authToken": "sekretny-klucz-admina-123"}
    elif data.username == "guest" and data.password == "guest":
        return {"success": True, "role": "guest"}
    else:
        raise HTTPException(status_code=401, detail="Invalid credentials")