import React, { useState } from 'react';
import { Sparkles, X, Search, ExternalLink, Globe2, ShieldCheck, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { runOfficialWebSearchGrounding, AssistantResponse } from '../services/geminiService';

export const WebSearchGroundingModal: React.FC = () => {
  const { isSearchGroundingOpen, setIsSearchGroundingOpen } = useApp();
  const [searchTarget, setSearchTarget] = useState('Amoxicillin Oral Suspension');
  const [jurisdiction, setJurisdiction] = useState('US');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AssistantResponse | null>(null);

  if (!isSearchGroundingOpen) return null;

  const handleRunSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTarget.trim() || loading) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await runOfficialWebSearchGrounding(searchTarget.trim(), jurisdiction);
      setResult(res);
    } catch (err) {
      console.error('Grounding search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        onClick={() => setIsSearchGroundingOpen(false)}
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 z-10 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
              <Globe2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Official Web Search Grounding Engine
              </h3>
              <p className="text-xs text-slate-500">
                Powered by <strong className="text-slate-700">gemini-3.5-flash with Google Search</strong>
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSearchGroundingOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Query Form */}
        <form onSubmit={handleRunSearch} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Medicine or Molecule
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTarget}
                  onChange={(e) => setSearchTarget(e.target.value)}
                  placeholder="e.g. Amoxicillin, Semaglutide, Cefepime..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Jurisdiction
              </label>
              <select
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900"
              >
                <option value="US">United States (FDA)</option>
                <option value="EU">European Union (EMA)</option>
                <option value="CA">Canada (Health Canada)</option>
                <option value="UK">United Kingdom (MHRA)</option>
                <option value="AU">Australia (TGA)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-black transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
                <span>Executing Google Search Grounding with gemini-3.5-flash...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-sky-400" />
                <span>Discover Authoritative Regulatory Notices</span>
              </>
            )}
          </button>
        </form>

        {/* Results Container */}
        {result && (
          <div className="mt-6 bg-slate-50 rounded-2xl p-5 border border-slate-200 max-h-80 overflow-y-auto space-y-4">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200">
              <span className="font-bold text-slate-800">Grounding Synthesis</span>
              <span className="text-[10px] text-slate-400 font-mono">
                {result.modelUsed} ({result.latencyMs}ms)
              </span>
            </div>

            <div className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">
              {result.text}
            </div>

            {/* Citations & Sources */}
            {result.groundingSources && result.groundingSources.length > 0 && (
              <div className="pt-3 border-t border-slate-200">
                <span className="text-[11px] font-bold text-slate-600 block mb-2">
                  Verified Grounding Citations:
                </span>
                <div className="space-y-1.5">
                  {result.groundingSources.map((source, i) => (
                    <a
                      key={i}
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 bg-white rounded-lg border border-slate-200/80 text-xs text-blue-600 hover:text-blue-800 flex items-center justify-between transition-colors"
                    >
                      <span className="truncate max-w-md font-medium">{source.title}</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0 ml-2" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Official Domain Restriction: FDA, EMA, Health Canada, TGA</span>
          <button
            onClick={() => setIsSearchGroundingOpen(false)}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
