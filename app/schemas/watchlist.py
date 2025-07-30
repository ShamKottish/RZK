from pydantic import BaseModel

class WatchlistItem(BaseModel):
    symbol: str
    company_name: str

class WatchlistItemCreate(WatchlistItem):
    pass

class WatchlistItemOut(WatchlistItem):
    id: int
    symbol: str
    user_id: int

    class Config:
        orm_mode = True