# contains route handlers for the finance part (chatbot, savings).

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.connection import SessionLocal
from app.models.user import User
from app.services.openai_agent import get_financial_advice_from_chatbot

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/chatbot")
def talk_to_financial_bot(query: str):
    try:
        reply = get_financial_advice_from_chatbot(query)
        return {"response": reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error talking to AI bot: {str(e)}")













# probably will need some part of this, polish later
'''
@router.get("/recommendations")
def get_recommendations(db: Session = Depends(get_db)):
    users = db.query(User).all()
    response = []

    for user in users:
        advice = get_savings_advice(user.name, user.savings)
        response.append({
            "user": user.name,
            "savings": user.savings,
            "ai_advice": advice
        })

    return response
'''
