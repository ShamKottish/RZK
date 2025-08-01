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

    savings_goals = relationship("app.models.savings.SavingsGoal", back_populates="user", cascade="all, delete-orphan")
    transactions = relationship("app.models.transaction.Transaction", back_populates="user", cascade="all, delete-orphan")

