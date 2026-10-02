/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProofStrip } from './components/ProofStrip';
import { FeaturesGrid } from './components/FeaturesGrid';
import { Architecture3D } from './components/Architecture3D';
import { RolesSection } from './components/RolesSection';
import { SearchEngineUI } from './components/SearchEngineUI';
import { ShortageAlertEngine } from './components/ShortageAlertEngine';
import { ExportReportingView } from './components/ExportReportingView';
import { GlobalSupplyMap } from './components/GlobalSupplyMap';
import { AgentSwarmConsole } from './components/AgentSwarmConsole';
import { CommandCenterDashboard } from './components/CommandCenterDashboard';
import { ConsumerPWAView } from './components/ConsumerPWAView';
import { MethodologyView } from './components/MethodologyView';
import { AuthenticatedOSView } from './components/AuthenticatedOSView';
import { AssistantDrawer } from './components/AssistantDrawer';
import { WebSearchGroundingModal } from './components/WebSearchGroundingModal';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { ArrowRight, Sparkles, ShieldCheck, Zap, Download, LayoutDashboard, Globe } from 'lucide-react';

const MainLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [targetAuthFeature, setTargetAuthFeature] = useState<string | undefined>(undefined);
  const [isEnterpriseOSActive, setIsEnterpriseOSActive] = useState<boolean>(false);

  const { setSearchFilter, setSelectedEvent, setIsAssistantOpen } = useApp();
  const { currentUser, profile } = useAuth();

  // If user signs in, automatically offer/switch to Enterprise OS mode
  useEffect(() => {
    if (currentUser) {
      setIsEnterpriseOSActive(true);
    }
  }, [currentUser]);

  const handleOpenAuth = (featureName?: string) => {
    setTargetAuthFeature(featureName);
    setIsAuthModalOpen(true);
  };

  const handleHeroSearch = (query: string) => {
    setSearchFilter(query);
    const searchSec = document.getElementById('search-section');
    if (searchSec) {
      searchSec.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectEvent = (event: any) => {
    setSelectedEvent(event);
    const searchSec = document.getElementById('search-section');
    if (searchSec) {
      searchSec.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleGoToConsole = () => {
    if (!currentUser) {
      handleOpenAuth('Enterprise Command Center');
      return;
    }
    setIsEnterpriseOSActive(true);
  };

  // If user is logged in and Enterprise OS mode is active, render full post-login OS experience
  if (currentUser && isEnterpriseOSActive) {
    return (
      <>
        <AuthenticatedOSView onBackToLanding={() => setIsEnterpriseOSActive(false)} />
        <AssistantDrawer />
        <WebSearchGroundingModal />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Banner if Logged In but viewing Landing Page */}
      {currentUser && (
        <div className="bg-slate-950 text-white px-4 py-2 text-xs flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Logged in as <strong>{profile?.displayName || 'Rahul Dewangan'}</strong> ({profile?.email})</span>
          </div>
          <button
            onClick={() => setIsEnterpriseOSActive(true)}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex items-center gap-1.5"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Open Enterprise OS Workspace</span>
          </button>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'dashboard' && currentUser) {
            setIsEnterpriseOSActive(true);
            return;
          }
          setActiveTab(tab);
        }}
        onOpenAuth={handleOpenAuth}
      />

      {/* Main Tab Content */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <div>
            {/* 1. Hero with in-place live preview */}
            <div id="hero-section">
              <Hero
                onSearchSubmit={handleHeroSearch}
                onSelectEvent={handleSelectEvent}
                onGoToConsole={handleGoToConsole}
              />
            </div>

            {/* 2. Capability Trust Proof Strip */}
            <ProofStrip />

            {/* 3. Embedded Live Medicine Search UI Engine (YouTube-style autocomplete) */}
            <div id="search-section" className="scroll-mt-16">
              <SearchEngineUI />
            </div>

            {/* 4. 4 Feature Grid Cards */}
            <div id="features-section" className="scroll-mt-16">
              <FeaturesGrid
                onExploreModule={(mod) => {
                  if (mod === 'search') {
                    document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' });
                  } else if (mod === 'dashboard') {
                    if (currentUser) {
                      setIsEnterpriseOSActive(true);
                    } else {
                      document.getElementById('alerts-section')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }
                }}
              />
            </div>

            {/* 5. Real-Time Shortage Alert Engine Section */}
            <div id="alerts-section" className="scroll-mt-16">
              <ShortageAlertEngine />
            </div>

            {/* 6. Standardized Regulatory Export & Dossier Section */}
            <div id="export-section" className="scroll-mt-16">
              <ExportReportingView />
            </div>

            {/* 7. Interactive 3D Pipeline Architecture */}
            <div id="architecture-section" className="scroll-mt-16">
              <Architecture3D />
            </div>

            {/* 8. Roles & Workspaces Section */}
            <div id="roles-section" className="scroll-mt-16">
              <RolesSection
                onSelectRoleAction={(role) => {
                  if (role === 'consumer') {
                    setActiveTab('consumer');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else if (role === 'pharmacist') {
                    document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    if (currentUser) {
                      setIsEnterpriseOSActive(true);
                    } else {
                      handleOpenAuth('Clinical Workspace');
                    }
                  }
                }}
              />
            </div>

            {/* 9. Methodology & Truth Distinctions */}
            <div id="methodology-section" className="scroll-mt-16">
              <MethodologyView />
            </div>

            {/* 10. Bottom Final CTA Banner (FlowSuite styled) */}
            <section className="py-20 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white mb-4 inline-block">
                  ✦ GOVERNED MEDICINE SUPPLY INTELLIGENCE
                </span>
                <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight max-w-2xl mx-auto leading-tight">
                  Start tracking official medicine shortage signals today.
                </h2>
                <p className="mt-4 text-sm sm:text-base text-blue-100 max-w-xl mx-auto leading-relaxed">
                  Join clinicians, pharmacists, regulatory officers, and patients accessing verified,
                  freshness-tracked supply intelligence.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-slate-950 hover:bg-black text-white text-xs sm:text-sm font-semibold transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                  >
                    <span>Search a Medicine</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      document.getElementById('alerts-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-semibold transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4 text-amber-300" />
                    <span>Configure Shortage Alerts</span>
                  </button>

                  <button
                    onClick={() => {
                      if (currentUser) {
                        setIsEnterpriseOSActive(true);
                      } else {
                        handleOpenAuth('Enterprise Command Center');
                      }
                    }}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-slate-900 hover:bg-slate-100 font-semibold text-xs sm:text-sm transition-all active:scale-95 shadow-md flex items-center justify-center gap-2"
                  >
                    <span>{currentUser ? 'Open Enterprise Workspace' : 'Sign In to Command Center'}</span>
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Dedicated Full-Screen Views for Specialized Tabs */}
        {activeTab === 'search' && <SearchEngineUI />}
        {activeTab === 'dashboard' && <CommandCenterDashboard />}
        {activeTab === 'consumer' && <ConsumerPWAView />}
        {activeTab === 'methodology' && <MethodologyView />}
      </main>

      {/* Floating Intelligence Assistant Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsAssistantOpen(true)}
          className="group relative flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-xs rounded-full shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:scale-105 transition-all active:scale-95"
        >
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span>Ask Supply Assistant</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 absolute top-1.5 right-1.5" />
        </button>
      </div>

      {/* Slide-over Assistant Drawer */}
      <AssistantDrawer />

      {/* Live Web Search Grounding Modal */}
      <WebSearchGroundingModal />

      {/* Firebase Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        targetFeatureName={targetAuthFeature}
      />

      {/* Global Footer */}
      <Footer
        onNavigate={(tab) => {
          if (activeTab === 'home') {
            const el = document.getElementById(
              tab === 'search'
                ? 'search-section'
                : tab === 'methodology'
                ? 'methodology-section'
                : 'hero-section'
            );
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
              return;
            }
          }
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <MainLayout />
      </AppProvider>
    </AuthProvider>
  );
}
