# PaperLens AI REST API Reference

The backend exposes fully validated REST APIs with OpenAPI documentation available at `http://127.0.0.1:8000/docs`.

## 1. System Health
### `GET /api/health`
Returns health status, active AI engine state, and database connectivity.
```json
{
  "status": "healthy",
  "app_name": "PaperLens AI",
  "version": "1.0.0",
  "demo_mode": true,
  "ai_engine_active": true,
  "database_connected": true
}
```

## 2. Documents
### `POST /api/documents/upload`
Uploads a document (`PDF`, `PNG`, `JPG`, `DOCX`), validates format and size (max 25MB), extracts OCR text & layout coordinates, and registers an `UploadedFile`.

### `POST /api/documents/analyze`
Executes classification, structural parsing, clause extraction, and summary generation.
- **Form Data**:
  - `file_id`: ID of uploaded file, OR
  - `sample_key`: Pre-configured demo key (`appointment_letter`, `employment_bond`, `nda`, `domicile_certificate`).

### `GET /api/documents`
Lists all analyzed documents. Optional query param `category`.

### `GET /api/documents/{id}`
Returns document analysis, key fields, summary, and clauses.

### `GET /api/documents/{id}/clauses`
Returns list of extracted clauses with optional risk filtering (`?risk=Critical|High|Moderate|Low`).

### `DELETE /api/documents/{id}`
Deletes document analysis and associated file from disk.

## 3. Conversational Assistant
### `POST /api/documents/{id}/ask`
Ask questions grounded on the document text.
- **Body**:
  ```json
  {
    "question": "What is the notice period required to resign?",
    "language": "English"
  }
  ```
- **Response**:
  ```json
  {
    "answer": "...",
    "citations": [
      {
        "document_title": "Tech Appointment Letter",
        "page": 1,
        "snippet": "...",
        "relevance_score": 0.95
      }
    ]
  }
  ```

## 4. Document Impact Simulator
### `POST /api/impact/analyze`
Simulates hypothetical decision scenarios (e.g., early departure or bond breach).
- **Body**:
  ```json
  {
    "analysis_id": "...",
    "user_question": "What happens if I leave my company before completing six months?"
  }
  ```

## 5. Knowledge Base
### `GET /api/knowledge-base`
Returns verified document guides. Supports query parameters `category` and `search`.

### `GET /api/knowledge-base/{id_or_slug}`
Returns detailed guide including official issuing authority, application steps, eligibility, and verified official government URL.

## 6. Personal Checklists
### `POST /api/checklists/generate`
Generates customized document checklists for situations:
- `joining_company`
- `passport`
- `government_certificate`
- `college_admission`
- `bank_loan`
- `insurance`
