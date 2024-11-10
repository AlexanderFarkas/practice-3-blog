import uuid
from typing import Annotated

import jwt
from fastapi.params import Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from backend.src.env import JWT_SECRET, JWT_ALGORITHM
from backend.src.modules.common.exceptions import UnauthorizedException


security = HTTPBearer()


def get_user_id(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)],
) -> uuid.UUID:
    try:
        token_data: dict = jwt.decode(
            credentials.credentials, JWT_SECRET, JWT_ALGORITHM
        )
        if token_data is None or "user_id" not in token_data:
            raise UnauthorizedException()
        return uuid.UUID(token_data["user_id"])
    except jwt.PyJWTError:
        raise UnauthorizedException()
