from typing import Generator
import uuid
import jwt
from fastapi import Depends, Header
from sqlalchemy.orm import Session
from app.core.errors import AppException
from app.core.security import decode_access_token
from app.db.session import get_db
from app.models.user import User


def get_current_user(
    authorization: str = Header(None),
    db: Session = Depends(get_db),
) -> User:
    """
    Extracts and cryptographically validates the JWT access token from Authorization header.
    Retrieves the authentic User record from PostgreSQL and verifies active status.
    Strictly forbids trusting any unverified client-supplied user_id.
    """
    if not authorization:
        raise AppException(
            code="UNAUTHORIZED",
            message="Authentication credentials were not provided.",
            status_code=401,
        )

    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise AppException(
            code="INVALID_TOKEN",
            message="Authorization header must follow 'Bearer <token>' format.",
            status_code=401,
        )

    token = parts[1]
    try:
        payload = decode_access_token(token)
    except jwt.ExpiredSignatureError:
        raise AppException(
            code="TOKEN_EXPIRED",
            message="Authentication token has expired. Please sign in again.",
            status_code=401,
        )
    except jwt.PyJWTError:
        raise AppException(
            code="INVALID_TOKEN",
            message="Authentication token is invalid or malformed.",
            status_code=401,
        )

    user_id_str = payload.get("sub")
    if not user_id_str:
        raise AppException(
            code="INVALID_TOKEN",
            message="Token payload is missing subject identity.",
            status_code=401,
        )

    try:
        user_uuid = uuid.UUID(user_id_str)
    except ValueError:
        raise AppException(
            code="INVALID_TOKEN",
            message="Invalid user identifier format in token.",
            status_code=401,
        )

    user = db.query(User).filter(User.id == user_uuid).first()
    if not user:
        raise AppException(
            code="USER_NOT_FOUND",
            message="The authenticated user account does not exist.",
            status_code=401,
        )

    if not user.is_active:
        raise AppException(
            code="USER_INACTIVE",
            message="This user account has been deactivated.",
            status_code=401,
        )

    return user
