"""Run inside backend container AFTER migration: python -m app.create_admin
Never auto-create accounts or ship passwords in the repository.
"""
import getpass
import sys
from sqlalchemy import select
from .admin_models import AdminUser
from .admin_security import hash_password
from .db import SessionLocal
from .models import Faculty, Department

def main():
    username=input('Username: ').strip().lower()
    role=input('Role (ccr/faculty/department/news_editor): ').strip().lower()
    if not username or len(username)>100 or role not in ('ccr','faculty','department','news_editor'):
        print('Invalid username/role',file=sys.stderr);return 1
    password=getpass.getpass('Password (12+ chars): ')
    repeat=getpass.getpass('Repeat password: ')
    if password != repeat: print('Passwords do not match',file=sys.stderr);return 1
    try: password_hash=hash_password(password)
    except ValueError as e: print(str(e),file=sys.stderr);return 1
    with SessionLocal.begin() as db:
        if db.scalar(select(AdminUser).where(AdminUser.username==username)):
            print('Username exists',file=sys.stderr);return 1
        f_id=d_id=None
        if role=='faculty':
            slug=input('Faculty slug: ').strip()
            faculty=db.scalar(select(Faculty).where(Faculty.slug==slug))
            if not faculty: print('Faculty not found',file=sys.stderr);return 1
            f_id=faculty.id
        if role=='department':
            slug=input('Department slug: ').strip()
            dept=db.scalar(select(Department).where(Department.slug==slug))
            if not dept: print('Department not found',file=sys.stderr);return 1
            d_id=dept.id
        db.add(AdminUser(username=username,password_hash=password_hash,role=role,faculty_id=f_id,department_id=d_id,is_active=True))
    print('Account created; save credentials in a password manager (not in Git).')
    return 0
if __name__=='__main__': sys.exit(main())
