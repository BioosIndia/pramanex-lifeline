import React, { useState } from 'react';
import {
  Activity,
  Globe,
  Database,
  Cpu,
  GitBranch,
  Clock,
  FileText,
  ShieldCheck,
  Building,
  User,
  LogOut,
  Bell,
  Sparkles,
  ExternalLink,
  Sliders,
  ChevronRight,
  Eye,
  CheckCircle2,
  MessageSquare,
  FileCheck,
  Radio,
  UserCheck,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { CommandCenterDashboard } from './CommandCenterDashboard';
import { GlobalSupplyMap } from './GlobalSupplyMap';
import { AgentSwarmConsole } from './AgentSwarmConsole';
import { ExportReportingView } from './ExportReportingView';
import { SearchEngineUI } from './SearchEngineUI';
import { CollaborativeAnnotationsPanel } from './CollaborativeAnnotationsPanel';
import { OfficialBulletinsViewer } from './OfficialBulletinsViewer';
import { RealTimeCadenceTracker } from './RealTimeCadenceTracker';
import { PersonalizedRoleWorkspace } from './PersonalizedRoleWorkspace';

interface AuthenticatedOSViewProps {
  onBackToLanding: () => void;
}

export const AuthenticatedOSView: React.FC<AuthenticatedOSViewProps> = ({ onBackToLanding }) => {
  const { currentUser, profile, signOutUser } = useAuth();
  const { events, conflicts, sourceHealth, auditLogs, setIsAssistantOpen, setIsSearchGroundingOpen } = useApp();
  const { currentLanguage, setLanguage, languages, t } = useLanguage();

  const [activeView, setActiveView] = useState<
    'personalized' | 'command' | 'map' | 'swarm' | 'annotations' | 'bulletins' | 'search' | 'reporting'
  >('personalized');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const currentLangObj = languages.find((l) => l.code === currentLanguage) || languages[0];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Enterprise Workstation App Bar */}
      <header className="bg-slate-950 text-white border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo & Workspace Context */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-white tracking-tight text-base">PRAMANEX</span>
                  <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-blue-500/20 text-sky-300 border border-blue-400/30">
                    ENTERPRISE OS
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                  <span>Pramanex Health System</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-medium">Hospital Node #845465</span>
                </div>
              </div>
            </div>

            {/* Center Quick Live Telemetry */}
            <div className="hidden lg:flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-slate-300 font-medium">5/5 Feeds Online</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800">
                <span className="text-slate-400">Active Signals:</span>
                <span className="font-bold text-white">{events.length}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800">
                <span className="text-slate-400">HITL Conflicts:</span>
                <span className="font-bold text-purple-400">{conflicts.length}</span>
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Multi-Language Selector Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
                  title="Select Language"
                >
                  <span>{currentLangObj.flag}</span>
                  <span className="hidden sm:inline">{currentLangObj.nativeName}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {isLangMenuOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Select Language
                    </div>
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsLangMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center justify-between ${
                          currentLanguage === lang.code
                            ? 'bg-blue-600/30 text-sky-300 font-bold'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{lang.flag}</span>
                          <span>{lang.nativeName}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Back to Public View button */}
              <button
                onClick={onBackToLanding}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors flex items-center gap-1"
                title="Preview public marketing experience"
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('nav.publicView')}</span>
              </button>

              {/* Gemini Assistant trigger */}
              <button
                onClick={() => setIsAssistantOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('nav.askAI')}</span>
              </button>

              {/* User Profile Capsule */}
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {profile?.displayName ? profile.displayName.charAt(0).toUpperCase() : 'R'}
                </div>
                <div className="hidden md:block text-left text-xs">
                  <div className="font-bold text-white leading-tight">
                    {profile?.displayName || 'Rahul Dewangan'}
                  </div>
                  <div className="text-[10px] text-slate-400 capitalize">
                    {profile?.role || 'pharmacist'}
                  </div>
                </div>
                <button
                  onClick={signOutUser}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                  title={t('nav.signOut')}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Enterprise Workstation Navigation Tabs */}
        <div className="bg-slate-900/90 border-t border-slate-800/80 px-4 sm:px-8 overflow-x-auto">
          <nav className="flex items-center gap-1 sm:gap-2 py-1 max-w-7xl mx-auto">
            {[
              { id: 'personalized', label: t('os.roleWorkspace'), icon: <UserCheck className="w-3.5 h-3.5 text-blue-400" /> },
              { id: 'command', label: t('os.commandCenter'), icon: <Database className="w-3.5 h-3.5" /> },
              { id: 'map', label: t('os.globalMap'), icon: <Globe className="w-3.5 h-3.5 text-emerald-400" /> },
              { id: 'swarm', label: t('os.swarm'), icon: <Cpu className="w-3.5 h-3.5 text-purple-400" /> },
              { id: 'annotations', label: t('os.notes'), icon: <MessageSquare className="w-3.5 h-3.5 text-amber-400" /> },
              { id: 'bulletins', label: t('os.bulletins'), icon: <FileCheck className="w-3.5 h-3.5 text-sky-400" /> },
              { id: 'search', label: t('os.index'), icon: <Activity className="w-3.5 h-3.5 text-indigo-400" /> },
              { id: 'reporting', label: t('os.dossiers'), icon: <FileText className="w-3.5 h-3.5 text-emerald-400" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-2 ${
                  activeView === tab.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Real-time Surveillance Cadence Ticker */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6">
        <RealTimeCadenceTracker />
      </div>

      {/* Main Workstation Workspace */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {activeView === 'personalized' && <PersonalizedRoleWorkspace />}
        {activeView === 'command' && <CommandCenterDashboard />}
        {activeView === 'map' && <GlobalSupplyMap />}
        {activeView === 'swarm' && <AgentSwarmConsole />}
        {activeView === 'annotations' && <CollaborativeAnnotationsPanel />}
        {activeView === 'bulletins' && <OfficialBulletinsViewer />}
        {activeView === 'search' && <SearchEngineUI />}
        {activeView === 'reporting' && <ExportReportingView />}
      </main>

      {/* Workstation Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <p>PRAMANEX LIFELINE Enterprise OS v28.4 • Authorized Institutional Session for {profile?.email || 'R4dewangan@gmail.com'}</p>
      </footer>
    </div>
  );
};
