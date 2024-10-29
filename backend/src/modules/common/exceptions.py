from fastapi import HTTPException


class UnauthorizedException(HTTPException):
    def __init__(self, detail: str = "Unauthorized"):
        super().__init__(status_code=401, detail=detail)


class NotFoundException(HTTPException):
    def __init__(self, detail: str = "Object not found"):
        super().__init__(status_code=404, detail=detail)


class DomainException(HTTPException):
    def __init__(self, detail: str):
        super().__init__(status_code=400, detail=detail)
