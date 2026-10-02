import React, { useState } from 'react';
import {
  Bot,
  Cpu,
  ShieldCheck,
  Zap,
  Play,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  GitBranch,
  ArrowRight,
  UserCheck,
  Send,
  Loader2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export interface AgentLog {
  id: string;
  agentName: string;
  model: string;
  role: string;
  action: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'PAUSED_HITL';
  thought: string;
  outputPayload?: string;
  timestamp: string;
}

export const AgentSwarmConsole: React.FC = () => {
  const { events, submitTriageReview } = useApp();
  const { profile } = useAuth();

  const [isRunning, setIsRunning] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [hitlDecision, setHitlDecision] = useState<string>('APPROVE_RECONCILIATION');
  const [hitlRationale, setHitlRationale] = useState<string>('');
  const [hitlCompleted, setHitlCompleted] = useState<boolean>(false);

  const [agentLogs, setAgentLogs] = useState<AgentLog[]>([
    {
      id: 'log-1',
      agentName: 'Agent Alpha — Source & Freshness Specialist',
      model: 'gemini-3.1-flash-lite',
      role: 'Source Surveillance & Cadence Decay',
      action: 'INGEST_REGULATORY_FEEDS',
      status: 'COMPLETED',
      thought: 'Fetched latest snapshots from 5 sovereign registries. Computed SHA-256 hashes. Cadence healthy (all <24h).',
      outputPayload: 'SHA256: e3b0c44298fc1c14... | 68 events observed.',
      timestamp: '10:14:02'
    },
    {
      id: 'log-2',
      agentName: 'Agent Beta — Identity & API Resolver',
      model: 'Deterministic Parser',
      role: 'Active Substance & Presentation Normalizer',
      action: 'NORMALIZE_MEDICINE_IDENTITY',
      status: 'COMPLETED',
      thought: 'Resolved Amoxicillin Trihydrate oral formulation (J01CA04) and Cefepime 2g injectable (J01DE01). Zero alias ambiguities.',
      outputPayload: 'Confidence: 99.8% | Standardized to WHO ATC taxonomy.',
      timestamp: '10:14:05'
    },
    {
      id: 'log-3',
      agentName: 'Agent Gamma — Cross-Source Reconciliation',
      model: 'Deterministic Parity Engine',
      role: 'Cross-Jurisdiction Divergence Inspector',
      action: 'DETECT_SOURCE_DISCREPANCIES',
      status: 'COMPLETED',
      thought: 'Flagged status split: US FDA marked Cefepime 2g as Resolved; Health Canada maintains Active Shortage.',
      outputPayload: 'STATUS_DIVERGENCE detected between US and CA filings.',
      timestamp: '10:14:08'
    },
    {
      id: 'log-4',
      agentName: 'Agent Delta — HITL Triage & Policy Gatekeeper',
      model: 'gemini-3.5-flash',
      role: 'Human-in-the-Loop Governance',
      action: 'AWAIT_HUMAN_AUTHORIZATION',
      status: 'PAUSED_HITL',
      thought: 'Cross-border divergence exceeds autonomous threshold. Paused execution pipeline. Awaiting authorized clinical human review.',
      outputPayload: 'DISPATCH_BLOCKED: Human authorization required before downstream alerts.',
      timestamp: '10:14:12'
    }
  ]);

  const runSwarmSurveillance = () => {
    setIsRunning(true);
    setActiveStep(1);
    setHitlCompleted(false);

    setTimeout(() => {
      setActiveStep(2);
    }, 1200);

    setTimeout(() => {
      setActiveStep(3);
    }, 2400);

    setTimeout(() => {
      setActiveStep(4);
      setIsRunning(false);
    }, 3600);
  };

  const handleCommitHitl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hitlRationale.trim()) return;

    await submitTriageReview(
      'evt-cefe-003',
      hitlDecision as any,
      hitlRationale.trim()
    );

    setHitlCompleted(true);
    setAgentLogs((prev) => [
      ...prev,
      {
        id: `log-${Date.now()}`,
        agentName: 'HITL Gatekeeper',
        model: 'Human Reviewer Authority',
        role: 'Authorized Regulatory Triage',
        action: `DECISION_${hitlDecision}`,
        status: 'COMPLETED',
        thought: `Human review committed by ${profile?.displayName || 'Clinical Lead'}: "${hitlRationale}". Audit trail updated.`,
        outputPayload: `Disposition: ${hitlDecision} | Alert dispatch unlocked.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      }
    ]);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-slate-100 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold uppercase tracking-wider mb-2">
            <Cpu className="w-3.5 h-3.5" />
            <span>AI MULTI-AGENT ORCHESTRATION SWARM</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Autonomous Surveillance with Human-in-the-Loop (HITL) Gate
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            4 bounded specialist agents operating under deterministic orchestration. Zero autonomous database overrides.
          </p>
        </div>

        {/* Trigger Button */}
        <button
          onClick={runSwarmSurveillance}
          disabled={isRunning}
          className="px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 active:scale-95 disabled:opacity-40"
        >
          {isRunning ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
              <span>Orchestrating Agent Swarm...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
              <span>Run Automated Surveillance Cycle</span>
            </>
          )}
        </button>
      </div>

      {/* 4 Agent Pipeline Cards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            agentNum: '01',
            title: 'Source & Freshness Specialist',
            model: 'gemini-3.1-flash-lite',
            duty: 'Raw Ingestion & Hash Audit',
            status: activeStep >= 1 ? 'ACTIVE / VERIFIED' : 'STANDBY',
            badgeColor: 'bg-blue-50 text-blue-700 border-blue-200'
          },
          {
            agentNum: '02',
            title: 'Identity & API Resolver',
            model: 'Deterministic Parser',
            duty: 'Active Substance Normalization',
            status: activeStep >= 2 ? 'ACTIVE / VERIFIED' : 'STANDBY',
            badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200'
          },
          {
            agentNum: '03',
            title: 'Parity Reconciliation Agent',
            model: 'Discrepancy Inspector',
            duty: 'Cross-Source Parity Check',
            status: activeStep >= 3 ? 'CONFLICT DETECTED' : 'STANDBY',
            badgeColor: 'bg-purple-50 text-purple-700 border-purple-200'
          },
          {
            agentNum: '04',
            title: 'HITL Policy Gatekeeper',
            model: 'gemini-3.5-flash',
            duty: 'Human Authorization Gate',
            status: hitlCompleted ? 'AUTHORIZED BY HUMAN' : 'PAUSED (AWAITING HITL)',
            badgeColor: hitlCompleted ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
          }
        ].map((ag, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-2xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-2">
                <span>AGENT {ag.agentNum}</span>
                <span className="font-mono">{ag.model}</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900">{ag.title}</h4>
              <p className="text-xs text-slate-500 mt-1">{ag.duty}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border inline-block ${ag.badgeColor}`}>
                {ag.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Human-in-the-Loop Adjudication Card */}
      <div className="mt-8 bg-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-600/30 text-rose-400 flex items-center justify-center border border-rose-500/40">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Human-in-the-Loop (HITL) Policy Gate</h3>
              <p className="text-xs text-slate-400">
                Rule 33 Compliance: Agent swarm detected cross-border discrepancy in Cefepime 2g. Human sign-off required.
              </p>
            </div>
          </div>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${
            hitlCompleted ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
          }`}>
            {hitlCompleted ? 'AUTHORIZATION COMMITTED' : 'PIPELINE PAUSED FOR HUMAN'}
          </span>
        </div>

        {hitlCompleted ? (
          <div className="p-4 bg-emerald-950/60 border border-emerald-800/80 rounded-2xl flex items-center gap-3 text-xs text-emerald-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <strong>Human Sign-off Complete:</strong> Reviewer {profile?.displayName || 'Dr. Rahul Dewangan'} approved the disposition. Downstream watchlist notifications have been released.
            </div>
          </div>
        ) : (
          <form onSubmit={handleCommitHitl} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Reviewer Disposition
                </label>
                <select
                  value={hitlDecision}
                  onChange={(e) => setHitlDecision(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-semibold text-white focus:outline-none"
                >
                  <option value="MAINTAIN_SPLIT">Maintain Jurisdiction Split (FDA Resolved vs Health Canada Shortage)</option>
                  <option value="APPROVE_RECONCILIATION">Approve Parity Harmonization</option>
                  <option value="REQUEST_MANUAL_PULL">Trigger Manual Source Ingestion Pull</option>
                  <option value="ESCALATE">Escalate to Regional Chief Pharmacist</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Clinical Rationale (Bound to Immutable Audit Record)
                </label>
                <input
                  type="text"
                  required
                  value={hitlRationale}
                  onChange={(e) => setHitlRationale(e.target.value)}
                  placeholder="e.g. Canadian domestic lot verification verified with primary synthetic site."
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="py-3 px-6 rounded-xl text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>Authorize & Resume Autonomous Swarm Pipeline</span>
            </button>
          </form>
        )}
      </div>

      {/* Real-time Agent Reasoning Logs */}
      <div className="mt-8">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Agent Swarm Telemetry & Thought Stream
        </h4>
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {agentLogs.map((log) => (
            <div
              key={log.id}
              className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs flex flex-col gap-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{log.agentName}</span>
                <span className="text-[10px] text-slate-400 font-mono">{log.timestamp}</span>
              </div>
              <p className="text-slate-700">{log.thought}</p>
              {log.outputPayload && (
                <div className="text-[10px] font-mono text-blue-700 bg-blue-50/60 p-1.5 rounded border border-blue-100 mt-1">
                  {log.outputPayload}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
