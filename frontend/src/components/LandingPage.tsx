import React from 'react';
import {
  FileSearch,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Languages,
  Layers,
  FileCheck2,
  Lock,
  Zap,
} from 'lucide-react';

interface LandingPageProps {
  onStartScanning: () => void;
  onExploreLibrary: () => void;
  onLoadSample: (sampleKey: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartScanning,
  onExploreLibrary,
  onLoadSample,
}) => {
  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.blue.100),white)] opacity-60" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold shadow-xs animate-in fade-in">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>AI-Powered Document Intelligence & Literacy Platform</span>
          </div>

          {/* Heading */}
          <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              Understand Every Document.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">
                Know Your Rights.
              </span>{' '}
              Make Informed Decisions.
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Don't sign what you don't understand. PaperLens AI decodes employment bonds, notice periods,
              confidentiality clauses, and government documents into plain language with grounded legal context.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={onStartScanning}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <FileSearch className="w-5 h-5" />
              <span>Scan Your Document</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onExploreLibrary}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-base border border-slate-300 shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-5 h-5 text-slate-500" />
              <span>Explore Knowledge Library</span>
            </button>
          </div>

          {/* Demo Pills */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2.5 text-xs text-slate-500">
            <span className="font-semibold text-slate-700 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              Instant Demos:
            </span>
            <button
              onClick={() => onLoadSample('appointment_letter')}
              className="px-3 py-1 rounded-full bg-white hover:bg-blue-50 hover:text-blue-600 border border-slate-200 transition-colors shadow-2xs font-medium"
            >
              📄 Tech Appointment Letter (CTC & Notice)
            </button>
            <button
              onClick={() => onLoadSample('employment_bond')}
              className="px-3 py-1 rounded-full bg-white hover:bg-blue-50 hover:text-blue-600 border border-slate-200 transition-colors shadow-2xs font-medium"
            >
              ⚠️ Employment Bond (2-Yr Penalty)
            </button>
            <button
              onClick={() => onLoadSample('domicile_certificate')}
              className="px-3 py-1 rounded-full bg-white hover:bg-blue-50 hover:text-blue-600 border border-slate-200 transition-colors shadow-2xs font-medium"
            >
              🏛️ Domicile Certificate (Aaple Sarkar)
            </button>
          </div>

          {/* Key Metrics Bar */}
          <div className="pt-10 max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-center">
              <div className="text-2xl font-black text-slate-900">20+ Entries</div>
              <div className="text-xs font-medium text-slate-500 mt-1">Verified Document Guides</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-center">
              <div className="text-2xl font-black text-blue-600">100% Grounded</div>
              <div className="text-xs font-medium text-slate-500 mt-1">Evidence-Based RAG Citations</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-center">
              <div className="text-2xl font-black text-indigo-600">3 Languages</div>
              <div className="text-xs font-medium text-slate-500 mt-1">English, हिंदी, मराठी</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-center">
              <div className="text-2xl font-black text-emerald-600">Private & Local</div>
              <div className="text-xs font-medium text-slate-500 mt-1">Zero Public Leakage</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-14">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600">Streamlined Workflow</h2>
          <h3 className="text-3xl font-extrabold text-slate-900">How PaperLens AI Works</h3>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            From raw scanned PDF or photo to verified clause obligations in 4 transparent stages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">
              1
            </div>
            <h4 className="font-bold text-slate-900 text-base">Multimodal Ingestion</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Upload PDF contracts, scans, or PNG/JPG camera snapshots. Vector extraction and layout parsing capture every section.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg">
              2
            </div>
            <h4 className="font-bold text-slate-900 text-base">Clause Extraction</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Detects notice periods, training bonds, non-competes, IP assignments, and termination conditions with source page tracking.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold text-lg">
              3
            </div>
            <h4 className="font-bold text-slate-900 text-base">Plain-Language Translation</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Replaces legal jargon with plain explanations: what it requires, who it affects, exceptions, and key questions to ask HR.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg">
              4
            </div>
            <h4 className="font-bold text-slate-900 text-base">Impact Simulation</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Ask hypothetical questions like "What if I resign early?" and receive evidence-grounded outcomes and legal context.
            </p>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-14">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600">Engineered For Clarity</h2>
          <h3 className="text-3xl font-extrabold text-slate-900">Comprehensive Document Literacy Tools</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="p-7 rounded-2xl bg-gradient-to-b from-white to-slate-50/50 border border-slate-200/90 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100/80 text-blue-700 flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Split-Screen Document Intelligence</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              View your original uploaded document side-by-side with AI extractions. Click any clause to instantly jump to its exact source line and page.
            </p>
            <ul className="space-y-2 pt-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Synchronized text highlighting</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Key field extraction (CTC, dates, notice)</span>
              </li>
            </ul>
          </div>

          {/* Card 2 */}
          <div className="p-7 rounded-2xl bg-gradient-to-b from-white to-slate-50/50 border border-slate-200/90 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100/80 text-amber-700 flex items-center justify-center">
              <Scale className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Terms & Conditions Analyzer</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Deep inspection of notice requirements, service bonds, non-compete clauses, and liquidated damages. Grounded on Indian contract law.
            </p>
            <ul className="space-y-2 pt-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Obligations vs restrictions breakdown</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Statutory non-compete reality check</span>
              </li>
            </ul>
          </div>

          {/* Card 3 */}
          <div className="p-7 rounded-2xl bg-gradient-to-b from-white to-slate-50/50 border border-slate-200/90 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-violet-100/80 text-violet-700 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Document Impact Simulator</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Simulate decision consequences before taking action. Discover what happens if you leave during probation or break a training bond.
            </p>
            <ul className="space-y-2 pt-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Financial implication calculations</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Clear informational legal disclaimers</span>
              </li>
            </ul>
          </div>

          {/* Card 4 */}
          <div className="p-7 rounded-2xl bg-gradient-to-b from-white to-slate-50/50 border border-slate-200/90 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-100/80 text-indigo-700 flex items-center justify-center">
              <Languages className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Multilingual Grounded Assistant</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Ask questions directly to your document in English, Hindi (हिंदी), or Marathi (मराठी). Responses include direct page citations.
            </p>
            <ul className="space-y-2 pt-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Strict anti-hallucination guardrails</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Direct page and snippet references</span>
              </li>
            </ul>
          </div>

          {/* Card 5 */}
          <div className="p-7 rounded-2xl bg-gradient-to-b from-white to-slate-50/50 border border-slate-200/90 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-teal-100/80 text-teal-700 flex items-center justify-center">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Personal Document Checklists</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Tailored requirement checklists for job onboarding, passport applications, college admissions, and bank loans.
            </p>
            <ul className="space-y-2 pt-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Mandatory vs optional breakdown</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Verified official portal links</span>
              </li>
            </ul>
          </div>

          {/* Card 6 */}
          <div className="p-7 rounded-2xl bg-gradient-to-b from-white to-slate-50/50 border border-slate-200/90 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Privacy & Responsible AI</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your sensitive documents stay private. No training on user uploads, complete document deletion support, and no third-party data broker sharing.
            </p>
            <ul className="space-y-2 pt-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Local private processing</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>1-Click complete file deletion</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Supported Document Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600">Comprehensive Library</h2>
          <h3 className="text-3xl font-extrabold text-slate-900">Supported Document Domains</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {[
            { name: 'Employment', count: '10+ Types', desc: 'Offers, Bonds, NDAs, Payslips', color: 'bg-blue-50 text-blue-700 border-blue-200' },
            { name: 'Government', count: '8+ Types', desc: 'Aadhaar, PAN, Domicile, DL', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
            { name: 'Education', count: '4+ Types', desc: 'Degrees, Transcripts, Migration', color: 'bg-amber-50 text-amber-700 border-amber-200' },
            { name: 'Financial', count: '3+ Types', desc: 'Bank Loans, Sanctions, Statements', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
            { name: 'Legal', count: '3+ Types', desc: 'Rent Agreements, Affidavits', color: 'bg-rose-50 text-rose-700 border-rose-200' },
            { name: 'Insurance', count: '3+ Types', desc: 'Health, Life & Motor Policies', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
          ].map((cat, i) => (
            <div key={i} className={`p-4 rounded-xl border ${cat.color} flex flex-col justify-between text-left`}>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/70">
                  {cat.count}
                </span>
                <h5 className="font-bold text-sm text-slate-900 mt-2">{cat.name}</h5>
              </div>
              <p className="text-[11px] text-slate-600 mt-2">{cat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white text-center space-y-6 shadow-2xl">
          <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Take Control of Your Contractual Decisions Today.
          </h3>
          <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed">
            Free and open-source. Scan any contract or explore our verified knowledge library now.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={onStartScanning}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm transition-all shadow-md shadow-blue-500/30 cursor-pointer"
            >
              Analyze Your Document Now
            </button>
            <button
              onClick={onExploreLibrary}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all cursor-pointer"
            >
              Browse 20+ Document Guides
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
