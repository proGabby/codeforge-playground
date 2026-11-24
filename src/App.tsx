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
import { ConceptQuizHub } from './components/ConceptQuiz/ConceptQuizHub';
import type { SupportedLanguage } from './types';

const AppContent: React.FC = () => {
  const {
    setShowEmailModal,
    setSelectedLanguage,
    userEmail,
    activeMainView,
    setActiveMainView,
  } = useApp();

  const [currentView, setCurrentView] = useState<'landing' | 'playground'>(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname;
      return p === '/playground' || p === '/quiz' || p === '/quizzes'
        ? 'playground'
        : 'landing';
    }
    return 'landing';
  });

  const [pendingNavigation, setPendingNavigation] = useState<{
    targetLang?: SupportedLanguage;
  } | null>(null);

  useEffect(() => {
    const handlePopState = () => {
      const p = window.location.pathname;
      if (p === '/quiz' || p === '/quizzes') {
        setActiveMainView('concept-quizzes');
        setCurrentView('playground');
      } else if (p === '/playground') {
        setActiveMainView('playground');
        setCurrentView('playground');
      } else {
        setCurrentView('landing');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [setActiveMainView]);

  const navigateToPlayground = (lang?: SupportedLanguage) => {
    if (lang) {
      setSelectedLanguage(lang);
    }
    setActiveMainView('playground');
    window.history.pushState({}, '', '/playground');
    setCurrentView('playground');
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  const navigateToQuiz = () => {
    setActiveMainView('concept-quizzes');
    window.history.pushState({}, '', '/quiz');
    setCurrentView('playground');
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  const navigateToLanding = () => {
    window.history.pushState({}, '', '/');
    setCurrentView('landing');
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  // From the landing page, exploring playground or starting free asks for user's email if not already provided
  const handleLandingEnterPlayground = (lang?: unknown) => {
    const validLang: SupportedLanguage | undefined =
    lang === 'typescript'
      ? 'typescript'
      : lang === 'javascript'
        ? 'javascript'
        : lang === 'python'
          ? 'python'
          : lang === 'go'
            ? 'go'
            : undefined;
    if (validLang) {
      setSelectedLanguage(validLang);
    }
    if (!userEmail) {
      setPendingNavigation({ targetLang: validLang });
      setShowEmailModal(true);
  } else {
    navigateToPlayground(validLang);
}
    };

const handleOpenEmailModal = (lang?: unknown) => {
  const validLang: SupportedLanguage | undefined =
    lang === 'typescript'
      ? 'typescript'
      : lang === 'javascript'
        ? 'javascript'
        : lang === 'python'
          ? 'python'
          : lang === 'go'
            ? 'go'
            : undefined;
  if (validLang) {
    setSelectedLanguage(validLang);
  }
  setPendingNavigation({ targetLang: validLang });
  setShowEmailModal(true);
};

const handleEmailModalSuccess = () => {
  if (pendingNavigation) {
    navigateToPlayground(pendingNavigation.targetLang);
    setPendingNavigation(null);
  } else if (currentView === 'landing') {
    navigateToPlayground();
  }
};

const handleEmailModalGuestContinue = () => {
  if (pendingNavigation) {
    navigateToPlayground(pendingNavigation.targetLang);
    setPendingNavigation(null);
  } else if (currentView === 'landing') {
    navigateToPlayground();
  }
};

const handleEmailModalClose = () => {
  setPendingNavigation(null);
};

return (
  <>
    {currentView === 'landing' ? (
      <LandingPage
        onEnterPlayground={handleLandingEnterPlayground}
        onEnterQuiz={navigateToQuiz}
        onOpenEmailModal={handleOpenEmailModal}
      />
    ) : (
      <div className="h-screen w-screen flex flex-col bg-[#0B0E14] text-[#F2F4F8] overflow-hidden font-sans">
        <Navbar onNavigateHome={navigateToLanding} />
        {activeMainView === 'concept-quizzes' ? (
          <ConceptQuizHub />
        ) : (
          <div className="flex-1 flex overflow-hidden relative">
            <CurriculumTree />
            <main className="flex-1 flex flex-col overflow-hidden relative bg-[#0E131F] border-x border-[#182133]">
              <CodeEditor />
              <TestRunnerPanel />
            </main>
            <RightDrawer />
          </div>
        )}
        <CompletionModal />
        <QuizModal />
      </div>
    )}
    <EmailModal
      onSuccess={handleEmailModalSuccess}
      onGuestContinue={handleEmailModalGuestContinue}
      onClose={handleEmailModalClose}
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
