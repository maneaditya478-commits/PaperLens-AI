import React, { useState } from 'react';
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Search,
  Scale,
  Bot,
  HelpCircle,
  ShieldAlert,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';
import { DocumentAnalysis, ExtractedClause } from '../types';
import { TermsAnalyzer } from './TermsAnalyzer';
import { ImpactAnalyzer } from './ImpactAnalyzer';
import { AskAssistant } from './AskAssistant';

interface DocumentIntelligenceProps {
  analysis: DocumentAnalysis;
  onBack: () => void;
}

export const DocumentIntelligence: React.FC<DocumentIntelligenceProps> = ({
  analysis,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'clauses' | 'terms' | 'impact' | 'chat'>('clauses');
  const [selectedClause, setSelectedClause] = useState<ExtractedClause | null>(
    analysis.clauses[0] || null
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [highlightKeyword, setHighlightKeyword] = useState<string>('');

  const riskBadgeStyles = {
    High: 'bg-rose-50 text-rose-700 border-rose-200',
    Moderate: 'bg-amber-50 text-amber-700 border-amber-200',
    Low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  }[analysis.risk_level] || 'bg-slate-50 text-slate-700 border-slate-200';

  const handleClauseClick = (clause: ExtractedClause) => {
    setSelectedClause(clause);
    if (clause.source_page) {
      setCurrentPage(clause.source_page);
    }
    // Set keyword to highlight the first few words of the clause
    const snippet = clause.original_text.slice(0, 30).trim();
    setHighlightKeyword(snippet);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {analysis.category}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${riskBadgeStyles}`}>
                {analysis.risk_level} Risk
              </span>
              {analysis.is_demo && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  Demo Mode
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">{analysis.title}</h2>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('clauses')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'clauses' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Overview & Clauses
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'terms' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Terms Analyzer
          </button>
          <button
            onClick={() => setActiveTab('impact')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'impact' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Impact Simulator
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'chat' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Ask PaperLens
          </button>
        </div>
      </div>

      {/* Split-Screen Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Original Document Viewer & Page Controls */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-[750px]">
          {/* Document Viewer Toolbar */}
          <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 font-semibold text-slate-700">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Document Viewer</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Page Nav */}
              <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-2 py-0.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="text-slate-400 hover:text-slate-700 p-0.5"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-bold text-slate-700">Page {currentPage}</span>
                <button
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="text-slate-400 hover:text-slate-700 p-0.5"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-1.5 py-0.5 text-[11px]">
                <button onClick={() => setZoomLevel((z) => Math.max(70, z - 10))} className="p-0.5 text-slate-500">
                  <ZoomOut className="w-3 h-3" />
                </button>
                <span className="font-semibold text-slate-600">{zoomLevel}%</span>
                <button onClick={() => setZoomLevel((z) => Math.min(150, z + 10))} className="p-0.5 text-slate-500">
                  <ZoomIn className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Document Content View */}
          <div
            className="flex-1 overflow-y-auto p-6 bg-slate-50/50 space-y-4"
            style={{ fontSize: `${(zoomLevel / 100) * 12}px` }}
          >
            {/* Display Selected Clause Highlight Banner */}
            {selectedClause && (
              <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-xl text-blue-900 text-xs flex items-center justify-between">
                <span className="font-semibold">Focused: {selectedClause.title}</span>
                <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold">
                  Page {selectedClause.source_page}
                </span>
              </div>
            )}

            {/* Document Paragraphs & Clauses */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs font-mono space-y-4 leading-relaxed text-slate-800">
              {analysis.clauses.map((clause, idx) => {
                const isFocused = selectedClause?.id === clause.id;
                return (
                  <div
                    key={idx}
                    id={`clause-block-${idx}`}
                    onClick={() => handleClauseClick(clause)}
                    className={`p-3 rounded-xl transition-all cursor-pointer ${
                      isFocused
                        ? 'bg-amber-100/70 border-2 border-amber-400 shadow-sm'
                        : 'hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
                      <span>§ {clause.title}</span>
                      <span>P.{clause.source_page}</span>
                    </div>
                    <div className="text-slate-800 text-[11px] whitespace-pre-wrap">
                      {clause.original_text}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Intelligence & Modular Tabs */}
        <div className="lg:col-span-7 space-y-6">
          {activeTab === 'clauses' && (
            <div className="space-y-6">
              {/* Executive Summary Card */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span>Executive Summary & Legal Purpose</span>
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Confidence: {(analysis.confidence_score * 100).toFixed(0)}%
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{analysis.summary}</p>

                {/* Key Extracted Fields Matrix */}
                {analysis.key_fields && Object.keys(analysis.key_fields).length > 0 && (
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Key Extracted Parameters
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {analysis.key_fields.notice_period && (
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                          <span className="text-[10px] text-slate-400 block font-semibold">Notice Period</span>
                          <span className="text-xs font-bold text-slate-900">{analysis.key_fields.notice_period}</span>
                        </div>
                      )}
                      {analysis.key_fields.probation_period && (
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                          <span className="text-[10px] text-slate-400 block font-semibold">Probation</span>
                          <span className="text-xs font-bold text-slate-900">{analysis.key_fields.probation_period}</span>
                        </div>
                      )}
                      {analysis.key_fields.financial_amounts && (
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                          <span className="text-[10px] text-slate-400 block font-semibold">Compensation / Amounts</span>
                          <span className="text-xs font-bold text-blue-700">
                            {analysis.key_fields.financial_amounts.slice(0, 2).join(', ')}
                          </span>
                        </div>
                      )}
                      {analysis.key_fields.service_bond && (
                        <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200">
                          <span className="text-[10px] text-rose-500 block font-semibold">Service Bond</span>
                          <span className="text-xs font-bold text-rose-800">{analysis.key_fields.service_bond}</span>
                        </div>
                      )}
                      {analysis.key_fields.dates_mentioned && (
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                          <span className="text-[10px] text-slate-400 block font-semibold">Dates Mentioned</span>
                          <span className="text-xs font-bold text-slate-900">
                            {analysis.key_fields.dates_mentioned[0]}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Clause Cards Quick View */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900">
                    Important Clauses ({analysis.clauses.length})
                  </h3>
                  <button
                    onClick={() => setActiveTab('terms')}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Inspect In-Depth</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {analysis.clauses.map((cl, i) => (
                    <div
                      key={i}
                      onClick={() => handleClauseClick(cl)}
                      className={`p-4 rounded-2xl bg-white border transition-all cursor-pointer ${
                        selectedClause?.id === cl.id
                          ? 'border-blue-500 shadow-sm ring-1 ring-blue-500/20'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-slate-900">{cl.title}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            cl.risk_severity === 'Critical'
                              ? 'bg-rose-50 text-rose-700'
                              : cl.risk_severity === 'High'
                              ? 'bg-orange-50 text-orange-700'
                              : 'bg-blue-50 text-blue-700'
                          }`}
                        >
                          {cl.risk_severity}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                        {cl.plain_language}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'terms' && (
            <TermsAnalyzer
              clauses={analysis.clauses}
              selectedClauseId={selectedClause?.id}
              onClauseSelect={(c) => setSelectedClause(c)}
            />
          )}

          {activeTab === 'impact' && (
            <ImpactAnalyzer currentAnalysis={analysis} />
          )}

          {activeTab === 'chat' && (
            <AskAssistant currentAnalysis={analysis} />
          )}
        </div>
      </div>
    </div>
  );
};
