import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const RightDrawer: React.FC = () => {
  const {
    activeExercise,
    activeTopic,
    chatMessages,
    isAskingAi,
    askAiMentor,
    executionResult,
    submissionResult,
    selectedLanguage,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'concept' | 'discussion'>('concept');
  const [questionInput, setQuestionInput] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const isPy = selectedLanguage === 'python';

  // Check if we are currently in failure or compiler error state
  const isCompilerError = executionResult && !executionResult.compiledSuccessfully;
  const isTestFailure =
    Boolean(submissionResult && !submissionResult.success) ||
    Boolean(submissionResult?.testDetails?.some((t) => !t.passed));
  const hasFailed = isCompilerError || isTestFailure;

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAskingAi]);

  const handleSendQuestion = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!questionInput.trim() || isAskingAi) return;
    askAiMentor(questionInput.trim());
    setQuestionInput('');
  };

  const topicOrder = activeTopic?.order ? String(activeTopic.order).padStart(2, '0') : '02';
  const exIndex = activeExercise?.difficulty ? String(activeExercise.difficulty).padStart(2, '0') : '04';
  const topicUpper = (activeTopic?.title || 'SLICES & ITERATION')
    .replace(/^\d+\.\s*/, '')
    .toUpperCase();
  const subHeader = `${topicOrder}.${exIndex} / ${topicUpper}`;

  // Default code example for Concept section
  const conceptCodeSnippet = isPy
    ? `for value in values:
    total += value`
    : `for _, value := range values {
    total += value
}`;

  return (
    <aside className="w-88 bg-[#0B0E14] text-[#F2F4F8] flex flex-col h-full select-none shrink-0 border-l border-[#121620]">
      {/* 1. Header with Concept & Discussion Tabs */}
      <div className="h-10 px-4 flex items-center space-x-6 border-b border-[#121620] shrink-0">
        <button
          onClick={() => setActiveTab('concept')}
          className={`text-xs font-semibold pb-1 transition-all cursor-pointer ${
            activeTab === 'concept'
              ? 'text-[#F2F4F8] border-b-2 border-[#3B82F6]'
              : 'text-[#737F94] hover:text-[#99A3B5]'
          }`}
        >
          Concept
        </button>
        <button
          onClick={() => setActiveTab('discussion')}
          className={`text-xs font-semibold pb-1 transition-all cursor-pointer ${
            activeTab === 'discussion'
              ? 'text-[#F2F4F8] border-b-2 border-[#3B82F6]'
              : 'text-[#737F94] hover:text-[#99A3B5]'
          }`}
        >
          Discussion
        </button>
      </div>

      {/* 2. Drawer Body (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar text-xs">
        {activeTab === 'discussion' ? (
          /* Discussion View */
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#F2F4F8]">Community Discussion</h3>
            <p className="text-xs text-[#99A3B5] leading-relaxed">
              Have questions about slice memory allocation or idiomatic patterns? Share thoughts with
              fellow learners.
            </p>
            <div className="p-3 bg-[#121620] rounded-[10px] text-xs text-[#737F94]">
              No comments yet on this lesson. Be the first to start a discussion!
            </div>
          </div>
        ) : (
          <>
            {/* Top Section: Concept */}
            <section className="space-y-3">
              <span className="text-[10px] font-mono font-semibold tracking-wider text-[#737F94] uppercase block">
                {subHeader}
              </span>

              <h2 className="text-base font-bold text-[#F2F4F8]">
                {activeExercise?.title || 'One slice. Every value.'}
              </h2>

              <p className="text-xs text-[#99A3B5] leading-relaxed">
                {activeExercise?.explanation?.simple ||
                  'A slice is a view into an underlying array. Use range to visit each element without tracking an index.'}
              </p>

              {/* Code Snippet Box */}
              <div className="bg-[#121620] rounded-[10px] p-3 font-mono text-xs text-[#F2F4F8] leading-relaxed overflow-x-auto">
                <pre>{conceptCodeSnippet}</pre>
              </div>

              {/* YOUR CHALLENGE Section */}
              <div className="pt-1">
                <span className="text-[10px] font-bold tracking-wider text-[#737F94] uppercase block">
                  YOUR CHALLENGE
                </span>
                <p className="text-xs text-[#F2F4F8] mt-1 leading-relaxed">
                  {activeExercise?.instructions ||
                    'Implement Sum so it returns the total. An empty slice should return zero.'}
                </p>

                {/* Helper Tip Card */}
                <div className="bg-[#121620] rounded-[10px] p-3 mt-2 text-xs text-[#99A3B5] leading-relaxed">
                  {activeExercise?.hints?.[0]?.text ||
                    'The blank identifier (_) discards the index. Keep only what you need.'}
                </div>
              </div>
            </section>

            {/* Bottom Section: Socratic Mentor */}
            <section className="pt-2 border-t border-[#121620] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-[#3B82F6]">Socratic mentor</h3>
                  <p className="text-[11px] text-[#737F94] mt-0.5">A nudge in the right direction.</p>
                </div>
                <span className="text-[10px] font-mono font-bold text-[#3B82F6] px-1.5 py-0.5 rounded-[4px] border border-[#3B82F6]/30 bg-[#3B82F6]/10">
                  AI
                </span>
              </div>

              {/* Conversation Messages Thread */}
              <div className="space-y-2 pt-1">
                {chatMessages.length === 0 ? (
                  /* Initial State: Mockup Questions & Responses */
                  hasFailed ? (
                    /* Failure state chat context (matches Mockup 7) */
                    <>
                      <div className="bg-[#121620] rounded-[10px] p-2.5 text-xs text-[#F2F4F8]">
                        Why can&apos;t I use total in []string?
                      </div>
                      <div className="bg-[#121620]/60 rounded-[10px] p-2.5 text-xs text-[#99A3B5] space-y-2 leading-relaxed">
                        <p>
                          What type does total have? Compare it with the element type that []string
                          accepts.
                        </p>
                        <p className="text-[#F2F4F8] font-medium">
                          Conversion and formatting are different.
                        </p>
                      </div>
                    </>
                  ) : (
                    /* Happy state chat context (matches Mockup 2 & 6) */
                    <>
                      <div className="bg-[#121620] rounded-[10px] p-2.5 text-xs text-[#F2F4F8]">
                        Why does the empty slice return 0?
                      </div>
                      <div className="bg-[#121620]/60 rounded-[10px] p-2.5 text-xs text-[#99A3B5] space-y-2 leading-relaxed">
                        <p>
                          Look at where total is initialized. If range has no elements to visit,
                          which lines will still execute?
                        </p>
                        <p className="text-[#F2F4F8] font-medium">What value reaches return?</p>
                      </div>
                    </>
                  )
                ) : (
                  /* Live user chat thread */
                  chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-2.5 rounded-[10px] text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-[#121620] text-[#F2F4F8]'
                          : 'bg-[#121620]/60 text-[#99A3B5]'
                      }`}
                    >
                      {msg.text}
                    </div>
                  ))
                )}

                {isAskingAi && (
                  <div className="bg-[#121620]/60 rounded-[10px] p-2.5 text-xs text-[#737F94] animate-pulse">
                    Thinking through a helpful question...
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Chat Input Form */}
              <form onSubmit={handleSendQuestion} className="pt-1">
                <div className="bg-[#121620] rounded-[10px] px-3 py-2 flex items-center justify-between gap-2">
                  <input
                    type="text"
                    value={questionInput}
                    onChange={(e) => setQuestionInput(e.target.value)}
                    placeholder="Ask a question..."
                    disabled={isAskingAi}
                    className="w-full bg-transparent text-xs text-[#F2F4F8] placeholder-[#737F94] outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!questionInput.trim() || isAskingAi}
                    className="w-5 h-5 rounded-[6px] bg-[#1E2536] hover:bg-[#3B82F6] text-[#F2F4F8] disabled:opacity-40 flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                    title="Send question to Socratic Mentor"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                </div>
                <div className="text-[11px] text-[#737F94] text-center mt-1.5">
                  Guidance, not the solution.
                </div>
              </form>
            </section>
          </>
        )}
      </div>
    </aside>
  );
};
