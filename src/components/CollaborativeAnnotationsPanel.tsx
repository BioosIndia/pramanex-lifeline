import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Shield,
  Tag,
  CheckCircle2,
  Lock,
  Users,
  Building,
  User,
  CornerDownRight,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { INITIAL_ANNOTATIONS } from '../data/seedData';
import { CollaborativeAnnotation, UserRole } from '../types';

export const CollaborativeAnnotationsPanel: React.FC = () => {
  const { events } = useApp();
  const { profile } = useAuth();

  const [annotations, setAnnotations] = useState<CollaborativeAnnotation[]>(INITIAL_ANNOTATIONS);
  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || '');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newVisibility, setNewVisibility] = useState<'CLINICAL_INTERNAL' | 'HOSPITAL_WIDE' | 'MAH_CONFIDENTIAL'>('CLINICAL_INTERNAL');
  const [newTagInput, setNewTagInput] = useState('Emergency Reserve');
  const [replyInput, setReplyInput] = useState<{ [annId: string]: string }>({});
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const currentEvent = events.find((e) => e.id === selectedEventId) || events[0];
  const eventAnnotations = annotations.filter((a) => a.eventId === currentEvent.id);

  const handleAddAnnotation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;

    const newAnnotation: CollaborativeAnnotation = {
      id: `ann-${Date.now()}`,
      eventId: currentEvent.id,
      medicineName: currentEvent.genericName,
      authorId: profile?.uid || 'usr-current',
      authorName: profile?.displayName || 'Dr. Rahul Dewangan',
      authorRole: profile?.role || 'pharmacist',
      content: newNoteContent.trim(),
      visibility: newVisibility,
      tags: newTagInput ? [newTagInput] : ['Clinical'],
      createdAt: new Date().toISOString(),
      status: 'OPEN',
      replies: []
    };

    setAnnotations([newAnnotation, ...annotations]);
    setNewNoteContent('');
    setToastMsg('Collaborative annotation added and bound to clinical docket.');
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleAddReply = (annId: string) => {
    const text = replyInput[annId];
    if (!text || !text.trim()) return;

    setAnnotations((prev) =>
      prev.map((a) => {
        if (a.id === annId) {
          const replies = a.replies || [];
          return {
            ...a,
            replies: [
              ...replies,
              {
                id: `rep-${Date.now()}`,
                authorName: profile?.displayName || 'Dr. Rahul Dewangan',
                authorRole: profile?.role || 'pharmacist',
                content: text.trim(),
                createdAt: new Date().toISOString()
              }
            ]
          };
        }
        return a;
      })
    );

    setReplyInput({ ...replyInput, [annId]: '' });
    setToastMsg('Peer response posted.');
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleToggleResolve = (annId: string) => {
    setAnnotations((prev) =>
      prev.map((a) =>
        a.id === annId ? { ...a, status: a.status === 'OPEN' ? 'RESOLVED' : 'OPEN' } : a
      )
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-slate-100 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-2">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>REAL-TIME COLLABORATIVE ANNOTATION & PEER TRIAGE</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Institutional Clinical Notes & Regulatory Discussions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Share internal hospital pharmacy mitigations, MAH compliance status, and batch reserves under strict access tiers.
          </p>
        </div>

        {/* Medicine Selector */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Focus Medicine
          </label>
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
          >
            {events.map((e) => (
              <option key={e.id} value={e.id}>
                {e.genericName} ({e.presentation}) — {e.authority}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* New Annotation Form */}
        <div className="lg:col-span-5 bg-slate-50 p-6 rounded-3xl border border-slate-200/80">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
            <h3 className="text-sm font-bold text-slate-900">Post New Clinical Annotation</h3>
            <span className="text-[10px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
              {currentEvent.genericName}
            </span>
          </div>

          <form onSubmit={handleAddAnnotation} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Visibility Scope & Security Tier
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { id: 'CLINICAL_INTERNAL', label: 'Clinical Internal' },
                  { id: 'HOSPITAL_WIDE', label: 'Hospital Wide' },
                  { id: 'MAH_CONFIDENTIAL', label: 'MAH Confidential' },
                ].map((vis) => (
                  <button
                    key={vis.id}
                    type="button"
                    onClick={() => setNewVisibility(vis.id as any)}
                    className={`p-2 rounded-xl border text-[11px] font-bold transition-colors ${
                      newVisibility === vis.id
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {vis.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Tag Category
              </label>
              <select
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-semibold text-slate-800"
              >
                <option value="Emergency Reserve">Emergency Reserve Allocation</option>
                <option value="Batch Release">Lot / Batch Reconstitution</option>
                <option value="MAH Compliance">MAH Regulatory Sign-off</option>
                <option value="USP 797">Sterility & Compounding</option>
                <option value="Divergence Triage">Cross-Border Divergence</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Clinical Observation / Regulatory Note
              </label>
              <textarea
                required
                rows={4}
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                placeholder="Enter batch details, ICU allocation guidance, or MAH submission timeline..."
                className="w-full p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Attach Note to {currentEvent.genericName} Dossier</span>
            </button>
          </form>
        </div>

        {/* Existing Annotations Feed */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 pb-2 border-b border-slate-100">
            <span>Threaded Annotations ({eventAnnotations.length})</span>
            <span className="text-[11px] text-slate-400">Encrypted Institutional Storage</span>
          </div>

          {eventAnnotations.length === 0 ? (
            <div className="p-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center">
              <p className="text-xs text-slate-500">
                No peer annotations posted for {currentEvent.genericName} yet.
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Post the first clinical buffer notice or regulatory batch release memo using the form on the left.
              </p>
            </div>
          ) : (
            eventAnnotations.map((ann) => (
              <div
                key={ann.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-3"
              >
                {/* Annotation Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                      {ann.authorName.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{ann.authorName}</div>
                      <div className="text-[10px] text-slate-400 capitalize">
                        {ann.authorRole.replace('_', ' ')} • {new Date(ann.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                        ann.visibility === 'MAH_CONFIDENTIAL'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : ann.visibility === 'HOSPITAL_WIDE'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                    >
                      {ann.visibility.replace('_', ' ')}
                    </span>
                    <button
                      onClick={() => handleToggleResolve(ann.id)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded transition-colors ${
                        ann.status === 'RESOLVED'
                          ? 'bg-slate-100 text-slate-500'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {ann.status === 'RESOLVED' ? 'Resolved' : 'Mark Resolved'}
                    </button>
                  </div>
                </div>

                {/* Content */}
                <p className="text-xs text-slate-800 leading-relaxed bg-slate-50/60 p-3 rounded-xl border border-slate-100">
                  {ann.content}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {ann.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-semibold rounded-md flex items-center gap-1"
                    >
                      <Tag className="w-2.5 h-2.5 text-slate-400" />
                      <span>{t}</span>
                    </span>
                  ))}
                </div>

                {/* Replies Thread */}
                {ann.replies && ann.replies.length > 0 && (
                  <div className="pl-4 border-l-2 border-blue-200 space-y-2 pt-2">
                    {ann.replies.map((rep) => (
                      <div key={rep.id} className="text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-700 mb-0.5">
                          <span>{rep.authorName} ({rep.authorRole})</span>
                          <span className="text-slate-400 font-normal">
                            {new Date(rep.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-slate-800 text-[11px]">{rep.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Inline Reply Input */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={replyInput[ann.id] || ''}
                    onChange={(e) => setReplyInput({ ...replyInput, [ann.id]: e.target.value })}
                    placeholder="Add peer reply to this clinical annotation..."
                    className="flex-1 py-1.5 px-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => handleAddReply(ann.id)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-semibold transition-colors"
                  >
                    Reply
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
