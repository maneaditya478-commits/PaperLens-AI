import React from 'react';
import { FileSearch, ShieldCheck, ExternalLink, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5 text-white">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
                <FileSearch className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">PaperLens AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Open-source multimodal document intelligence & legal literacy platform. Helping students, job-seekers,
              and citizens understand complex documents.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 text-[11px] font-medium border border-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Grounded Anti-Hallucination AI</span>
            </div>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Core Intelligence</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><span className="hover:text-white transition-colors cursor-pointer">Split-Screen PDF Scanner</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Terms & Conditions Analyzer</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Document Impact Simulator</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Multilingual Grounded Q&A</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Personal Document Checklists</span></li>
            </ul>
          </div>

          {/* Official Portals */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Official Portals</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <a href="https://uidai.gov.in" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1 transition-colors">
                  <span>UIDAI Aadhaar Portal</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://www.incometax.gov.in" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1 transition-colors">
                  <span>Income Tax Department (PAN)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://aaplesarkar.mahaonline.gov.in" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1 transition-colors">
                  <span>Aaple Sarkar (Maharashtra)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://www.passportindia.gov.in" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1 transition-colors">
                  <span>Passport Seva Kendra</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://www.digilocker.gov.in" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1 transition-colors">
                  <span>DigiLocker National Depository</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Disclaimer */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Informational Disclaimer</h4>
            <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60 text-[11px] text-slate-400 leading-relaxed">
              PaperLens AI provides automated text extraction, linguistic summaries, and clause explanations for educational and informational purposes.
              It does not constitute qualified legal, tax, or financial counsel. For binding legal disputes, consult an advocate registered with the Bar Council.
            </div>
          </div>
        </div>

        {/* Bottom credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 PaperLens AI. Open-source under MIT License. Built for NariYukti TechHack.</p>
          <div className="flex items-center gap-1">
            <span>Designed for clarity, rights awareness & empowerment</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
