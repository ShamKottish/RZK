from typing import Optional
from pydantic import BaseModel
from datetime import date


class SavingsGoalCreate(BaseModel):
    goal_name: str
    target_amount: float
    target_date: date
    investing: bool
    expected_return: Optional[float] = None
    interest_type: Optional[str] = None
    risk_tolerance: Optional[str] = None


class SavingsGoalRead(SavingsGoalCreate):
    id: int
    current_amount: float

    class Config:
        orm_mode = True
