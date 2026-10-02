import React from 'react';
import { ShieldCheck, Globe2, Clock, Users, FileCheck2, Cpu } from 'lucide-react';

export const ProofStrip: React.FC = () => {
  const capabilities = [
    {
      icon: <Globe2 className="w-4 h-4 text-blue-600" />,
      label: 'Official-Source Linked',
      desc: 'US FDA, EMA, Health Canada, TGA',
    },
    {
      icon: <Clock className="w-4 h-4 text-sky-600" />,
      label: 'Freshness Visible',
      desc: 'Published vs Ingestion Timestamps',
    },
    {
      icon: <ShieldCheck className="w-4 h-4 text-indigo-600" />,
      label: 'Jurisdiction Aware',
      desc: 'National declarations respected',
    },
    {
      icon: <Users className="w-4 h-4 text-purple-600" />,
      label: 'Human Governed',
      desc: 'Discrepancy triage & clinical verification',
    },
    {
      icon: <FileCheck2 className="w-4 h-4 text-emerald-600" />,
      label: 'Auditable Lineage',
      desc: 'Cryptographic SHA-256 snapshots',
    },
  ];

  return (
    <section className="bg-slate-50 border-y border-slate-200/80 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold text-slate-400 uppercase tracking-wider mb-6">
          Architected for Traceable Medicine Supply Intelligence
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {capabilities.map((cap, idx) => (
            <div
              key={idx}
              className="bg-white p-3.5 rounded-xl border border-slate-200/70 shadow-2xs flex flex-col items-start gap-1 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-center gap-2">
                {cap.icon}
                <span className="text-xs font-bold text-slate-800">{cap.label}</span>
              </div>
              <p className="text-[11px] text-slate-500">{cap.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
