"""RBAC enforcement, intentionally independent of public V7.4 API.
Token is opaque; only SHA-256 hash stored in DB. Passwords use scrypt with random salt.
"""
from __future__ import annotations
import hashlib
import hmac
import secrets
from datetime import datetime, timedelta, timezone
from typing import Annotated
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.orm import Session
from .db import get_db
from .admin_models import AdminUser, AdminSession
from .models import Department

DB = Annotated[Session, Depends(get_db)]
Bearer = HTTPBearer(auto_error=False)
TOKEN_TTL = timedelta(hours=8)

def hash_password(password: str) -> str:
    if not 12 <= len(password) <= 1024:
        raise ValueError('Password must have between 12 and 1024 characters')
    salt = secrets.token_bytes(16)
    digest = hashlib.scrypt(password.encode('utf8'), salt=salt, n=2**14, r=8, p=1)
    return f'scrypt$16384$8$1${salt.hex()}${digest.hex()}'

def verify_password(password: str, saved: str) -> bool:
    try:
        algo, n, r, p, salt, digest = saved.split('$')
        if algo != 'scrypt' or (int(n), int(r), int(p)) != (16384,8,1): return False
        computed=hashlib.scrypt(password.encode('utf8'), salt=bytes.fromhex(salt), n=16384, r=8, p=1)
        return hmac.compare_digest(computed,bytes.fromhex(digest))
    except (ValueError, TypeError, OverflowError):
        return False

def issue_session(db: Session, user: AdminUser) -> str:
    token=secrets.token_urlsafe(32)
    db.add(AdminSession(user_id=user.id,token_hash=hashlib.sha256(token.encode()).hexdigest(),
                        expires_at=datetime.now(timezone.utc)+TOKEN_TTL,revoked=False))
    db.flush()
    return token

def current_admin(db: DB, credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(Bearer)]) -> AdminUser:
    if credentials is None or credentials.scheme.lower()!='bearer':
        raise HTTPException(401, 'Authentication required', headers={'WWW-Authenticate':'Bearer'})
    hashed=hashlib.sha256(credentials.credentials.encode()).hexdigest()
    sess=db.scalar(select(AdminSession).where(AdminSession.token_hash == hashed, AdminSession.revoked.is_(False)))
    if not sess or sess.expires_at <= datetime.now(timezone.utc) or not sess.user.is_active:
        raise HTTPException(401, 'Invalid or expired session', headers={'WWW-Authenticate':'Bearer'})
    return sess.user

CurrentAdmin = Annotated[AdminUser, Depends(current_admin)]

def require_unit_access(db: Session, user: AdminUser, *, faculty_slug: str | None=None, department_slug: str | None=None) -> None:
    """Fail closed: only the user's own unit, except CCR.
    This must be called BY EVERY future write endpoint, before writing.
    """
    if user.role == 'ccr': return
    if not faculty_slug and not department_slug: raise HTTPException(403, 'Unit required')
    if user.role == 'faculty':
        if not user.faculty or faculty_slug != user.faculty.slug or department_slug is not None:
            raise HTTPException(403, 'Other unit is not accessible')
        return
    if user.role == 'department':
        if not user.department or department_slug != user.department.slug:
            raise HTTPException(403, 'Other unit is not accessible')
        if faculty_slug is not None and user.department.faculty.slug != faculty_slug:
            raise HTTPException(403, 'Other unit is not accessible')
        return
    raise HTTPException(403, 'Role is not authorized')
