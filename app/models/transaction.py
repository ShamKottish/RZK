from sqlalchemy import Column, Integer, Float, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    savings_goal_id = Column(Integer, ForeignKey("savings_goals.id"), nullable=True)

    type = Column(String(255), nullable=False)
    amount = Column(Float, nullable=True)
    description = Column(String(255), nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("app.models.user.User", back_populates="transactions")

