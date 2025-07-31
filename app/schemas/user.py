from pydantic import BaseModel, EmailStr
from typing import Optional


class UserCreate(BaseModel):

    email: EmailStr
    password: str
    phone_number: str

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
