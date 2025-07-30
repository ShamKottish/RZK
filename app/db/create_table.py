import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.database import engine, Base
from app.models import user, savings, transaction, watchlist

Base.metadata.create_all(bind=engine)
