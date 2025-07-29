from pydantic import BaseModel
from datetime import date


class SavingsGoalCreate(BaseModel):
    goal_name: str
    target_amount: float
    target_date: date
