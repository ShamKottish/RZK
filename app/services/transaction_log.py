from app.models.transaction import Transaction
from datetime import datetime


def log_transaction(db, user_id, transaction_type, description=None, amount=None, related_id=None):
    tx = Transaction(
        user_id=user_id,
        type=transaction_type,
        amount=amount,
        description=description,
        savings_goal_id=related_id,
        timestamp=datetime.utcnow()
    )
    db.add(tx)
    db.commit()
