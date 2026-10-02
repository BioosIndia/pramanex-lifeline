import React, { useState } from 'react';
import {
  Search,
  Bookmark,
  BookmarkCheck,
  Bell,
  Clock,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Info,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { ShortageEvent } from '../types';

export const ConsumerPWAView: React.FC = () => {
  const {
    events,
    watchlists,
    toggleWatchlist,
    setSelectedEvent,
    notifications,
    setIsAssistantOpen
  } = useApp();
  const { t, currentLanguage, setLanguage, languages } = useLanguage();

  const [consumerQuery, setConsumerQuery] = useState('');
  const [isLangOpen, setIsLangOpen] = useState(false);

  const currentLangObj = languages.find((l) => l.code === currentLanguage) || languages[0];

  const watchedEvents = events.filter((e) =>
    watchlists.some((w) => w.medicineId === e.medicineId)
  );

  const searchResults = events.filter((e) => {
    if (!consumerQuery.trim()) return false;
    const q = consumerQuery.toLowerCase();
    return (
      e.genericName.toLowerCase().includes(q) ||
      e.brandName.toLowerCase().includes(q) ||
      e.presentation.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-10">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Mobile Header with Language Dropdown */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-[10px] uppercase font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              {t('nav.patient')}
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-1">{t('patient.title')}</h1>
            <p className="text-xs text-slate-500">{t('patient.subtitle')}</p>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Language Toggle */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl shadow-2xs hover:bg-slate-50"
              >
                <span>{currentLangObj.flag}</span>
                <span className="text-[11px]">{currentLangObj.code.toUpperCase()}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-1.5 w-36 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code);
                        setIsLangOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between ${
                        currentLanguage === l.code ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{l.flag}</span>
                        <span>{l.nativeName}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setIsAssistantOpen(true)}
              className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 active:scale-95 transition-transform"
              title="Ask Lifeline Assistant"
            >
              <Sparkles className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Consumer Search Input */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={consumerQuery}
            onChange={(e) => setConsumerQuery(e.target.value)}
            placeholder={t('patient.searchPlaceholder')}
            className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-slate-200 shadow-sm text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {/* Instant Search Results Dropdown */}
        {consumerQuery.trim() && (
          <div className="mb-6 bg-white rounded-2xl border border-slate-200 shadow-lg p-3 space-y-2">
            <span className="text-[10px] font-bold uppercase text-slate-400 block px-2">
              Matches Found ({searchResults.length})
            </span>
            {searchResults.length === 0 ? (
              <p className="text-xs text-slate-500 p-2">
                No official shortage signal on file for "{consumerQuery}".
              </p>
            ) : (
              searchResults.map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => setSelectedEvent(evt)}
                  className="p-3 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{evt.genericName}</h4>
                    <p className="text-[11px] text-slate-500">{evt.brandName} • {evt.presentation}</p>
                  </div>
                  <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    {evt.status}
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {/* My Medicines Watchlist Section */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">{t('patient.myList')} ({watchedEvents.length})</h2>
            </div>
            <span className="text-[11px] text-slate-400">Live Status Monitored</span>
          </div>

          {watchedEvents.length === 0 ? (
            <div className="p-6 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-xs text-slate-500">
                You haven't added any medicines to your watchlist yet.
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Search a prescription above and tap the bookmark to receive official status change alerts.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {watchedEvents.map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => setSelectedEvent(evt)}
                  className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 cursor-pointer transition-colors flex items-center justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      {evt.jurisdiction} • {evt.authority}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-0.5">{evt.genericName}</h3>
                    <p className="text-xs text-slate-500 truncate max-w-xs">{evt.presentation}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        {evt.status}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-medium">Fresh (Verified)</span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWatchlist(evt);
                    }}
                    className="p-2 text-blue-600 hover:text-slate-400"
                    title="Remove"
                  >
                    <BookmarkCheck className="w-5 h-5 fill-blue-600" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Consumer Safety Contract Notice */}
        <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 text-xs text-blue-900 flex items-start gap-3">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="block font-bold">{t('patient.whatThisMeans')}</strong>
            {t('disclaimer.text')} {t('patient.pharmacistAdvice')}
          </div>
        </div>
      </div>
    </div>
  );
};
