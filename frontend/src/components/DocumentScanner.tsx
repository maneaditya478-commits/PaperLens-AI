import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  FileSearch,
  Zap,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { api } from '../services/api';
import { DocumentAnalysis } from '../types';

interface DocumentScannerProps {
  onAnalysisComplete: (analysis: DocumentAnalysis) => void;
  onLoadSample: (sampleKey: string) => void;
}

export const DocumentScanner: React.FC<DocumentScannerProps> = ({
  onAnalysisComplete,
  onLoadSample,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [currentStage, setCurrentStage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processingStages = [
    'Validating file integrity and format...',
    'Performing layout extraction & OCR...',
    'Parsing document structure and key fields...',
    'Classifying document domain & sub-type...',
    'Extracting contractual terms & obligations...',
    'Finalizing plain-language explanations & citations...',
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setErrorMsg('');
    const validExts = ['.pdf', '.png', '.jpg', '.jpeg', '.docx'];
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!validExts.includes(ext)) {
      setErrorMsg(`Unsupported file type. Please upload PDF, PNG, JPG, or DOCX.`);
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setErrorMsg('File size exceeds the 25MB limit.');
      return;
    }
    setSelectedFile(file);
  };

  const startAnalysis = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      setErrorMsg('');

      // Step 1: Upload
      setCurrentStage(processingStages[0]);
      const uploadRes = await api.uploadDocument(selectedFile);

      // Step 2-5: Simulate stage updates for clear UX
      for (let i = 1; i < processingStages.length - 1; i++) {
        setCurrentStage(processingStages[i]);
        await new Promise((r) => setTimeout(r, 350));
      }

      // Step 6: Analyze
      setCurrentStage(processingStages[processingStages.length - 1]);
      const analysisRes = await api.analyzeDocument(uploadRes.id);

      onAnalysisComplete(analysisRes);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to complete document analysis.');
    } finally {
      setIsUploading(false);
      setCurrentStage('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
          <FileSearch className="w-3.5 h-3.5 text-blue-600" />
          <span>Multimodal Document Ingestion Engine</span>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900">Upload & Analyze Any Document</h2>
        <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto">
          Scan your appointment letter, employment bond, NDA, or government certificate for instant plain-language clause breakdown.
        </p>
      </div>

      {/* Main Upload Dropzone */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => !selectedFile && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer ${
            dragActive
              ? 'border-blue-500 bg-blue-50/60'
              : selectedFile
              ? 'border-emerald-400 bg-emerald-50/30 cursor-default'
              : 'border-slate-300 hover:border-blue-400 bg-slate-50/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.docx"
            onChange={handleFileChange}
            className="hidden"
          />

          {!selectedFile ? (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto shadow-xs">
                <Upload className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-base text-slate-900">
                  Drop your document here, or <span className="text-blue-600 underline">browse</span>
                </h4>
                <p className="text-xs text-slate-500">
                  Supports PDF contracts, JPG/PNG scans, and DOCX files (up to 25MB)
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Files are processed securely and never shared publicly</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-emerald-200 shadow-xs text-left">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{selectedFile.name}</h4>
                  <p className="text-xs text-slate-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Ready for analysis
                  </p>
                </div>
              </div>
              {!isUploading && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Progress or Action Button */}
        {isUploading ? (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
                {currentStage}
              </span>
              <span className="text-blue-600">Processing AI Pipeline</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 h-2 rounded-full w-4/5 animate-pulse" />
            </div>
          </div>
        ) : selectedFile ? (
          <button
            onClick={startAnalysis}
            className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Extract Clauses & Analyze Rights</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : null}
      </div>

      {/* Pre-configured Demo Samples */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
          <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
            Or test instantly with verified sample documents
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            onClick={() => onLoadSample('appointment_letter')}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-3"
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                Employment
              </span>
              <h4 className="font-bold text-sm text-slate-900 mt-2 group-hover:text-blue-600">
                Tech Appointment Letter
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Contains 90-day notice period, 6-month probation, INR 16.5 LPA compensation, and post-employment non-compete.
              </p>
            </div>
            <div className="text-xs font-semibold text-blue-600 flex items-center gap-1">
              <span>Load this sample</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div
            onClick={() => onLoadSample('employment_bond')}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-3"
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-800">
                Service Bond
              </span>
              <h4 className="font-bold text-sm text-slate-900 mt-2 group-hover:text-amber-700">
                2-Year Employment Service Bond
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Mandates 24-month tenure or INR 2,50,000 liquidated damages. Evaluates legality under Section 27 Contract Act.
              </p>
            </div>
            <div className="text-xs font-semibold text-amber-700 flex items-center gap-1">
              <span>Load this sample</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div
            onClick={() => onLoadSample('nda')}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-violet-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-3"
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-50 text-violet-700">
                Confidentiality
              </span>
              <h4 className="font-bold text-sm text-slate-900 mt-2 group-hover:text-violet-600">
                Mutual Non-Disclosure Agreement
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                3-year survival term, trade secret protections, exclusion clauses, and intellectual property ownership boundaries.
              </p>
            </div>
            <div className="text-xs font-semibold text-violet-600 flex items-center gap-1">
              <span>Load this sample</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div
            onClick={() => onLoadSample('domicile_certificate')}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-3"
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800">
                Government
              </span>
              <h4 className="font-bold text-sm text-slate-900 mt-2 group-hover:text-emerald-700">
                Maharashtra Domicile Certificate
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Official Aaple Sarkar 15-year residency certification. Explains Tahsildar authority, validity, and usage in college quotas.
              </p>
            </div>
            <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
              <span>Load this sample</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
