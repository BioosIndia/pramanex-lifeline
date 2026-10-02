import React from 'react';
import {
  Activity,
  GitBranch,
  Clock,
  Filter,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Shield,
  Layers
} from 'lucide-react';

interface FeaturesGridProps {
  onExploreModule: (module: string) => void;
}

export const FeaturesGrid: React.FC<FeaturesGridProps> = ({ onExploreModule }) => {
  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <span>✦ FEATURES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Smarter intelligence for medicine supply visibility
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Engineered to replace fragmented press releases with verified, source-linked, and
            jurisdiction-aware official medicine records.
          </p>
        </div>

        {/* 4 Balanced Cards Grid (FlowSuite composition) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Official Shortage Intelligence with Spline Preview */}
          <div
            onClick={() => onExploreModule('search')}
            className="group bg-slate-50/70 hover:bg-slate-50 border border-slate-200/90 rounded-3xl p-6 sm:p-8 transition-all hover:shadow-lg hover:border-blue-300 cursor-pointer flex flex-col justify-between"
          >
            <div>
              {/* Mini visual mockup */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs mb-6 group-hover:scale-[1.01] transition-transform">
                <div className="flex items-center justify-between text-xs mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    <span className="font-semibold text-slate-900">Amoxicillin Oral 250mg</span>
                  </div>
                  <span className="text-slate-400 text-[11px]">US FDA CDER</span>
                </div>
                {/* Mini SVG graph */}
                <div className="h-28 w-full">
                  <svg className="w-full h-full" viewBox="0 0 300 90">
                    <path
                      d="M 0 70 Q 75 80, 150 40 T 300 20"
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="2.5"
                    />
                    <circle cx="150" cy="40" r="4" fill="#2563eb" />
                    <circle cx="300" cy="20" r="4" fill="#10b981" />
                  </svg>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                  <span>Signal Ingested: May 2026</span>
                  <span className="text-blue-600 font-semibold">Verified Normalization</span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900">Official Shortage Intelligence</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Turn unstructured regulatory bulletins into normalized active substances, strengths,
                and dosage presentations with zero hallucinations.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:text-blue-800">
              <span>Inspect Medicine Registry</span>
              <span>→</span>
            </div>
          </div>

          {/* Card 2: Freshness & Conflict Tracking */}
          <div
            onClick={() => onExploreModule('dashboard')}
            className="group bg-slate-50/70 hover:bg-slate-50 border border-slate-200/90 rounded-3xl p-6 sm:p-8 transition-all hover:shadow-lg hover:border-blue-300 cursor-pointer flex flex-col justify-between"
          >
            <div>
              {/* Mini visual mockup */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs mb-6 group-hover:scale-[1.01] transition-transform">
                <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-100">
                  <span className="font-semibold text-slate-800">Source Cadence Monitor</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    98.4% Fresh
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 py-3">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">Published Update</span>
                    <span className="text-xs font-bold text-slate-800">4 hours ago</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">Verified Retrieval</span>
                    <span className="text-xs font-bold text-blue-600">12 mins ago</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-purple-700 bg-purple-50 p-2 rounded-lg border border-purple-100">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>2 Authorities Diverge: US Resolved vs CA Active</span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900">Freshness & Conflict Tracking</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Continuously track publication versus retrieval timestamps. Automatically identify
                when two government agencies report divergent statuses for the same molecule.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:text-blue-800">
              <span>View Source Matrix</span>
              <span>→</span>
            </div>
          </div>

          {/* Card 3: Supply Provenance Architecture (FlowSuite node graphic) */}
          <div
            onClick={() => onExploreModule('dashboard')}
            className="group bg-slate-50/70 hover:bg-slate-50 border border-slate-200/90 rounded-3xl p-6 sm:p-8 transition-all hover:shadow-lg hover:border-blue-300 cursor-pointer flex flex-col justify-between"
          >
            <div>
              {/* Mini Visual Mockup — FlowSuite node graphic */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs mb-6 group-hover:scale-[1.01] transition-transform flex items-center justify-center">
                <div className="relative py-4 w-full flex items-center justify-around">
                  <div className="flex flex-col items-center gap-1">
                    <span className="px-2 py-1 bg-slate-100 border border-slate-200 text-[10px] font-bold rounded-md text-slate-700">
                      Official Feed
                    </span>
                    <span className="text-[9px] text-slate-400">Snapshot</span>
                  </div>
                  <div className="w-8 h-0.5 bg-blue-300" />
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md text-xs font-bold">
                    OS
                  </div>
                  <div className="w-8 h-0.5 bg-blue-300" />
                  <div className="flex flex-col items-center gap-1">
                    <span className="px-2 py-1 bg-emerald-50 border border-emerald-200 text-[10px] font-bold rounded-md text-emerald-700">
                      Verified Alert
                    </span>
                    <span className="text-[9px] text-slate-400">Audited</span>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900">Supply Provenance Architecture</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Every state transition links back to an immutable SHA-256 snapshot hash. Trace from
                regulatory agency fetch to end-user notification without missing steps.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:text-blue-800">
              <span>Inspect Provenance Tree</span>
              <span>→</span>
            </div>
          </div>

          {/* Card 4: Multi-Jurisdiction Faceted Discovery */}
          <div
            onClick={() => onExploreModule('search')}
            className="group bg-slate-50/70 hover:bg-slate-50 border border-slate-200/90 rounded-3xl p-6 sm:p-8 transition-all hover:shadow-lg hover:border-blue-300 cursor-pointer flex flex-col justify-between"
          >
            <div>
              {/* Mini visual mockup */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs mb-6 group-hover:scale-[1.01] transition-transform">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
                  <span className="font-semibold text-slate-800">Faceted Filter Matrix</span>
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <div className="flex flex-wrap gap-1.5 py-3">
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 font-semibold rounded-md text-[10px] border border-blue-200">
                    Jurisdiction: US & EU
                  </span>
                  <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-[10px]">
                    Form: Injectables
                  </span>
                  <span className="px-2 py-1 bg-rose-50 text-rose-700 font-semibold rounded-md text-[10px] border border-rose-200">
                    Status: Shortage
                  </span>
                  <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-[10px]">
                    Freshness: &lt;24h
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">Deterministic multi-index execution in &lt;30ms</p>
              </div>

              <h3 className="text-xl font-bold text-slate-900">Multi-Jurisdiction Faceted Discovery</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Filter and isolate supply events by jurisdiction, dosage formulation, marketing
                authorization holder, and shortage lifecycle without clutter.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:text-blue-800">
              <span>Open Filter Engine</span>
              <span>→</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
