import React, { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Mail,
  Smartphone,
  Sliders,
  Send,
  ShieldAlert,
  Zap,
  Check,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ShortageEvent } from '../types';

export const ShortageAlertEngine: React.FC = () => {
  const { events, notifications, setSelectedEvent, isWatched, toggleWatchlist } = useApp();
  const { currentUser, profile } = useAuth();
  const { t } = useLanguage();

  const [selectedMedicineId, setSelectedMedicineId] = useState<string>(events[0]?.id || '');
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyInApp, setNotifyInApp] = useState(true);
  const [triggerCriticalOnly, setTriggerCriticalOnly] = useState(false);
  const [frequency, setFrequency] = useState<'INSTANT' | 'DAILY_DIGEST'>('INSTANT');
  const [subscribedToast, setSubscribedToast] = useState<string | null>(null);
  const [simulatedAlertToast, setSimulatedAlertToast] = useState<{ title: string; message: string } | null>(null);

  const selectedEvent = events.find((e) => e.id === selectedMedicineId) || events[0];

  const handleSubscribeAlert = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribedToast(
      `Alert active for ${selectedEvent.genericName}! Updates routed to ${
        profile?.email || 'R4dewangan@gmail.com'
      } via ${frequency === 'INSTANT' ? 'Instant Dispatch' : 'Daily Digest'}.`
    );
    setTimeout(() => setSubscribedToast(null), 4500);
  };

  const handleSimulateAlertDispatch = () => {
    const sampleAlerts = [
      {
        title: 'URGENT: US FDA Shortage Declared for Amoxicillin Oral',
        message: 'US FDA published a new status observation. High demand and sterile packaging constraints noted.',
      },
      {
        title: 'CONFLICT: Cefepime 2g Split Between FDA and Health Canada',
        message: 'Status divergence detected. FDA marked Resolved, while Health Canada maintains Active Shortage.',
      },
      {
        title: 'RECOVERY: Salbutamol Inhaler Marked Resolved by UK MHRA',
        message: 'Supply constraint cleared. NHS commercial ordering channels restored.',
      }
    ];

    const chosen = sampleAlerts[Math.floor(Math.random() * sampleAlerts.length)];
    setSimulatedAlertToast(chosen);
    setTimeout(() => setSimulatedAlertToast(null), 5000);
  };

  return (
    <section id="alerts-section" className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200/80">
      {/* Dynamic Alert Banner Toast */}
      {simulatedAlertToast && (
        <div className="fixed top-20 right-6 z-50 max-w-sm bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-700 animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs mb-1">
            <AlertTriangle className="w-4 h-4 animate-bounce" />
            <span>LIVE SHORTAGE SIGNAL DISPATCHED</span>
          </div>
          <h4 className="text-xs font-bold text-white">{simulatedAlertToast.title}</h4>
          <p className="text-[11px] text-slate-300 mt-1">{simulatedAlertToast.message}</p>
        </div>
      )}

      {subscribedToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-emerald-950 text-emerald-100 p-4 rounded-2xl shadow-2xl border border-emerald-800 flex items-center gap-3 text-xs animate-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{subscribedToast}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-2">
            <Zap className="w-3.5 h-3.5" />
            <span>REAL-TIME SHORTAGE ALERT ENGINE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t('alerts.title')}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600">
            {t('alerts.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Alert Subscription Configuration Card */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">Configure Shortage Watcher</h3>
                <p className="text-xs text-slate-500">Subscribe for verified status transition triggers</p>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Zero Notification Fatigue
              </span>
            </div>

            <form onSubmit={handleSubscribeAlert} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Target Medicine to Watch
                </label>
                <select
                  value={selectedMedicineId}
                  onChange={(e) => setSelectedMedicineId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800"
                >
                  {events.map((evt) => (
                    <option key={evt.id} value={evt.id}>
                      {evt.genericName} ({evt.presentation}) — {evt.authority} [{evt.status}]
                    </option>
                  ))}
                </select>
              </div>

              {/* Alert Channels */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Notification Delivery Channels
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setNotifyEmail(!notifyEmail)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                      notifyEmail
                        ? 'bg-blue-50/80 border-blue-400 text-blue-900'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    <Mail className="w-4 h-4 text-blue-600" />
                    <div>
                      <div className="text-xs font-bold">Email Alerts</div>
                      <div className="text-[10px] opacity-75 truncate">
                        {profile?.email || 'R4dewangan@gmail.com'}
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => setNotifyInApp(!notifyInApp)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                      notifyInApp
                        ? 'bg-blue-50/80 border-blue-400 text-blue-900'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    <Bell className="w-4 h-4 text-blue-600" />
                    <div>
                      <div className="text-xs font-bold">In-App Notification</div>
                      <div className="text-[10px] opacity-75">Bell badge & notification tray</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Frequency selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Delivery Frequency
                </label>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => setFrequency('INSTANT')}
                    className={`p-3 rounded-xl border text-left font-semibold transition-colors ${
                      frequency === 'INSTANT'
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Instant Dispatch (&lt;60s of Filing)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFrequency('DAILY_DIGEST')}
                    className={`p-3 rounded-xl border text-left font-semibold transition-colors ${
                      frequency === 'DAILY_DIGEST'
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Daily Morning Digest (08:00 UTC)
                  </button>
                </div>
              </div>

              {/* Action */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="w-full sm:flex-1 py-3 px-6 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
                >
                  <Bell className="w-4 h-4" />
                  <span>{t('alerts.activateBtn')} ({selectedEvent.genericName})</span>
                </button>
                <button
                  type="button"
                  onClick={handleSimulateAlertDispatch}
                  className="w-full sm:w-auto py-3 px-4 rounded-xl text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5"
                  title="Test alert dispatch webhook simulator"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
                  <span>{t('alerts.testBtn')}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Active Live Alerts Stream */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>Recent Official Signals Dispatched</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">LIVE FEED</span>
            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900">{n.title}</span>
                    <span className="text-[10px] text-slate-400 shrink-0 font-medium">{n.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-normal">{n.message}</p>
                  <div className="mt-2 flex items-center gap-2 text-[10px] text-blue-600 font-semibold">
                    <span>Verified Authority Event</span>
                    <span>•</span>
                    <span>Snapshot Linked</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
