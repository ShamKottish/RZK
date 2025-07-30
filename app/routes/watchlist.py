from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models import watchlist as model
from app.services.auth import get_current_user
from app.models.watchlist import WatchlistItem

router = APIRouter()


@router.post("/watchlist/add")
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
    db.add(item)
    db.commit()
    db.refresh(item)
    return {"message": "Added to watchlist", "item": item}


@router.get("/watchlist")
def get_watchlist(db: Session = Depends(get_db), user=Depends(get_current_user)):
    items = db.query(model.WatchlistItem).filter_by(user_id=user.id).all()
    return [{"symbol": i.symbol, "company_name": i.company_name} for i in items]


@router.delete("/watchlist/{symbol}")
def delete_from_watchlist(symbol: str, db: Session = Depends(get_db), user=Depends(get_current_user)):
    item = db.query(model.WatchlistItem).filter_by(user_id=user.id, symbol=symbol).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(item)
    db.commit()
    return {"message": "Removed from watchlist"}
