export interface ExtractedClause {
  id?: string;
  clause_type: string;
  title: string;
  original_text: string;
  plain_language: string;
  what_it_requires?: string;
  who_it_affects: string;
  when_it_applies: string;
  obligations: string[];
  restrictions: string[];
  deadlines: string[];
  financial_implications: string[];
  possible_consequences: string[];
  exceptions: string[];
  questions_to_ask: string[];
  source_page: number;
  source_paragraph: number;
  confidence: number;
  requires_human_review: boolean;
  risk_severity: 'Low' | 'Moderate' | 'High' | 'Critical';
}

export interface DocumentReference {
  id?: string;
  title: string;
  snippet: string;
  page: number;
  section_type: string;
  confidence: number;
}

export interface DocumentAnalysis {
  id: string;
  file_id: string;
  title: string;
  category: string;
  sub_type: string;
  language: string;
  summary: string;
  purpose?: string;
  key_fields: Record<string, any>;
  risk_level: 'Low' | 'Moderate' | 'High';
  confidence_score: number;
  is_demo: boolean;
  processing_time_ms: number;
  created_at: string;
  clauses: ExtractedClause[];
  references: DocumentReference[];
}

export interface KnowledgeBaseEntry {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  purpose: string;
  why_required: string;
  where_used: string;
  issuing_authority: string;
  who_needs_it: string;
  required_information: string[];
  eligibility: string[];
  application_procedure: string[];
  supporting_documents: string[];
  important_terms: string[];
  common_mistakes: string[];
  related_documents: string[];
  official_url: string;
  verification_date: string;
  is_official_source: boolean;
  sample_text_preview?: string;
}

export interface ChatCitation {
  document_title: string;
  page: number;
  snippet: string;
  relevance_score: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  language: string;
  citations?: ChatCitation[];
  created_at?: string;
}

export interface ImpactAnalysisResult {
  user_question: string;
  direct_answer: string;
  retrieved_clauses: any[];
  related_conditions: string[];
  possible_outcomes: string[];
  financial_implications: string[];
  relevant_exceptions: string[];
  missing_information: string[];
  source_citations: { title: string; page: number; snippet: string }[];
  risk_level: string;
  legal_disclaimer: string;
}

export interface ChecklistItem {
  id: string;
  name: string;
  category: string;
  required: boolean;
  status: 'pending' | 'obtained';
  where_to_obtain: string;
  why_required: string;
  official_url?: string;
  supporting_docs?: string[];
}

export interface ChecklistResponse {
  situation: string;
  title: string;
  description: string;
  items: ChecklistItem[];
  total_required: number;
  total_optional: number;
  verification_authority: string;
}

export interface HealthStatus {
  status: string;
  app_name: string;
  version: string;
  demo_mode: boolean;
  ai_engine_active: boolean;
  database_connected: boolean;
}
