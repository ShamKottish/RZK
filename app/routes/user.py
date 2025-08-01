# contains route handlers for user related stuff (create user, login, etc.).

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.user import User
from app.schemas.user import UserResponse, UserCreate, UserLogin
from app.services.auth import hash_password, verify_password, create_access_token
from app.services.auth import get_current_user
from app.db.database import get_db
from app.schemas.user import UserLogin

router = APIRouter(prefix="/user", tags=["user"])


# Get all users
@router.get("/users")
def get_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users


# Create a new user
@router.post("/signup")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    db_user = User(
        email=user.email,
        password_hash=hash_password(user.password),
        phone_number=user.phone_number,
        birthday=user.birthday,
    )
     
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    access_token = create_access_token(user_id=db_user.id)
    return {"access_token": access_token, "token_type": "bearer"}


# Update savings
@router.put("/{user_id}/savings")
def update_savings(user_id: int, amount: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.current_savings = amount
    db.commit()
    return {"message": "Savings updated", "current_savings": user.current_savings}


@router.post("/login")
def login(form_data: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == form_data.email).first()
    if not db_user or not verify_password(form_data.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(user_id=db_user.id)
    return {"access_token": token, "token_type": "bearer"}



@router.get("/profile")
def read_profile(current_user: User = Depends(get_current_user)):
    return {
        "name": current_user.name,
        "email": current_user.email,
        "savings": current_user.savings,
        "goal": current_user.savings_goal
    }
