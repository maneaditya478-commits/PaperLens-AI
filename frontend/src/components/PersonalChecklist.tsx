import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Printer,
  FileText,
  Briefcase,
  GraduationCap,
  Landmark,
  Shield,
  Plane,
} from 'lucide-react';
import { api } from '../services/api';
import { ChecklistResponse, ChecklistItem } from '../types';

export const PersonalChecklist: React.FC = () => {
  const [selectedSituation, setSelectedSituation] = useState('joining_company');
  const [checklist, setChecklist] = useState<ChecklistResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<ChecklistItem[]>([]);

  const situations = [
    { id: 'joining_company', label: 'Joining a New Company', icon: Briefcase, desc: 'HR Onboarding & BGV' },
    { id: 'passport', label: 'Applying for Indian Passport', icon: Plane, desc: 'PSK & Police Verification' },
    { id: 'government_certificate', label: 'State Domicile / Income Certificate', icon: Landmark, desc: 'Aaple Sarkar / Tahsildar' },
    { id: 'college_admission', label: 'College & University Admission', icon: GraduationCap, desc: 'CAP Rounds & Verification' },
    { id: 'bank_loan', label: 'Bank Loan Application', icon: Landmark, desc: 'Credit Underwriting & KYC' },
    { id: 'insurance', label: 'Health & Life Insurance', icon: Shield, desc: 'IRDAI Underwriting' },
  ];

  useEffect(() => {
    loadChecklist(selectedSituation);
  }, [selectedSituation]);

  const loadChecklist = async (sit: string) => {
    try {
      setLoading(true);
      const res = await api.generateChecklist(sit);
      setChecklist(res);
      setItems(res.items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleItemStatus = (itemId: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, status: it.status === 'obtained' ? 'pending' : 'obtained' } : it))
    );
  };

  const obtainedCount = items.filter((it) => it.status === 'obtained').length;
  const progressPct = items.length ? Math.round((obtainedCount / items.length) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center sm:text-left space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold border border-teal-200">
          <CheckSquare className="w-3.5 h-3.5 text-teal-600" />
          <span>Requirement Verification Engine</span>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Personal Document Checklist</h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
          Select your life situation to generate an authorized checklist of mandatory and optional supporting documents.
        </p>
      </div>

      {/* Situations Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {situations.map((sit) => {
          const Icon = sit.icon;
          const isSelected = selectedSituation === sit.id;
          return (
            <button
              key={sit.id}
              onClick={() => setSelectedSituation(sit.id)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                isSelected
                  ? 'border-teal-500 bg-teal-50/50 shadow-xs ring-2 ring-teal-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    isSelected ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-teal-600" />}
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900 leading-snug">{sit.label}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">{sit.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Checklist Card */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 text-xs">Generating verified checklist...</div>
      ) : checklist ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          {/* Title and Progress */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                Official Standards
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">{checklist.title}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{checklist.description}</p>
              <p className="text-[11px] text-slate-400 font-medium mt-1">
                Verified Authority: {checklist.verification_authority}
              </p>
            </div>

            {/* Print & Progress */}
            <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
              <button
                onClick={() => window.print()}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>Print Checklist</span>
              </button>

              <div className="w-full sm:w-44 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
                  <span>Prepared:</span>
                  <span className="text-teal-700">{progressPct}% ({obtainedCount}/{items.length})</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-teal-600 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-4">
            {items.map((item) => {
              const isObtained = item.status === 'obtained';
              return (
                <div
                  key={item.id}
                  onClick={() => toggleItemStatus(item.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isObtained
                      ? 'bg-emerald-50/40 border-emerald-200/80 shadow-2xs'
                      : 'bg-white border-slate-200/90 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <input
                      type="checkbox"
                      checked={isObtained}
                      onChange={() => toggleItemStatus(item.id)}
                      className="w-4 h-4 mt-0.5 rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4
                          className={`font-bold text-xs sm:text-sm ${
                            isObtained ? 'line-through text-slate-400' : 'text-slate-900'
                          }`}
                        >
                          {item.name}
                        </h4>
                        <span
                          className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                            item.required
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {item.required ? 'Mandatory' : 'Optional'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{item.why_required}</p>
                      <div className="text-[11px] text-slate-400">
                        <span className="font-semibold text-slate-600">Where to obtain:</span>{' '}
                        {item.where_to_obtain}
                      </div>
                    </div>
                  </div>

                  {item.official_url && (
                    <a
                      href={item.official_url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="self-start sm:self-center px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-700 text-xs font-semibold border border-slate-200/80 flex items-center gap-1 shrink-0 transition-colors"
                    >
                      <span>Official Link</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
};
