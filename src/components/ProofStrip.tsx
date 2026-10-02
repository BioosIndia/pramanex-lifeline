import React from 'react';
import { ShieldCheck, Globe2, Clock, Users, FileCheck2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const ProofStrip: React.FC = () => {
  const { t } = useLanguage();

  const capabilities = [
    {
      icon: <Globe2 className="w-4 h-4 text-blue-600" />,
      label: t('proof.officialLinked'),
      desc: t('proof.officialLinkedDesc'),
    },
    {
      icon: <Clock className="w-4 h-4 text-sky-600" />,
      label: t('proof.freshnessVisible'),
      desc: t('proof.freshnessVisibleDesc'),
    },
    {
      icon: <ShieldCheck className="w-4 h-4 text-indigo-600" />,
      label: t('proof.jurisdictionAware'),
      desc: t('proof.jurisdictionAwareDesc'),
    },
    {
      icon: <Users className="w-4 h-4 text-purple-600" />,
      label: t('proof.humanGoverned'),
      desc: t('proof.humanGovernedDesc'),
    },
    {
      icon: <FileCheck2 className="w-4 h-4 text-emerald-600" />,
      label: 'Auditable Lineage',
      desc: 'Cryptographic SHA-256 snapshots & verifiable audit logs',
    },
  ];

  return (
    <section className="bg-slate-50 border-y border-slate-200/80 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold text-slate-400 uppercase tracking-wider mb-6">
          ✦ {t('hero.badge')} — Verified Regulatory Assurance
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
