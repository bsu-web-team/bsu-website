from fastapi import APIRouter

from ..models import Material
from ..schemas import MaterialOut
from .common import DbSession, not_found

router = APIRouter(prefix="/content", tags=["content"])


@router.get("/{material_id}", response_model=MaterialOut)
def get_material(material_id: str, db: DbSession):
    """Archive page by its public id, e.g. `8a5edab28263` or `c5959c2c688c-draft-ky`.
    Returned exactly as stored (no fields dropped), as the website expects."""
    m = db.get(Material, material_id)
    if m is None:
        raise not_found("Material")
    return MaterialOut(title=m.title, lang=m.lang, blocks=m.blocks, variants=m.variants)
