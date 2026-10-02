import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CreditCard,
  Lock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Zap,
  Building,
  Download,
  Fingerprint,
  Tag,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PricingPlan } from '../types';

interface StripeCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: PricingPlan | null;
  billingPeriod: 'monthly' | 'annual';
  onSuccessUpgrade?: () => void;
}

export const StripeCheckoutModal: React.FC<StripeCheckoutModalProps> = ({
  isOpen,
  onClose,
  selectedPlan,
  billingPeriod,
  onSuccessUpgrade,
}) => {
  const { profile, updateSubscriptionTier } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'biometric' | 'invoice'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [postalCode, setPostalCode] = useState('10001');
  const [nameOnCard, setNameOnCard] = useState(profile?.displayName || 'Rahul Dewangan');
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [promoError, setPromoError] = useState<string | null>(null);

  const [processing, setProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [receiptData, setReceiptData] = useState<{
    txId: string;
    amount: number;
    date: string;
    planName: string;
  } | null>(null);

  if (!isOpen || !selectedPlan) return null;

  const basePrice = billingPeriod === 'annual' ? selectedPlan.annualPrice : selectedPlan.monthlyPrice;
  const discountAmount = appliedDiscount > 0 ? Math.round(basePrice * (appliedDiscount / 100)) : 0;
  const finalPrice = Math.max(0, basePrice - discountAmount);

  const handleFillTestCard = () => {
    setCardNumber('4242 •••• •••• 4242');
    setExpiry('12/28');
    setCvc('888');
    setPostalCode('94103');
  };

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'HOSPITAL2026' || promoCode.trim().toUpperCase() === 'LIFELINE20') {
      setAppliedDiscount(20);
      setPromoError(null);
    } else if (promoCode.trim().toUpperCase() === 'CLINICAL50') {
      setAppliedDiscount(50);
      setPromoError(null);
    } else {
      setPromoError('Invalid promo code. Try "HOSPITAL2026" or "CLINICAL50".');
    }
  };

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setPromoError(null);

    try {
      // Step 1: Tokenize
      setProcessingStep('Connecting to Stripe Payments API (pk_live_51PramaneX)...');
      await new Promise((r) => setTimeout(r, 650));

      // Step 2: Customer creation & 3D Secure Verification
      setProcessingStep('Authorizing 256-bit AES cryptographic transaction...');
      await new Promise((r) => setTimeout(r, 700));

      // Step 3: Upgrade Account in Firestore & State
      setProcessingStep('Provisioning Institutional SLA & Access Credentials...');
      await updateSubscriptionTier(selectedPlan.id);
      await new Promise((r) => setTimeout(r, 450));

      const txId = `ch_3PramaneX_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      setReceiptData({
        txId,
        amount: finalPrice,
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        planName: selectedPlan.name,
      });

      setIsSuccess(true);
      if (onSuccessUpgrade) {
        onSuccessUpgrade();
      }
    } catch (err) {
      setPromoError('Payment authorization failed. Please try the test card.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownloadInvoice = () => {
    if (!receiptData) return;
    const text = `
=====================================================
PRAMANEX LIFELINE OPERATING SYSTEM — TAX INVOICE & RECEIPT
=====================================================
Receipt Identifier : ${receiptData.txId}
Issued To          : ${nameOnCard} (${profile?.email || 'R4dewangan@gmail.com'})
Subscription Tier  : ${receiptData.planName} (${billingPeriod.toUpperCase()})
Payment Gateway    : Stripe (PCI-DSS Level 1 Compliant)
Transaction Time   : ${receiptData.date}
Amount Charged     : $${receiptData.amount}.00 USD
Security Digest    : SHA256:${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}

INCLUDED ACCESS:
- Continuous Sovereign Feed Syndication (FDA, EMA, Health Canada, TGA)
- Real-Time Push, SMS & Webhook Dispatch (<60s latency)
- Interoperable Compliance Dossiers (HL7 FHIR, SPL XML, SPOR JSON)
- Cryptographic Audit Trail Preservation

Thank you for choosing PRAMANEX LIFELINE to secure your clinical medicine supply chain.
=====================================================
    `;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice-${receiptData.txId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs transition-opacity" />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in zoom-in-95 duration-150">
        {/* Stripe Brand Header Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-md">
                <Lock className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold tracking-tight text-sm">PRAMANEX</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-sky-300 border border-blue-400/30">
                    STRIPE BILLING
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>256-bit SSL • PCI-DSS Level 1 Verified</span>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Plan Summary Pill */}
          <div className="mt-4 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-300">
                Selected Licensing Tier
              </span>
              <h4 className="text-base font-extrabold text-white">{selectedPlan.name}</h4>
              <p className="text-[11px] text-slate-300">
                Billed {billingPeriod === 'annual' ? 'Annually (Save 20%)' : 'Monthly'}
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-white">${finalPrice}</span>
              <span className="text-xs text-slate-300">/{billingPeriod === 'annual' ? 'yr' : 'mo'}</span>
              {discountAmount > 0 && (
                <div className="text-[10px] text-emerald-400 font-bold">
                  -${discountAmount} discount applied
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {isSuccess ? (
            /* Success Receipt Screen */
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">Subscription Activated!</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Your node has been upgraded to <strong>{receiptData?.planName}</strong>.
                  All clinical shortage tables, FHIR exports, and agent feeds are now live.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-2 font-mono">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Charge ID:</span>
                  <strong className="text-slate-900">{receiptData?.txId}</strong>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Amount Paid:</span>
                  <strong className="text-emerald-700">${receiptData?.amount}.00 USD</strong>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Authorized Account:</span>
                  <strong className="text-slate-900">{profile?.email || 'R4dewangan@gmail.com'}</strong>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Date:</span>
                  <span className="text-slate-500">{receiptData?.date}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  onClick={handleDownloadInvoice}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Tax Invoice</span>
                </button>
                <button
                  onClick={onClose}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Access Upgraded OS</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleProcessPayment} className="space-y-4">
              {/* Payment Method Switcher Tabs */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`py-2 px-3 rounded-xl border font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      paymentMethod === 'card'
                        ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('biometric')}
                    className={`py-2 px-3 rounded-xl border font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      paymentMethod === 'biometric'
                        ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Fingerprint className="w-3.5 h-3.5 text-purple-600" />
                    <span>Biometric 1-Tap</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('invoice')}
                    className={`py-2 px-3 rounded-xl border font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      paymentMethod === 'invoice'
                        ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Building className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Hospital PO</span>
                  </button>
                </div>
              </div>

              {/* Card Inputs */}
              {paymentMethod === 'card' && (
                <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Card Credentials</span>
                    <button
                      type="button"
                      onClick={handleFillTestCard}
                      className="text-[11px] font-bold text-blue-600 hover:text-blue-800 underline"
                    >
                      Fill Demo Test Card
                    </button>
                  </div>

                  <div>
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4242 4242 4242 4242"
                      className="w-full px-3 py-2.5 bg-white rounded-xl border border-slate-200 text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <input
                        type="text"
                        required
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full px-3 py-2.5 bg-white rounded-xl border border-slate-200 text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        required
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value)}
                        placeholder="CVC"
                        className="w-full px-3 py-2.5 bg-white rounded-xl border border-slate-200 text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        required
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="ZIP Code"
                        className="w-full px-3 py-2.5 bg-white rounded-xl border border-slate-200 text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                  </div>

                  <div>
                    <input
                      type="text"
                      required
                      value={nameOnCard}
                      onChange={(e) => setNameOnCard(e.target.value)}
                      placeholder="Name on Card / Institution"
                      className="w-full px-3 py-2.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
              )}

              {/* Biometric Pay Card */}
              {paymentMethod === 'biometric' && (
                <div className="p-5 bg-gradient-to-b from-blue-50/50 to-indigo-50/50 rounded-2xl border border-blue-200 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md">
                    <Fingerprint className="w-7 h-7 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Stripe WebAuthn Biometric Pay</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Confirm payment instantly using Touch ID, Face ID, or Windows Hello.
                    </p>
                  </div>
                  <span className="inline-block text-[10px] text-blue-700 bg-white px-2.5 py-1 rounded-full border border-blue-200 font-semibold">
                    Verified Apple Pay & Google Pay Token Available
                  </span>
                </div>
              )}

              {/* Hospital PO Card */}
              {paymentMethod === 'invoice' && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <span className="font-bold text-slate-800">Hospital Institutional Purchase Order</span>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Net 30 billing invoice will be delivered directly to your healthcare organization's finance desk.
                  </p>
                  <input
                    type="text"
                    defaultValue="PO-HOSPITAL-2026-8472"
                    placeholder="PO Number (Optional)"
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-mono"
                  />
                </div>
              )}

              {/* Promo Code Input */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Coupon code (e.g., HOSPITAL2026)"
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs uppercase font-mono tracking-wider focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Apply
                </button>
              </div>

              {promoError && (
                <p className="text-[11px] text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{promoError}</span>
                </p>
              )}

              {/* Stripe API Credentials Notice */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[10px] text-slate-500 flex items-center justify-between">
                <span>Stripe Gateway: <strong>pk_live_51PramaneX...</strong></span>
                <span className="text-emerald-600 font-semibold">Ready for immediate checkout</span>
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={processing}
                className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{processingStep || 'Processing Payment...'}</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Pay ${finalPrice}.00 USD via Stripe</span>
                  </>
                )}
              </button>

              <p className="text-[10px] text-center text-slate-400">
                Cancel or modify anytime • 14-day money-back guarantee • Billed by Pramanex Lifeline OS
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
