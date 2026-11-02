import React, { useState } from 'react';
import {
  Sparkles,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  FileText,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { api } from '../services/api';
import { ImpactAnalysisResult, DocumentAnalysis } from '../types';

interface ImpactAnalyzerProps {
  currentAnalysis?: DocumentAnalysis | null;
}

export const ImpactAnalyzer: React.FC<ImpactAnalyzerProps> = ({ currentAnalysis }) => {
  const [question, setQuestion] = useState(
    'What happens if I leave my company before completing six months?'
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImpactAnalysisResult | null>(null);
  const [error, setError] = useState('');

  const sampleQuestions = [
    'What happens if I leave my company before completing six months?',
    'What happens if I break my 2-year service bond?',
    'Can I start a freelance project while employed?',
    'What is the notice period requirement during probation?',
    'Can the employer withhold my relieving letter if I resign?',
  ];

  const handleSimulate = async (customQ?: string) => {
    const qToUse = customQ || question;
    if (!qToUse.trim()) return;

    try {
      setLoading(true);
      setError('');
      const res = await api.analyzeImpact(qToUse, currentAnalysis?.id);
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Failed to simulate scenario impact.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 text-violet-700 text-xs font-semibold border border-violet-200">
          <Sparkles className="w-3.5 h-3.5 text-violet-600" />
          <span>Decision Consequence & Risk Simulator</span>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900">Document Impact Analyzer</h2>
        <p className="text-xs text-slate-600">
          Simulate real-world contractual consequences before tendering resignation, violating terms, or signing bonds.
        </p>
      </div>

      {/* Input Box */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">
            Ask a hypothetical "What happens if..." question:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. What happens if I leave before 6 months?"
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-slate-50/50"
              onKeyDown={(e) => e.key === 'Enter' && handleSimulate()}
            />
            <button
              onClick={() => handleSimulate()}
              disabled={loading || !question.trim()}
              className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm shadow-md shadow-violet-600/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Simulating...' : 'Simulate'}</span>
            </button>
          </div>
        </div>

        {/* Suggested Prompts */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] font-semibold text-slate-400">Suggested scenarios to test:</span>
          <div className="flex flex-wrap gap-2">
            {sampleQuestions.map((sq, i) => (
              <button
                key={i}
                onClick={() => {
                  setQuestion(sq);
                  handleSimulate(sq);
                }}
                className="text-[11px] px-3 py-1 rounded-full bg-slate-100 hover:bg-violet-50 hover:text-violet-700 text-slate-600 transition-colors font-medium border border-slate-200/60"
              >
                {sq}
              </button>
            ))}
          </div>
        </div>

        {currentAnalysis && (
          <div className="pt-2 text-[11px] text-slate-500 flex items-center gap-1.5 border-t border-slate-100">
            <FileText className="w-3.5 h-3.5 text-blue-500" />
            <span>Simulating against loaded document: <strong>{currentAnalysis.title}</strong></span>
          </div>
        )}
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Result Display */}
      {result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
          {/* Main Direct Answer Box */}
          <div className="p-6 rounded-3xl bg-white border border-violet-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Simulated Outcome & Plain Language Summary
              </span>
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  result.risk_level === 'High'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {result.risk_level} Impact
              </span>
            </div>

            <div className="text-sm font-medium text-slate-900 leading-relaxed">
              {result.direct_answer}
            </div>

            {/* Possible Outcomes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <h5 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Projected Practical Outcomes</span>
                </h5>
                <ul className="space-y-1.5 text-[11px] text-slate-600 leading-relaxed">
                  {result.possible_outcomes.map((po, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-slate-400 font-bold">•</span>
                      <span>{po}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-2">
                <h5 className="font-bold text-xs text-amber-950 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Financial Liabilities & Deductions</span>
                </h5>
                <ul className="space-y-1.5 text-[11px] text-amber-900 leading-relaxed">
                  {result.financial_implications.map((fi, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{fi}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Exceptions & Missing Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-2">
                <h5 className="font-bold text-xs text-blue-950 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-blue-600" />
                  <span>Relevant Exceptions / Waivers</span>
                </h5>
                <ul className="space-y-1 text-[11px] text-blue-900">
                  {result.relevant_exceptions.map((ex, i) => (
                    <li key={i}>• {ex}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <h5 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span>Crucial Information to Verify</span>
                </h5>
                <ul className="space-y-1 text-[11px] text-slate-600">
                  {result.missing_information.map((mi, i) => (
                    <li key={i}>• {mi}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Source Citations */}
            {result.source_citations.length > 0 && (
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-2 text-xs">
                <span className="font-bold text-slate-700 block">Verified Document Citations:</span>
                {result.source_citations.map((sc, i) => (
                  <div key={i} className="text-[11px] text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="font-semibold text-blue-600 block mb-0.5">{sc.title} (Page {sc.page})</span>
                    <span className="italic">"{sc.snippet}"</span>
                  </div>
                ))}
              </div>
            )}

            {/* Mandatory Informational Disclaimer */}
            <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200/90 text-[11px] text-slate-500 leading-relaxed">
              <span className="font-bold text-slate-700 block mb-1">Informational Legal Notice:</span>
              {result.legal_disclaimer}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
