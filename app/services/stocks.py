import httpx

# DONT FORGET TO CHOOSE THE API !!!
API_KEY = "your_api_key_here"
BASE_URL = "https://api.twelvedata.com"


# might change function name later
async def get_stock_price(symbol: str):
    url = f"{BASE_URL}/quote?symbol={symbol}&apikey={API_KEY}"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        data = response.json()
        return {
            "symbol": data.get("symbol"),
            "name": data.get("name"),
            "price": data.get("price"),
            "change": data.get("percent_change"),
        }
