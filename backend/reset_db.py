from database import Base, engine
from model import Interaction

# delete old table + recreate new one
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

print("Database reset successful")