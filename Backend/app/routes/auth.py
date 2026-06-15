"""
/api/auth — Simple authentication router.
"""
from __future__ import annotations

import logging
import uuid
from typing import Any

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, EmailStr

from app.core.rate_limit import limiter

logger = logging.getLogger(__name__)

router = APIRouter(tags=["Auth"])

# ---------------------------------------------------------------------------
# In-memory user store (email -> user_dict)
# ---------------------------------------------------------------------------
_users: dict[str, dict[str, Any]] = {}

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    name: str | None = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class AuthResponse(BaseModel):
    id: str
    email: str
    name: str | None
    token: str

@router.post("/register", response_model=AuthResponse)
@limiter.limit("5/minute")
async def register(request: Request, body: RegisterRequest) -> AuthResponse:
    if body.email in _users:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = str(uuid.uuid4())
    token = f"token_{user_id}"  # Simple mock token for the frontend to use
    
    user_data = {
        "id": user_id,
        "email": body.email,
        "name": body.name,
        "password": body.password,  # In a real app, hash this!
        "token": token
    }
    
    _users[body.email] = user_data
    logger.info("Registered new user: %s", body.email)
    
    return AuthResponse(**user_data)

@router.post("/login", response_model=AuthResponse)
@limiter.limit("10/minute")
async def login(request: Request, body: LoginRequest) -> AuthResponse:
    user_data = _users.get(body.email)
    
    if not user_data or user_data["password"] != body.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    logger.info("User logged in: %s", body.email)
    return AuthResponse(**user_data)
