from typing import Optional

from fastapi import APIRouter, Depends
from pydantic import SecretStr
from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.src.modules.auth.auth_models import User, AccessTokenDTO
from backend.src.modules.common.dto import DTO
from backend.src.modules.common.exceptions import NotFoundException, DomainException
from backend.src.modules.database.db import get_session

auth_router = APIRouter()


class LoginUserDTO(DTO):
    username: str
    password: SecretStr


@auth_router.post("/register")
def register(
    dto: LoginUserDTO, session: Session = Depends(get_session)
) -> AccessTokenDTO:
    password = dto.password.get_secret_value()
    existing_user = session.execute(
        select(User).where(User.username == dto.username)
    ).scalar_one_or_none()
    if existing_user is not None:
        raise DomainException("User already exists")

    user = User.create_from(
        username=dto.username,
        password=password,
    )
    session.add(user)
    session.commit()
    return user.login(password)


@auth_router.post("/login")
def login(dto: LoginUserDTO, session: Session = Depends(get_session)) -> AccessTokenDTO:
    user: Optional[User] = session.execute(
        select(User).where(User.username == dto.username)
    ).scalar_one_or_none()

    if user is None:
        raise NotFoundException("User not found")

    access_token = user.login(dto.password.get_secret_value())
    return access_token
