from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TransactionCreate(BaseModel):
    type: str
    amount: Optional[float]
    description: Optional[str]
    savings_goal_id: Optional[int]

class TransactionOut(TransactionCreate):
    id: int
    timestamp: datetime

    class Config:
        orm_mode = True
