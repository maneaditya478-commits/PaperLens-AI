import React, { useState } from 'react';
import {
  AlertTriangle,
  HelpCircle,
  Clock,
  ShieldAlert,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileQuestion,
  ExternalLink,
  Info,
} from 'lucide-react';
import { ExtractedClause } from '../types';

interface TermsAnalyzerProps {
  clauses: ExtractedClause[];
  onClauseSelect?: (clause: ExtractedClause) => void;
  selectedClauseId?: string;
}

export const TermsAnalyzer: React.FC<TermsAnalyzerProps> = ({
  clauses,
  onClauseSelect,
  selectedClauseId,
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [filterRisk, setFilterRisk] = useState<string>('all');

  const filteredClauses = clauses.filter((c) => {
    if (filterRisk === 'all') return true;
    return c.risk_severity.toLowerCase() === filterRisk.toLowerCase();
  });

  const toggleExpand = (idx: number, clause: ExtractedClause) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
    if (onClauseSelect) onClauseSelect(clause);
  };

  return (
    <div className="space-y-6">
      {/* Risk Filter & Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h3 className="text-base font-bold text-slate-900">Contractual Clauses & Terms Inspector</h3>
          <p className="text-xs text-slate-500">
            {clauses.length} structured terms identified with obligations, restrictions & plain-language translation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">Filter Risk:</span>
          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Risks ({clauses.length})</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="moderate">Moderate</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {filteredClauses.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs">
          No clauses found matching the selected risk level.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredClauses.map((clause, idx) => {
            const isExpanded = expandedIndex === idx;
            const isSelected = selectedClauseId === clause.id;

            const severityColors = {
              Critical: 'bg-rose-50 text-rose-700 border-rose-200',
              High: 'bg-orange-50 text-orange-700 border-orange-200',
              Moderate: 'bg-amber-50 text-amber-700 border-amber-200',
              Low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            }[clause.risk_severity] || 'bg-slate-50 text-slate-700 border-slate-200';

            return (
              <div
                key={clause.id || idx}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isSelected
                    ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md bg-white'
                    : 'border-slate-200 hover:border-slate-300 bg-white shadow-2xs'
                }`}
              >
                {/* Header Row */}
                <div
                  onClick={() => toggleExpand(idx, clause)}
                  className="p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none bg-slate-50/50 hover:bg-slate-100/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${severityColors}`}>
                      {clause.risk_severity}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{clause.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Source: Page {clause.source_page} • Clause {clause.clause_type.replace('_', ' ')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {clause.requires_human_review && (
                      <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        Verify
                      </span>
                    )}
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-5 border-t border-slate-100 space-y-6 text-xs">
                    {/* Plain Language Summary */}
                    <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 space-y-1.5">
                      <div className="font-bold text-blue-900 flex items-center gap-1.5 text-xs">
                        <Info className="w-4 h-4 text-blue-600" />
                        <span>Plain-Language Explanation (What this means in simple terms)</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed text-xs">
                        {clause.plain_language}
                      </p>
                    </div>

                    {/* Original Verbatim Contract Excerpt */}
                    <div className="space-y-1.5">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                        <span>Original Contract Clause Text</span>
                        <span className="text-[10px] text-slate-400">Page {clause.source_page}</span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-800 font-mono text-[11px] leading-relaxed whitespace-pre-wrap">
                        {clause.original_text}
                      </div>
                    </div>

                    {/* Breakdown Matrix: Obligations & Restrictions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Obligations */}
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                        <h5 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>What It Requires (Obligations)</span>
                        </h5>
                        <ul className="space-y-1.5 text-slate-600 text-[11px]">
                          {clause.obligations.length > 0 ? (
                            clause.obligations.map((ob, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span className="text-slate-400">•</span>
                                <span>{ob}</span>
                              </li>
                            ))
                          ) : (
                            <li className="text-slate-400">Standard operational terms apply.</li>
                          )}
                        </ul>
                      </div>

                      {/* Restrictions */}
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                        <h5 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                          <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                          <span>What It Restricts / Forbids</span>
                        </h5>
                        <ul className="space-y-1.5 text-slate-600 text-[11px]">
                          {clause.restrictions.length > 0 ? (
                            clause.restrictions.map((res, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span className="text-slate-400">•</span>
                                <span>{res}</span>
                              </li>
                            ))
                          ) : (
                            <li className="text-slate-400">No explicit negative covenants specified.</li>
                          )}
                        </ul>
                      </div>
                    </div>

                    {/* Financial Implications & Possible Consequences */}
                    {(clause.financial_implications.length > 0 || clause.possible_consequences.length > 0) && (
                      <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/70 space-y-3">
                        <h5 className="font-bold text-amber-950 text-xs flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          <span>Financial Conditions & Possible Consequences</span>
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] text-amber-900">
                          <div>
                            <span className="font-semibold block text-slate-700">Financial Stipulations:</span>
                            {clause.financial_implications.length > 0 ? (
                              clause.financial_implications.map((fi, i) => <div key={i}>• {fi}</div>)
                            ) : (
                              <span className="text-slate-500">None explicitly stated.</span>
                            )}
                          </div>
                          <div>
                            <span className="font-semibold block text-slate-700">Consequences of Violation:</span>
                            {clause.possible_consequences.length > 0 ? (
                              clause.possible_consequences.map((pc, i) => <div key={i}>• {pc}</div>)
                            ) : (
                              <span className="text-slate-500">Subject to standard contractual breach terms.</span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Questions to Ask HR / Employer */}
                    {clause.questions_to_ask.length > 0 && (
                      <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 space-y-2">
                        <h5 className="font-bold text-indigo-950 text-xs flex items-center gap-1.5">
                          <FileQuestion className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Questions You Should Ask Your Employer Before Signing</span>
                        </h5>
                        <ul className="space-y-1.5 text-[11px] text-indigo-900">
                          {clause.questions_to_ask.map((q, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-indigo-400 font-bold">{i + 1}.</span>
                              <span>{q}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
