import uuid

from argon2 import PasswordHasher
from sqlalchemy.orm import Mapped
from sqlalchemy.testing.schema import mapped_column

from backend.src.modules.database.db import Base


password_hasher = PasswordHasher()

class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4,
    )
    email: Mapped[str] = mapped_column(unique=True)
    password: Mapped[str] = mapped_column()

    @classmethod
    def create_from(cls, email: str, password: str):
        encoded_password = password_hasher.hash(password)
        return cls(
            email=email,
            password=encoded_password,
        )