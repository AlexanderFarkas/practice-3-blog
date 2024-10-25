import uuid
from datetime import timedelta

import jwt
from argon2 import PasswordHasher
from sqlalchemy import ForeignKey, Column
from sqlalchemy.orm import Mapped, relationship
from sqlalchemy.testing.schema import mapped_column, Table

from backend.src.env import JWT_SECRET, JWT_ALGORITHM
from backend.src.modules.common.dto import DTO
from backend.src.modules.common.exceptions import DomainException
from backend.src.modules.common.utils import utc_now
from backend.src.modules.database.db import Base


password_hasher = PasswordHasher()


class AccessTokenDTO(DTO):
    token: str


user_subscription_table = Table(
    "user_subscription",
    Base.metadata,
    Column("subscriber_id", ForeignKey("user.id", onupdate="CASCADE")),
    Column("publisher_id", ForeignKey("user.id", onupdate="CASCADE")),
)


class User(Base):
    __tablename__ = "user"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        init=False,
        default_factory=uuid.uuid4,
    )
    username: Mapped[str] = mapped_column(unique=True)
    password: Mapped[str] = mapped_column()
    subscribers: Mapped[list["User"]] = relationship(
        secondary=user_subscription_table,
        primaryjoin=id == user_subscription_table.c.publisher_id,
        secondaryjoin=id == user_subscription_table.c.subscriber_id,
        back_populates="subscriptions",
    )
    subscriptions: Mapped[list["User"]] = relationship(
        "User",
        secondary=user_subscription_table,
        primaryjoin=id == user_subscription_table.c.subscriber_id,
        secondaryjoin=id == user_subscription_table.c.publisher_id,
        back_populates="subscribers",
    )

    @classmethod
    def create_from(cls, username: str, password: str):
        encoded_password = password_hasher.hash(password)
        return cls(
            email=username,
            password=encoded_password,
        )

    def login(self, password: str) -> "AccessTokenDTO":
        is_password_correct = password_hasher.verify(self.password, password)
        if not is_password_correct:
            raise DomainException("Password is incorrect")

        return AccessTokenDTO(token=self._generate_access_token())

    def _generate_access_token(self):
        issued_at = utc_now()
        data = {
            "user_id": self.id,
            "exp": issued_at + timedelta(hours=2),
            "iat": issued_at,
        }
        return jwt.encode(data, JWT_SECRET, JWT_ALGORITHM)

    def subscribe_to(self, user: "User"):
        user.subscribers.append(self)

    def unsubscribe_from(self, user: "User"):
        user.subscribers.remove(self)
