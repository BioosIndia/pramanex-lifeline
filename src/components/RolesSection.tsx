import React from 'react';
import { UserCheck, Stethoscope, Building2, TrendingUp, ShieldAlert } from 'lucide-react';

interface RolesSectionProps {
  onSelectRoleAction: (role: string) => void;
}

export const RolesSection: React.FC<RolesSectionProps> = ({ onSelectRoleAction }) => {
  const roles = [
    {
      roleKey: 'consumer',
      title: 'Consumers & Patients',
      tagline: 'Search medicines with plain-language status and verified evidence.',
      icon: <UserCheck className="w-5 h-5 text-blue-600" />,
      bullets: [
        'Instant check of official national shortage bulletins',
        'Transparent freshness indicators so you know when data was updated',
        'Personal watchlists with source-backed change alerts',
        'Strict safety boundary: No therapeutic substitution advice'
      ],
      cta: 'Explore Patient View'
    },
    {
      roleKey: 'pharmacist',
      title: 'Hospital & Clinical Pharmacists',
      tagline: 'Track specific presentations, strengths, and authorized batch releases.',
      icon: <Stethoscope className="w-5 h-5 text-emerald-600" />,
      bullets: [
        'Disambiguation by strength, route, and package size',
        'Official authority mitigation notices and import discretions',
        'Cross-source discrepancy warnings (e.g., FDA vs Health Canada)',
        'Immediate presentation-level impact triage'
      ],
      cta: 'Launch Clinical Workspace'
    },
    {
      roleKey: 'mah_regulatory',
      title: 'MAH & Regulatory Officers',
      tagline: 'Multi-jurisdiction compliance and reporting readiness.',
      icon: <Building2 className="w-5 h-5 text-purple-600" />,
      bullets: [
        'Cryptographic audit trail with immutable SHA-256 snapshots',
        'Automated discrepancy alerts for shared API molecules',
        'Standardized regulatory packet compiler with export validation',
        'Human-in-the-loop triage and resolution rationale binding'
      ],
      cta: 'Open MAH Console'
    },
    {
      roleKey: 'supply_analyst',
      title: 'Supply Chain & Procurement',
      tagline: 'Synthesize global supply signals and upstream dependencies.',
      icon: <TrendingUp className="w-5 h-5 text-sky-600" />,
      bullets: [
        'Descriptive shortage duration and recurrence trends',
        'Interactive drug-to-manufacturing facility dependency maps',
        'Feed health and cadence monitoring across 14 agencies',
        'Controlled CSV/JSON export for ERP integration'
      ],
      cta: 'Open Command Center'
    }
  ];

  return (
    <section className="py-20 sm:py-28 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <span>✦ ROLES & WORKSPACES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Designed for different supply-intelligence users
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            A single verified evidence engine powering distinct, policy-governed workflows for
            patients, healthcare professionals, and regulatory teams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((r) => (
            <div
              key={r.roleKey}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-5 shadow-xs">
                  {r.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{r.title}</h3>
                <p className="text-xs text-slate-500 mb-5 leading-relaxed">{r.tagline}</p>

                <ul className="space-y-2.5 mb-6">
                  {r.bullets.map((b, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 leading-normal">
                      <span className="text-blue-500 font-bold shrink-0">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => onSelectRoleAction(r.roleKey)}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1"
              >
                <span>{r.cta}</span>
                <span>→</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
