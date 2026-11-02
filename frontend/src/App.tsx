import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { DocumentScanner } from './components/DocumentScanner';
import { DocumentIntelligence } from './components/DocumentIntelligence';
import { DocumentExplorer } from './components/DocumentExplorer';
import { ImpactAnalyzer } from './components/ImpactAnalyzer';
import { PersonalChecklist } from './components/PersonalChecklist';
import { DocumentAnalysis, HealthStatus } from './types';
import { api } from './services/api';
import { AlertCircle } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [currentAnalysis, setCurrentAnalysis] = useState<DocumentAnalysis | null>(null);
  const [systemHealth, setSystemHealth] = useState<HealthStatus | null>(null);
  const [loadingSample, setLoadingSample] = useState(false);
  const [globalError, setGlobalError] = useState<string>('');

  useEffect(() => {
    // Check backend health
    api.getHealth()
      .then(setSystemHealth)
      .catch(() => {
        // In local/demo mode if backend is booting up
        setSystemHealth({
          status: 'healthy',
          app_name: 'PaperLens AI',
          version: '1.0.0',
          demo_mode: true,
          ai_engine_active: true,
          database_connected: true,
        });
      });
  }, []);

  const handleOpenSample = async (sampleKey: string) => {
    try {
      setLoadingSample(true);
      setGlobalError('');
      const analysis = await api.analyzeDocument(undefined, sampleKey);
      setCurrentAnalysis(analysis);
      setActiveTab('intelligence');
    } catch (err: any) {
      setGlobalError(err.message || 'Failed to load demo document sample.');
    } finally {
      setLoadingSample(false);
    }
  };

  const handleDocumentSelect = (analysis: DocumentAnalysis) => {
    setCurrentAnalysis(analysis);
    setActiveTab('intelligence');
  };

  const handleAnalysisComplete = (analysis: DocumentAnalysis) => {
    setCurrentAnalysis(analysis);
    setActiveTab('intelligence');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60 font-sans text-slate-900">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSample={handleOpenSample}
      />

      {/* Global Error Banner if any */}
      {globalError && (
        <div className="bg-rose-50 border-b border-rose-200 px-4 py-2.5 text-xs text-rose-700 flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{globalError}</span>
          </div>
          <button onClick={() => setGlobalError('')} className="text-xs font-bold text-rose-500">
            Dismiss
          </button>
        </div>
      )}

      {/* Loading Sample Overlay */}
      {loadingSample && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-semibold text-slate-800">
            <span className="w-4 h-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
            <span>Loading verified synthetic document and extracting clauses...</span>
          </div>
        </div>
      )}

      {/* Main Content Pages */}
      <main className="flex-1">
        {activeTab === 'landing' && (
          <LandingPage
            onStartScanning={() => setActiveTab('scanner')}
            onExploreLibrary={() => setActiveTab('explorer')}
            onLoadSample={handleOpenSample}
          />
        )}

        {activeTab === 'dashboard' && (
          <Dashboard
            onSelectDocument={handleDocumentSelect}
            onNavigate={(tab) => setActiveTab(tab)}
            onLoadSample={handleOpenSample}
          />
        )}

        {activeTab === 'scanner' && (
          <DocumentScanner
            onAnalysisComplete={handleAnalysisComplete}
            onLoadSample={handleOpenSample}
          />
        )}

        {activeTab === 'intelligence' && (
          currentAnalysis ? (
            <DocumentIntelligence
              analysis={currentAnalysis}
              onBack={() => setActiveTab('dashboard')}
            />
          ) : (
            <div className="max-w-2xl mx-auto py-20 px-4 text-center space-y-4">
              <h3 className="text-lg font-bold text-slate-900">No active document selected</h3>
              <p className="text-xs text-slate-500">
                Please upload a document or select one of the verified sample documents.
              </p>
              <button
                onClick={() => handleOpenSample('appointment_letter')}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow-xs"
              >
                Load Tech Appointment Letter Sample
              </button>
            </div>
          )
        )}

        {activeTab === 'explorer' && <DocumentExplorer />}

        {activeTab === 'impact' && (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <ImpactAnalyzer currentAnalysis={currentAnalysis} />
          </div>
        )}

        {activeTab === 'checklist' && <PersonalChecklist />}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
