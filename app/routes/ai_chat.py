from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.openai_agent import get_financial_advice_from_chatbot

router = APIRouter(prefix="/ai", tags=["AI Chat"])

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str

@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    response = get_financial_advice_from_chatbot(request.message)
    if response.startswith("Sorry"):
        raise HTTPException(status_code=500, detail=response)
    return ChatResponse(reply=response)
