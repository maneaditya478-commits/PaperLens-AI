from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict

# Base & Health
class HealthResponse(BaseModel):
    status: str
    app_name: str
    version: str
    demo_mode: bool
    ai_engine_active: bool
    database_connected: bool

# Clause schema matching requirements
class ExtractedClauseSchema(BaseModel):
    id: Optional[str] = None
    clause_type: str = Field(..., description="e.g., notice_period, probation, bond, non_compete")
    title: str
    original_text: str
    plain_language: str
    what_it_requires: Optional[str] = None
    who_it_affects: str = "Signatory / Employee"
    when_it_applies: str = "During execution or departure"
    obligations: List[str] = Field(default_factory=list)
    restrictions: List[str] = Field(default_factory=list)
    deadlines: List[str] = Field(default_factory=list)
    financial_implications: List[str] = Field(default_factory=list)
    possible_consequences: List[str] = Field(default_factory=list)
    exceptions: List[str] = Field(default_factory=list)
    questions_to_ask: List[str] = Field(default_factory=list)
    source_page: int = 1
    source_paragraph: int = 1
    confidence: float = 0.95
    requires_human_review: bool = False
    risk_severity: str = "Moderate" # Low, Moderate, High, Critical

class DocumentReferenceSchema(BaseModel):
    id: Optional[str] = None
    title: str
    snippet: str
    page: int = 1
    section_type: str = "body"
    confidence: float = 0.95

class UploadedFileSchema(BaseModel):
    id: str
    original_filename: str
    file_size_bytes: int
    mime_type: str
    page_count: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class DocumentAnalysisSchema(BaseModel):
    id: str
    file_id: str
    title: str
    category: str
    sub_type: str
    language: str
    summary: str
    purpose: Optional[str] = None
    key_fields: Dict[str, Any] = Field(default_factory=dict)
    risk_level: str
    confidence_score: float
    is_demo: bool
    processing_time_ms: int
    created_at: datetime
    clauses: List[ExtractedClauseSchema] = Field(default_factory=list)
    references: List[DocumentReferenceSchema] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)

class KnowledgeBaseEntrySchema(BaseModel):
    id: str
    slug: str
    title: str
    category: str
    description: str
    purpose: str
    why_required: str
    where_used: str
    issuing_authority: str
    who_needs_it: str
    required_information: List[str] = Field(default_factory=list)
    eligibility: List[str] = Field(default_factory=list)
    application_procedure: List[str] = Field(default_factory=list)
    supporting_documents: List[str] = Field(default_factory=list)
    important_terms: List[str] = Field(default_factory=list)
    common_mistakes: List[str] = Field(default_factory=list)
    related_documents: List[str] = Field(default_factory=list)
    official_url: str
    verification_date: str
    is_official_source: bool = True
    sample_text_preview: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

# Impact analysis request/response
class ImpactAnalysisRequest(BaseModel):
    analysis_id: Optional[str] = None
    clause_id: Optional[str] = None
    clause_text: Optional[str] = None
    user_question: str
    context: Optional[str] = None

class ImpactAnalysisResponse(BaseModel):
    user_question: str
    direct_answer: str
    retrieved_clauses: List[Dict[str, Any]] = Field(default_factory=list)
    related_conditions: List[str] = Field(default_factory=list)
    possible_outcomes: List[str] = Field(default_factory=list)
    financial_implications: List[str] = Field(default_factory=list)
    relevant_exceptions: List[str] = Field(default_factory=list)
    missing_information: List[str] = Field(default_factory=list)
    source_citations: List[Dict[str, Any]] = Field(default_factory=list)
    risk_level: str = "Moderate"
    legal_disclaimer: str = (
        "PaperLens AI provides informational analysis grounded in the document text. "
        "This is not formal legal advice. Contractual enforceability and exceptions depend on applicable statutory law "
        "and individual facts. Consult qualified legal counsel for binding determinations."
    )

# Conversational Assistant
class ChatAskRequest(BaseModel):
    analysis_id: Optional[str] = None
    session_id: Optional[str] = None
    question: str
    language: str = "English" # English, Hindi, Marathi

class ChatCitation(BaseModel):
    document_title: str
    page: int
    snippet: str
    relevance_score: float

class ChatAskResponse(BaseModel):
    session_id: str
    question: str
    answer: str
    language: str
    citations: List[ChatCitation] = Field(default_factory=list)
    confidence: float = 0.95
    is_grounded: bool = True
    notice: str = "Grounded on provided document and verified knowledge base."

# Checklists
class ChecklistItem(BaseModel):
    id: str
    name: str
    category: str
    required: bool
    status: str = "pending" # pending, uploaded, verified
    where_to_obtain: str
    why_required: str
    official_url: Optional[str] = None
    supporting_docs: List[str] = Field(default_factory=list)

class ChecklistGenerateRequest(BaseModel):
    situation: str # e.g. "joining_company", "government_certificate", "passport", "college_admission", "bank_loan", "insurance"
    custom_details: Optional[str] = None

class ChecklistGenerateResponse(BaseModel):
    situation: str
    title: str
    description: str
    items: List[ChecklistItem]
    total_required: int
    total_optional: int
    verification_authority: str
