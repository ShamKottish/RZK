from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.db.database import Base


class SavingsGoal(Base):
    __tablename__ = "savings_goals"


    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    goal_name = Column(String, nullable=False)
    target_amount = Column(Float, nullable=False)
    target_date = Column(Date, nullable=False)
    current_amount = Column(Float, default=0.0)
    investing = Column(Boolean, default=False)
    expected_return = Column(Float, nullable=True)
    interest_type = Column(String)
    risk_tolerance = Column(String)

    user = relationship("User", back_populates="savings_goals")
