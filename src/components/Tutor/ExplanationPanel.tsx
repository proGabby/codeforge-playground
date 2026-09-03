import React, { useState } from 'react';
import { BookOpen, Cpu, Sparkles, Code2, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ExplanationPanel: React.FC = () => {
  const { activeExercise, lineExplanation } = useApp();
  const [activeTab, setActiveTab] = useState<'concept' | 'hood' | 'line'>('concept');

  if (!activeExercise) return null;

  const exp = activeExercise.explanation;

  return (
    <div className="w-96 bg-slate-900 border-l border-slate-800 flex flex-col h-full select-none overflow-hidden">
      {/* Panel Navigation Header */}
      <div className="h-11 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between px-3">
        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('concept')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeTab === 'concept'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Concept Guide
          </button>
          <button
            onClick={() => setActiveTab('hood')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeTab === 'hood'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Under Hood
          </button>
          <button
            onClick={() => setActiveTab('line')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all relative cursor-pointer ${
              activeTab === 'line'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Line Breakdown
            {lineExplanation && (
              <span className="w-2 h-2 rounded-full bg-purple-400 absolute top-1 right-1 animate-pulse"></span>
            )}
          </button>
        </div>
      </div>

      {/* Panel Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs text-slate-300 custom-scrollbar">
        {activeTab === 'concept' && (
          <div className="space-y-4">
            {/* Task Banner */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400">
                {activeExercise.difficultyLabel}
              </span>
              <h3 className="text-sm font-bold text-slate-100 mt-1">
                {activeExercise.title}
              </h3>
              <p className="text-slate-300 mt-2 leading-relaxed">
                {activeExercise.instructions}
              </p>
            </div>

            {/* Simple Explanation */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" /> Simple Explanation
              </h4>
              <p className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/60 leading-relaxed">
                {exp.simple}
              </p>
            </div>

            {/* Why It Works */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-emerald-400" /> Why It Works
              </h4>
              <p className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/60 leading-relaxed">
                {exp.whyItWorks}
              </p>
            </div>

            {/* Syntax Breakdown Table */}
            {exp.syntaxBreakdown && exp.syntaxBreakdown.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-purple-400" /> Syntax Breakdown
                </h4>
                <div className="bg-slate-950 rounded-xl border border-slate-800 divide-y divide-slate-800/80 overflow-hidden">
                  {exp.syntaxBreakdown.map((item, i) => (
                    <div key={i} className="p-2.5 flex items-start space-x-2">
                      <code className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[11px] border border-indigo-500/30 flex-shrink-0">
                        {item.token}
                      </code>
                      <span className="text-slate-300 leading-snug">{item.meaning}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'hood' && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xs">
              <Cpu className="w-4 h-4" />
              <span>Go Runtime & Memory Architecture</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 leading-relaxed text-slate-300 font-mono text-[11px] whitespace-pre-wrap">
              {exp.underTheHood}
            </div>
          </div>
        )}

        {activeTab === 'line' && (
          <div className="space-y-3">
            {lineExplanation ? (
              <div className="space-y-3">
                <div className="bg-purple-950/40 p-3 rounded-xl border border-purple-500/30">
                  <span className="text-[10px] font-mono text-purple-300 font-bold uppercase">
                    Line {lineExplanation.lineNumber}
                  </span>
                  <div className="mt-1 bg-slate-950 p-2 rounded border border-purple-900/60 font-mono text-purple-200">
                    {lineExplanation.lineText}
                  </div>
                  <p className="mt-2 text-slate-200 font-medium">
                    {lineExplanation.summary}
                  </p>
                </div>

                {lineExplanation.breakdown.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="font-bold text-xs text-slate-400">Token Breakdown</h5>
                    <div className="space-y-1.5">
                      {lineExplanation.breakdown.map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-950 p-2 rounded-lg border border-slate-800 flex items-start space-x-2"
                        >
                          <code className="text-indigo-300 font-mono font-bold">{item.token}</code>
                          <span className="text-slate-300">{item.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 space-y-2">
                <Sparkles className="w-8 h-8 mx-auto text-purple-400/40 animate-pulse" />
                <p>Highlight any line in the code editor and click <strong>"Explain Line"</strong> to view line-by-line syntax breakdowns!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
