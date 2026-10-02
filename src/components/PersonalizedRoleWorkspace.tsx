import React, { useState } from 'react';
import {
  ShieldCheck,
  Stethoscope,
  Building,
  TrendingUp,
  Settings,
  UserCheck,
  Activity,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Clock,
  ExternalLink,
  Lock,
  Layers,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { CollaborativeAnnotationsPanel } from './CollaborativeAnnotationsPanel';
import { OfficialBulletinsViewer } from './OfficialBulletinsViewer';
import { GlobalSupplyMap } from './GlobalSupplyMap';
import { AgentSwarmConsole } from './AgentSwarmConsole';
import { ExportReportingView } from './ExportReportingView';

export const PersonalizedRoleWorkspace: React.FC = () => {
  const { profile, switchRole } = useAuth();
  const { events, conflicts, sourceHealth, auditLogs, setSelectedEvent } = useApp();

  const currentRole: UserRole = profile?.role || 'pharmacist';

  return (
    <div className="space-y-8">
      {/* Persona Header & Dynamic Quick Switcher */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              DYNAMIC ROLE-TAILORED PERSONALIZATION
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Active Workspace: <span className="text-blue-600 capitalize">{currentRole.replace('_', ' ')}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Interface components, data density, and governance actions adapt specifically to your authorized responsibilities.
          </p>
        </div>

        {/* Quick Role Persona Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl">
          {[
            { r: 'consumer', label: 'Patient / Consumer', icon: <UserCheck className="w-3.5 h-3.5" /> },
            { r: 'pharmacist', label: 'Hospital Pharmacist', icon: <Stethoscope className="w-3.5 h-3.5" /> },
            { r: 'mah_regulatory', label: 'MAH Regulatory', icon: <Building className="w-3.5 h-3.5" /> },
            { r: 'supply_analyst', label: 'Supply Chain', icon: <TrendingUp className="w-3.5 h-3.5" /> },
            { r: 'admin', label: 'System Admin', icon: <Settings className="w-3.5 h-3.5" /> },
          ].map((item) => (
            <button
              key={item.r}
              onClick={() => switchRole(item.r as UserRole)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentRole === item.r
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 1. CONSUMER / PATIENT VIEW */}
      {currentRole === 'consumer' && (
        <div className="space-y-6">
          <div className="p-5 bg-blue-50 border border-blue-200 rounded-3xl text-xs text-blue-900 leading-relaxed flex items-start gap-3">
            <UserCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-sm font-bold mb-1">Patient Transparency Portal</strong>
              You are viewing plain-language official shortage notices. Complex MAH compliance sign-offs,
              raw batch numbers, and supply procurement contracts are strictly hidden to ensure clarity.
              Always consult your doctor or pharmacist if your prescription is unavailable.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.slice(0, 6).map((e) => (
              <div
                key={e.id}
                onClick={() => setSelectedEvent(e)}
                className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">
                    {e.jurisdiction} • {e.authority}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1">{e.genericName}</h3>
                  <p className="text-xs text-slate-500 font-medium">{e.brandName}</p>
                  <p className="text-xs text-slate-700 bg-slate-50 p-2 rounded-xl border border-slate-100 mt-3 truncate">
                    {e.presentation}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span
                    className={`font-bold text-[10px] px-2 py-0.5 rounded ${
                      e.status === 'SHORTAGE_DECLARED'
                        ? 'bg-rose-50 text-rose-700'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    {e.status}
                  </span>
                  <span className="text-blue-600 font-semibold text-[11px]">View Guidance →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. HOSPITAL PHARMACIST WORKSPACE */}
      {currentRole === 'pharmacist' && (
        <div className="space-y-8">
          {/* Priority Critical Care Injectables */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-emerald-600" />
              <span>Hospital Critical Care & Sterile Injectables Queue</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Priority formulation triage for inpatient wards, ICUs, and oncology compounding centers.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {events
                .filter((e) => e.dosageForm.toLowerCase().includes('inject') || e.dosageForm.toLowerCase().includes('susp'))
                .slice(0, 3)
                .map((e) => (
                  <div key={e.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <span className="text-[10px] font-bold uppercase text-slate-400">{e.authority}</span>
                    <h4 className="text-sm font-bold text-slate-900">{e.genericName}</h4>
                    <p className="text-xs text-slate-600 truncate mt-1">{e.presentation}</p>
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        {e.status}
                      </span>
                      <span className="text-emerald-700 text-[10px] font-semibold">Lot Release Active</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Collaborative Annotations Panel */}
          <CollaborativeAnnotationsPanel />
        </div>
      )}

      {/* 3. MAH & REGULATORY LEAD WORKSPACE */}
      {currentRole === 'mah_regulatory' && (
        <div className="space-y-8">
          {/* Mandatory Sign-offs Queue */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-purple-400" />
                <h3 className="text-base font-bold text-white">Mandatory MAH Regulatory Sign-Off Docket</h3>
              </div>
              <span className="text-xs font-bold text-purple-300 bg-purple-500/20 px-2.5 py-1 rounded-full border border-purple-400/30">
                {conflicts.length} Pending Actions
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              F13 Governance Contract: Only authenticated MAH Regulatory Leads and Chief Pharmacists are authorized
              to sign off on multi-jurisdiction divergence packages before downstream submission.
            </p>

            <div className="space-y-3">
              {conflicts.map((c) => (
                <div key={c.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-purple-400 uppercase">{c.discrepancyType}</span>
                    <h4 className="text-sm font-bold text-white mt-0.5">{c.medicineName}</h4>
                    <p className="text-xs text-slate-400">{c.presentation}</p>
                  </div>
                  <button className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors">
                    Review & Authorize
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Official Sovereign Bulletins Viewer */}
          <OfficialBulletinsViewer />
        </div>
      )}

      {/* 4. SUPPLY CHAIN & PROCUREMENT WORKSPACE */}
      {currentRole === 'supply_analyst' && (
        <div className="space-y-8">
          <GlobalSupplyMap />
          <ExportReportingView />
        </div>
      )}

      {/* 5. SYSTEM ADMINISTRATOR WORKSPACE */}
      {currentRole === 'admin' && (
        <div className="space-y-8">
          {/* Feed Health Monitor */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Settings className="w-4 h-4 text-slate-700" />
              <span>Sovereign Feed Infrastructure & Automated Health Telemetry</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Real-time surveillance of scheduled scraping workers, API endpoints, and immutable SHA-256 snapshot archives.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {sourceHealth.map((s) => (
                <div key={s.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 block">{s.jurisdiction}</span>
                  <strong className="text-xs text-slate-900 block truncate">{s.authorityName}</strong>
                  <div className="mt-2 flex items-center justify-between text-[10px]">
                    <span className="text-emerald-600 font-bold">{s.uptimePct}% Uptime</span>
                    <span className="font-mono text-slate-500">{s.cadenceHours}h Cadence</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <AgentSwarmConsole />
        </div>
      )}
    </div>
  );
};
