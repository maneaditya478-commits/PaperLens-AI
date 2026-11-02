import {
  DocumentAnalysis,
  KnowledgeBaseEntry,
  ImpactAnalysisResult,
  ChecklistResponse,
  HealthStatus
} from '../types';

const API_BASE = '/api';

export const api = {
  // Health
  getHealth: async (): Promise<HealthStatus> => {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Failed to fetch system health');
    return res.json();
  },

  // Upload document
  uploadDocument: async (file: File): Promise<{ id: string; original_filename: string; page_count: number }> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/documents/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to upload document');
    }
    return res.json();
  },

  // Analyze document
  analyzeDocument: async (fileId?: string, sampleKey?: string): Promise<DocumentAnalysis> => {
    const formData = new FormData();
    if (fileId) formData.append('file_id', fileId);
    if (sampleKey) formData.append('sample_key', sampleKey);

    const res = await fetch(`${API_BASE}/documents/analyze`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Analysis failed');
    }
    return res.json();
  },

  // List recent documents
  listDocuments: async (category?: string): Promise<DocumentAnalysis[]> => {
    const url = category ? `${API_BASE}/documents?category=${category}` : `${API_BASE}/documents`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch analyzed documents');
    return res.json();
  },

  // Get specific document analysis
  getDocumentAnalysis: async (id: string): Promise<DocumentAnalysis> => {
    const res = await fetch(`${API_BASE}/documents/${id}`);
    if (!res.ok) throw new Error('Failed to load analysis');
    return res.json();
  },

  // Delete document
  deleteDocument: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/documents/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete document');
  },

  // Ask Document Assistant
  askAssistant: async (
    analysisId: string,
    question: string,
    language: string = 'English',
    sessionId?: string
  ): Promise<{ answer: string; citations: any[]; session_id: string }> => {
    const res = await fetch(`${API_BASE}/documents/${analysisId}/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ analysis_id: analysisId, question, language, session_id: sessionId }),
    });
    if (!res.ok) throw new Error('Failed to get answer');
    return res.json();
  },

  // Impact Analyzer
  analyzeImpact: async (
    userQuestion: string,
    analysisId?: string,
    clauseText?: string
  ): Promise<ImpactAnalysisResult> => {
    const res = await fetch(`${API_BASE}/impact/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_question: userQuestion, analysis_id: analysisId, clause_text: clauseText }),
    });
    if (!res.ok) throw new Error('Failed to analyze scenario impact');
    return res.json();
  },

  // Knowledge Base list
  getKnowledgeBase: async (category?: string, search?: string): Promise<KnowledgeBaseEntry[]> => {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (search) params.append('search', search);

    const res = await fetch(`${API_BASE}/knowledge-base?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch knowledge base');
    return res.json();
  },

  // Knowledge Base single entry
  getKnowledgeBaseEntry: async (idOrSlug: string): Promise<KnowledgeBaseEntry> => {
    const res = await fetch(`${API_BASE}/knowledge-base/${idOrSlug}`);
    if (!res.ok) throw new Error('Knowledge base entry not found');
    return res.json();
  },

  // Generate Checklist
  generateChecklist: async (situation: string): Promise<ChecklistResponse> => {
    const res = await fetch(`${API_BASE}/checklists/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ situation }),
    });
    if (!res.ok) throw new Error('Failed to generate checklist');
    return res.json();
  },
};
