import uuid
from typing import Annotated

import jwt
from fastapi.params import Header

from backend.src.env import JWT_SECRET
from backend.src.modules.common.exceptions import UnauthorizedException


def get_user_id(authorization: Annotated[str, Header]) -> uuid.UUID:
    token = authorization.replace("Bearer ", "").strip()
    if not token:
        raise UnauthorizedException()
    token_data: dict = jwt.decode(token, JWT_SECRET)
    if token_data is None or "user_id" not in token_data:
        raise UnauthorizedException()
    return uuid.UUID(token_data["user_id"])
