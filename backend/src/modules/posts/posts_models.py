import datetime
import uuid

import sqlalchemy as sa
from sqlalchemy import ForeignKey, Column, Table, String
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.ext.hybrid import hybrid_method
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.src.modules.auth.auth_models import User
from backend.src.modules.common.utils import utc_now
from backend.src.modules.database.db import Base

shared_posts_table = Table(
    "shared_posts",
    Base.metadata,
    Column("post_id", ForeignKey("post.id", onupdate="CASCADE", ondelete="CASCADE")),
    Column("user_id", ForeignKey("user.id", onupdate="CASCADE", ondelete="CASCADE")),
)


class PostComment(Base):
    __tablename__ = "post_comment"

    post_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("post.id", onupdate="CASCADE", ondelete="CASCADE"),
        primary_key=True,
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("user.id", onupdate="CASCADE", ondelete="CASCADE"),
        primary_key=True,
    )
    user: Mapped[User] = relationship()
    content: Mapped[str] = mapped_column()
    created_at: Mapped[datetime.datetime] = mapped_column(default_factory=utc_now)


class Post(Base):
    __tablename__ = "post"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        init=False,
        default_factory=uuid.uuid4,
    )
    title: Mapped[str] = mapped_column()
    content: Mapped[str] = mapped_column()
    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("user.id", onupdate="CASCADE")
    )
    user: Mapped[User] = relationship(init=False)
    shared_with_users: Mapped[list[User]] = relationship(
        secondary=shared_posts_table, lazy="selectin"
    )
    comments: Mapped[list[PostComment]] = relationship(
        order_by=PostComment.created_at.desc(),
        lazy="selectin",
    )
    tags: Mapped[list[str]] = mapped_column(ARRAY(String))
    created_at: Mapped[datetime.datetime] = mapped_column(default_factory=utc_now)
    updated_at: Mapped[datetime.datetime] = mapped_column(
        default_factory=utc_now,
        onupdate=utc_now,
    )
    is_public: Mapped[bool] = mapped_column(default=True)

    @classmethod
    def create(
        cls,
        user_id: uuid.UUID,
        title: str,
        content: str,
        is_public: bool,
        tags: list[str],
    ):
        return cls(
            user_id=user_id,
            title=title,
            content=content,
            is_public=is_public,
            tags=tags,
            comments=[],
            shared_with_users=[],
        )

    def share_with(self, user: User):
        self.shared_with_users.append(user)

    def unshare_with(self, user: User):
        self.shared_with_users.remove(user)

    def add_comment(self, user: User, content: str):
        self.comments.append(PostComment(user=user, content=content))

    @hybrid_method
    def can_be_viewed_by(self, user_id: uuid.UUID) -> bool:
        return (
            self.is_public
            or self.user_id == user_id
            or user_id in [user.id for user in self.shared_with_users]
        )

    @can_be_viewed_by.expression
    def can_be_viewed_by(cls, user_id: uuid.UUID) -> bool:
        return sa.or_(
            cls.is_public,
            cls.user_id == user_id,
            cls.shared_with_users.any(User.id == user_id),
        )
