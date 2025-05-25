from sqlalchemy import Column, Integer, String, DateTime, Enum
from ..database import Base

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    content = Column(String)
    date = Column(DateTime)
    status = Column(Enum('pending', 'approved', 'rejected'), default='pending') 