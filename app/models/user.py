# the table layout of the user acc.

from sqlalchemy.orm import relationship
from app.db.database import Base
from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey, Boolean


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    phone_number = Column(String(20), nullable=True)
    password_hash = Column(String(255))
    savings_goal = Column(Float)
    current_savings = Column(Float)
    savings = Column(Float, nullable=False)
    birthday = Column(Date, nullable=False)

    savings_goals = relationship("SavingsGoal", back_populates="user")
    transactions = relationship("Transaction", back_populates="user")


class SavingsGoal(Base):
    __tablename__ = "savings_goals"


    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    goal_name = Column(String(255), nullable=False)
    target_amount = Column(Float, nullable=False)
    target_date = Column(Date, nullable=False)
    current_amount = Column(Float, default=0.0)
    investing = Column(Boolean, default=False)
    expected_return = Column(Float, nullable=True)
    interest_type = Column(String(255))
    risk_tolerance = Column(String(255))

    user = relationship("User", back_populates="savings_goals")
