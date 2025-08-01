from sqlalchemy import Column, Integer, String, ForeignKey
from app.db.database import Base


class WatchlistItem(Base):
    __tablename__ = "watchlist"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    symbol = Column(String(255))
    company_name = Column(String(255))

    class Config:
        orm_mode = True