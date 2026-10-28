/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { SearchModal } from './components/common/SearchModal';
import { HelpCenterModal } from './components/common/HelpCenterModal';
import { NongMiuMiuChatbot } from './components/mascot/NongMiuMiuChatbot';
import { Home } from './pages/Home';
import { MuseumDirectory } from './pages/MuseumDirectory';
import { MuseumDetail } from './pages/MuseumDetail';
import { SubjectExplorer } from './pages/SubjectExplorer';
import { KnowledgeGraphPage } from './pages/KnowledgeGraphPage';
import { Insights } from './pages/Insights';
import { About } from './pages/About';
import { HelpCenter } from './pages/HelpCenter';
import { ContactPage } from './pages/ContactPage';
import { DataExportPage } from './pages/DataExportPage';
import { Admin } from './pages/Admin';
import { Login } from './pages/Login';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [navigationMeta, setNavigationMeta] = useState<any>({});
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);

  // Scroll to top on navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentTab, navigationMeta]);

  // Global keyboard shortcut for search (⌘K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(open => !open);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavigate = (tab: string, meta?: any) => {
    setCurrentTab(tab);
    setNavigationMeta(meta || {});
  };

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-transparent text-[#382415]">
        
        {/* Navigation Top Bar */}
        <Navbar
          currentTab={currentTab}
          onNavigate={handleNavigate}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenHelp={() => setIsHelpOpen(true)}
        />

        {/* Global Search Dialog Modal */}
        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onSelectMuseum={(museumId) => {
            handleNavigate('museum-detail', { museumId });
          }}
          onSelectSubject={(subjectName) => {
            handleNavigate('subjects', { initialSubject: subjectName });
          }}
        />

        {/* Global Help Center Modal */}
        <HelpCenterModal
          isOpen={isHelpOpen}
          onClose={() => setIsHelpOpen(false)}
          onNavigate={handleNavigate}
        />

        {/* Main Content View Container */}
        <main className="flex-1">
          {currentTab === 'home' && (
            <Home 
              onNavigate={handleNavigate} 
              onOpenSearch={() => setIsSearchOpen(true)} 
            />
          )}

          {currentTab === 'museums' && (
            <MuseumDirectory
              onNavigate={handleNavigate}
              initialQuery={navigationMeta.searchQuery}
              initialType={navigationMeta.filterType}
            />
          )}

          {currentTab === 'museum-detail' && (
            <MuseumDetail
              museumId={navigationMeta.museumId || 'sac_1'}
              localLiving={Boolean(navigationMeta.localLiving)}
              onNavigate={handleNavigate}
            />
          )}

          {currentTab === 'subjects' && (
            <SubjectExplorer
              onNavigate={handleNavigate}
              initialSubject={navigationMeta.initialSubject || navigationMeta.selectSubject}
            />
          )}

          {currentTab === 'graph' && (
            <KnowledgeGraphPage
              onNavigate={handleNavigate}
              focusSubject={navigationMeta.focusSubject}
              focusMuseumId={navigationMeta.focusMuseumId}
            />
          )}

          {currentTab === 'insights' && (
            <Insights />
          )}

          {currentTab === 'about' && (
            <About />
          )}

          {currentTab === 'contact' && (
            <ContactPage onNavigate={handleNavigate} />
          )}

          {currentTab === 'export' && (
            <DataExportPage />
          )}

          {currentTab === 'help' && (
            <HelpCenter onNavigate={handleNavigate} />
          )}

          {currentTab === 'admin' && (
            <Admin 
              onNavigate={handleNavigate} 
              initialMenu={navigationMeta.menu}
              initialSubTab={navigationMeta.subTab}
            />
          )}

          {currentTab === 'login' && (
            <Login onNavigate={handleNavigate} />
          )}
        </main>

        {/* Floating Mascot Chatbot "น้องมิวมิว" */}
        <NongMiuMiuChatbot onNavigate={handleNavigate} />

        {/* Institutional Footer */}
        <Footer onNavigate={handleNavigate} />

      </div>
    </AuthProvider>
  );
}
