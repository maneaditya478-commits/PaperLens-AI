import React from 'react';
import {
  X,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Building,
  UserCheck,
  HelpCircle,
  Clock,
} from 'lucide-react';
import { KnowledgeBaseEntry } from '../types';

interface DocumentDetailModalProps {
  entry: KnowledgeBaseEntry | null;
  onClose: () => void;
}

export const DocumentDetailModal: React.FC<DocumentDetailModalProps> = ({ entry, onClose }) => {
  if (!entry) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-slate-50 border-b border-slate-200 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                {entry.category}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                Verified Official Guide
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">{entry.title}</h2>
            <p className="text-xs text-slate-500">Verified as of {entry.verification_date}</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 text-xs leading-relaxed">
          {/* Overview & Purpose */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-2">
              <span className="font-bold text-blue-950 text-xs block">Document Overview</span>
              <p className="text-slate-700">{entry.description}</p>
            </div>

            <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-2">
              <span className="font-bold text-indigo-950 text-xs block">Purpose & Why It Is Required</span>
              <p className="text-slate-700">{entry.purpose}</p>
            </div>
          </div>

          {/* Issuing Authority & Usage */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Building className="w-3.5 h-3.5" />
                Issuing Authority
              </span>
              <span className="font-bold text-slate-900 block text-xs">{entry.issuing_authority}</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5" />
                Who Needs It
              </span>
              <span className="font-bold text-slate-900 block text-xs">{entry.who_needs_it}</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Where It Is Used
              </span>
              <span className="font-bold text-slate-900 block text-xs">{entry.where_used}</span>
            </div>
          </div>

          {/* Required Information & Eligibility */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>Information Contained in This Document</span>
              </h4>
              <ul className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                {entry.required_information.map((inf, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-700">
                    <span className="text-blue-500 font-bold">•</span>
                    <span>{inf}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Eligibility Requirements</span>
              </h4>
              <ul className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                {entry.eligibility.map((el, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-700">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{el}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Step-by-Step Procedure */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-slate-900">Official Application & Issuance Procedure</h4>
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2.5">
              {entry.application_procedure.map((proc, i) => (
                <div key={i} className="text-slate-700 flex items-start gap-2.5">
                  <span className="font-bold text-blue-600 shrink-0">{i + 1}.</span>
                  <span>{proc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Important Terms & Common Mistakes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-3">
              <h5 className="font-bold text-amber-950 flex items-center gap-1.5 text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Important Terms & Legal Conditions</span>
              </h5>
              <ul className="space-y-2 text-amber-900">
                {entry.important_terms.map((term, i) => (
                  <li key={i}>• {term}</li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-200/80 space-y-3">
              <h5 className="font-bold text-rose-950 flex items-center gap-1.5 text-xs">
                <HelpCircle className="w-4 h-4 text-rose-600" />
                <span>Common Mistakes & Pitfalls to Avoid</span>
              </h5>
              <ul className="space-y-2 text-rose-900">
                {entry.common_mistakes.map((mis, i) => (
                  <li key={i}>• {mis}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Verified Official Portal Action */}
          <div className="p-5 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="font-bold text-sm block">Official Government / Statutory Source Portal</span>
              <p className="text-slate-400 text-[11px]">
                Always verify procedures on the official accredited website: {entry.official_url}
              </p>
            </div>
            <a
              href={entry.official_url}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shrink-0 flex items-center gap-1.5"
            >
              <span>Visit Official Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
