from sqlalchemy import Column, Integer, String
from database import Base

class Interaction(Base):
    __tablename__ = "interactions"

    id = Column(Integer, primary_key=True, index=True)

    doctor_name = Column(String, default="")
    date = Column(String, default="")   # YYYY-MM-DD
    interaction_type = Column(String, default="Meeting or Call")
    time = Column(String, default="")   # HH:MM:SS

    attendees = Column(String, default="")
    topics_discussed = Column(String, default="")

    outcome = Column(String, default="")
    sentiment = Column(String, default="Neutral")

    follow_up = Column(String, default="")