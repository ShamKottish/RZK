import uvicorn
from app.main import app

from app.db.connection import Base, engine
from app.models import user

Base.metadata.create_all(bind=engine)



if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

