"""Separate private authentication routes. Does NOT expose content mutation endpoints."""
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import select, update
from .admin_models import AdminSession, AdminUser
from .admin_security import DB, CurrentAdmin, issue_session, verify_password

router = APIRouter(prefix='/admin-auth', tags=['admin-auth'])

class LoginBody(BaseModel):
    username: str = Field(min_length=1,max_length=100)
    password: str = Field(min_length=1,max_length=1024)

class Principal(BaseModel):
    username: str
    role: str
    facultySlug: str | None = None
    departmentSlug: str | None = None

class LoginResult(BaseModel):
    accessToken: str
    tokenType: str = 'bearer'
    expiresIn: int = 28800
    principal: Principal

def principal(user: AdminUser) -> Principal:
    return Principal(username=user.username,role=user.role,
                     facultySlug=user.faculty.slug if user.faculty else None,
                     departmentSlug=user.department.slug if user.department else None)

@router.post('/login', response_model=LoginResult)
def login(body: LoginBody,db: DB):
    user=db.scalar(select(AdminUser).where(AdminUser.username == body.username.strip().lower()))
    if user is None or not user.is_active or not verify_password(body.password,user.password_hash):
        raise HTTPException(401,'Invalid username or password')
    token=issue_session(db,user)
    db.commit()
    return LoginResult(accessToken=token,principal=principal(user))

@router.get('/me',response_model=Principal)
def me(user: CurrentAdmin):
    return principal(user)

@router.post('/logout',status_code=204)
def logout(user: CurrentAdmin,db: DB):
    # Revoke ALL user's sessions (safe initial policy); clients must erase local token.
    db.execute(update(AdminSession).where(AdminSession.user_id==user.id).values(revoked=True))
    db.commit()
