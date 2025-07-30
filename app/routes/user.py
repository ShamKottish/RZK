# contains route handlers for user related stuff (create user, login, etc.).

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.connection import SessionLocal
from app.models.user import User
from app.schemas.user import UserResponse, UserCreate, UserLogin
from app.services.auth import hash_password, verify_password, create_access_token
from app.services.auth import get_current_user
from app.db.database import get_db


def create_user(user: UserCreate, db: Session):
    db_user = User(
        name=user.name,
        email=user.email,
        password_hash=hash_password(user.password),
        savings_goal=user.savings_goal,
        current_savings=user.current_savings
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


router = APIRouter()

# will delete later
'''def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

'''


# Get all users
@router.get("/users")
def get_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users


# Create a new user
@router.post("/users")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password),
        savings=user.savings,
        savings_goal=user.savings_goal,  # or some default value
        current_savings=user.current_savings  # or some default value
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


# Update savings
@router.put("/users/{user_id}/savings")
def update_savings(user_id: int, amount: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.current_savings = amount
    db.commit()
    return {"message": "Savings updated", "current_savings": user.current_savings}


@router.post("/login")
def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user_credentials.email).first()
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not verify_password(user_credentials.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # generate token (e.g., JWT) here
    token = create_access_token({"user_id": db_user.id})

    return {"access_token": token, "token_type": "bearer"}


@router.get("/profile")
def read_profile(current_user: User = Depends(get_current_user)):
    return {
        "name": current_user.name,
        "email": current_user.email,
        "savings": current_user.savings,
        "goal": current_user.savings_goal
    }
