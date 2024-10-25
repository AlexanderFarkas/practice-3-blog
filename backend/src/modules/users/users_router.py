import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.src.modules.auth.auth_dependencies import get_user_id
from backend.src.modules.auth.auth_models import User
from backend.src.modules.common.dto import DTO
from backend.src.modules.database.db import get_session

users_router = APIRouter(
    dependencies=[Depends(get_user_id)],
)


class UserDTO(DTO):
    id: uuid.UUID
    username: str


class UserWithProfileDTO(UserDTO):
    subscribers: list[UserDTO]
    subscriptions: list[UserDTO]


@users_router.get("/me")
def get_me(
    user_id: uuid.UUID = Depends(get_user_id), session: Session = Depends(get_session)
) -> UserDTO:
    user = session.get(User, user_id)
    return UserDTO.model_validate(user)


@users_router.post("/{id}/subscribe")
def subscribe(
    id: uuid.UUID,
    my_user_id: uuid.UUID = Depends(get_user_id),
    session: Session = Depends(get_session),
) -> UserDTO:
    user: User = session.get(User, my_user_id)
    user.subscribe_to(session.get(User, id))
    session.commit()
    return UserDTO.model_validate(user)


@users_router.post("/{id}/unsubscribe")
def unsubscribe(
    id: uuid.UUID,
    my_user_id: uuid.UUID = Depends(get_user_id),
    session: Session = Depends(get_session),
) -> UserDTO:
    user: User = session.get(User, my_user_id)
    user.unsubscribe_from(session.get(User, id))
    session.commit()
    return UserDTO.model_validate(user)
