from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models import user as user_model, savings as savings_model, watchlist as watchlist_model
from app.services.auth import get_current_user

router = APIRouter()

@router.get("/dashboard")
def get_dashboard(db: Session = Depends(get_db), user=Depends(get_current_user)):
    # User Info
    user_info = {
        "name": user.name,
        "email": user.email,
    }

    # total savings
    goals = db.query(savings_model.SavingsGoal).filter_by(user_id=user.id).all()
    total_saved = sum(goal.current_amount for goal in goals)

    # active goals
    active_goals = [goal for goal in goals if goal.current_amount < goal.target_amount]

    # watchlist
    watchlist = db.query(watchlist_model.WatchlistItem).filter_by(user_id=user.id).all()
    watchlist_data = [{"symbol": item.symbol, "company_name": item.company_name} for item in watchlist]

    return {
        "user": user_info,
        "total_savings": total_saved,
        "active_goals": active_goals,
        "watchlist": watchlist_data,
    }
