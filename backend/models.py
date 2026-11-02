import uuid
from datetime import datetime
from sqlalchemy import (
    Column, String, Text, Integer, Float, Boolean, DateTime, ForeignKey, JSON
)
from sqlalchemy.orm import relationship
from backend.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, index=True, nullable=True)
    username = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class DocumentCategory(Base):
    __tablename__ = "document_categories"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    slug = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    icon = Column(String(50), default="FileText")
    display_order = Column(Integer, default=0)

class KnowledgeBaseEntry(Base):
    __tablename__ = "knowledge_base_entries"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False, index=True)
    category = Column(String(50), nullable=False, index=True)
    description = Column(Text, nullable=False)
    purpose = Column(Text, nullable=False)
    why_required = Column(Text, nullable=False)
    where_used = Column(Text, nullable=False)
    issuing_authority = Column(String(255), nullable=False)
    who_needs_it = Column(Text, nullable=False)
    required_information = Column(JSON, default=list)
    eligibility = Column(JSON, default=list)
    application_procedure = Column(JSON, default=list)
    supporting_documents = Column(JSON, default=list)
    important_terms = Column(JSON, default=list)
    common_mistakes = Column(JSON, default=list)
    related_documents = Column(JSON, default=list)
    official_url = Column(String(500), nullable=False)
    verification_date = Column(String(50), default="2026-03-01")
    is_official_source = Column(Boolean, default=True)
    sample_text_preview = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class UploadedFile(Base):
    __tablename__ = "uploaded_files"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    original_filename = Column(String(255), nullable=False)
    stored_filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_size_bytes = Column(Integer, nullable=False)
    mime_type = Column(String(100), nullable=False)
    page_count = Column(Integer, default=1)
    ocr_raw_text = Column(Text, nullable=True)
    layout_data = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    analysis = relationship("DocumentAnalysis", back_populates="file", uselist=False, cascade="all, delete-orphan")

class DocumentAnalysis(Base):
    __tablename__ = "document_analyses"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    file_id = Column(String(36), ForeignKey("uploaded_files.id", ondelete="CASCADE"), nullable=False, unique=True)
    title = Column(String(255), nullable=False)
    category = Column(String(50), nullable=False, index=True)
    sub_type = Column(String(100), nullable=False)
    language = Column(String(20), default="English")
    summary = Column(Text, nullable=False)
    purpose = Column(Text, nullable=True)
    key_fields = Column(JSON, default=dict) # e.g. dates, names, amounts, party info
    risk_level = Column(String(20), default="Low") # Low, Medium, High
    confidence_score = Column(Float, default=0.95)
    is_demo = Column(Boolean, default=False)
    processing_time_ms = Column(Integer, default=450)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    file = relationship("UploadedFile", back_populates="analysis")
    clauses = relationship("ExtractedClause", back_populates="analysis", cascade="all, delete-orphan")
    references = relationship("DocumentReference", back_populates="analysis", cascade="all, delete-orphan")
    chat_sessions = relationship("ChatSession", back_populates="analysis", cascade="all, delete-orphan")

class ExtractedClause(Base):
    __tablename__ = "extracted_clauses"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    analysis_id = Column(String(36), ForeignKey("document_analyses.id", ondelete="CASCADE"), nullable=False, index=True)
    clause_type = Column(String(100), nullable=False, index=True) # notice_period, probation, bond, confidentiality, non_compete, etc.
    title = Column(String(255), nullable=False)
    original_text = Column(Text, nullable=False)
    plain_language = Column(Text, nullable=False)
    what_it_requires = Column(Text, nullable=True)
    who_it_affects = Column(String(255), default="Signatory / Employee")
    when_it_applies = Column(String(255), default="During execution or departure")
    obligations = Column(JSON, default=list)
    restrictions = Column(JSON, default=list)
    deadlines = Column(JSON, default=list)
    financial_implications = Column(JSON, default=list)
    possible_consequences = Column(JSON, default=list)
    exceptions = Column(JSON, default=list)
    questions_to_ask = Column(JSON, default=list)
    source_page = Column(Integer, default=1)
    source_paragraph = Column(Integer, default=1)
    confidence = Column(Float, default=0.92)
    requires_human_review = Column(Boolean, default=False)
    risk_severity = Column(String(20), default="Moderate") # Low, Moderate, High, Critical
    created_at = Column(DateTime, default=datetime.utcnow)
    
    analysis = relationship("DocumentAnalysis", back_populates="clauses")

class DocumentReference(Base):
    __tablename__ = "document_references"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    analysis_id = Column(String(36), ForeignKey("document_analyses.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    snippet = Column(Text, nullable=False)
    page = Column(Integer, default=1)
    section_type = Column(String(100), default="body")
    confidence = Column(Float, default=0.95)

    analysis = relationship("DocumentAnalysis", back_populates="references")

class ChatSession(Base):
    __tablename__ = "chat_sessions"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    analysis_id = Column(String(36), ForeignKey("document_analyses.id", ondelete="CASCADE"), nullable=True, index=True)
    title = Column(String(255), default="Document Assistant")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    analysis = relationship("DocumentAnalysis", back_populates="chat_sessions")
    messages = relationship("ChatMessage", back_populates="session", cascade="all, delete-orphan", order_by="ChatMessage.created_at")

class ChatMessage(Base):
    __tablename__ = "chat_messages"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    session_id = Column(String(36), ForeignKey("chat_sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    role = Column(String(20), nullable=False) # user, assistant, system
    content = Column(Text, nullable=False)
    language = Column(String(20), default="English") # English, Hindi, Marathi
    citations = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    session = relationship("ChatSession", back_populates="messages")

class UserChecklist(Base):
    __tablename__ = "user_checklists"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    situation = Column(String(100), nullable=False, index=True) # employment, government, education, loan, insurance, passport
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    items = Column(JSON, default=list) # [{ name, required, status, where_to_obtain, why_required, official_url }]
    created_at = Column(DateTime, default=datetime.utcnow)
