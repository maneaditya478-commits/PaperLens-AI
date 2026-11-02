import React, { useState, useEffect } from 'react';
import {
  Search,
  BookOpen,
  Filter,
  ExternalLink,
  ShieldCheck,
  Building,
  ArrowRight,
  FileText,
} from 'lucide-react';
import { KnowledgeBaseEntry } from '../types';
import { api } from '../services/api';
import { DocumentDetailModal } from './DocumentDetailModal';

export const DocumentExplorer: React.FC = () => {
  const [entries, setEntries] = useState<KnowledgeBaseEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalEntry, setActiveModalEntry] = useState<KnowledgeBaseEntry | null>(null);

  useEffect(() => {
    loadEntries();
  }, [selectedCategory, searchQuery]);

  const loadEntries = async () => {
    try {
      setLoading(true);
      const data = await api.getKnowledgeBase(selectedCategory, searchQuery);
      setEntries(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', label: 'All Documents' },
    { id: 'employment', label: 'Employment' },
    { id: 'government', label: 'Government & ID' },
    { id: 'education', label: 'Education' },
    { id: 'financial', label: 'Financial' },
    { id: 'legal', label: 'Legal' },
    { id: 'insurance', label: 'Insurance' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
          <BookOpen className="w-3.5 h-3.5 text-blue-600" />
          <span>Verified Document Knowledge Base</span>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Explore Document Knowledge Library
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm max-w-2xl">
          Comprehensive, verified guides for 20+ crucial documents across employment, government services,
          and educational transitions.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents by name, purpose, or authority..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Knowledge Cards */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 text-xs font-medium">
          Loading verified knowledge base entries...
        </div>
      ) : entries.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
          <FileText className="w-8 h-8 text-slate-300 mx-auto" />
          <h4 className="font-bold text-sm text-slate-800">No documents found</h4>
          <p className="text-xs text-slate-500">Try modifying your search or choosing a different domain.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {entries.map((entry) => (
            <div
              key={entry.id}
              onClick={() => setActiveModalEntry(entry)}
              className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {entry.category}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Verified
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                    {entry.title}
                  </h3>
                  <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                    <Building className="w-3 h-3 text-slate-400" />
                    <span className="line-clamp-1">{entry.issuing_authority}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {entry.description}
                </p>

                <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100 text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700 block mb-0.5">Why it is required:</span>
                  <span className="line-clamp-2">{entry.why_required}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <a
                  href={entry.official_url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-slate-400 hover:text-slate-700 flex items-center gap-1 text-[11px]"
                >
                  <span>Official Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button className="font-bold text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer">
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details Modal */}
      {activeModalEntry && (
        <DocumentDetailModal
          entry={activeModalEntry}
          onClose={() => setActiveModalEntry(null)}
        />
      )}
    </div>
  );
};
