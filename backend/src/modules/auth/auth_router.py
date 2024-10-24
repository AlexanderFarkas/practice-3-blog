from fastapi import APIRouter
from pydantic import BaseModel, SecretStr

from backend.src.modules.auth.user import User

auth_router = APIRouter()

class LoginUserDTO(BaseModel):
    email: str
    password: SecretStr


@auth_router.post('/register')
def register(dto: LoginUserDTO):
    user = User.create_from(email=dto.email, password=dto.password.get_secret_value(),)

@auth_router.post('/login')
def login(dto: LoginUserDTO):
    user = User.create_from(email=dto.email, password=dto.password.get_secret_value(),)
