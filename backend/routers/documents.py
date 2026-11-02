import shutil
import uuid
import time
from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from sqlalchemy.orm import Session

from backend.config import settings
from backend.database import get_db
from backend.models import UploadedFile, DocumentAnalysis, ExtractedClause, DocumentReference
from backend.schemas import UploadedFileSchema, DocumentAnalysisSchema, ExtractedClauseSchema
from ai_engine.ocr.ocr_engine import ocr_engine
from ai_engine.document_parser.parser import document_parser
from ai_engine.classification.classifier import document_classifier
from ai_engine.clause_extraction.extractor import clause_extractor

router = APIRouter(prefix="/api/documents", tags=["Documents"])

@router.post("/upload", response_model=UploadedFileSchema)
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # Validate extension
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{file_ext}'. Allowed formats: {', '.join(settings.ALLOWED_EXTENSIONS)}"
        )

    # Save to upload dir
    unique_name = f"{uuid.uuid4().hex[:12]}_{file.filename}"
    target_path = settings.UPLOAD_DIR / unique_name

    with target_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    file_size = target_path.stat().st_size
    if file_size > settings.MAX_FILE_SIZE_MB * 1024 * 1024:
        target_path.unlink(missing_ok=True)
        raise HTTPException(status_code=400, detail=f"File exceeds maximum size of {settings.MAX_FILE_SIZE_MB}MB")

    # Run OCR & text extraction
    try:
        extracted = ocr_engine.extract_document(target_path)
    except Exception as e:
        target_path.unlink(missing_ok=True)
        raise HTTPException(status_code=500, detail=f"Failed to process document layout: {str(e)}")

    db_file = UploadedFile(
        original_filename=file.filename,
        stored_filename=unique_name,
        file_path=str(target_path),
        file_size_bytes=file_size,
        mime_type=file.content_type or "application/octet-stream",
        page_count=extracted.get("page_count", 1),
        ocr_raw_text=extracted.get("full_text", ""),
        layout_data={"pages": extracted.get("pages", []), "blocks": extracted.get("blocks", [])}
    )
    db.add(db_file)
    db.commit()
    db.refresh(db_file)

    return db_file

@router.post("/analyze", response_model=DocumentAnalysisSchema)
def analyze_document(
    file_id: str = Form(None),
    sample_key: str = Form(None),
    db: Session = Depends(get_db)
):
    start_time = time.time()
    is_demo = False

    # Handle demo sample loading
    if sample_key:
        sample_map = {
            "appointment_letter": "synthetic_appointment_letter.pdf",
            "employment_bond": "synthetic_employment_bond.pdf",
            "nda": "synthetic_nda.pdf",
            "domicile_certificate": "synthetic_domicile_certificate.pdf"
        }
        sample_filename = sample_map.get(sample_key)
        if not sample_filename:
            raise HTTPException(status_code=400, detail=f"Invalid sample key '{sample_key}'")

        sample_path = settings.SAMPLES_DIR / sample_filename
        if not sample_path.exists():
            raise HTTPException(status_code=404, detail="Sample file not found on disk")

        # Copy to uploads to create a registered file entry
        unique_name = f"demo_{uuid.uuid4().hex[:8]}_{sample_filename}"
        target_path = settings.UPLOAD_DIR / unique_name
        shutil.copy(sample_path, target_path)

        extracted = ocr_engine.extract_document(target_path)
        db_file = UploadedFile(
            original_filename=sample_filename.replace("synthetic_", "Sample_").replace("_", " ").title(),
            stored_filename=unique_name,
            file_path=str(target_path),
            file_size_bytes=target_path.stat().st_size,
            mime_type="application/pdf",
            page_count=extracted.get("page_count", 1),
            ocr_raw_text=extracted.get("full_text", ""),
            layout_data={"pages": extracted.get("pages", []), "blocks": extracted.get("blocks", [])}
        )
        db.add(db_file)
        db.commit()
        db.refresh(db_file)
        file_id = db_file.id
        is_demo = True
    else:
        if not file_id:
            raise HTTPException(status_code=400, detail="Either file_id or sample_key is required")
        db_file = db.query(UploadedFile).filter(UploadedFile.id == file_id).first()
        if not db_file:
            raise HTTPException(status_code=404, detail="Uploaded file not found")

    # Check if analysis already exists
    existing_analysis = db.query(DocumentAnalysis).filter(DocumentAnalysis.file_id == file_id).first()
    if existing_analysis:
        return existing_analysis

    # 1. Classification
    raw_text = db_file.ocr_raw_text or ""
    cls_res = document_classifier.classify(raw_text, filename=db_file.original_filename)

    # 2. Structural Parsing
    parsed = document_parser.parse_structure({
        "full_text": raw_text,
        "pages": db_file.layout_data.get("pages", []),
        "blocks": db_file.layout_data.get("blocks", [])
    })

    # 3. Clause Extraction
    extracted_clauses = clause_extractor.extract_clauses(
        text=raw_text,
        pages_data=db_file.layout_data.get("pages", [])
    )

    # Calculate overall risk
    risk_level = "Low"
    if any(c.get("risk_severity") == "Critical" for c in extracted_clauses):
        risk_level = "High"
    elif any(c.get("risk_severity") == "High" for c in extracted_clauses):
        risk_level = "Moderate"

    # Summary synthesis
    summary = (
        f"This is an official {cls_res['sub_type']} categorized under {cls_res['category'].capitalize()}. "
        f"The document defines binding conditions across {len(extracted_clauses)} extracted key clauses, "
        f"including notice requirements, rights, and contractual terms. "
        f"{'A compulsory service bond or financial stipulation is present.' if risk_level == 'High' else 'Standard contractual provisions apply.'}"
    )

    elapsed_ms = int((time.time() - start_time) * 1000)

    # Save Analysis
    analysis = DocumentAnalysis(
        file_id=db_file.id,
        title=db_file.original_filename.replace(".pdf", "").replace(".docx", "").replace("_", " ").title(),
        category=cls_res["category"],
        sub_type=cls_res["sub_type"],
        language="English",
        summary=summary,
        purpose=f"Official legal/employment framework establishing terms for {cls_res['sub_type']}.",
        key_fields=parsed.get("key_fields", {}),
        risk_level=risk_level,
        confidence_score=cls_res["confidence"],
        is_demo=is_demo,
        processing_time_ms=elapsed_ms
    )
    db.add(analysis)
    db.commit()
    db.refresh(analysis)

    # Save Clauses
    for cl in extracted_clauses:
        clause_row = ExtractedClause(
            analysis_id=analysis.id,
            clause_type=cl["clause_type"],
            title=cl["title"],
            original_text=cl["original_text"],
            plain_language=cl["plain_language"],
            what_it_requires=cl["what_it_requires"],
            who_it_affects=cl["who_it_affects"],
            when_it_applies=cl["when_it_applies"],
            obligations=cl["obligations"],
            restrictions=cl["restrictions"],
            deadlines=cl["deadlines"],
            financial_implications=cl["financial_implications"],
            possible_consequences=cl["possible_consequences"],
            exceptions=cl["exceptions"],
            questions_to_ask=cl["questions_to_ask"],
            source_page=cl["source_page"],
            source_paragraph=cl["source_paragraph"],
            confidence=cl["confidence"],
            requires_human_review=cl["requires_human_review"],
            risk_severity=cl["risk_severity"]
        )
        db.add(clause_row)

    # Save References for groundings
    for idx, pg in enumerate(db_file.layout_data.get("pages", [])[:5]):
        if pg.get("text"):
            db.add(DocumentReference(
                analysis_id=analysis.id,
                title=f"Page {pg.get('page', idx+1)} Overview",
                snippet=pg.get("text")[:200] + "...",
                page=pg.get("page", idx+1),
                section_type="body",
                confidence=0.95
            ))

    db.commit()
    db.refresh(analysis)
    return analysis

@router.get("", response_model=list[DocumentAnalysisSchema])
def list_documents(
    category: str = Query(None),
    limit: int = Query(20, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(DocumentAnalysis).order_by(DocumentAnalysis.created_at.desc())
    if category:
        query = query.filter(DocumentAnalysis.category == category.lower())
    return query.limit(limit).all()

@router.get("/{analysis_id}", response_model=DocumentAnalysisSchema)
def get_document_analysis(analysis_id: str, db: Session = Depends(get_db)):
    analysis = db.query(DocumentAnalysis).filter(DocumentAnalysis.id == analysis_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Document analysis not found")
    return analysis

@router.get("/{analysis_id}/clauses", response_model=list[ExtractedClauseSchema])
def get_document_clauses(
    analysis_id: str,
    risk: str = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(ExtractedClause).filter(ExtractedClause.analysis_id == analysis_id)
    if risk:
        query = query.filter(ExtractedClause.risk_severity == risk)
    return query.all()

@router.delete("/{analysis_id}")
def delete_document(analysis_id: str, db: Session = Depends(get_db)):
    analysis = db.query(DocumentAnalysis).filter(DocumentAnalysis.id == analysis_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")

    file_row = db.query(UploadedFile).filter(UploadedFile.id == analysis.file_id).first()
    if file_row and Path(file_row.file_path).exists():
        Path(file_row.file_path).unlink(missing_ok=True)

    db.delete(analysis)
    if file_row:
        db.delete(file_row)
    db.commit()
    return {"message": "Document and analysis deleted successfully"}
