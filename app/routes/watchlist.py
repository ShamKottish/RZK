from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models import watchlist as model
from app.services.auth import get_current_user

router = APIRouter()

@router.post("/watchlist/add")
def add_to_watchlist(symbol: str, company_name: str, db: Session = Depends(get_db), user=Depends(get_current_user)):
    item = model.WatchlistItem(user_id=user.id, symbol=symbol, company_name=company_name)
    db.add(item)
    db.commit()
    db.refresh(item)
    return {"message": "Added to watchlist", "item": item}

@router.get("/watchlist")
def get_watchlist(db: Session = Depends(get_db), user=Depends(get_current_user)):
    items = db.query(model.WatchlistItem).filter_by(user_id=user.id).all()
    return items

@router.delete("/watchlist/{symbol}")
def delete_from_watchlist(symbol: str, db: Session = Depends(get_db), user=Depends(get_current_user)):
    item = db.query(model.WatchlistItem).filter_by(user_id=user.id, symbol=symbol).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(item)
    db.commit()
    return {"message": "Removed from watchlist"}
