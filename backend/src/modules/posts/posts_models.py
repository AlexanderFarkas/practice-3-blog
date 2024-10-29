import uuid

import sqlalchemy as sa
from sqlalchemy import ForeignKey, Column, Table, String
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
    created_at: Mapped[str] = mapped_column(default_factory=utc_now)


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
    user: Mapped[User] = relationship()
    shared_with_users: Mapped[list[User]] = relationship(
        secondary=shared_posts_table,
        lazy="write_only",
    )
    comments: Mapped[list[PostComment]] = relationship(
        order_by=PostComment.created_at.desc(),
    )
    tags: Mapped[list[str]] = mapped_column(sa.ARRAY(String))
    created_at: Mapped[str] = mapped_column(default_factory=utc_now)
    updated_at: Mapped[str] = mapped_column(
        default_factory=utc_now,
        onupdate=utc_now,
    )
    is_public: Mapped[bool] = mapped_column(default=True)

    def share_with(self, user: User):
        self.shared_with_users.append(user)

    def unshare_with(self, user: User):
        self.shared_with_users.remove(user)

    def add_comment(self, user: User, content: str):
        self.comments.append(PostComment(user=user, content=content))
