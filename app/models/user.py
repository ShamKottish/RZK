# the table layout of the user acc.

from sqlalchemy import Column, Integer, String, Float
from app.db.connection import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255))
    savings_goal = Column(Float)
    current_savings = Column(Float)
    savings = Column(Float, nullable=False)
