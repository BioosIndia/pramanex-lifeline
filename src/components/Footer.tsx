import React from 'react';
import { Activity, ShieldCheck, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                <Activity className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-white text-lg tracking-tight">
                PRAMANEX <span className="text-blue-400">LIFELINE</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Drug Shortage & Medicine Supply Intelligence Operating System. Transforming fragmented
              government shortage bulletins into source-linked, normalized, freshness-aware records.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Official Sovereign Feeds Grounded • Cryptographically Hashed</span>
            </div>
          </div>

          {/* Column 1: Platform */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">
              Intelligence Platform
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('search')} className="hover:text-white transition-colors">
                  Medicine Search Engine
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors">
                  Supply Command Center
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors">
                  Cross-Source Reconciliation
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors">
                  Source Cadence Monitor
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('consumer')} className="hover:text-white transition-colors">
                  Patient & Caregiver PWA
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Regulatory Sources */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">
              Monitored Authorities
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-1">
                <span>US FDA CDER</span>
                <span className="text-[10px] text-emerald-400">(Live 24h)</span>
              </li>
              <li className="flex items-center gap-1">
                <span>European Medicines Agency</span>
                <span className="text-[10px] text-emerald-400">(Live 24h)</span>
              </li>
              <li className="flex items-center gap-1">
                <span>Health Canada Registry</span>
                <span className="text-[10px] text-emerald-400">(Live 24h)</span>
              </li>
              <li className="flex items-center gap-1">
                <span>UK MHRA Alerts</span>
                <span className="text-[10px] text-emerald-400">(Live 24h)</span>
              </li>
              <li className="flex items-center gap-1">
                <span>Australian TGA MSI</span>
                <span className="text-[10px] text-emerald-400">(Live 24h)</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Trust & Governance */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">
              Governance & Safety
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('methodology')} className="hover:text-white transition-colors">
                  Evidence Methodology
                </button>
              </li>
              <li>
                <span className="text-slate-500">Uncertainty Principles</span>
              </li>
              <li>
                <span className="text-slate-500">Non-Prediction Policy</span>
              </li>
              <li>
                <span className="text-slate-500">No Substitution Guard</span>
              </li>
              <li>
                <span className="text-slate-500">Role-Based Access Control</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 PRAMANEX LIFELINE OS. All sovereign regulatory records preserved under immutable digest.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-300">Privacy Policy</span>
            <span className="hover:text-slate-300">Terms of Service</span>
            <span className="hover:text-slate-300">Security Architecture</span>
            <span className="hover:text-slate-300">Status Page</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
