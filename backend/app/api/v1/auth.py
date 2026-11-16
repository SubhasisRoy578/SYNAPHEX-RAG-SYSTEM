import uuid
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.api.deps import get_current_user
from app.core.errors import AppException
from app.core.security import hash_password, verify_password, create_access_token
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import (
    UserRegisterRequest,
    UserLoginRequest,
    UserResponse,
    TokenResponse,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/register",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user account",
)
def register(
    payload: UserRegisterRequest,
    db: Session = Depends(get_db),
) -> TokenResponse:
    """
    Creates a new user account with bcrypt-hashed credentials.
    Rejects duplicate emails with a structured 409 Conflict error.
    Returns a signed JWT access token and user identity.
    """
    email_clean = payload.email.strip().lower()

    # Check for existing user with this email
    existing_user = db.query(User).filter(User.email == email_clean).first()
    if existing_user:
        raise AppException(
            code="EMAIL_ALREADY_REGISTERED",
            message="An account with this email address already exists.",
            status_code=status.HTTP_409_CONFLICT,
        )

    user_id = uuid.uuid4()
    hashed_pw = hash_password(payload.password)

    new_user = User(
        id=user_id,
        email=email_clean,
        hashed_password=hashed_pw,
        auth_provider="local",
        auth_subject=str(user_id),
        display_name=payload.display_name.strip() if payload.display_name else None,
        is_active=True,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    access_token = create_access_token(
        subject=str(new_user.id),
        claims={"email": new_user.email},
    )

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(new_user),
    )


@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Authenticate and receive access token",
)
def login(
    payload: UserLoginRequest,
    db: Session = Depends(get_db),
) -> TokenResponse:
    """
    Authenticates user credentials using constant-time bcrypt verification.
    Issues a signed JWT access token upon successful verification.
    """
    email_clean = payload.email.strip().lower()
    user = db.query(User).filter(User.email == email_clean).first()

    if not user or not verify_password(payload.password, user.hashed_password):
        raise AppException(
            code="INVALID_CREDENTIALS",
            message="Invalid email address or password.",
            status_code=status.HTTP_401_UNAUTHORIZED,
        )

    if not user.is_active:
        raise AppException(
            code="USER_INACTIVE",
            message="This user account has been deactivated.",
            status_code=status.HTTP_401_UNAUTHORIZED,
        )

    access_token = create_access_token(
        subject=str(user.id),
        claims={"email": user.email},
    )

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(user),
    )


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get current authenticated user profile",
)
def get_me(current_user: User = Depends(get_current_user)) -> UserResponse:
    """Returns the verified identity of the authenticated user from bearer token."""
    return UserResponse.model_validate(current_user)
