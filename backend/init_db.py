from app.database import engine, Base
from app.models import User

print("Creating tables...")
Base.metadata.create_all(bind=engine)
print("Done.")
