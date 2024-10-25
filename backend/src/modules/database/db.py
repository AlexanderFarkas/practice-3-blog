from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, MappedAsDataclass

from backend.src.env import DB_CONNECTION_STRING


class Base(MappedAsDataclass, DeclarativeBase):
    pass


db_engine = create_engine(DB_CONNECTION_STRING)


def get_session():
    with Session(db_engine) as session:
        yield session
