import React, { useState } from 'react';
import {
  FileCheck,
  ShieldCheck,
  ExternalLink,
  Download,
  Copy,
  Hash,
  Building2,
  Calendar,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { OFFICIAL_BULLETINS } from '../data/seedData';
import { OfficialBulletin } from '../types';

export const OfficialBulletinsViewer: React.FC = () => {
  const [selectedBulletin, setSelectedBulletin] = useState<OfficialBulletin>(OFFICIAL_BULLETINS[0]);
  const [copied, setCopied] = useState(false);

  const handleCopyText = () => {
    navigator.clipboard.writeText(selectedBulletin.fullLegalText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-slate-100 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold uppercase tracking-wider mb-2">
            <FileCheck className="w-3.5 h-3.5" />
            <span>AUTHENTIC SOVEREIGN GAZETTES & MITIGATION NOTICES</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Official Shortage Bulletins & Government Instruments
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Directly reproduced regulatory instruments under Section 506E (FDA), Section 19A (TGA), SAP (Health Canada), and MSSG (EMA).
          </p>
        </div>

        {/* Gazette Selector Pills */}
        <div className="flex flex-wrap gap-1.5">
          {OFFICIAL_BULLETINS.map((blt) => (
            <button
              key={blt.id}
              onClick={() => setSelectedBulletin(blt)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                selectedBulletin.id === blt.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {blt.jurisdiction} — {blt.authority}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Gazette Metadata Card */}
        <div className="lg:col-span-4 bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
              {selectedBulletin.jurisdiction} JURISDICTION
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
              VERIFIED FILING
            </span>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900">{selectedBulletin.authority}</h3>
            <p className="text-xs font-mono text-slate-500 mt-0.5">{selectedBulletin.gazetteNumber}</p>
          </div>

          <div className="pt-2 border-t border-slate-200 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Date Published:</span>
              <span className="font-semibold text-slate-800">{selectedBulletin.publishedDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Classification:</span>
              <span className="font-bold text-blue-600">{selectedBulletin.classification}</span>
            </div>
          </div>

          {/* Cryptographic Hash */}
          <div className="p-3 bg-white rounded-2xl border border-slate-200 text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Cryptographic Digest (SHA-256)
            </span>
            <p className="font-mono text-[10px] text-slate-700 break-all bg-slate-50 p-2 rounded-lg border border-slate-100">
              {selectedBulletin.sha256Hash}
            </p>
          </div>

          <a
            href={selectedBulletin.verifiedSourceUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors flex items-center justify-center gap-1.5"
          >
            <span>View Sovereign Agency Docket</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Right: Full Legal Gazette Body */}
        <div className="lg:col-span-8 bg-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col justify-between min-h-[460px]">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Official Gazette Instrument Text
                </span>
              </div>
              <button
                onClick={handleCopyText}
                className="px-2.5 py-1 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied' : 'Copy Legal Text'}</span>
              </button>
            </div>

            <h3 className="text-lg font-bold text-white mb-2 leading-snug">
              {selectedBulletin.title}
            </h3>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300 mb-4">
              <strong className="text-sky-300 block mb-0.5">Executive Summary:</strong>
              {selectedBulletin.summary}
            </div>

            <div className="text-xs font-serif leading-relaxed text-slate-200 bg-black/40 p-4 rounded-xl border border-slate-800/80 max-h-64 overflow-y-auto whitespace-pre-line">
              {selectedBulletin.fullLegalText}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
            <span>Official Regulatory Reproduction • Non-Commercial Sovereign Public Record</span>
            <span className="text-emerald-400 font-semibold">100% Unaltered Ingestion Snapshot</span>
          </div>
        </div>
      </div>
    </div>
  );
};
