import logging
from pathlib import Path
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session

from backend.config import settings, BASE_DIR
from backend.database import init_db, get_db, SessionLocal
from backend.models import KnowledgeBaseEntry
from backend.schemas import HealthResponse
from backend.routers import documents, ask, impact, knowledge_base, checklists
from knowledge_base.seed_data import KNOWLEDGE_ENTRIES

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("paperlens")

# Ensure database tables exist
init_db()

# Seed Knowledge Base if empty
def seed_knowledge_base():
    db: Session = SessionLocal()
    try:
        count = db.query(KnowledgeBaseEntry).count()
        if count == 0:
            logger.info("Seeding initial 20 Knowledge Base entries...")
            for entry_data in KNOWLEDGE_ENTRIES:
                kb_row = KnowledgeBaseEntry(
                    slug=entry_data["slug"],
                    title=entry_data["title"],
                    category=entry_data["category"],
                    description=entry_data["description"],
                    purpose=entry_data["purpose"],
                    why_required=entry_data["why_required"],
                    where_used=entry_data["where_used"],
                    issuing_authority=entry_data["issuing_authority"],
                    who_needs_it=entry_data["who_needs_it"],
                    required_information=entry_data.get("required_information", []),
                    eligibility=entry_data.get("eligibility", []),
                    application_procedure=entry_data.get("application_procedure", []),
                    supporting_documents=entry_data.get("supporting_documents", []),
                    important_terms=entry_data.get("important_terms", []),
                    common_mistakes=entry_data.get("common_mistakes", []),
                    related_documents=entry_data.get("related_documents", []),
                    official_url=entry_data["official_url"],
                    verification_date=entry_data.get("verification_date", "2026-03-01"),
                    sample_text_preview=entry_data.get("sample_text_preview", "")
                )
                db.add(kb_row)
            db.commit()
            logger.info("Knowledge Base successfully seeded.")
    except Exception as e:
        logger.error(f"Error during KB seeding: {e}")
        db.rollback()
    finally:
        db.close()

seed_knowledge_base()

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Multimodal AI-Powered Document Intelligence & Literacy Platform"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount files for document previewing
app.mount("/static/uploads", StaticFiles(directory=str(settings.UPLOAD_DIR)), name="uploads")
app.mount("/static/samples", StaticFiles(directory=str(settings.SAMPLES_DIR)), name="samples")

# Include Routers
app.include_router(documents.router)
app.include_router(ask.router)
app.include_router(impact.router)
app.include_router(knowledge_base.router)
app.include_router(checklists.router)

@app.get("/api/health", response_model=HealthResponse)
def health_check(db: Session = Depends(get_db)):
    db_connected = False
    try:
        from sqlalchemy import text
        db.execute(text("SELECT 1"))
        db_connected = True
    except Exception:
        db_connected = False

    return HealthResponse(
        status="healthy",
        app_name=settings.APP_NAME,
        version=settings.APP_VERSION,
        demo_mode=settings.DEMO_MODE,
        ai_engine_active=True,
        database_connected=db_connected
    )

# Mount frontend production build if present
frontend_dist = BASE_DIR / "frontend" / "dist"
if frontend_dist.exists():
    app.mount("/", StaticFiles(directory=str(frontend_dist), html=True), name="frontend")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
