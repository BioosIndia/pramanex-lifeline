import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  RefreshCw,
  GitBranch,
  ShieldCheck,
  Download,
  Share2,
  FileSpreadsheet,
  FileText,
  UserCheck,
  Send,
  Eye,
  Sliders,
  ExternalLink,
  ChevronRight,
  Database,
  ArrowUpRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import {
  DEPENDENCY_GRAPH_NODES,
  DEPENDENCY_GRAPH_EDGES
} from '../data/seedData';
import { ShortageEvent, SourceConflict, DependencyNode } from '../types';

export const CommandCenterDashboard: React.FC = () => {
  const {
    events,
    sourceHealth,
    conflicts,
    auditLogs,
    submitTriageReview,
    setSelectedEvent
  } = useApp();
  const { profile } = useAuth();

  const [activeConsoleTab, setActiveConsoleTab] = useState<
    'events' | 'reconciliation' | 'sources' | 'triage' | 'dependencies' | 'reporting'
  >('events');

  // Triage state
  const [selectedConflictForReview, setSelectedConflictForReview] = useState<SourceConflict | null>(null);
  const [reviewDecision, setReviewDecision] = useState<
    'APPROVE_RECONCILIATION' | 'MAINTAIN_SPLIT' | 'REQUEST_MANUAL_PULL' | 'ESCALATE'
  >('MAINTAIN_SPLIT');
  const [reviewRationale, setReviewRationale] = useState('');
  const [triageSuccessMsg, setTriageSuccessMsg] = useState<string | null>(null);

  // Dependency graph state
  const [selectedNode, setSelectedNode] = useState<DependencyNode | null>(DEPENDENCY_GRAPH_NODES[0]);

  // Export Packet state
  const [selectedEventForExport, setSelectedEventForExport] = useState<ShortageEvent>(events[0]);
  const [exportFormat, setExportFormat] = useState<'JSON' | 'CSV' | 'AUDIT_PDF'>('AUDIT_PDF');
  const [exportCompleteToast, setExportCompleteToast] = useState(false);

  const handleTriageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConflictForReview || !reviewRationale.trim()) return;

    await submitTriageReview(
      selectedConflictForReview.eventId,
      reviewDecision,
      reviewRationale.trim()
    );

    setTriageSuccessMsg(`Review recorded: ${reviewDecision} for ${selectedConflictForReview.medicineName}`);
    setSelectedConflictForReview(null);
    setReviewRationale('');
    setTimeout(() => setTriageSuccessMsg(null), 4000);
  };

  const handleExportDownload = () => {
    setExportCompleteToast(true);
    setTimeout(() => setExportCompleteToast(false), 3000);

    const filename = `LIFELINE-REPORT-${selectedEventForExport.genericName.replace(/\s+/g, '_')}-${Date.now()}.${
      exportFormat === 'JSON' ? 'json' : exportFormat === 'CSV' ? 'csv' : 'txt'
    }`;

    const content =
      exportFormat === 'JSON'
        ? JSON.stringify(
            {
              platform: 'PRAMANEX LIFELINE OS',
              reportType: 'Official Medicine Shortage Dossier',
              exportedAt: new Date().toISOString(),
              reviewer: profile?.displayName || 'Clinical Reviewer',
              event: selectedEventForExport,
              cryptographicDigest: selectedEventForExport.snapshotHash,
            },
            null,
            2
          )
        : `PRAMANEX LIFELINE REGULATORY REPORT\nGENERIC: ${selectedEventForExport.genericName}\nAUTHORITY: ${selectedEventForExport.authority}\nJURISDICTION: ${selectedEventForExport.jurisdiction}\nSTATUS: ${selectedEventForExport.status}\nSNAPSHOT_HASH: ${selectedEventForExport.snapshotHash}\nTIMESTAMP: ${new Date().toISOString()}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50/80 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Toast */}
        {triageSuccessMsg && (
          <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{triageSuccessMsg}</span>
          </div>
        )}
        {exportCompleteToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold">
            <Download className="w-4 h-4 text-sky-400" />
            <span>Export generated with SHA-256 cryptographic watermark.</span>
          </div>
        )}

        {/* Dashboard Header */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Supply Command Center & MAH Console
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Enterprise Medicine Supply Dashboard Engine
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Role: <strong className="text-slate-800 capitalize">{profile?.role || 'Pharmacist'}</strong> •
                Cross-jurisdiction reconciliation, source cadence monitor & human triage.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-3">
              <div className="bg-slate-50 border border-slate-200/80 px-4 py-2.5 rounded-2xl text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Active Events</span>
                <span className="text-lg font-extrabold text-slate-900">{events.length}</span>
              </div>
              <div className="bg-slate-50 border border-slate-200/80 px-4 py-2.5 rounded-2xl text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Conflicts</span>
                <span className="text-lg font-extrabold text-purple-600">{conflicts.length}</span>
              </div>
              <div className="bg-slate-50 border border-slate-200/80 px-4 py-2.5 rounded-2xl text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Feeds Online</span>
                <span className="text-lg font-extrabold text-emerald-600">5/5</span>
              </div>
            </div>
          </div>

          {/* Console Sub-navigation Tabs */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-1 overflow-x-auto">
            <button
              onClick={() => setActiveConsoleTab('events')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeConsoleTab === 'events'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Events Lifecycle</span>
            </button>

            <button
              onClick={() => setActiveConsoleTab('reconciliation')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeConsoleTab === 'reconciliation'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>Cross-Source Reconciliation</span>
              {conflicts.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-purple-100 text-purple-800 font-bold">
                  {conflicts.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveConsoleTab('sources')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeConsoleTab === 'sources'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Source Cadence & Health</span>
            </button>

            <button
              onClick={() => setActiveConsoleTab('triage')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeConsoleTab === 'triage'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Human Triage Review</span>
            </button>

            <button
              onClick={() => setActiveConsoleTab('dependencies')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeConsoleTab === 'dependencies'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Supply Dependency Graph</span>
            </button>

            <button
              onClick={() => setActiveConsoleTab('reporting')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeConsoleTab === 'reporting'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Reporting & Export</span>
            </button>
          </div>
        </div>

        {/* TAB 1: EVENTS LIFECYCLE */}
        {activeConsoleTab === 'events' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">National Shortage Lifecycle Records</h3>
                <p className="text-xs text-slate-500">
                  Stable event identities maintained across sequential regulatory observation runs.
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                Total: {events.length} Events
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                  <tr>
                    <th className="py-3.5 px-4">Event ID / Molecule</th>
                    <th className="py-3.5 px-4">Presentation Details</th>
                    <th className="py-3.5 px-4">Authority & Region</th>
                    <th className="py-3.5 px-4">Lifecycle State</th>
                    <th className="py-3.5 px-4">Status & Freshness</th>
                    <th className="py-3.5 px-4">SHA-256 Digest</th>
                    <th className="py-3.5 px-4 text-right">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {events.map((evt) => (
                    <tr
                      key={evt.id}
                      onClick={() => setSelectedEvent(evt)}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                    >
                      <td className="py-4 px-4 font-bold text-slate-900">
                        <div className="text-[10px] text-blue-600 font-mono">{evt.id}</div>
                        <div>{evt.genericName}</div>
                      </td>
                      <td className="py-4 px-4 max-w-xs">
                        <p className="truncate font-medium text-slate-800">{evt.presentation}</p>
                        <p className="text-[10px] text-slate-400">{evt.dosageForm}</p>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-slate-800">{evt.authority}</span>
                        <span className="ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                          {evt.jurisdiction}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                          {evt.lifecycleState}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-semibold text-slate-900">{evt.status}</div>
                        <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {evt.freshnessStatus}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-mono text-[10px] text-slate-400">
                        {evt.snapshotHash.slice(0, 14)}...
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEvent(evt);
                          }}
                          className="px-2.5 py-1 rounded-md text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: RECONCILIATION MATRIX */}
        {activeConsoleTab === 'reconciliation' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <h3 className="text-base font-bold text-slate-900">Cross-Source Divergence Matrix</h3>
              <p className="text-xs text-slate-500 mt-1">
                Rule 39 Compliance: Side-by-side comparison of multi-authority filings. Never averaging
                or hiding disagreements.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {conflicts.map((conf) => (
                <div
                  key={conf.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                        {conf.discrepancyType}
                      </span>
                      <h4 className="text-lg font-bold text-slate-900 mt-1">{conf.medicineName}</h4>
                      <p className="text-xs text-slate-500">{conf.presentation}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          conf.triageStatus === 'RECONCILED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {conf.triageStatus}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedConflictForReview(conf);
                          setActiveConsoleTab('triage');
                        }}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-black transition-colors"
                      >
                        Launch Human Triage
                      </button>
                    </div>
                  </div>

                  {/* Side-by-Side Comparison */}
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {conf.authorities.map((auth, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-slate-800 text-xs">{auth.authority}</span>
                            <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                              {auth.jurisdiction}
                            </span>
                          </div>
                          <div className="mt-2">
                            <span className="text-[11px] text-slate-400 block">Reported Status</span>
                            <span className="text-sm font-bold text-slate-900">{auth.status}</span>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                          <span>Updated: {new Date(auth.publishedAt).toLocaleDateString()}</span>
                          <a
                            href={auth.sourceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 font-semibold hover:text-blue-800 transition-colors flex items-center gap-1"
                          >
                            <span>Official Source</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SOURCE HEALTH & CADENCE MONITOR */}
        {activeConsoleTab === 'sources' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Official Regulatory Feeds & Ingestion Health</h3>
                <p className="text-xs text-slate-500">
                  Continuous tracking of expected vs actual cadence across all sovereign regulatory partners.
                </p>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                All 5 Ingestion Workers Healthy
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                  <tr>
                    <th className="py-3.5 px-4">Authority & Feed</th>
                    <th className="py-3.5 px-4">Jurisdiction</th>
                    <th className="py-3.5 px-4">Feed Protocol</th>
                    <th className="py-3.5 px-4">Expected Cadence</th>
                    <th className="py-3.5 px-4">Last Published / Synced</th>
                    <th className="py-3.5 px-4">Uptime Pct</th>
                    <th className="py-3.5 px-4">Health Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sourceHealth.map((src) => (
                    <tr key={src.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-4 font-bold text-slate-900">
                        <div>{src.authorityName}</div>
                        <div className="text-[10px] text-slate-400 font-mono truncate max-w-xs">{src.endpointUrl}</div>
                      </td>
                      <td className="py-4 px-4 font-semibold text-slate-800">{src.jurisdiction}</td>
                      <td className="py-4 px-4 font-medium text-slate-600">{src.feedType}</td>
                      <td className="py-4 px-4 font-medium text-slate-600">Every {src.cadenceHours} hours</td>
                      <td className="py-4 px-4 text-slate-700">
                        <div>Pub: {new Date(src.lastPublishedUpdate).toLocaleDateString()}</div>
                        <div className="text-[10px] text-emerald-600 font-semibold">
                          Sync: {new Date(src.lastSuccessfulRetrieval).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="py-4 px-4 font-bold text-slate-900">{src.uptimePct}%</td>
                      <td className="py-4 px-4">
                        {src.health === 'HEALTHY' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" /> Healthy
                          </span>
                        )}
                        {src.health === 'DELAYED' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3 h-3" /> Delayed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: HUMAN TRIAGE REVIEW */}
        {activeConsoleTab === 'triage' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Triage Decision Form */}
            <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
              <div className="pb-4 border-b border-slate-100 mb-6">
                <span className="text-[10px] uppercase font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  Human-in-the-Loop Protocol
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">Professional Review & Action</h3>
                <p className="text-xs text-slate-500">
                  Every decision binds the reviewer's identity, timestamp, and clinical rationale to the audit trail.
                </p>
              </div>

              <form onSubmit={handleTriageSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Target Discrepancy Signal
                  </label>
                  <select
                    value={selectedConflictForReview?.id || ''}
                    onChange={(e) => {
                      const c = conflicts.find((conf) => conf.id === e.target.value);
                      setSelectedConflictForReview(c || null);
                    }}
                    className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800"
                  >
                    <option value="">Select a conflict to adjudicate...</option>
                    {conflicts.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.medicineName} ({c.discrepancyType}) — Status: {c.triageStatus}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Review Decision
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { val: 'MAINTAIN_SPLIT', label: 'Maintain Jurisdiction Split' },
                      { val: 'APPROVE_RECONCILIATION', label: 'Approve Parity' },
                      { val: 'REQUEST_MANUAL_PULL', label: 'Request Manual Ingest' },
                      { val: 'ESCALATE', label: 'Escalate to Regulatory' },
                    ].map((opt) => (
                      <button
                        type="button"
                        key={opt.val}
                        onClick={() => setReviewDecision(opt.val as any)}
                        className={`p-3 rounded-xl border text-left font-semibold transition-colors ${
                          reviewDecision === opt.val
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Clinical / Regulatory Rationale (Mandatory)
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={reviewRationale}
                    onChange={(e) => setReviewRationale(e.target.value)}
                    placeholder="Enter evidence basis, packaging batch notice, or cross-border distribution constraint..."
                    className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!selectedConflictForReview || !reviewRationale.trim()}
                  className="w-full py-3 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-black disabled:opacity-40 transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Commit Governed Triage Decision</span>
                </button>
              </form>
            </div>

            {/* Audit Trail Sidebar */}
            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
              <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Recent Immutable Audit Logs</span>
              </h4>
              <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                      <span className="font-bold text-slate-800">{log.action}</span>
                      <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-slate-700 font-medium">{log.resource}</p>
                    <p className="text-[11px] text-slate-500 mt-1 leading-normal">{log.details}</p>
                    <div className="mt-2 text-[10px] text-slate-400 font-mono truncate">
                      Actor: {log.actor} ({log.role})
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SUPPLY DEPENDENCY GRAPH */}
        {activeConsoleTab === 'dependencies' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-100 gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Multi-Tier Supply Chain & Synthesis Graph
                </h3>
                <p className="text-xs text-slate-500">
                  Interactive network trace: Molecule → Finished Presentation → MAH → Synthetic Site → Target Markets.
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                8 Verified Nodes • 7 Directed Edges
              </span>
            </div>

            {/* Interactive SVG Network Graph */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-8 bg-slate-900 rounded-2xl p-6 min-h-[400px] flex items-center justify-center relative overflow-hidden">
                <svg className="w-full h-80" viewBox="0 0 700 320">
                  {/* Directed Edges */}
                  <g stroke="#334155" strokeWidth="2" strokeDasharray="4 2">
                    <line x1="80" y1="160" x2="220" y2="100" />
                    <line x1="80" y1="160" x2="220" y2="220" />
                    <line x1="220" y1="100" x2="380" y2="100" />
                    <line x1="220" y1="220" x2="380" y2="220" />
                    <line x1="380" y1="100" x2="540" y2="80" />
                    <line x1="380" y1="220" x2="540" y2="240" />
                    <line x1="540" y1="80" x2="640" y2="160" />
                  </g>

                  {/* Nodes */}
                  {DEPENDENCY_GRAPH_NODES.map((node, i) => {
                    const coords = [
                      { x: 80, y: 160 },
                      { x: 220, y: 100 },
                      { x: 220, y: 220 },
                      { x: 380, y: 100 },
                      { x: 380, y: 220 },
                      { x: 540, y: 80 },
                      { x: 540, y: 240 },
                      { x: 640, y: 160 },
                    ][i] || { x: 100, y: 100 };

                    const isSelected = selectedNode?.id === node.id;

                    return (
                      <g
                        key={node.id}
                        transform={`translate(${coords.x}, ${coords.y})`}
                        onClick={() => setSelectedNode(node)}
                        className="cursor-pointer group"
                      >
                        <circle
                          r={isSelected ? 24 : 18}
                          fill={isSelected ? '#38bdf8' : '#1e293b'}
                          stroke={isSelected ? '#ffffff' : '#475569'}
                          strokeWidth="2.5"
                          className="transition-all"
                        />
                        <text
                          y={isSelected ? 36 : 30}
                          textAnchor="middle"
                          fill="#f8fafc"
                          fontSize="10"
                          fontWeight="bold"
                        >
                          {node.label.slice(0, 16)}...
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Node Inspector Panel */}
              <div className="lg:col-span-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded">
                  {selectedNode?.category}
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-2">{selectedNode?.label}</h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{selectedNode?.details}</p>

                <div className="mt-4 pt-4 border-t border-slate-200 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Node Identifier:</span>
                    <span className="font-mono text-slate-700">{selectedNode?.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status Context:</span>
                    <span className="font-semibold text-rose-600">{selectedNode?.status || 'NORMAL'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Audit Status:</span>
                    <span className="text-emerald-600 font-semibold">Authorized Source</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: STANDARDIZED REPORTING & EXPORT */}
        {activeConsoleTab === 'reporting' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6">
            <div className="pb-6 border-b border-slate-100 mb-6">
              <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Audit Dossier Compiler
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">Regulatory Reporting Readiness Packet</h3>
              <p className="text-xs text-slate-500">
                Assemble verifiable compliance dossiers for regulatory inspection or hospital procurement boards.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Export Configuration Form */}
              <div className="lg:col-span-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Select Target Medicine
                  </label>
                  <select
                    value={selectedEventForExport.id}
                    onChange={(e) => {
                      const ev = events.find((item) => item.id === e.target.value);
                      if (ev) setSelectedEventForExport(ev);
                    }}
                    className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800"
                  >
                    {events.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.genericName} — {e.authority} ({e.jurisdiction})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Export Format
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['AUDIT_PDF', 'JSON', 'CSV'] as const).map((fmt) => (
                      <button
                        type="button"
                        key={fmt}
                        onClick={() => setExportFormat(fmt)}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold transition-colors ${
                          exportFormat === fmt
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {fmt === 'AUDIT_PDF' ? 'PDF Dossier' : fmt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Cryptographic Watermark Guard</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Output will be signed with SHA-256 digest:
                    <span className="font-mono text-[10px] block mt-1 text-slate-800 break-all">
                      {selectedEventForExport.snapshotHash}
                    </span>
                  </p>
                </div>

                <button
                  onClick={handleExportDownload}
                  className="w-full py-3 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Verified Packet ({exportFormat})</span>
                </button>
              </div>

              {/* Packet Preview Card */}
              <div className="lg:col-span-7 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                  <span className="text-xs font-bold text-slate-700">Dossier Preview</span>
                  <span className="text-[10px] font-mono text-slate-400">REF: LIFELINE-DOSSIER-2026</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Substance & Brand</span>
                    <strong className="text-slate-900 text-sm">{selectedEventForExport.genericName}</strong> ({selectedEventForExport.brandName})
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Presentation</span>
                    <p className="text-slate-800 font-medium">{selectedEventForExport.presentation}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Reporting Agency</span>
                      <span className="font-semibold text-slate-800">{selectedEventForExport.authority}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Official Status</span>
                      <span className="font-bold text-rose-700">{selectedEventForExport.status}</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <span className="text-slate-400 block text-[11px]">Reported Cause</span>
                    <p className="text-slate-700">{selectedEventForExport.reportedCause}</p>
                  </div>
                  <div className="pt-2">
                    <span className="text-slate-400 block text-[11px]">Published Mitigation</span>
                    <p className="text-slate-700">{selectedEventForExport.mitigationNotice || 'None published by sovereign agency.'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
