import React, { useState } from 'react';
import {
  FileSearch,
  BookOpen,
  CheckSquare,
  Sparkles,
  LayoutDashboard,
  Menu,
  X,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSample: (sampleKey: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenSample }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sampleDropdownOpen, setSampleDropdownOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Home' },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'scanner', label: 'AI Scanner', icon: FileSearch },
    { id: 'explorer', label: 'Document Library', icon: BookOpen },
    { id: 'impact', label: 'Impact Simulator', icon: Sparkles },
    { id: 'checklist', label: 'Checklists', icon: CheckSquare },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => handleNavClick('landing')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center shadow-md shadow-blue-500/20 text-white font-bold">
              <FileSearch className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900">
                  PaperLens<span className="text-blue-600 font-extrabold">.AI</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
                  TechHack
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Understand Every Document. Know Your Rights.
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  {Icon && <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />}
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Demo Samples Dropdown */}
            <div className="relative">
              <button
                onClick={() => setSampleDropdownOpen(!sampleDropdownOpen)}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 flex items-center gap-1.5 transition-colors"
              >
                <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                <span>Try Demo Sample</span>
              </button>

              {sampleDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-1"
                  onMouseLeave={() => setSampleDropdownOpen(false)}
                >
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Synthetic Demo Documents
                  </div>
                  <button
                    onClick={() => {
                      onOpenSample('appointment_letter');
                      setSampleDropdownOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex flex-col"
                  >
                    <span className="font-semibold">Tech Appointment Letter</span>
                    <span className="text-[11px] text-slate-500">Notice period, CTC, non-compete</span>
                  </button>
                  <button
                    onClick={() => {
                      onOpenSample('employment_bond');
                      setSampleDropdownOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex flex-col border-t border-slate-100"
                  >
                    <span className="font-semibold">Employment Bond (2 Years)</span>
                    <span className="text-[11px] text-slate-500">Liquidated damages, training fee</span>
                  </button>
                  <button
                    onClick={() => {
                      onOpenSample('nda');
                      setSampleDropdownOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex flex-col border-t border-slate-100"
                  >
                    <span className="font-semibold">Non-Disclosure Agreement</span>
                    <span className="text-[11px] text-slate-500">IP assignment & trade secrets</span>
                  </button>
                  <button
                    onClick={() => {
                      onOpenSample('domicile_certificate');
                      setSampleDropdownOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex flex-col border-t border-slate-100"
                  >
                    <span className="font-semibold">Maharashtra Domicile Certificate</span>
                    <span className="text-[11px] text-slate-500">Aaple Sarkar 15-year verification</span>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => handleNavClick('scanner')}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-600/30 transition-all flex items-center gap-1.5"
            >
              <FileSearch className="w-3.5 h-3.5" />
              <span>Scan Document</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
                activeTab === item.id ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenSample('appointment_letter');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-center"
            >
              ⚡ Load Sample Appointment Letter
            </button>
            <button
              onClick={() => handleNavClick('scanner')}
              className="w-full py-2.5 px-3 text-xs font-semibold rounded-lg bg-blue-600 text-white text-center shadow-xs"
            >
              Scan New Document
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
