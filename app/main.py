# this is where the FastAPI (exposes py logic to frontend) initializes.

from fastapi import FastAPI
from app.routes import user, finance, ai_chat, savings, transaction, stocks, dashboard, watchlist

app = FastAPI()

# Include your route modules
app.include_router(user.router, prefix="/user")
app.include_router(finance.router, prefix="/finance")
app.include_router(ai_chat.router, prefix="/ai chat")
app.include_router(savings.router, prefix="/savings")
app.include_router(transaction.router, prefix="/transaction")
app.include_router(stocks.router)
app.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
app.include_router(watchlist.router, prefix="/stocks", tags=["Watchlist"])
