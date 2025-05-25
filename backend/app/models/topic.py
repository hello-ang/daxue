from sqlalchemy import Column, Integer, String, DateTime
from ..database import Base

class Topic(Base):
    __tablename__ = "topics"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    author = Column(String)
    content = Column(String)
    date = Column(DateTime)
    views = Column(Integer, default=0)
    comments = Column(Integer, default=0)
    likes = Column(Integer, default=0) 