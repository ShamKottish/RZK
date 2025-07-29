from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "mysql+pymysql://root:yara1992@localhost/rzk_db"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# base for models to inherit from
Base = declarative_base()


# DB session dependency for routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
