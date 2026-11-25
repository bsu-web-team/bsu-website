"""Private editorial API. Only CCR can publish; user-supplied role/author are ignored."""
from datetime import date, datetime, timezone
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field, ConfigDict
from sqlalchemy import select, func
from sqlalchemy.orm import joinedload
from .admin_security import DB, CurrentAdmin
from .admin_models import AdminUser
from .editorial_models import EditorialItem
from .editorial_media import EditorialMedia
from .media_router import media_json
from .models import Faculty, Department, News

router = APIRouter(prefix="/admin-editorial", tags=["admin-editorial"])
CATEGORIES = {"Новости", "Наука", "Международное сотрудничество", "Мероприятия"}

class DraftIn(BaseModel):
    model_config = ConfigDict(extra="forbid")
    title: str = Field(min_length=1, max_length=180)
    excerpt: str = Field(default="", max_length=2000)
    body: str = Field(min_length=1, max_length=50000)
    category: str = "Новости"
    facultySlug: str | None = Field(default=None, max_length=200)
    departmentSlug: str | None = Field(default=None, max_length=300)

class DecisionIn(BaseModel):
    model_config = ConfigDict(extra="forbid")
    approve: bool
    feedback: str = Field(default="", max_length=4000)

def must_be_editor(user: AdminUser):
    if user.role not in ("ccr", "news_editor", "faculty", "department"):
        raise HTTPException(403, "Role cannot edit news")

def resolve_scope(db, user, body: DraftIn):
    faculty = db.scalar(select(Faculty).where(Faculty.slug == body.facultySlug)) if body.facultySlug else None
    department = db.scalar(select(Department).where(Department.slug == body.departmentSlug)) if body.departmentSlug else None
    if body.facultySlug and not faculty: raise HTTPException(422, "Unknown faculty")
    if body.departmentSlug and not department: raise HTTPException(422, "Unknown department")
    if department and faculty and department.faculty_id != faculty.id: raise HTTPException(422, "Department belongs to another faculty")
    if department and not faculty: faculty = db.get(Faculty, department.faculty_id)
    if user.role == "faculty" and (not user.faculty_id or not faculty or user.faculty_id != faculty.id or department):
        raise HTTPException(403, "Only own faculty news allowed")
    if user.role == "department" and (not user.department_id or not department or user.department_id != department.id):
        raise HTTPException(403, "Only own department news allowed")
    return faculty, department

def as_json(x: EditorialItem):
    return {"id":x.id,"title":x.title,"excerpt":x.excerpt,"body":x.body,"category":x.category,
            "facultySlug":x.faculty.slug if x.faculty else None,
            "departmentSlug":x.department.slug if x.department else None,
            "status":x.status,"feedback":x.feedback,"authorId":x.author_id,
            "publishedSlug":f"editorial-{x.id}" if x.published_news_id else None,
            "updatedAt":x.updated_at.isoformat(), "media": [media_json(m) for m in x.media]}

def allowed_read(user: AdminUser, x: EditorialItem):
    if user.role == "ccr": return True
    return x.author_id == user.id

def editable(user: AdminUser, x: EditorialItem):
    return user.role == "ccr" or x.author_id == user.id

@router.get("/items")
def list_items(db: DB, user: CurrentAdmin):
    must_be_editor(user)
    q = select(EditorialItem).options(joinedload(EditorialItem.faculty), joinedload(EditorialItem.department))
    if user.role != "ccr": q = q.where(EditorialItem.author_id == user.id)
    return [as_json(i) for i in db.scalars(q.order_by(EditorialItem.updated_at.desc())).all()]

@router.post("/items", status_code=201)
def create_item(body: DraftIn, db: DB, user: CurrentAdmin):
    must_be_editor(user)
    faculty, department = resolve_scope(db, user, body)
    if body.category not in CATEGORIES: raise HTTPException(422, "Invalid category")
    item = EditorialItem(author_id=user.id, title=body.title.strip(), excerpt=body.excerpt.strip(),
                         body=body.body.strip(), category=body.category, faculty_id=faculty.id if faculty else None,
                         department_id=department.id if department else None, status="draft", feedback="")
    if not item.title or not item.body: raise HTTPException(422,"Blank content")
    db.add(item); db.commit(); db.refresh(item)
    return as_json(item)

@router.put("/items/{item_id}")
def update_item(item_id: int, body: DraftIn, db: DB, user: CurrentAdmin):
    must_be_editor(user)
    item = db.scalar(select(EditorialItem).where(EditorialItem.id == item_id).with_for_update())
    if not item: raise HTTPException(404,"Item not found")
    if not editable(user,item): raise HTTPException(403,"Cannot edit another author's item")
    if item.status not in ("draft", "changes_requested"): raise HTTPException(409,"Item is locked")
    faculty, department = resolve_scope(db, user, body)
    if body.category not in CATEGORIES: raise HTTPException(422, "Invalid category")
    if not body.title.strip() or not body.body.strip(): raise HTTPException(422,"Blank content")
    item.title=body.title.strip();item.excerpt=body.excerpt.strip();item.body=body.body.strip()
    item.category=body.category; item.faculty_id=faculty.id if faculty else None
    item.department_id=department.id if department else None;item.feedback=""
    item.updated_at=datetime.now(timezone.utc)
    db.commit();db.refresh(item);return as_json(item)

@router.post("/items/{item_id}/submit")
def submit(item_id: int, db: DB, user: CurrentAdmin):
    must_be_editor(user)
    item=db.scalar(select(EditorialItem).where(EditorialItem.id==item_id).with_for_update())
    if not item: raise HTTPException(404,"Item not found")
    if not editable(user,item): raise HTTPException(403,"Cannot submit another author's item")
    if item.status not in ("draft","changes_requested"): raise HTTPException(409,"Item is locked")
    item.status="submitted";item.feedback="";item.updated_at=datetime.now(timezone.utc)
    db.commit();db.refresh(item);return as_json(item)

@router.post("/items/{item_id}/decision")
def decide(item_id: int, body: DecisionIn, db: DB, user: CurrentAdmin):
    if user.role != "ccr": raise HTTPException(403, "Only CCR may approve publication")
    item=db.scalar(select(EditorialItem).where(EditorialItem.id==item_id).with_for_update())
    if not item: raise HTTPException(404,"Item not found")
    if item.status != "submitted": raise HTTPException(409,"Not awaiting review")
    if not body.approve:
        if not body.feedback.strip(): raise HTTPException(422,"Feedback is required")
        item.status="changes_requested";item.feedback=body.feedback.strip()
    else:
        # Only this CCR-only endpoint inserts public News. No editor publication endpoint exists.
        public = News(slug=f"editorial-{item.id}", title=item.title, date=date.today(),category=item.category,
                      excerpt=item.excerpt or item.body[:350], source_url=f"/news/editorial-{item.id}",
                      content=[item.body], tags=[], faculty_id=item.faculty_id,department_id=item.department_id,
                      is_published=True, position=0)
        cover=next((m for m in item.media if m.is_cover), None)
        if cover: public.image_url=media_json(cover)["url"]
        db.add(public); db.flush()
        item.published_news_id=public.id
        item.status="published";item.feedback=""
    item.updated_at=datetime.now(timezone.utc)
    db.commit();db.refresh(item);return as_json(item)
