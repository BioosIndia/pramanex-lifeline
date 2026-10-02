import React from 'react';
import { ShieldCheck, AlertCircle, FileCheck, CheckCircle2, Hash, Database } from 'lucide-react';

export const MethodologyView: React.FC = () => {
  const distinctions = [
    {
      bad: 'SOURCE_FAILED converted to "No Shortage"',
      good: 'SOURCE_FAILED preserves previous evidence and signals ingestion failure.',
      why: 'When a government API or server times out, absence of response must never be falsified as positive medicine availability.'
    },
    {
      bad: 'NO_OFFICIAL_SIGNAL converted to "Available"',
      good: 'NO_OFFICIAL_SIGNAL strictly indicates no national regulatory filing.',
      why: 'Retail pharmacy shelf stock is not tracked by sovereign national shortage databases.'
    },
    {
      bad: 'LOCAL_STOCKOUT interpreted as "National Shortage"',
      good: 'Local logistics constraints are kept distinct from manufacturer national supply notices.',
      why: 'Regional delivery disruptions do not represent a manufacturer-wide supply crisis.'
    },
    {
      bad: 'Conflicting authority signals averaged or hidden',
      good: 'Multi-source disagreements remain explicitly visible in the Reconciliation Matrix.',
      why: 'If the US FDA resolves an event while Health Canada maintains an active shortage, clinicians must see both.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 uppercase tracking-wider">
            ✦ REGULATORY TRUTH CONTRACT
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Evidence Methodology & Non-Prediction Policy
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            PRAMANEX LIFELINE operates under a deterministic evidence contract. We never fabricate supply certainty or hide jurisdictional disagreements.
          </p>
        </div>

        {/* Core Truth Distinctions */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <span>Non-Negotiable Truth Distinctions</span>
          </h2>

          <div className="space-y-4">
            {distinctions.map((d, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800">
                    <span className="font-bold block text-[10px] uppercase tracking-wider mb-0.5">
                      Prohibited False Assumption
                    </span>
                    {d.bad}
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
                    <span className="font-bold block text-[10px] uppercase tracking-wider mb-0.5">
                      LIFELINE Deterministic Rule
                    </span>
                    {d.good}
                  </div>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed pt-1">
                  <strong>Rationale:</strong> {d.why}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 5-Step Verification Cycle */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Hash className="w-5 h-5 text-sky-600" />
            <span>Cryptographic Hashing & Immutability</span>
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every payload retrieved from an official regulatory endpoint is hashed using SHA-256 before any normalization is attempted.
            This ensures that any downstream alert, clinical inspection, or regulatory export can be mathematically verified against
            the exact government bulletin snapshot at that precise timestamp.
          </p>
        </div>

        {/* Clinical Safety Contract */}
        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
          <strong className="block font-bold mb-1">Clinical Safety & Substitution Guardrail:</strong>
          PRAMANEX LIFELINE is an administrative supply intelligence platform. It does NOT diagnose clinical conditions, prescribe alternative pharmaceutical therapies, or calculate probabilistic speculative forecasts.
        </div>
      </div>
    </div>
  );
};
