from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, EmailStr, Field, ConfigDict


class UserRegisterRequest(BaseModel):
    """Payload for registering a new user account."""
    email: EmailStr = Field(description="User primary email address")
    password: str = Field(min_length=8, description="User password (min 8 characters)")
    display_name: Optional[str] = Field(default=None, max_length=150, description="Optional profile name")


class UserLoginRequest(BaseModel):
    """Payload for authenticating with email and password."""
    email: EmailStr = Field(description="User primary email address")
    password: str = Field(description="User password")


class UserResponse(BaseModel):
    """Public representation of an authenticated user."""
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    email: str
    display_name: Optional[str] = None
    auth_provider: str = "local"
    is_active: bool = True
    created_at: datetime


class TokenResponse(BaseModel):
    """JWT bearer token and authenticated user summary."""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
