#this is where the FastAPI (exposes py logic to frontend) intializes.

from fastapi import FastAPI
from app.routes import user, finance, ai_chat, savings, transaction

app = FastAPI()

# Include your route modules
app.include_router(user.router, prefix="/user")
app.include_router(finance.router, prefix="/finance")
app.include_router(ai_chat.router, prefix="ai chat")
app.include_router(savings.router, prefix="/finance")
app.include_router(transaction.router, prefix="/finance")