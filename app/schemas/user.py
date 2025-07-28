from pydantic import BaseModel, EmailStr
from typing import Optional


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    savings: float
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    savings: float
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str

    class Config:
        orm_mode = True
