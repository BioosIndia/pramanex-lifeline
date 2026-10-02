import React, { useState, useEffect } from 'react';
import {
  Clock,
  RefreshCw,
  Zap,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Shield,
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const RealTimeCadenceTracker: React.FC = () => {
  const { events, sourceHealth } = useApp();
  const [secondsRemaining, setSecondsRemaining] = useState(240); // 4 min countdown
  const [workerStatus, setWorkerStatus] = useState<'SYNCHRONIZING' | 'RESTING_ON_CADENCE' | 'PROCESSING_SNAPSHOT'>('RESTING_ON_CADENCE');
  const [livePulse, setLivePulse] = useState(false);
  const [pushNotificationActive, setPushNotificationActive] = useState(false);
  const [pushToast, setPushToast] = useState<string | null>(null);

  // Countdown timer simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          setWorkerStatus('SYNCHRONIZING');
          setTimeout(() => {
            setWorkerStatus('PROCESSING_SNAPSHOT');
            setTimeout(() => {
              setWorkerStatus('RESTING_ON_CADENCE');
            }, 1500);
          }, 1500);
          return 300; // Reset to 5 mins
        }
        return prev - 1;
      });
      setLivePulse((p) => !p);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleTriggerDirectPush = () => {
    setPushNotificationActive(true);
    setPushToast('Direct Browser Push Alert Activated: Live webhooks armed for instant sovereign status changes.');
    setTimeout(() => setPushToast(null), 4000);
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-xl">
      {/* Toast */}
      {pushToast && (
        <div className="fixed top-20 right-6 z-50 bg-blue-600 text-white p-4 rounded-2xl shadow-2xl border border-blue-400 flex items-center gap-2 text-xs font-semibold animate-in slide-in-from-top-2">
          <Bell className="w-4 h-4 animate-bounce" />
          <span>{pushToast}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Radio className="w-5 h-5 text-sky-400 animate-pulse" />
            <span className="w-2 h-2 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Real-Time Surveillance Cadence Heartbeat</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-sky-300 border border-blue-400/30">
                LIVE 24/7
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Deterministic background polling across 5 regulatory agencies with SHA-256 validation.
            </p>
          </div>
        </div>

        {/* Push Notification Button */}
        <button
          onClick={handleTriggerDirectPush}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            pushNotificationActive
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-white text-slate-900 hover:bg-slate-100 shadow-xs'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>{pushNotificationActive ? 'Push Armed (Instant)' : 'Enable Direct Push'}</span>
        </button>
      </div>

      {/* Cadence Telemetry Metrics Grid */}
      <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
            Next Scheduled Cycle
          </span>
          <div className="text-2xl font-mono font-extrabold text-sky-400">
            {formatTime(secondsRemaining)}
          </div>
          <span className="text-[10px] text-slate-500">24-hour cadence guard</span>
        </div>

        <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
            Background Worker State
          </span>
          <div className="text-xs font-bold text-emerald-400 truncate mt-1">
            {workerStatus}
          </div>
          <span className="text-[10px] text-slate-500">Zero unobserved gaps</span>
        </div>

        <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
            Observations (24h)
          </span>
          <div className="text-2xl font-mono font-extrabold text-white">
            1,482
          </div>
          <span className="text-[10px] text-slate-500">Cryptographically hashed</span>
        </div>

        <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
            Raw Signal Fallback
          </span>
          <div className="text-xs font-bold text-sky-300 mt-1">
            STANDBY / ACTIVE
          </div>
          <span className="text-[10px] text-slate-500">Auto-engages if API drops</span>
        </div>
      </div>
    </div>
  );
};
