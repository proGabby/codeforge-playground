import React from 'react';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { CurriculumTree } from './components/Sidebar/CurriculumTree';
import { CodeEditor } from './components/Editor/CodeEditor';
import { GuidedCorrectionCard } from './components/Tutor/GuidedCorrectionCard';
import { ExplanationPanel } from './components/Tutor/ExplanationPanel';
import { TestRunnerPanel } from './components/Terminal/TestRunnerPanel';
import { RecommendationBanner } from './components/Adaptive/RecommendationBanner';
import { CompletionModal } from './components/Adaptive/CompletionModal';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <div className="h-screen w-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans">
        <Navbar />
        <RecommendationBanner />
        <div className="flex-1 flex overflow-hidden relative">
          <CurriculumTree />
          <div className="flex-1 flex flex-col overflow-hidden border-r border-slate-800 relative">
            <CodeEditor />
            <GuidedCorrectionCard />
            <TestRunnerPanel />
          </div>
          <ExplanationPanel />
        </div>
        <CompletionModal />
      </div>
    </AppProvider>
  );
};

export default App;
