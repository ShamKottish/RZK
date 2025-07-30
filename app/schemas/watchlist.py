from pydantic import BaseModel

class WatchlistItem(BaseModel):
    symbol: str
    company_name: str
