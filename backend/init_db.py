from database import Base, engine
from model import Interaction

Base.metadata.create_all(bind=engine)

print("Database tables created successfully")