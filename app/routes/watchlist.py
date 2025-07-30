from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db
from app.models import watchlist as model
from app.schemas.watchlist import WatchlistItem, WatchlistItemOut
from app.services.auth import get_current_user

router = APIRouter()

@router.post("/watchlist/add", response_model=WatchlistItemOut)
def add_to_watchlist(
        item: WatchlistItem,
        db: Session = Depends(get_db),
        user=Depends(get_current_user)
):
    watchlist_item = model.WatchlistItem(
        user_id=user.id,
        symbol=item.symbol,
        company_name=item.company_name
    )
    db.add(watchlist_item)
    db.commit()
    db.refresh(watchlist_item)
    return watchlist_item

@router.get("/watchlist", response_model=List[WatchlistItemOut])
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
