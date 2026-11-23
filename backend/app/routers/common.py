"""Helpers shared by the routers."""
from typing import Annotated

from fastapi import Depends, HTTPException, Query
from sqlalchemy.orm import Session

from ..db import get_db

DbSession = Annotated[Session, Depends(get_db)]
# Query parameter written ?facultySlug=... in the URL.
FacultySlugFilter = Annotated[str | None, Query(alias="facultySlug", description="Filter by faculty slug")]

# Response options for every JSON endpoint: camelCase keys, empty optional fields omitted.
RESPONSE_OPTIONS = {"response_model_by_alias": True, "response_model_exclude_none": True}


def not_found(what: str) -> HTTPException:
    return HTTPException(status_code=404, detail=f"{what} not found")
