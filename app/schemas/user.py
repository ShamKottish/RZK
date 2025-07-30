from pydantic import BaseModel, EmailStr
from typing import Optional


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    savings: float
    password: str
    savings_goal: Optional[float] = None
    current_savings: float = 0.0


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    savings: float


class UserLogin(BaseModel):
    email: EmailStr
    password: str

    class Config:
        orm_mode = True
