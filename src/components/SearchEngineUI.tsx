import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  Filter,
  Bookmark,
  BookmarkCheck,
  Clock,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  RefreshCw,
  X,
  FileText,
  Hash,
  AlertCircle,
  Pill,
  Building,
  TrendingUp,
  History,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ShortageEvent, JurisdictionCode } from '../types';

export const SearchEngineUI: React.FC = () => {
  const {
    events,
    searchFilter,
    setSearchFilter,
    selectedJurisdiction,
    setSelectedJurisdiction,
    selectedStatusFilter,
    setSelectedStatusFilter,
    toggleWatchlist,
    isWatched,
    selectedEvent,
    setSelectedEvent,
    setIsSearchGroundingOpen,
    setIsAssistantOpen
  } = useApp();

  const [selectedFormFilter, setSelectedFormFilter] = useState<string>('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Amoxicillin',
    'Semaglutide',
    'Cefepime',
    'Carboplatin',
    'Salbutamol'
  ]);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleWatchToggle = async (e: React.MouseEvent, evt: ShortageEvent) => {
    e.stopPropagation();
    const added = await toggleWatchlist(evt);
    showToast(added ? `Added ${evt.genericName} to your Watchlist.` : `Removed ${evt.genericName} from Watchlist.`);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // YouTube-style autocomplete suggestions generator
  const autocompleteSuggestions = useMemo(() => {
    if (!searchFilter.trim()) return [];
    const q = searchFilter.toLowerCase();
    const suggestions: { type: 'MOLECULE' | 'BRAND' | 'FORM' | 'ATC'; label: string; sub: string }[] = [];

    events.forEach((evt) => {
      if (evt.genericName.toLowerCase().includes(q)) {
        suggestions.push({
          type: 'MOLECULE',
          label: evt.genericName,
          sub: `Active API Substance (${evt.atcCode})`
        });
      }
      evt.brandName.split('/').forEach((brand) => {
        const b = brand.trim();
        if (b.toLowerCase().includes(q)) {
          suggestions.push({
            type: 'BRAND',
            label: b,
            sub: `Brand Presentation for ${evt.genericName}`
          });
        }
      });
      if (evt.presentation.toLowerCase().includes(q)) {
        suggestions.push({
          type: 'FORM',
          label: evt.presentation,
          sub: `${evt.genericName} (${evt.jurisdiction})`
        });
      }
    });

    // Deduplicate by label
    const seen = new Set<string>();
    return suggestions.filter((item) => {
      const k = item.label.toLowerCase();
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    }).slice(0, 8);
  }, [events, searchFilter]);

  // Filtered medicine search results
  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      // Query filter
      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase();
        const matchesGeneric = evt.genericName.toLowerCase().includes(q);
        const matchesBrand = evt.brandName.toLowerCase().includes(q);
        const matchesPres = evt.presentation.toLowerCase().includes(q);
        const matchesSubstance = evt.activeSubstances.some((s) => s.toLowerCase().includes(q));
        const matchesATC = evt.atcCode.toLowerCase().includes(q);
        if (!matchesGeneric && !matchesBrand && !matchesPres && !matchesSubstance && !matchesATC) {
          return false;
        }
      }

      // Jurisdiction filter
      if (selectedJurisdiction !== 'ALL' && evt.jurisdiction !== selectedJurisdiction) {
        return false;
      }

      // Status filter
      if (selectedStatusFilter !== 'ALL' && evt.status !== selectedStatusFilter) {
        return false;
      }

      // Dosage form filter
      if (selectedFormFilter !== 'ALL' && !evt.dosageForm.toLowerCase().includes(selectedFormFilter.toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [events, searchFilter, selectedJurisdiction, selectedStatusFilter, selectedFormFilter]);

  const jurisdictionsList: { code: JurisdictionCode | 'ALL'; label: string }[] = [
    { code: 'ALL', label: 'All Jurisdictions' },
    { code: 'US', label: 'United States (FDA)' },
    { code: 'EU', label: 'European Union (EMA)' },
    { code: 'CA', label: 'Canada (Health Canada)' },
    { code: 'UK', label: 'United Kingdom (MHRA)' },
    { code: 'AU', label: 'Australia (TGA)' },
  ];

  const handleSelectSuggestion = (val: string) => {
    setSearchFilter(val);
    setIsDropdownOpen(false);
    if (!recentSearches.includes(val)) {
      setRecentSearches([val, ...recentSearches.slice(0, 4)]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pt-8 pb-20">
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in slide-in-from-bottom-3 duration-200">
          <BookmarkCheck className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-2">
                <span>✦ DETERMINISTIC MEDICINE SEARCH ENGINE</span>
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Official Medicine Supply Index
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Directly cross-referencing {events.length} verified national regulatory filings with
                instant autocomplete and official source discovery.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSearchGroundingOpen(true)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Search Grounding</span>
              </button>
              <button
                onClick={() => setIsAssistantOpen(true)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <span>Ask Supply AI</span>
              </button>
            </div>
          </div>

          {/* YouTube-Style Autocomplete Search Bar */}
          <div ref={searchContainerRef} className="mt-6 relative z-30">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchFilter}
                onFocus={() => setIsDropdownOpen(true)}
                onChange={(e) => {
                  setSearchFilter(e.target.value);
                  setIsDropdownOpen(true);
                }}
                placeholder="Search by generic substance, commercial brand, ATC code, or formulation..."
                className="w-full pl-12 pr-10 py-4 bg-white rounded-2xl border border-slate-200 shadow-sm text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              {searchFilter && (
                <button
                  onClick={() => setSearchFilter('')}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* YouTube-Style Autocomplete Overlay Dropdown */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-40 animate-in fade-in zoom-in-95 duration-100">
                {/* Autocomplete Suggestions */}
                {autocompleteSuggestions.length > 0 && (
                  <div className="py-2 divide-y divide-slate-100">
                    <div className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Search Suggestions
                    </div>
                    {autocompleteSuggestions.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSelectSuggestion(item.label)}
                        className="px-4 py-2.5 hover:bg-blue-50/70 cursor-pointer flex items-center justify-between text-xs transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Search className="w-3.5 h-3.5 text-slate-400" />
                          <div>
                            <span className="font-semibold text-slate-900">{item.label}</span>
                            <span className="text-[11px] text-slate-400 ml-2 font-normal">{item.sub}</span>
                          </div>
                        </div>
                        <span className="text-[9px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {item.type}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="p-3 bg-slate-50/80 border-t border-slate-100">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                      <span className="flex items-center gap-1">
                        <History className="w-3 h-3" />
                        <span>Recent Searches</span>
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {recentSearches.map((term, i) => (
                        <button
                          key={i}
                          onClick={() => handleSelectSuggestion(term)}
                          className="px-2.5 py-1 bg-white border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <span>{term}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Faceted Filter Strip */}
          <div className="mt-4 flex flex-wrap items-center gap-2 pt-2">
            {/* Jurisdiction Pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
              {jurisdictionsList.map((j) => (
                <button
                  key={j.code}
                  onClick={() => setSelectedJurisdiction(j.code)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-colors ${
                    selectedJurisdiction === j.code
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
                  }`}
                >
                  {j.label}
                </button>
              ))}
            </div>

            {/* Status Dropdown */}
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-white rounded-full text-xs font-medium text-slate-700 border border-slate-200 shadow-2xs focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="SHORTAGE_DECLARED">Shortage Declared</option>
              <option value="SUPPLY_DISRUPTION">Supply Disruption</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CONFLICTING_SOURCES">Conflicting Signals</option>
            </select>

            {/* Dosage Form Dropdown */}
            <select
              value={selectedFormFilter}
              onChange={(e) => setSelectedFormFilter(e.target.value)}
              className="px-3 py-1.5 bg-white rounded-full text-xs font-medium text-slate-700 border border-slate-200 shadow-2xs focus:outline-none"
            >
              <option value="ALL">All Formulations</option>
              <option value="Suspension">Oral Suspension / Liquids</option>
              <option value="Injectable">Injectables & Infusions</option>
              <option value="Inhalation">Inhalation Aerosols</option>
              <option value="Tablet">Solid Oral Tablets / Capsules</option>
            </select>
          </div>
        </div>

        {/* Results Count & Disclaimers */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-4 pb-2 border-b border-slate-200">
          <span>
            Found <strong className="text-slate-800">{filteredEvents.length}</strong> official supply records
          </span>
          <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 hidden sm:inline">
            Official declarations only • Does not reflect individual retail pharmacy stock
          </span>
        </div>

        {/* Results Cards List */}
        {filteredEvents.length === 0 ? (
          /* Universal Dynamic Regulatory Card for ANY drug */
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xs max-w-2xl mx-auto my-8 text-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-200">
              <Pill className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Regulatory Dossier Lookup for "{searchFilter}"
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed max-w-lg mx-auto">
              This medication is not currently listed under national shortage in the pre-indexed registry.
              In accordance with LIFELINE truth principles: <strong>NO_OFFICIAL_SIGNAL</strong> does not
              guarantee retail availability.
            </p>

            <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-3">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Available Sovereign Regulatory Portals for "{searchFilter}":</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <a
                  href={`https://www.accessdata.fda.gov/scripts/drugshortages/dsp_Search.cfm`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 bg-white rounded-xl border border-slate-200 text-blue-600 hover:text-blue-800 flex items-center justify-between transition-colors"
                >
                  <span>US FDA CDER Search</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href={`https://www.ema.europa.eu/en/medicines/human/shortages`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 bg-white rounded-xl border border-slate-200 text-blue-600 hover:text-blue-800 flex items-center justify-between transition-colors"
                >
                  <span>EMA SPOR Catalogue</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href={`https://www.drugshortagescanada.ca/`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 bg-white rounded-xl border border-slate-200 text-blue-600 hover:text-blue-800 flex items-center justify-between transition-colors"
                >
                  <span>Health Canada Registry</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href={`https://apps.tga.gov.au/Prod/msi/Search`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 bg-white rounded-xl border border-slate-200 text-blue-600 hover:text-blue-800 flex items-center justify-between transition-colors"
                >
                  <span>Australian TGA Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setIsSearchGroundingOpen(true)}
                className="w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-sky-300" />
                <span>Execute Live Google Search Grounding with Gemini</span>
              </button>
              <button
                onClick={() => {
                  setSearchFilter('');
                  setSelectedJurisdiction('ALL');
                  setSelectedStatusFilter('ALL');
                  setSelectedFormFilter('ALL');
                }}
                className="w-full sm:w-auto px-4 py-3 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Clear Search
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredEvents.map((evt) => {
              const watched = isWatched(evt.medicineId);

              return (
                <div
                  key={evt.id}
                  onClick={() => setSelectedEvent(evt)}
                  className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Row: Authority & Watch button */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] uppercase font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          {evt.jurisdiction} • {evt.authority}
                        </span>
                        {evt.hasCrossSourceConflict && (
                          <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
                            Split
                          </span>
                        )}
                      </div>
                      <button
                        onClick={(e) => handleWatchToggle(e, evt)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          watched
                            ? 'text-blue-600 bg-blue-50'
                            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                        }`}
                        title={watched ? 'Remove from Watchlist' : 'Add to Watchlist'}
                      >
                        {watched ? (
                          <BookmarkCheck className="w-4 h-4 fill-blue-600 text-blue-600" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Medicine Title & Brands */}
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {evt.genericName}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">{evt.brandName}</p>

                    {/* Specific Presentation */}
                    <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                        Affected Presentation
                      </span>
                      <p className="text-xs font-semibold text-slate-800 leading-snug line-clamp-2">
                        {evt.presentation}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <div className="mt-3">
                      {evt.status === 'SHORTAGE_DECLARED' && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Shortage Declared</span>
                        </div>
                      )}
                      {evt.status === 'SUPPLY_DISRUPTION' && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Supply Disruption</span>
                        </div>
                      )}
                      {evt.status === 'RESOLVED' && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Resolved by Authority</span>
                        </div>
                      )}
                      {evt.status === 'CONFLICTING_SOURCES' && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Conflicting Sources</span>
                        </div>
                      )}
                    </div>

                    {/* Reported Cause snippet */}
                    <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                      <strong className="text-slate-700">Official Cause:</strong> {evt.reportedCause}
                    </p>
                  </div>

                  {/* Card Bottom: Freshness Clock & Action */}
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>Synced 15m ago</span>
                    </div>
                    <span className="text-blue-600 font-semibold group-hover:text-blue-800 transition-colors flex items-center gap-1">
                      Inspect Snapshot →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Slide-over Evidence Detail Drawer */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <div
            onClick={() => setSelectedEvent(null)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Content */}
          <div className="relative w-full max-w-xl bg-white h-full shadow-2xl p-6 sm:p-8 overflow-y-auto flex flex-col justify-between z-10 animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-600" />
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Official Regulatory Evidence Snapshot
                  </span>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Title Header */}
              <div className="mt-4">
                <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  ATC: {selectedEvent.atcCode}
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-2">
                  {selectedEvent.genericName}
                </h2>
                <p className="text-sm text-slate-500">{selectedEvent.brandName}</p>
              </div>

              {/* Status & Freshness Clock Component */}
              <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/70">
                  <span className="text-xs font-semibold text-slate-500">Official Filing Status</span>
                  <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    {selectedEvent.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Reporting Agency</span>
                    <strong className="text-slate-900">{selectedEvent.authority}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Jurisdiction</span>
                    <strong className="text-slate-900">{selectedEvent.jurisdiction}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Published Date</span>
                    <span className="text-slate-700">
                      {new Date(selectedEvent.sourcePublishedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Ingestion Freshness</span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {selectedEvent.freshnessStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Affected Presentation Specifics */}
              <div className="mt-6">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Detailed Presentation
                </h4>
                <div className="p-3.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-medium">
                  {selectedEvent.presentation}
                </div>
              </div>

              {/* Cause & Duration */}
              <div className="mt-6 space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Manufacturer Reported Reason
                  </h4>
                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {selectedEvent.reportedCause}
                  </p>
                </div>
                {selectedEvent.reportedDuration && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Estimated Normalization Timeline
                    </h4>
                    <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {selectedEvent.reportedDuration}
                    </p>
                  </div>
                )}
              </div>

              {/* Authority Published Mitigation ONLY */}
              {selectedEvent.mitigationNotice && (
                <div className="mt-6 p-4 rounded-2xl bg-sky-50 border border-sky-200 text-xs text-sky-900">
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <ShieldCheck className="w-4 h-4 text-sky-600" />
                    <span>Official Authority Published Mitigation Guidance</span>
                  </div>
                  <p className="leading-relaxed">{selectedEvent.mitigationNotice}</p>
                </div>
              )}

              {/* Cryptographic Snapshot Lineage */}
              <div className="mt-6 p-4 rounded-2xl bg-slate-900 text-slate-300 text-xs">
                <div className="flex items-center gap-2 text-white font-bold mb-2">
                  <Hash className="w-4 h-4 text-sky-400" />
                  <span>Immutable Evidence Hash (SHA-256)</span>
                </div>
                <p className="font-mono text-[10px] break-all bg-black/40 p-2 rounded-lg text-sky-300 border border-slate-800">
                  {selectedEvent.snapshotHash}
                </p>
                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Tamper-evident record</span>
                  <a
                    href={selectedEvent.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1"
                  >
                    <span>View Authority Notice</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Strict Regulatory Non-Prediction Boundary */}
            <div className="mt-8 pt-4 border-t border-slate-100 text-[11px] text-slate-400 leading-normal">
              <strong>Regulatory Notice:</strong> PRAMANEX LIFELINE reflects official manufacturer
              filings verified by sovereign authorities. It does not calculate probabilistic future shortages
              or diagnose pharmacy shelf inventory.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
