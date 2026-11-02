from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_

from backend.database import get_db
from backend.models import KnowledgeBaseEntry
from backend.schemas import KnowledgeBaseEntrySchema

router = APIRouter(prefix="/api/knowledge-base", tags=["Knowledge Base"])

@router.get("", response_model=list[KnowledgeBaseEntrySchema])
def list_knowledge_base(
    category: str = Query(None),
    search: str = Query(None),
    limit: int = Query(50, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(KnowledgeBaseEntry)

    if category and category.lower() != "all":
        query = query.filter(KnowledgeBaseEntry.category == category.lower())

    if search:
        search_fmt = f"%{search.lower()}%"
        query = query.filter(
            or_(
                KnowledgeBaseEntry.title.ilike(search_fmt),
                KnowledgeBaseEntry.description.ilike(search_fmt),
                KnowledgeBaseEntry.purpose.ilike(search_fmt)
            )
        )

    return query.order_by(KnowledgeBaseEntry.title.asc()).limit(limit).all()

@router.get("/{entry_id_or_slug}", response_model=KnowledgeBaseEntrySchema)
def get_knowledge_base_entry(entry_id_or_slug: str, db: Session = Depends(get_db)):
    entry = db.query(KnowledgeBaseEntry).filter(
        or_(
            KnowledgeBaseEntry.id == entry_id_or_slug,
            KnowledgeBaseEntry.slug == entry_id_or_slug
        )
    ).first()

    if not entry:
        raise HTTPException(status_code=404, detail="Knowledge base entry not found")

    return entry
