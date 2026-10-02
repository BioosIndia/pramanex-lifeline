import React, { useState } from 'react';
import {
  Globe,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Layers,
  MapPin,
  ExternalLink,
  Table,
  Filter,
  RefreshCw,
  Info
} from 'lucide-react';
import { GLOBAL_REGIONS, RegionalSupplyPoint } from '../data/seedData';
import { useApp } from '../context/AppContext';
import { ShortageEvent, JurisdictionCode } from '../types';

export const GlobalSupplyMap: React.FC = () => {
  const { events, setSelectedEvent } = useApp();
  const [selectedRegion, setSelectedRegion] = useState<RegionalSupplyPoint>(GLOBAL_REGIONS[0]);
  const [selectedMedicineFilter, setSelectedMedicineFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'MAP' | 'TABLE'>('MAP');

  const distinctMedicines = Array.from(new Set(events.map((e) => e.genericName)));

  // Filter events by selected region and/or medicine
  const regionEvents = events.filter((e) => {
    const matchesRegion = e.jurisdiction === selectedRegion.jurisdiction;
    const matchesMed = selectedMedicineFilter === 'ALL' || e.genericName === selectedMedicineFilter;
    return matchesRegion && matchesMed;
  });

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-slate-100 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-2">
            <Globe className="w-3.5 h-3.5" />
            <span>GLOBAL SOVEREIGN REGULATORY MAP</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Multi-Jurisdiction Medicine Supply Geography
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tracking national filings across sovereign regulatory agencies. Local retail inventory is not inferred.
          </p>
        </div>

        {/* View Toggle & Medicine Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedMedicineFilter}
            onChange={(e) => setSelectedMedicineFilter(e.target.value)}
            className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
          >
            <option value="ALL">All Medicines (Global Overview)</option>
            {distinctMedicines.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('MAP')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                viewMode === 'MAP' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Map View</span>
            </button>
            <button
              onClick={() => setViewMode('TABLE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                viewMode === 'TABLE' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Accessible Table</span>
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'MAP' ? (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Interactive World Vector Canvas */}
          <div className="lg:col-span-8 bg-slate-950 rounded-3xl p-6 sm:p-8 min-h-[440px] flex flex-col justify-between relative overflow-hidden border border-slate-800 shadow-2xl">
            {/* World Grid Lines Background */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none" />

            {/* Title overlay */}
            <div className="flex items-center justify-between text-xs text-slate-400 relative z-10">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-white font-mono text-[11px]">ACTIVE SURVEILLANCE GRID</span>
              </span>
              <span className="text-[10px] font-mono text-sky-400">WGS84 REGULATORY COORDINATES</span>
            </div>

            {/* SVG Interactive Map */}
            <div className="relative w-full h-80 flex items-center justify-center my-auto">
              <svg className="w-full h-full" viewBox="0 0 900 400">
                {/* Continents Outline Path (Stylized High-Contrast World Silhouette) */}
                <g fill="#1e293b" stroke="#334155" strokeWidth="1.5" opacity="0.8">
                  {/* North America */}
                  <path d="M 120 70 L 260 60 L 280 120 L 220 180 L 190 230 L 160 170 L 90 120 Z" />
                  {/* South America */}
                  <path d="M 230 230 L 290 240 L 320 310 L 270 380 L 220 320 Z" />
                  {/* Europe */}
                  <path d="M 430 80 L 520 70 L 540 140 L 470 160 L 420 120 Z" />
                  {/* Africa */}
                  <path d="M 430 170 L 530 170 L 550 260 L 480 340 L 420 260 Z" />
                  {/* Asia */}
                  <path d="M 540 70 L 750 80 L 800 180 L 680 240 L 560 180 Z" />
                  {/* Australia */}
                  <path d="M 700 250 L 820 250 L 830 330 L 730 340 Z" />
                </g>

                {/* Connection lines between regulatory nodes */}
                <g stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" opacity="0.4">
                  <line x1="210" y1="130" x2="480" y2="110" />
                  <line x1="210" y1="130" x2="180" y2="85" />
                  <line x1="480" y1="110" x2="450" y2="95" />
                  <line x1="480" y1="110" x2="750" y2="280" />
                </g>

                {/* Regional Jurisdiction Hotspots */}
                {GLOBAL_REGIONS.map((reg) => {
                  const isSelected = selectedRegion.id === reg.id;

                  return (
                    <g
                      key={reg.id}
                      transform={`translate(${reg.x}, ${reg.y})`}
                      onClick={() => setSelectedRegion(reg)}
                      className="cursor-pointer group"
                    >
                      {/* Pulse ring if elevated */}
                      {reg.status !== 'OPTIMAL' && (
                        <circle
                          r={isSelected ? 26 : 18}
                          fill="none"
                          stroke={reg.status === 'CRITICAL' ? '#f43f5e' : '#f59e0b'}
                          strokeWidth="2"
                          className="animate-ping opacity-50"
                        />
                      )}

                      {/* Main node pin */}
                      <circle
                        r={isSelected ? 18 : 12}
                        fill={
                          isSelected
                            ? '#38bdf8'
                            : reg.status === 'CRITICAL'
                            ? '#e11d48'
                            : reg.status === 'ELEVATED'
                            ? '#d97706'
                            : '#059669'
                        }
                        stroke="#ffffff"
                        strokeWidth={isSelected ? '3' : '2'}
                        className="transition-all"
                      />

                      {/* Flag/Code Text */}
                      <text
                        y={isSelected ? -24 : -18}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize={isSelected ? '12' : '10'}
                        fontWeight="bold"
                        className="drop-shadow-md"
                      >
                        {reg.jurisdiction}
                      </text>

                      {/* Sub-label */}
                      <text
                        y={isSelected ? 32 : 24}
                        textAnchor="middle"
                        fill="#94a3b8"
                        fontSize="9"
                        fontWeight="600"
                      >
                        {reg.activeShortages} active
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Bottom Map Legend */}
            <div className="flex flex-wrap items-center justify-between pt-4 border-t border-slate-800 text-[11px] text-slate-400 relative z-10">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Cadence Optimal (&lt;24h)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>Elevated Disruption</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span>Sync Delayed / Alert</span>
                </span>
              </div>
              <span className="text-slate-500">Click any hotspot to inspect regulatory docket</span>
            </div>
          </div>

          {/* Region Docket & Active Signals Panel */}
          <div className="lg:col-span-4 bg-slate-50 rounded-3xl p-6 border border-slate-200 flex flex-col justify-between min-h-[440px]">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-[10px] uppercase font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                  {selectedRegion.jurisdiction} JURISDICTION DOCKET
                </span>
                <span className="text-xs font-bold text-slate-900">{selectedRegion.authority}</span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mt-3">{selectedRegion.name}</h3>

              <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">Active Shortages</span>
                  <span className="text-lg font-extrabold text-slate-900">{selectedRegion.activeShortages}</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">Reconciliation Parity</span>
                  <span className="text-lg font-extrabold text-blue-600">{selectedRegion.reconciledParity}%</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">Uptime Index</span>
                  <span className="text-xs font-bold text-emerald-600">{selectedRegion.uptimePct}%</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">Freshness State</span>
                  <span className="text-xs font-bold text-slate-800">{selectedRegion.freshness}</span>
                </div>
              </div>

              {/* Signals in this jurisdiction */}
              <div className="mt-5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                  <span>Filings in {selectedRegion.jurisdiction} ({regionEvents.length})</span>
                  {selectedMedicineFilter !== 'ALL' && (
                    <span className="text-[10px] text-blue-600 font-semibold">{selectedMedicineFilter}</span>
                  )}
                </div>

                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {regionEvents.length === 0 ? (
                    <p className="text-xs text-slate-500 p-2">
                      No active filings match the selected medicine filter in this jurisdiction.
                    </p>
                  ) : (
                    regionEvents.map((e) => (
                      <div
                        key={e.id}
                        onClick={() => setSelectedEvent(e)}
                        className="p-3 bg-white rounded-xl border border-slate-200 hover:border-blue-300 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <strong className="text-xs text-slate-900">{e.genericName}</strong>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                              e.status === 'SHORTAGE_DECLARED'
                                ? 'bg-rose-50 text-rose-700'
                                : e.status === 'RESOLVED'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-amber-50 text-amber-700'
                            }`}
                          >
                            {e.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-1">{e.presentation}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between mt-4">
              <span>Verified feed endpoint</span>
              <span className="text-blue-600 font-bold flex items-center gap-1">
                <span>View Raw Gazette</span>
                <ExternalLink className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Accessible Table Alternative */
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Jurisdiction & Agency</th>
                <th className="py-3 px-4">Active Shortages</th>
                <th className="py-3 px-4">Reconciliation Parity</th>
                <th className="py-3 px-4">Ingestion Uptime</th>
                <th className="py-3 px-4">Freshness State</th>
                <th className="py-3 px-4">System Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {GLOBAL_REGIONS.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <div>{r.name}</div>
                    <span className="text-[10px] text-slate-400">{r.authority}</span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">{r.activeShortages} events</td>
                  <td className="py-3.5 px-4 font-bold text-blue-600">{r.reconciledParity}%</td>
                  <td className="py-3.5 px-4 font-semibold text-emerald-600">{r.uptimePct}%</td>
                  <td className="py-3.5 px-4">{r.freshness}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        r.status === 'OPTIMAL'
                          ? 'bg-emerald-50 text-emerald-700'
                          : r.status === 'ELEVATED'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Truth Distinction Guard */}
      <div className="mt-6 p-4 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-start gap-2.5 text-xs text-blue-900">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Jurisdiction Boundary Notice:</strong> A medicine shortage declared by the US FDA does not
          imply a shortage in the European Union or Canada unless confirmed by sovereign authorities. The
          PRAMANEX global map visualizes cross-border supply signals without collapsing jurisdictional independence.
        </p>
      </div>
    </div>
  );
};
