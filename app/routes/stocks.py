from fastapi import APIRouter
from app.services.stocks import get_stock_price

router = APIRouter()

@router.get("/stock/{symbol}")
async def get_stock(symbol: str):
    return await get_stock_price(symbol)
