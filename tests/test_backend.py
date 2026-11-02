import pytest
from backend.database import SessionLocal
from backend.main import health_check
from backend.routers import documents, ask, impact, knowledge_base, checklists
from backend.schemas import (
    ImpactAnalysisRequest, ChatAskRequest, ChecklistGenerateRequest
)
from ai_engine.classification.classifier import document_classifier
from ai_engine.clause_extraction.extractor import clause_extractor
from ai_engine.evaluation.evaluator import evaluator

@pytest.fixture
def db():
    session = SessionLocal()
    yield session
    session.close()

def test_health_check(db):
    res = health_check(db)
    assert res.status == "healthy"
    assert res.app_name == "PaperLens AI"
    assert res.database_connected is True

def test_knowledge_base_list_and_detail(db):
    entries = knowledge_base.list_knowledge_base(category=None, search=None, limit=50, db=db)
    assert len(entries) >= 20

    # Test filtering by category
    emp_entries = knowledge_base.list_knowledge_base(category="employment", search=None, limit=20, db=db)
    assert len(emp_entries) >= 10
    for e in emp_entries:
        assert e.category == "employment"
        assert e.official_url.startswith("http")

    # Test detail
    aadhaar = knowledge_base.get_knowledge_base_entry("aadhaar-card", db=db)
    assert aadhaar.slug == "aadhaar-card"
    assert "UIDAI" in aadhaar.issuing_authority

def test_checklist_generation(db):
    req = ChecklistGenerateRequest(situation="joining_company")
    res = checklists.generate_checklist(payload=req, db=db)
    assert res.situation == "joining_company"
    assert len(res.items) >= 5
    assert res.total_required > 0
    assert any("Appointment" in it.name for it in res.items)

def test_document_demo_analysis_and_impact(db):
    # Analyze synthetic sample appointment letter
    analysis = documents.analyze_document(file_id=None, sample_key="appointment_letter", db=db)
    assert analysis.category == "employment"
    assert len(analysis.clauses) > 0
    assert analysis.is_demo is True

    # Test Ask Assistant
    ask_req = ChatAskRequest(
        analysis_id=analysis.id,
        question="What is the notice period required to resign?",
        language="English"
    )
    ask_res = ask.ask_document_assistant(analysis_id=analysis.id, payload=ask_req, db=db)
    assert "notice" in ask_res.answer.lower()
    assert len(ask_res.citations) > 0

    # Test Multilingual (Hindi)
    ask_hi = ask.ask_document_assistant(
        analysis_id=analysis.id,
        payload=ChatAskRequest(analysis_id=analysis.id, question="नोटिस अवधि क्या है?", language="Hindi"),
        db=db
    )
    assert "नोटिस" in ask_hi.answer or "स्पष्टीकरण" in ask_hi.answer

    # Test Impact Analysis
    impact_req = ImpactAnalysisRequest(
        analysis_id=analysis.id,
        user_question="What happens if I leave before completing six months?"
    )
    impact_res = impact.analyze_document_impact(payload=impact_req, db=db)
    assert len(impact_res.possible_outcomes) > 0
    assert "informational" in impact_res.legal_disclaimer.lower()

def test_classifier_and_clauses():
    res = document_classifier.classify("Income Tax Department Permanent Account Number PAN Card")
    assert res["category"] == "government"

    clauses = clause_extractor.extract_clauses(
        "Employee agrees to serve 90 days notice before resignation. Minimum service bond of 2 years applies."
    )
    clause_types = [c["clause_type"] for c in clauses]
    assert "notice_period" in clause_types
    assert "bond_service" in clause_types

def test_ai_benchmark_evaluator():
    eval_res = evaluator.run_evaluation()
    assert eval_res["classification_accuracy_pct"] >= 90.0
    assert eval_res["clause_extraction_recall_pct"] >= 80.0
    assert eval_res["status"] == "PASS"
