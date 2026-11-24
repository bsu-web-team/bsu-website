"""Auth primitives and unit RBAC checks. No real secret test fixtures."""
from types import SimpleNamespace
import pytest
from fastapi import HTTPException
from app.admin_security import hash_password, verify_password, require_unit_access

def test_password_hash_is_salted():
    a=hash_password('test-password-123')
    b=hash_password('test-password-123')
    assert a != b
    assert verify_password('test-password-123',a)
    assert not verify_password('wrong-password',a)

def user(role,faculty=None,department=None):
    f=SimpleNamespace(slug=faculty) if faculty else None
    d=SimpleNamespace(slug=department,faculty=SimpleNamespace(slug='f-a')) if department else None
    return SimpleNamespace(role=role,faculty=f,department=d)

def test_faculty_access():
    require_unit_access(None,user('faculty',faculty='f-a'),faculty_slug='f-a')
    with pytest.raises(HTTPException) as e:
        require_unit_access(None,user('faculty',faculty='f-a'),faculty_slug='f-b')
    assert e.value.status_code==403
    with pytest.raises(HTTPException):
        require_unit_access(None,user('faculty',faculty='f-a'),faculty_slug='f-a',department_slug='d-a')

def test_department_access():
    require_unit_access(None,user('department',department='d-a'),department_slug='d-a',faculty_slug='f-a')
    with pytest.raises(HTTPException):
        require_unit_access(None,user('department',department='d-a'),department_slug='d-b')
    with pytest.raises(HTTPException):
        require_unit_access(None,user('department',department='d-a'),department_slug='d-a',faculty_slug='f-b')

def test_ccr_access():
    require_unit_access(None,user('ccr'),faculty_slug='f-b')
    require_unit_access(None,user('ccr'),department_slug='d-b')

def test_unknown_role_fails_closed():
    with pytest.raises(HTTPException):
        require_unit_access(None,user('some-role'),faculty_slug='f-a')
