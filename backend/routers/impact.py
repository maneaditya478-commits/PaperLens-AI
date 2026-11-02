from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models import DocumentAnalysis, ExtractedClause, UploadedFile
from backend.schemas import ImpactAnalysisRequest, ImpactAnalysisResponse
from ai_engine.impact_analyzer.impact_engine import impact_analyzer

router = APIRouter(prefix="/api/impact", tags=["Impact Analyzer"])

@router.post("/analyze", response_model=ImpactAnalysisResponse)
def analyze_document_impact(
    payload: ImpactAnalysisRequest,
    db: Session = Depends(get_db)
):
    clauses_data = []
    doc_text = ""

    if payload.analysis_id:
        analysis = db.query(DocumentAnalysis).filter(DocumentAnalysis.id == payload.analysis_id).first()
        if not analysis:
            raise HTTPException(status_code=404, detail="Document analysis not found")

        clauses = db.query(ExtractedClause).filter(ExtractedClause.analysis_id == analysis.id).all()
        clauses_data = [
            {
                "id": c.id,
                "clause_type": c.clause_type,
                "title": c.title,
                "original_text": c.original_text,
                "plain_language": c.plain_language,
                "obligations": c.obligations,
                "restrictions": c.restrictions,
                "deadlines": c.deadlines,
                "financial_implications": c.financial_implications,
                "possible_consequences": c.possible_consequences,
                "exceptions": c.exceptions,
                "source_page": c.source_page,
                "risk_severity": c.risk_severity
            }
            for c in clauses
        ]

        file_row = db.query(UploadedFile).filter(UploadedFile.id == analysis.file_id).first()
        if file_row:
            doc_text = file_row.ocr_raw_text or ""

    elif payload.clause_text:
        clauses_data = [{
            "clause_type": "user_provided_clause",
            "title": "Selected Contract Clause",
            "original_text": payload.clause_text,
            "plain_language": payload.clause_text,
            "obligations": [],
            "restrictions": [],
            "deadlines": [],
            "financial_implications": [],
            "possible_consequences": [],
            "exceptions": [],
            "source_page": 1,
            "risk_severity": "Moderate"
        }]

    # Run impact simulation
    result = impact_analyzer.analyze_scenario(
        user_question=payload.user_question,
        clauses=clauses_data,
        document_text=doc_text
    )

    return ImpactAnalysisResponse(**result)
