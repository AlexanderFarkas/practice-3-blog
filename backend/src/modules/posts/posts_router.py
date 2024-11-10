import uuid
import datetime
from fastapi import APIRouter
from fastapi.params import Depends
from sqlalchemy import select, true
from sqlalchemy.orm import Session
import sqlalchemy as sa
from backend.src.modules.auth.auth_dependencies import get_user_id
from backend.src.modules.auth.auth_models import User, user_subscription_table
from backend.src.modules.common.dto import DTO
from backend.src.modules.common.exceptions import DomainException
from backend.src.modules.database.db import get_session
from backend.src.modules.posts.posts_models import Post, shared_posts_table
from backend.src.modules.users.users_router import UserDTO

posts_router = APIRouter(
    dependencies=[Depends(get_user_id)],
)


class PutPostDTO(DTO):
    title: str
    content: str
    is_public: bool
    tags: list[str]


class CommentDTO(DTO):
    user: UserDTO
    content: str
    created_at: datetime.datetime


class PostDTO(DTO):
    id: uuid.UUID
    title: str
    content: str
    user_id: uuid.UUID
    user: UserDTO
    created_at: datetime.datetime
    updated_at: datetime.datetime
    comments: list[CommentDTO]
    is_public: bool
    tags: list[str]


@posts_router.get("/all_feed")
def get_feed(
    user_id: uuid.UUID = Depends(get_user_id),
    session: Session = Depends(get_session),
) -> list[PostDTO]:
    posts = (
        session.execute(
            select(Post)
            .outerjoin(shared_posts_table, shared_posts_table.c.post_id == Post.id)
            .where(
                sa.or_(
                    Post.is_public,
                    shared_posts_table.c.user_id == user_id,
                ),
            )
            .order_by(Post.created_at.desc())
        )
        .scalars()
        .all()
    )
    return [PostDTO.model_validate(post) for post in posts]


@posts_router.get("/subscriptions_feed")
def get_subscriptions_feed(
    user_id: uuid.UUID = Depends(get_user_id),
    session: Session = Depends(get_session),
) -> list[PostDTO]:
    posts = (
        session.execute(
            select(Post)
            .select_from(user_subscription_table)
            .join(Post, Post.user_id == user_subscription_table.c.publisher_id)
            .outerjoin(shared_posts_table, shared_posts_table.c.user_id == Post.id)
            .where(
                user_subscription_table.c.subscriber_id == user_id,
                Post.user_id == user_subscription_table.c.publisher_id,
                Post.can_be_viewed_by(user_id),
            )
            .order_by(Post.created_at.desc())
        )
        .scalars()
        .all()
    )
    return [PostDTO.model_validate(post) for post in posts]


@posts_router.get("/user/{publisher_id}")
def get_user_posts(
    publisher_id: uuid.UUID,
    user_id: uuid.UUID = Depends(get_user_id),
    session: Session = Depends(get_session),
) -> list[PostDTO]:
    posts = (
        session.execute(
            select(Post)
            .outerjoin(shared_posts_table, shared_posts_table.c.post_id == Post.id)
            .where(
                Post.user_id == publisher_id,
                Post.can_be_viewed_by(user_id) == true(),
            )
        )
        .scalars()
        .all()
    )
    return [PostDTO.model_validate(post) for post in posts]


@posts_router.post("/")
def create_post(
    dto: PutPostDTO,
    user_id: uuid.UUID = Depends(get_user_id),
    session: Session = Depends(get_session),
):
    post = Post.create(
        user_id=user_id,
        title=dto.title,
        content=dto.content,
        is_public=dto.is_public,
        tags=dto.tags,
    )
    session.add(post)
    session.commit()
    return PostDTO.model_validate(post)


@posts_router.delete("/{id}")
def delete_post(
    id: uuid.UUID,
    user_id: uuid.UUID = Depends(get_user_id),
    session: Session = Depends(get_session),
):
    post = session.get(Post, id)
    if post.user_id != user_id:
        raise DomainException("You can't delete other user's post")
    session.delete(post)
    session.commit()
    return PostDTO.model_validate(post)


@posts_router.get("/{id}")
def get_post(
    id: uuid.UUID,
    user_id: uuid.UUID = Depends(get_user_id),
    session: Session = Depends(get_session),
) -> PostDTO:
    post: Post = session.get(Post, id)
    if not post.can_be_viewed_by(user_id):
        raise DomainException("You can't view this post")
    return PostDTO.model_validate(post)


@posts_router.put("/{id}")
def update_post(
    id: uuid.UUID,
    dto: PutPostDTO,
    user_id: uuid.UUID = Depends(get_user_id),
    session: Session = Depends(get_session),
):
    post = session.get(Post, id)
    if post.user_id != user_id:
        raise DomainException("You can't update other user's post")

    post.title = dto.title
    post.content = dto.content
    post.is_public = dto.is_public
    post.tags = dto.tags

    session.commit()
    return PostDTO.model_validate(post)


class SharePostDTO(DTO):
    user_id: uuid.UUID


@posts_router.post("/{post_id}/share")
def share_post(
    post_id: str,
    dto: SharePostDTO,
    user_id: uuid.UUID = Depends(get_user_id),
    session: Session = Depends(get_session),
) -> None:
    post = session.get(Post, post_id)
    if post.user_id != user_id:
        raise DomainException("You can't share other user's post")
    post.share_with(session.get(User, dto.user_id))
    session.commit()
    return None


class AddCommentDTO(DTO):
    content: str


@posts_router.post("/{post_id}/comment")
def add_comment(
    post_id: uuid.UUID,
    dto: AddCommentDTO,
    user_id: uuid.UUID = Depends(get_user_id),
    session: Session = Depends(get_session),
) -> PostDTO:
    post: Post = session.get(Post, post_id)
    post.add_comment(session.get(User, user_id), dto.content)
    session.commit()
    return PostDTO.model_validate(post)
