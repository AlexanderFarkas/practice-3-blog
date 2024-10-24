from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase

from backend.src.env import DB_CONNECTION_STRING


class Base(DeclarativeBase):
    pass

db_engine = create_engine(DB_CONNECTION_STRING)

def get_session():
    pass