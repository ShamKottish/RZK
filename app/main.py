#this is where the FastAPI (exposes py logic to frontend) intializes.

from fastapi import FastAPI
from app.routes import user, finance

app = FastAPI()

# Include your route modules
app.include_router(user.router, prefix="/user")
app.include_router(finance.router, prefix="/finance")
