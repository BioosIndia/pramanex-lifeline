import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  ShieldAlert,
  Clock,
  ExternalLink,
  RotateCcw,
  Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { askLifelineAssistant, AssistantResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

export const AssistantDrawer: React.FC = () => {
  const { isAssistantOpen, setIsAssistantOpen, selectedEvent } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content:
        'Hello, I am the PRAMANEX LIFELINE Official Medicine Supply Intelligence Assistant.\n\n' +
        'I strictly interpret official regulatory filings (US FDA, EMA, Health Canada, UK MHRA, TGA).\n\n' +
        '**Safety Notice:** I do not provide clinical therapy substitutions or medical advice. How can I assist you with supply intelligence today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const [useLowLatency, setUseLowLatency] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAssistantOpen) {
      scrollToBottom();
    }
  }, [messages, isAssistantOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: inputVal.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputVal('');
    setLoading(true);

    try {
      const historyForApi = messages
        .filter((m) => m.role !== 'system')
        .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));

      const contextData = selectedEvent
        ? `Selected Medicine: ${selectedEvent.genericName} (${selectedEvent.presentation})\n` +
          `Authority: ${selectedEvent.authority} (${selectedEvent.jurisdiction})\n` +
          `Status: ${selectedEvent.status}\n` +
          `Reported Cause: ${selectedEvent.reportedCause}\n` +
          `Freshness: ${selectedEvent.freshnessStatus}\n` +
          `Snapshot Hash: ${selectedEvent.snapshotHash}`
        : undefined;

      const response: AssistantResponse = await askLifelineAssistant(
        userMessage.content,
        historyForApi,
        contextData,
        useLowLatency
      );

      const assistantMessage: ChatMessage = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        content: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: `${response.modelUsed} (${response.latencyMs}ms)`,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: 'Unable to reach regulatory AI gateway. Operating under local evidence verification.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const resetChat = () => {
    setMessages([
      {
        id: `init-${Date.now()}`,
        role: 'assistant',
        content: 'Conversation reset. Ready to inspect official supply evidence.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  if (!isAssistantOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        onClick={() => setIsAssistantOpen(false)}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer */}
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">LIFELINE Intelligence Assistant</h3>
              <p className="text-[10px] text-slate-500">
                Official Regulatory Grounding • Multi-Turn
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setUseLowLatency(!useLowLatency)}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors ${
                useLowLatency ? 'bg-amber-100 text-amber-900' : 'bg-blue-100 text-blue-900'
              }`}
              title="Toggle between low-latency and reasoning models"
            >
              <Zap className="w-3 h-3" />
              <span>{useLowLatency ? 'gemini-3.1-flash-lite' : 'gemini-3.5-flash'}</span>
            </button>
            <button
              onClick={resetChat}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50"
              title="Reset Conversation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsAssistantOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Selected Context Banner */}
        {selectedEvent && (
          <div className="px-4 py-2 bg-blue-50 border-b border-blue-100 flex items-center justify-between text-[11px] text-blue-900">
            <span className="truncate">
              <strong>Active Context:</strong> {selectedEvent.genericName} ({selectedEvent.authority})
            </span>
            <span className="text-[10px] uppercase font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded ml-2 shrink-0">
              Attached
            </span>
          </div>
        )}

        {/* Messages Scrollable Area */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${
                m.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  m.role === 'user'
                    ? 'bg-slate-900 text-white'
                    : 'bg-blue-600 text-white'
                }`}
              >
                {m.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-50 border border-slate-200/80 text-slate-800'
                }`}
              >
                <div className="whitespace-pre-line">{m.content}</div>

                <div
                  className={`mt-2 flex items-center justify-between text-[9px] pt-1.5 border-t ${
                    m.role === 'user'
                      ? 'border-white/20 text-blue-100'
                      : 'border-slate-200/60 text-slate-400'
                  }`}
                >
                  <span>{m.timestamp}</span>
                  {m.modelUsed && <span>{m.modelUsed}</span>}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
              <Sparkles className="w-4 h-4 animate-spin text-blue-600" />
              <span>Consulting official regulatory indexes...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggested Queries */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px]">
          <span className="text-slate-400 shrink-0">Quick prompts:</span>
          {[
            'What is the official status?',
            'When was this updated?',
            'Do authorities disagree?',
            'What should I take instead?',
          ].map((prompt, i) => (
            <button
              key={i}
              onClick={() => {
                setInputVal(prompt);
              }}
              className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 shrink-0 whitespace-nowrap"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 sm:p-4 border-t border-slate-200 bg-white">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask about official supply signals, causes, or freshness..."
              className="flex-1 py-2.5 px-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <button
              type="submit"
              disabled={!inputVal.trim() || loading}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-black text-white disabled:opacity-40 transition-colors shrink-0 shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 text-center">
            PRAMANEX Assistant operates strictly on sovereign regulatory filings. Not medical advice.
          </p>
        </form>
      </div>
    </div>
  );
};
