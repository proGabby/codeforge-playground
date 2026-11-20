import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { CurriculumTree } from './components/Sidebar/CurriculumTree';
import { CodeEditor } from './components/Editor/CodeEditor';
import { TestRunnerPanel } from './components/Terminal/TestRunnerPanel';
import { RightDrawer } from './components/Tutor/RightDrawer';
import { CompletionModal } from './components/Adaptive/CompletionModal';
import { EmailModal } from './components/User/EmailModal';
import { QuizModal } from './components/Quiz/QuizModal';
import { LandingPage } from './components/Landing/LandingPage';

const AppContent: React.FC = () => {
  const { setShowEmailModal, setSelectedLanguage, userEmail } = useApp();
  const [currentView, setCurrentView] = useState<'landing' | 'playground'>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname === '/playground' ? 'playground' : 'landing';
    }
    return 'landing';
  });

  const [pendingNavigation, setPendingNavigation] = useState<{
    targetLang?: 'go' | 'python';
  } | null>(null);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentView(window.location.pathname === '/playground' ? 'playground' : 'landing');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToPlayground = (lang?: 'go' | 'python') => {
    if (lang) {
      setSelectedLanguage(lang);
    }
    window.history.pushState({}, '', '/playground');
    setCurrentView('playground');
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  const navigateToLanding = () => {
    window.history.pushState({}, '', '/');
    setCurrentView('landing');
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  // From the landing page, exploring playground or starting free asks for user's email if not already provided
  const handleLandingEnterPlayground = (lang?: 'go' | 'python') => {
    if (lang) {
      setSelectedLanguage(lang);
    }
    if (!userEmail) {
      setPendingNavigation({ targetLang: lang });
      setShowEmailModal(true);
    } else {
      navigateToPlayground(lang);
    }
  };

  const handleOpenEmailModal = (lang?: 'go' | 'python') => {
    if (lang) {
      setSelectedLanguage(lang);
    }
    setPendingNavigation({ targetLang: lang });
    setShowEmailModal(true);
  };

  const handleEmailModalComplete = () => {
    if (pendingNavigation) {
      navigateToPlayground(pendingNavigation.targetLang);
      setPendingNavigation(null);
    }
  };

  const handleEmailModalSkip = () => {
    if (pendingNavigation) {
      navigateToPlayground(pendingNavigation.targetLang);
      setPendingNavigation(null);
    }
  };

  return (
    <>
      {currentView === 'landing' ? (
        <LandingPage
          onEnterPlayground={handleLandingEnterPlayground}
          onOpenEmailModal={handleOpenEmailModal}
        />
      ) : (
        <div className="h-screen w-screen flex flex-col bg-[#0B0E14] text-[#F2F4F8] overflow-hidden font-sans">
          <Navbar onNavigateHome={navigateToLanding} />
          <div className="flex-1 flex overflow-hidden relative">
            <CurriculumTree />
            <main className="flex-1 flex flex-col overflow-hidden relative bg-[#0E131F] border-x border-[#182133]">
              <CodeEditor />
              <TestRunnerPanel />
            </main>
            <RightDrawer />
          </div>
          <CompletionModal />
          <QuizModal />
        </div>
      )}
      <EmailModal
        onSuccess={handleEmailModalComplete}
        onSkip={handleEmailModalSkip}
      />
    </>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
