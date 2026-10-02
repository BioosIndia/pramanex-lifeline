import React, { useState } from 'react';
import {
  Check,
  Zap,
  ShieldCheck,
  Building,
  Activity,
  Sparkles,
  Lock,
  ArrowRight,
  HelpCircle,
  Clock,
  Database,
  Cpu,
  FileText,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PricingPlan, SubscriptionTier } from '../types';
import { StripeCheckoutModal } from './StripeCheckoutModal';
import { ScrollReveal } from './ScrollReveal';

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'community',
    name: 'Community & Patient',
    tagline: 'For patients, caregivers, and independent community practitioners.',
    monthlyPrice: 0,
    annualPrice: 0,
    badge: 'FREE ESSENTIALS',
    features: [
      'Official sovereign medicine shortage search',
      'YouTube-style instant generic & brand autocomplete',
      'Up to 2 active medicine watchlists',
      'Standard 24-hour scheduled sync cadence',
      'Patient availability guides & safe storage advisory',
      'Read-only official government bulletins',
    ],
    exemptionsOrLimits: 'Consumer use only • No clinical sign-offs',
    ctaText: 'Current Free Tier',
    stripePriceIdMonth: 'price_free_community',
    stripePriceIdYear: 'price_free_community_annual',
  },
  {
    id: 'pharmacist_pro',
    name: 'Clinical Pharmacist Pro',
    tagline: 'For hospital pharmacists, dispensing leads, and outpatient health networks.',
    monthlyPrice: 249,
    annualPrice: 2388, // $199/mo
    popular: true,
    badge: 'MOST POPULAR FOR HOSPITALS',
    features: [
      'Everything in Community, plus:',
      'Up to 50 active monitored medicine watchlists',
      'Instant multi-channel dispatch (<60s of sovereign filing)',
      'Cross-Source Discrepancy & Reconciliation Matrix',
      'HL7 FHIR Ndh Shortage Resource export dossiers',
      'Interactive Supply Dependency Graph inspection',
      'Collaborative Clinical Annotations & Peer Triage',
      'Standard business hours clinical triage support',
    ],
    exemptionsOrLimits: 'Single hospital or regional pharmacy group',
    ctaText: 'Upgrade to Clinical Pro',
    stripePriceIdMonth: 'price_pharmacist_pro_monthly',
    stripePriceIdYear: 'price_pharmacist_pro_annual',
  },
  {
    id: 'enterprise_mah',
    name: 'Health System & MAH Enterprise',
    tagline: 'For Marketing Authorisation Holders (MAH), manufacturers, and hospital systems.',
    monthlyPrice: 980,
    annualPrice: 9480, // $790/mo
    badge: 'REGULATORY COMPLIANCE',
    features: [
      'Everything in Clinical Pro, plus:',
      'Unlimited watched medicines & national regulatory feeds',
      'Autonomous Multi-Agent AI Swarm (HITL Triage)',
      'F13 MAH Regulatory Reporting & Formal Sign-offs',
      'All compliance formats: FDA SPL XML, EMA SPOR JSON, WHO CSV',
      'Cryptographically sealed SHA-256 audit log export',
      'Continuous Webhook & Electronic Health Record API feeds',
      'Dedicated Account Pharmacist & 99.9% Uptime SLA',
    ],
    exemptionsOrLimits: 'Multi-hospital health network or pharmaceutical MAH',
    ctaText: 'Deploy Enterprise Node',
    stripePriceIdMonth: 'price_enterprise_mah_monthly',
    stripePriceIdYear: 'price_enterprise_mah_annual',
  },
  {
    id: 'sovereign_gov',
    name: 'Sovereign Regulatory & Gov',
    tagline: 'For national health authorities, ministries of health, and sovereign defense.',
    monthlyPrice: 4800,
    annualPrice: 46000,
    badge: 'INSTITUTIONAL LICENSE',
    features: [
      'Everything in Enterprise MAH, plus:',
      'Multi-territory direct ingestion pipeline syndication',
      'Confidential raw shortage signal early telemetry',
      'Air-gapped on-premises or sovereign cloud installation',
      'Custom national classification schema adapters',
      'Automated cross-border mutual recognition feeds',
      '24/7 dedicated clinical triage officer & hotline',
    ],
    exemptionsOrLimits: 'National government and sovereign healthcare authorities',
    ctaText: 'Request Sovereign License',
    stripePriceIdMonth: 'price_sovereign_monthly',
    stripePriceIdYear: 'price_sovereign_annual',
  },
];

export const PricingSection: React.FC = () => {
  const { profile } = useAuth();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('annual');
  const [selectedPlanForStripe, setSelectedPlanForStripe] = useState<PricingPlan | null>(null);
  const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);

  const handleSelectPlan = (plan: PricingPlan) => {
    if (plan.id === 'community') return;
    setSelectedPlanForStripe(plan);
    setIsStripeModalOpen(true);
  };

  return (
    <section id="pricing-section" className="py-20 sm:py-28 bg-slate-50 border-t border-slate-200/80 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-100/60 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <ScrollReveal direction="up" className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <CreditCard className="w-3.5 h-3.5" />
            <span>SAAS PRICING & STRIPE BILLING</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Transparent Tiered Pricing for Clinical & Enterprise Nodes
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Free access for essential public and patient searches. Institutional licenses
            unlock real-time multi-channel alerts, FHIR interoperability, and autonomous AI triage.
          </p>

          {/* Monthly / Annual Billing Toggle */}
          <div className="mt-8 inline-flex items-center p-1.5 bg-white rounded-full border border-slate-200 shadow-xs">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingPeriod('annual')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                billingPeriod === 'annual'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] font-extrabold bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-full">
                SAVE 20%
              </span>
            </button>
          </div>
        </ScrollReveal>

        {/* 4 Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {PRICING_PLANS.map((plan, idx) => {
            const isCurrent = (profile?.subscriptionTier || 'community') === plan.id;
            const price = billingPeriod === 'annual' ? Math.round(plan.annualPrice / 12) : plan.monthlyPrice;

            return (
              <ScrollReveal
                key={plan.id}
                direction="up"
                delay={idx * 0.1}
                className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all ${
                  plan.popular
                    ? 'bg-white border-2 border-blue-600 shadow-xl shadow-blue-500/10 ring-4 ring-blue-500/5'
                    : 'bg-white border border-slate-200/90 shadow-xs hover:border-slate-300'
                }`}
              >
                <div>
                  {/* Badge */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span
                      className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        plan.popular
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {plan.badge}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Active
                      </span>
                    )}
                  </div>

                  {/* Plan Name & Tagline */}
                  <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 min-h-[36px]">{plan.tagline}</p>

                  {/* Price Block */}
                  <div className="mt-5 pb-5 border-b border-slate-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-black text-slate-900">${price}</span>
                      <span className="text-xs text-slate-500">
                        {plan.monthlyPrice === 0 ? '' : '/month'}
                      </span>
                    </div>
                    {billingPeriod === 'annual' && plan.monthlyPrice > 0 && (
                      <p className="text-[11px] text-blue-600 font-medium mt-0.5">
                        ${plan.annualPrice} billed annually
                      </p>
                    )}
                    {plan.monthlyPrice === 0 && (
                      <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
                        Always free for individual consumers
                      </p>
                    )}
                  </div>

                  {/* Features List */}
                  <div className="mt-5 space-y-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Included Capabilities
                    </span>
                    <ul className="space-y-2 text-xs text-slate-700">
                      {plan.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                          <span className="leading-tight">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom CTA */}
                <div className="mt-8 pt-4 border-t border-slate-100">
                  <div className="text-[10px] text-slate-400 mb-2 truncate">
                    {plan.exemptionsOrLimits}
                  </div>
                  <button
                    onClick={() => handleSelectPlan(plan)}
                    disabled={plan.id === 'community'}
                    className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      plan.popular
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 active:scale-95'
                        : plan.id === 'community'
                        ? 'bg-slate-100 text-slate-500 cursor-default'
                        : 'bg-slate-900 hover:bg-black text-white active:scale-95'
                    }`}
                  >
                    <span>{isCurrent ? 'Current Plan' : plan.ctaText}</span>
                    {plan.id !== 'community' && <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Stripe Trust & Guarantees Strip */}
        <ScrollReveal direction="up" delay={0.2} className="mt-12 p-6 bg-white rounded-3xl border border-slate-200/90 shadow-2xs">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Stripe PCI-DSS Level 1</h4>
                <p className="text-[11px] text-slate-500">Bank-grade end-to-end tokenization</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">14-Day Money Back</h4>
                <p className="text-[11px] text-slate-500">No questions asked clinical guarantee</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Automatic Invoicing</h4>
                <p className="text-[11px] text-slate-500">Instant PDF receipts & Net 30 PO support</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Cancel Anytime</h4>
                <p className="text-[11px] text-slate-500">One-click immediate self-serve downgrade</p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Stripe Interactive Checkout Modal */}
      <StripeCheckoutModal
        isOpen={isStripeModalOpen}
        onClose={() => setIsStripeModalOpen(false)}
        selectedPlan={selectedPlanForStripe}
        billingPeriod={billingPeriod}
        onSuccessUpgrade={() => {
          // Closed by user inside modal when viewing upgraded workstation
        }}
      />
    </section>
  );
};
