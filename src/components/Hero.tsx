import React, { useState } from 'react';
import {
  Search,
  Activity,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  ChevronRight,
  Shield,
  Filter,
  RefreshCw,
  SlidersHorizontal,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { ShortageEvent } from '../types';

interface HeroProps {
  onSearchSubmit: (query: string) => void;
  onSelectEvent: (event: ShortageEvent) => void;
  onGoToConsole: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onSearchSubmit, onSelectEvent, onGoToConsole }) => {
  const { events, sourceHealth, setSelectedEvent } = useApp();
  const { t } = useLanguage();
  const [quickQuery, setQuickQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'us' | 'eu'>('all');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickQuery.trim()) {
      onSearchSubmit(quickQuery.trim());
    }
  };

  const filteredHeroEvents = events.filter((ev) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'us') return ev.jurisdiction === 'US';
    if (activeTab === 'eu') return ev.jurisdiction === 'EU';
    return true;
  });

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#1b5df5] via-[#2563eb] to-slate-50 pt-14 pb-20 sm:pt-20 sm:pb-28">
      {/* Ambient background glow and circuit lines */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-sky-400/20 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Eyebrow Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-medium tracking-wide mb-6 shadow-sm">
          <span className="text-sky-300 font-bold">✦</span>
          <span>{t('hero.badge')}</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.12] max-w-4xl mx-auto">
          {t('hero.title')}{' '}
          <span className="text-sky-200">{t('hero.titleHighlight')}</span>
        </h1>

        {/* Supporting Copy */}
        <p className="mt-5 text-base sm:text-lg md:text-xl text-blue-100 max-w-2xl mx-auto font-normal leading-relaxed">
          {t('hero.subtitle')}
        </p>

        {/* Central Search Bar — FlowSuite Hero Form Pattern */}
        <form
          onSubmit={handleSearch}
          className="mt-8 sm:mt-10 max-w-xl mx-auto flex items-center bg-white rounded-full p-2 shadow-2xl shadow-blue-900/30 border border-white/30 transition-all focus-within:ring-4 focus-within:ring-sky-300/40"
        >
          <div className="pl-4 pr-2 text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={quickQuery}
            onChange={(e) => setQuickQuery(e.target.value)}
            placeholder={t('hero.searchPlaceholder')}
            className="flex-1 bg-transparent py-2.5 px-2 text-slate-800 text-sm sm:text-base placeholder:text-slate-400 focus:outline-none"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-full bg-slate-950 hover:bg-black text-white text-xs sm:text-sm font-semibold transition-all shadow-md flex items-center gap-1.5 shrink-0 active:scale-95"
          >
            <span>{t('hero.searchBtn')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Search Chips */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-blue-100">
          <span className="text-blue-200">{t('hero.commonSignals')}</span>
          {['Amoxicillin', 'Semaglutide', 'Cefepime', 'Carboplatin', 'Methotrexate'].map((chip) => (
            <button
              key={chip}
              onClick={() => onSearchSubmit(chip)}
              className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-xs transition-colors border border-white/10"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Hero Product Visual Frame (macOS Dashboard Preview) */}
        <div className="mt-14 sm:mt-16 max-w-6xl mx-auto text-left">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden ring-1 ring-slate-900/5">
            {/* macOS Window Titlebar */}
            <div className="bg-slate-50/80 px-4 sm:px-6 py-3 border-b border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400/90 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-400/90 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-400/90 inline-block" />
                <span className="text-xs font-semibold text-slate-500 ml-3 tracking-wide">
                  {t('hero.windowTitle')}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  14 Authority Feeds Online
                </span>
              </div>
            </div>

            {/* Dashboard Mockup Body */}
            <div className="p-4 sm:p-6 lg:p-8 bg-slate-50/50">
              {/* Top KPI Metrics Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>{t('hero.activeShortages')}</span>
                    <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                      National
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">68</span>
                    <span className="text-xs font-medium text-amber-600 flex items-center">
                      +3 this week
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Across FDA, EMA, Health Canada</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>{t('hero.monitoredFeeds')}</span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      Official
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">14</span>
                    <span className="text-xs font-medium text-emerald-600">100% Uptime</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Scheduled 24h cadence</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>{t('hero.freshnessIndex')}</span>
                    <span className="text-[10px] font-semibold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded">
                      Verified
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">98.4%</span>
                    <span className="text-xs font-medium text-blue-600">Avg sync 18m</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Zero unobserved gaps</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>{t('hero.crossSplit')}</span>
                    <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
                      Reconciled
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">12</span>
                    <span className="text-xs font-medium text-purple-600">In Human Triage</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Multi-jurisdiction divergence</p>
                </div>
              </div>

              {/* Chart & Donut Composition (FlowSuite layout) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Spline Resolution Chart */}
                <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Supply Event Resolution & Trend</h4>
                      <p className="text-xs text-slate-500">Descriptive count of official declarations vs resolution</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg font-medium">
                        Last 6 Months
                      </span>
                    </div>
                  </div>

                  {/* SVG Spline visualization */}
                  <div className="h-44 w-full relative">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 500 160">
                      {/* Grid lines */}
                      <line x1="0" y1="40" x2="500" y2="40" stroke="#f1f5f9" strokeDasharray="3 3" />
                      <line x1="0" y1="80" x2="500" y2="80" stroke="#f1f5f9" strokeDasharray="3 3" />
                      <line x1="0" y1="120" x2="500" y2="120" stroke="#f1f5f9" strokeDasharray="3 3" />

                      {/* Area Fill */}
                      <defs>
                        <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 0 130 C 70 120, 120 70, 180 85 C 240 100, 300 40, 370 65 C 430 85, 470 30, 500 45 L 500 160 L 0 160 Z"
                        fill="url(#blueGradient)"
                      />
                      {/* Spline Stroke */}
                      <path
                        d="M 0 130 C 70 120, 120 70, 180 85 C 240 100, 300 40, 370 65 C 430 85, 470 30, 500 45"
                        fill="none"
                        stroke="#2563eb"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />

                      {/* Interactive Tooltip Pin */}
                      <g transform="translate(370, 65)">
                        <circle r="5" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
                        <rect x="-42" y="-36" width="84" height="26" rx="6" fill="#0f172a" />
                        <text x="0" y="-19" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                          Active: 68 Evts
                        </text>
                      </g>
                    </svg>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 mt-2 px-1">
                    <span>May</span>
                    <span>Jun</span>
                    <span>Jul</span>
                    <span>Aug</span>
                    <span>Sep</span>
                    <span>Current</span>
                  </div>
                </div>

                {/* Donut Gauge: Signal Distribution */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Signal Status Parity</h4>
                    <p className="text-xs text-slate-500">Cross-jurisdiction verification</p>
                  </div>

                  <div className="py-4 flex items-center justify-center relative">
                    <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="12" fill="none" />
                      {/* Open Shortages: 62% */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#2563eb"
                        strokeWidth="12"
                        strokeDasharray="251.2"
                        strokeDashoffset="95.4"
                        fill="none"
                        strokeLinecap="round"
                      />
                      {/* Resolved: 26% */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#10b981"
                        strokeWidth="12"
                        strokeDasharray="251.2"
                        strokeDashoffset="185.8"
                        fill="none"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-2xl font-extrabold text-slate-900">62%</span>
                      <span className="text-[10px] uppercase font-semibold text-slate-400">Open Signals</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-600">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
                        Active Shortage
                      </span>
                      <span className="font-semibold text-slate-900">42 events</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-600">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                        Resolved
                      </span>
                      <span className="font-semibold text-slate-900">18 events</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-600">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                        Discrepancy / Split
                      </span>
                      <span className="font-semibold text-slate-900">8 events</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Signals Table (FlowSuite Lead Table style) */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">Recent Official Medicine Signals</h4>
                    <span className="text-xs text-slate-500">({filteredHeroEvents.length} tracked)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('all')}
                      className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                        activeTab === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {t('hero.tabAll')}
                    </button>
                    <button
                      onClick={() => setActiveTab('us')}
                      className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                        activeTab === 'us' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {t('hero.tabUS')}
                    </button>
                    <button
                      onClick={() => setActiveTab('eu')}
                      className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                        activeTab === 'eu' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {t('hero.tabEU')}
                    </button>
                    <button
                      onClick={onGoToConsole}
                      className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 ml-2"
                    >
                      {t('hero.openConsole')} <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-50/70 text-slate-500 font-semibold border-b border-slate-100">
                      <tr>
                        <th className="py-3 px-4">Medicine & Formulation</th>
                        <th className="py-3 px-4">Authority & Region</th>
                        <th className="py-3 px-4">Official Status</th>
                        <th className="py-3 px-4">Freshness</th>
                        <th className="py-3 px-4">Reported Cause</th>
                        <th className="py-3 px-4 text-right">Evidence Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredHeroEvents.slice(0, 4).map((evt) => (
                        <tr
                          key={evt.id}
                          onClick={() => setSelectedEvent(evt)}
                          className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                        >
                          <td className="py-3.5 px-4 font-semibold text-slate-900">
                            <div>{evt.genericName}</div>
                            <div className="text-[11px] font-normal text-slate-500 truncate max-w-xs">
                              {evt.presentation}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-medium text-slate-800">{evt.authority}</span>
                            <span className="ml-1 text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-1 py-0.5 rounded">
                              {evt.jurisdiction}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            {evt.status === 'SHORTAGE_DECLARED' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                                <AlertTriangle className="w-3 h-3" /> Shortage Declared
                              </span>
                            )}
                            {evt.status === 'SUPPLY_DISRUPTION' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                <Clock className="w-3 h-3" /> Disruption
                              </span>
                            )}
                            {evt.status === 'RESOLVED' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3" /> Resolved
                              </span>
                            )}
                            {evt.status === 'CONFLICTING_SOURCES' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                                <RefreshCw className="w-3 h-3" /> Multi-Source Split
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Fresh (Verified)
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 text-[11px] max-w-xs truncate">
                            {evt.reportedCause}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedEvent(evt);
                              }}
                              className="px-2.5 py-1 rounded-md text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                            >
                              Inspect Snapshot
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
