import React, { useState, useEffect, useRef } from 'react';
import { Layers, ShieldCheck, Cpu, RefreshCw, Eye, Sparkles } from 'lucide-react';

export const Architecture3D: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState<number>(0);
  const [rotationAngle, setRotationAngle] = useState(15);
  const [isRotating, setIsRotating] = useState(true);

  useEffect(() => {
    if (!isRotating) return;
    const interval = setInterval(() => {
      setRotationAngle((prev) => (prev + 0.3) % 360);
    }, 40);
    return () => clearInterval(interval);
  }, [isRotating]);

  const layers = [
    {
      id: 'l1',
      title: 'Layer 1: Official Regulatory Feeds',
      role: 'Source Ingestion',
      description: 'Automated retrieval from FDA, EMA SPOR, Health Canada, UK MHRA, and Australian TGA registries under verified cadence.',
      nodes: ['FDA CDER Feed', 'EMA Shortages', 'Health Canada API', 'TGA MSI Portal', 'MHRA RSS Alerts'],
      color: 'from-blue-600 to-indigo-700',
    },
    {
      id: 'l2',
      title: 'Layer 2: Cryptographic Snapshot & Hashing',
      role: 'Immutable Preservation',
      description: 'Every observation generates an immutable SHA-256 snapshot to guarantee zero retroactive tampering.',
      nodes: ['Raw Payload Cache', 'SHA-256 Hash Digest', 'Schema Validation', 'Failure Handler'],
      color: 'from-sky-600 to-cyan-700',
    },
    {
      id: 'l3',
      title: 'Layer 3: Identity & Presentation Normalizer',
      role: 'Deterministic Disambiguation',
      description: 'Maps trade names and packaging codes to canonical active substances, routes of administration, and pack sizes.',
      nodes: ['ATC Code Index', 'Strength & Form Parser', 'NDC/DIN Mapping', 'Alias Resolution'],
      color: 'from-indigo-600 to-purple-700',
    },
    {
      id: 'l4',
      title: 'Layer 4: Reconciliation & Freshness Engine',
      role: 'Multi-Source Parity',
      description: 'Monitors time-since-retrieval against expected publication cadence and flags cross-jurisdiction status divergence.',
      nodes: ['Freshness Decay Math', 'Divergence Detector', 'Conflict Aggregator', 'Triage Queue Dispatch'],
      color: 'from-violet-600 to-pink-700',
    },
    {
      id: 'l5',
      title: 'Layer 5: Governed Action & Distribution',
      role: 'Human-in-the-Loop Delivery',
      description: 'Pushes deduplicated consumer alerts, equips clinicians with evidence drawers, and prepares regulatory packets.',
      nodes: ['Consumer Watchlist', 'Human Review Queue', 'Reporting Packet Compiler', 'Audit Log Append'],
      color: 'from-emerald-600 to-teal-700',
    },
  ];

  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background ambient mesh */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-sky-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive 3D Pipeline Visualizer</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Cryptographic Medicine Supply Intelligence Architecture
          </h2>
          <p className="mt-3 text-slate-300 text-sm sm:text-base">
            Inspect how raw official regulatory notices are ingested, hashed, normalized, reconciled,
            and transformed into verified clinical records.
          </p>
        </div>

        {/* 3D Stack / Interactive Canvas Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* 3D Perspective Visualizer */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 sm:p-10 bg-slate-950/60 rounded-3xl border border-slate-800 shadow-2xl relative min-h-[380px]">
            {/* Visualizer Controls */}
            <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
              <button
                onClick={() => setIsRotating(!isRotating)}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                  isRotating ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
                <span>{isRotating ? 'Auto Orbit' : 'Paused'}</span>
              </button>
            </div>

            {/* Pseudo-3D Isometric Stack */}
            <div
              className="relative w-full max-w-md h-72 flex items-center justify-center transition-transform duration-700 ease-out"
              style={{
                perspective: '1000px',
              }}
            >
              {layers.map((layer, index) => {
                const isActive = activeLayer === index;
                const offsetZ = (index - 2) * 45;
                const offsetY = (index - 2) * -28;
                const tilt = Math.sin((rotationAngle + index * 40) * (Math.PI / 180)) * 8;

                return (
                  <div
                    key={layer.id}
                    onClick={() => setActiveLayer(index)}
                    className={`absolute w-72 sm:w-80 h-28 rounded-2xl p-4 cursor-pointer transition-all duration-300 border flex flex-col justify-between shadow-xl ${
                      isActive
                        ? `bg-gradient-to-r ${layer.color} border-white text-white ring-4 ring-sky-400/50 scale-105 z-30`
                        : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300 z-10'
                    }`}
                    style={{
                      transform: `rotateX(52deg) rotateZ(${-25 + tilt}deg) translateY(${offsetY}px) translateZ(${offsetZ}px)`,
                      boxShadow: isActive ? '0 25px 50px -12px rgba(56, 189, 248, 0.35)' : 'none',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold tracking-wider uppercase opacity-80">
                        {layer.role}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/30">
                        L0{index + 1}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold truncate">{layer.title}</h4>
                      <p className="text-[10px] opacity-75 truncate">{layer.nodes.join(' • ')}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-xs text-slate-400 mt-4 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-sky-400" />
              <span>Click any platform layer to inspect technical pipeline telemetry</span>
            </p>
          </div>

          {/* Layer Detail Inspector Card */}
          <div className="lg:col-span-5 bg-slate-800/90 rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-xl flex flex-col justify-between min-h-[380px]">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/20 text-sky-300 border border-blue-400/30">
                  {layers[activeLayer].role}
                </span>
                <span className="text-xs text-slate-400">Step 0{activeLayer + 1} of 05</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {layers[activeLayer].title}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                {layers[activeLayer].description}
              </p>

              <div>
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                  Pipeline Sub-components & Nodes
                </h5>
                <div className="grid grid-cols-2 gap-2">
                  {layers[activeLayer].nodes.map((node, i) => (
                    <div
                      key={i}
                      className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-700/80 text-xs text-slate-200 flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                      <span className="truncate">{node}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Layer Switching Navigation */}
            <div className="pt-6 border-t border-slate-700/80 flex items-center justify-between mt-6">
              <button
                disabled={activeLayer === 0}
                onClick={() => setActiveLayer((prev) => Math.max(0, prev - 1))}
                className="px-3 py-1.5 text-xs rounded-lg font-medium text-slate-300 hover:text-white bg-slate-700/60 disabled:opacity-40"
              >
                ← Previous
              </button>
              <div className="flex gap-1.5">
                {layers.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveLayer(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      activeLayer === i ? 'bg-sky-400 w-6' : 'bg-slate-600'
                    }`}
                  />
                ))}
              </div>
              <button
                disabled={activeLayer === layers.length - 1}
                onClick={() => setActiveLayer((prev) => Math.min(layers.length - 1, prev + 1))}
                className="px-3 py-1.5 text-xs rounded-lg font-medium text-slate-300 hover:text-white bg-slate-700/60 disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
