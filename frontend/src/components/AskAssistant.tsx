import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Languages,
  BookOpen,
  CheckCircle2,
  FileText,
  User,
  Bot,
  ShieldCheck,
} from 'lucide-react';
import { api } from '../services/api';
import { DocumentAnalysis, ChatMessage } from '../types';

interface AskAssistantProps {
  currentAnalysis?: DocumentAnalysis | null;
}

export const AskAssistant: React.FC<AskAssistantProps> = ({ currentAnalysis }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [language, setLanguage] = useState<'English' | 'Hindi' | 'Marathi'>('English');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial greeting
    const greetings = {
      English: currentAnalysis
        ? `Hello! I have analyzed "${currentAnalysis.title}". You can ask me any questions about notice periods, compensation, bonds, or restrictions.`
        : `Hello! I am PaperLens AI. Ask me anything about employment contracts, bonds, or Indian government documents.`,
      Hindi: `नमस्ते! मैं PaperLens AI हूँ। आपके दस्तावेज़ के नियमों व शर्तों को समझने में मैं आपकी क्या मदद कर सकता हूँ?`,
      Marathi: `नमस्कार! मी PaperLens AI आहे. आपल्या दस्तऐवजातील अटी व शर्ती समजून घेण्यासाठी मी कशी मदत करू शकेन?`,
    };

    setMessages([
      {
        id: 'init-1',
        role: 'assistant',
        content: greetings[language],
        language: language,
      },
    ]);
  }, [currentAnalysis, language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      language: language,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      if (currentAnalysis) {
        const res = await api.askAssistant(currentAnalysis.id, text, language, sessionId);
        setSessionId(res.session_id);
        const assistantMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: res.answer,
          language: language,
          citations: res.citations,
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        // Fallback knowledge answer
        const res = await api.analyzeImpact(text);
        const assistantMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: res.direct_answer,
          language: language,
          citations: res.source_citations.map((c) => ({
            document_title: c.title,
            page: c.page,
            snippet: c.snippet,
            relevance_score: 0.95,
          })),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Sorry, I encountered an issue retrieving verifiable information for that query.',
          language: language,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sampleQuestions = [
    'What is the notice period required to resign?',
    'What is an employment bond under Indian law?',
    'Are non-compete clauses enforceable in India?',
    'Why is HR asking for my relieving letter?',
    'Can I resign during my probation period?',
  ];

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[650px] bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>Ask PaperLens AI</span>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Grounded RAG
              </span>
            </h3>
            <p className="text-[11px] text-slate-500">
              {currentAnalysis ? `Document: ${currentAnalysis.title}` : 'Verified Knowledge Assistant'}
            </p>
          </div>
        </div>

        {/* Language Selector */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 text-xs font-semibold">
          <Languages className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
          {(['English', 'Hindi', 'Marathi'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                language === lang ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lang === 'English' ? 'EN' : lang === 'Hindi' ? 'हिंदी' : 'मराठी'}
            </button>
          ))}
        </div>
      </div>

      {/* Messages list */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  isUser ? 'bg-slate-900 text-white' : 'bg-blue-100 text-blue-700'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-50 border border-slate-200 text-slate-900'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {/* Citations block */}
                {!isUser && msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-200 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Grounded Document Citations:
                    </span>
                    {msg.citations.map((c, i) => (
                      <div
                        key={i}
                        className="text-[11px] bg-white p-2 rounded-lg border border-slate-200 text-slate-700 font-mono"
                      >
                        <span className="font-semibold text-blue-600 block mb-0.5">
                          {c.document_title} (Page {c.page})
                        </span>
                        <span>"{c.snippet}"</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
              <span>Searching verified document evidence...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompts */}
      <div className="px-6 py-2 bg-slate-50/50 border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-[11px]">
        <span className="text-slate-400 font-semibold shrink-0">Try asking:</span>
        {sampleQuestions.map((sq, i) => (
          <button
            key={i}
            onClick={() => handleSend(sq)}
            className="px-2.5 py-1 rounded-full bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-700 border border-slate-200 shrink-0 transition-colors"
          >
            {sq}
          </button>
        ))}
      </div>

      {/* Input row */}
      <div className="p-4 bg-white border-t border-slate-200 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Ask about this document in ${language}...`}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/60"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !inputText.trim()}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
