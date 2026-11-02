import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Upload,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  BookOpen,
  CheckSquare,
  FileSearch,
  Zap,
} from 'lucide-react';
import { DocumentAnalysis } from '../types';
import { api } from '../services/api';

interface DashboardProps {
  onSelectDocument: (analysis: DocumentAnalysis) => void;
  onNavigate: (tab: string) => void;
  onLoadSample: (sampleKey: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onSelectDocument,
  onNavigate,
  onLoadSample,
}) => {
  const [documents, setDocuments] = useState<DocumentAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadRecentDocuments();
  }, []);

  const loadRecentDocuments = async () => {
    try {
      setLoading(true);
      const data = await api.listDocuments();
      setDocuments(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.sub_type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || doc.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner / Welcome */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            <span>Document Literacy Command Center</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome to PaperLens AI
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Upload any contract, employment agreement, or government certificate to analyze obligations,
            extract notice clauses, and check your rights.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigate('scanner')}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
          <button
            onClick={() => onLoadSample('appointment_letter')}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>Load Demo Document</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Documents Analyzed</span>
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{documents.length}</div>
          <p className="text-[11px] text-slate-500 mt-1">Total processed</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Knowledge Library</span>
            <BookOpen className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-indigo-600 mt-2">20+ Entries</div>
          <p className="text-[11px] text-slate-500 mt-1">Official Guides Seeded</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Critical Conditions</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600 mt-2">
            {documents.filter((d) => d.risk_level === 'High').length}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Bonds & Liquidated Damages</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>RAG Grounding</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2">100%</div>
          <p className="text-[11px] text-slate-500 mt-1">Anti-hallucination rate</p>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button
          onClick={() => onNavigate('scanner')}
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all text-left flex items-start gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <FileSearch className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-slate-900 group-hover:text-blue-600">Scan Contract / PDF</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Upload and extract clauses</p>
          </div>
        </button>

        <button
          onClick={() => onNavigate('impact')}
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-violet-400 hover:shadow-md transition-all text-left flex items-start gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center shrink-0 group-hover:bg-violet-600 group-hover:text-white transition-colors">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-slate-900 group-hover:text-violet-600">Impact Simulator</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Simulate early exit or breach</p>
          </div>
        </button>

        <button
          onClick={() => onNavigate('explorer')}
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all text-left flex items-start gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-slate-900 group-hover:text-indigo-600">Document Library</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Explore 20+ official formats</p>
          </div>
        </button>

        <button
          onClick={() => onNavigate('checklist')}
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-teal-400 hover:shadow-md transition-all text-left flex items-start gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 group-hover:bg-teal-600 group-hover:text-white transition-colors">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-slate-900 group-hover:text-teal-600">Personal Checklists</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Requirements by situation</p>
          </div>
        </button>
      </div>

      {/* Recent Documents Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Recently Analyzed Documents</h3>
            <p className="text-xs text-slate-500">Click any document to open its split-screen intelligence view</p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="py-1.5 px-3 text-xs rounded-lg border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Domains</option>
              <option value="employment">Employment</option>
              <option value="government">Government</option>
              <option value="education">Education</option>
              <option value="financial">Financial</option>
              <option value="legal">Legal</option>
            </select>
          </div>
        </div>

        {/* Documents List / Cards */}
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-xs">Loading analyzed documents...</div>
        ) : filteredDocs.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/80 space-y-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-800">No documents analyzed yet</h4>
              <p className="text-xs text-slate-500 mt-1">Upload a PDF or test with a pre-configured synthetic sample</p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => onLoadSample('appointment_letter')}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white shadow-xs cursor-pointer"
              >
                Load Tech Appointment Sample
              </button>
              <button
                onClick={() => onNavigate('scanner')}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
              >
                Scan New File
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                onClick={() => onSelectDocument(doc)}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {doc.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        doc.risk_level === 'High'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : doc.risk_level === 'Moderate'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {doc.risk_level} Risk
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{doc.title}</h4>
                  <p className="text-xs text-slate-500 font-medium">{doc.sub_type}</p>
                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">{doc.summary}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1 text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{doc.clauses?.length || 0} Clauses</span>
                  </span>
                  <span className="text-blue-600 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Inspect</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
