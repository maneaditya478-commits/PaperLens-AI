import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models import DocumentAnalysis, UploadedFile, ChatSession, ChatMessage
from backend.schemas import ChatAskRequest, ChatAskResponse
from ai_engine.rag.rag_pipeline import rag_pipeline
from ai_engine.multilingual.translator import multilingual_engine

router = APIRouter(prefix="/api/documents", tags=["Ask Assistant"])

@router.post("/{analysis_id}/ask", response_model=ChatAskResponse)
def ask_document_assistant(
    analysis_id: str,
    payload: ChatAskRequest,
    db: Session = Depends(get_db)
):
    analysis = db.query(DocumentAnalysis).filter(DocumentAnalysis.id == analysis_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Document analysis not found")

    file_row = db.query(UploadedFile).filter(UploadedFile.id == analysis.file_id).first()
    pages_data = file_row.layout_data.get("pages", []) if file_row else []

    # Get or create chat session
    session_id = payload.session_id
    if not session_id:
        chat_sess = ChatSession(analysis_id=analysis.id, title=payload.question[:40])
        db.add(chat_sess)
        db.commit()
        db.refresh(chat_sess)
        session_id = chat_sess.id

    # Record User Message
    user_msg = ChatMessage(
        session_id=session_id,
        role="user",
        content=payload.question,
        language=payload.language
    )
    db.add(user_msg)
    db.commit()

    # RAG Retrieval and Grounded Synthesis
    rag_result = rag_pipeline.answer_question(
        query=payload.question,
        document_title=analysis.title,
        pages_data=pages_data
    )

    answer_content = rag_result["answer"]

    # Localize response if target language is Hindi or Marathi
    if payload.language.lower() in ["hindi", "marathi"]:
        answer_content = multilingual_engine.localize_text(answer_content, payload.language)

    # Record Assistant Message
    assistant_msg = ChatMessage(
        session_id=session_id,
        role="assistant",
        content=answer_content,
        language=payload.language,
        citations=rag_result["citations"]
    )
    db.add(assistant_msg)
    db.commit()

    return ChatAskResponse(
        session_id=session_id,
        question=payload.question,
        answer=answer_content,
        language=payload.language,
        citations=rag_result["citations"],
        confidence=rag_result["confidence"],
        is_grounded=rag_result["is_grounded"]
    )
