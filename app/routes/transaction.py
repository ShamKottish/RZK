from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.transaction import TransactionCreate, TransactionOut
from app.models import transaction
from app.db.database import get_db
from app.services.auth import get_current_user

router = APIRouter(prefix="/transactions", tags=["Transactions"])


@router.post("/", response_model=TransactionOut, name="create transaction")
def create_transaction(
        data: TransactionCreate,
        db: Session = Depends(get_db),
        user=Depends(get_current_user)
):
    new_tx = transaction.Transaction(
        user_id=user.id,
        savings_goal_id=data.savings_goal_id,
        type=data.type,
        amount=data.amount,
        description=data.description,
    )
    db.add(new_tx)
    db.commit()
    db.refresh(new_tx)
    return new_tx


@router.get("/", response_model=list[TransactionOut], name="get user transactions")
def get_user_transactions(
        db: Session = Depends(get_db),
        user=Depends(get_current_user)
):
    return db.query(transaction.Transaction).filter_by(user_id=user.id).order_by(
        transaction.Transaction.timestamp.desc()).all()
