from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.savings import SavingsGoalCreate
from app.models import savings
from app.db.database import get_db
from app.services.auth import get_current_user
from app.services.transaction_log import log_transaction
from typing import List
from app.schemas.savings import SavingsGoalOut


router = APIRouter(prefix="/savings", tags=["Savings"])


@router.post("/create")
def create_savings_goal(goal: SavingsGoalCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    new_goal = savings.SavingsGoal(
        user_id=user.id,
        goal_name=goal.goal_name,
        target_amount=goal.target_amount,
        target_date=goal.target_date,
        interest_type=goal.interest_type,
        risk_tolerance=goal.risk_tolerance,
        expected_return=goal.expected_return,
        investing=goal.investing
    )
    db.add(new_goal)
    db.commit()
    db.refresh(new_goal)
    return {"message": "Savings goal created", "goal": new_goal}


# potentially add the create_transaction function down here
@router.patch("/update/{goal_id}")
def update_savings_progress(goal_id: int, amount: float, db: Session = Depends(get_db), user=Depends(get_current_user)):
    goal = db.query(savings.SavingsGoal).filter_by(id=goal_id, user_id=user.id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")

    goal.current_amount += amount
    db.commit()
    db.refresh(goal)

    log_transaction(
        db=db,
        user_id=user.id,
        transaction_type="progress_update",
        amount=amount,
        description="Updated progress for savings goal",
        related_id=goal.id
    )

    return {"message": "Progress tracked.", "goal": goal}


# potentially add the create_transaction function down here
@router.delete("/delete/{goal_id}")
def delete_savings_goal(goal_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    goal = db.query(savings.SavingsGoal).filter_by(id=goal_id, user_id=user.id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")

    db.delete(goal)
    db.commit()

    log_transaction(
        db=db,
        user_id=user.id,
        transaction_type="delete",
        description="Deleted savings goal",
        related_id=goal.id
    )

    return {"message": "Savings amount deleted"}


@router.get("/savings/goals", response_model=List[SavingsGoalOut])
def get_goals(db: Session = Depends(get_db)):
    return db.query(savings.SavingsGoal).all()
