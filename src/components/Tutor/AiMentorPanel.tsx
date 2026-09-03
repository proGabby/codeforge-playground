import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Lock, Send, Bot, User, Play, ArrowRight, Loader2, Lightbulb } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AiMentorPanel: React.FC = () => {
  const {
    hasAttemptedCurrentExercise,
    chatMessages,
    isAskingAi,
    askAiMentor,
    runCode,
    submitCode,
    activeExercise,
    isExecuting,
  } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAskingAi]);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || isAskingAi) return;
    askAiMentor(query);
    setInputQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // LOCKED STATE (Pre-Attempt)
  if (!hasAttemptedCurrentExercise) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-900/60 rounded-xl border border-slate-800/80 shadow-2xl relative overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl" />

        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/30 flex items-center justify-center mb-5 text-purple-400 shadow-lg shadow-purple-500/10 animate-pulse">
          <Lock className="w-8 h-8" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-950/60 text-purple-300 border border-purple-800/50 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          Attempt Required to Unlock
        </div>

        <h3 className="text-xl font-bold text-slate-100 mb-2">AI Mentor is Locked</h3>
        <p className="text-slate-400 text-sm max-w-sm mb-6 leading-relaxed">
          To ensure active learning, the Gemini AI Mentor unlocks after your first <span className="text-emerald-400 font-semibold">Run</span> or <span className="text-indigo-400 font-semibold">Submit</span> attempt on <span className="text-slate-200 font-semibold">{activeExercise?.title || 'this exercise'}</span>.
        </p>

        <div className="flex flex-wrap justify-center gap-3 w-full max-w-xs">
          <button
            onClick={() => runCode()}
            disabled={isExecuting}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-all shadow-md shadow-emerald-900/30 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Play className="w-4 h-4 fill-white" />
            Run Code
          </button>
          <button
            onClick={() => submitCode()}
            disabled={isExecuting}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-md shadow-indigo-900/30 hover:scale-[1.02] active:scale-[0.98]"
          >
            <ArrowRight className="w-4 h-4" />
            Submit
          </button>
        </div>
      </div>
    );
  }

  // UNLOCKED STATE (Post-Attempt)
  return (
    <div className="flex-1 flex flex-col h-full bg-slate-900/80 rounded-xl border border-slate-800/80 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-950/70 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-600/30 to-indigo-600/30 border border-purple-500/40 text-purple-300">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              Gemini AI Mentor
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-800/50">
                ● Unlocked
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Context-Aware Socratic Tutor</p>
          </div>
        </div>
      </div>

      {/* Quick Prompt Suggestions */}
      <div className="px-3 py-2 bg-slate-950/40 border-b border-slate-800/60 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-semibold text-purple-400 uppercase tracking-wider whitespace-nowrap flex items-center gap-1">
          <Lightbulb className="w-3 h-3" /> Quick:
        </span>
        <button
          onClick={() => handleSend('Why did I get this error or output?')}
          className="text-xs px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-purple-950/60 hover:border-purple-600/50 border border-slate-700/60 text-slate-300 transition-all whitespace-nowrap"
        >
          Why did I get this error?
        </button>
        <button
          onClick={() => handleSend('Explain the concept of this exercise simply.')}
          className="text-xs px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-purple-950/60 hover:border-purple-600/50 border border-slate-700/60 text-slate-300 transition-all whitespace-nowrap"
        >
          Explain concept simply
        </button>
        <button
          onClick={() => handleSend('Give me a subtle Socratic hint without spoiling full solution code.')}
          className="text-xs px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-purple-950/60 hover:border-purple-600/50 border border-slate-700/60 text-slate-300 transition-all whitespace-nowrap"
        >
          Give subtle hint
        </button>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {chatMessages.length === 0 && (
          <div className="text-center py-8 text-slate-400">
            <div className="w-12 h-12 rounded-xl bg-purple-950/40 border border-purple-800/40 text-purple-400 flex items-center justify-center mx-auto mb-3">
              <Bot className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-200">AI Mentor Ready!</p>
            <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
              Ask any question about your execution result, Go syntax, or algorithm logic below.
            </p>
          </div>
        )}

        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-purple-950 border border-purple-600/50 text-purple-300'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-indigo-600/90 text-white rounded-tr-none'
                  : 'bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-tl-none font-sans'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>
              <div
                className={`text-[9px] mt-1.5 ${
                  msg.sender === 'user' ? 'text-indigo-200/80 text-right' : 'text-slate-400'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {isAskingAi && (
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-purple-950 border border-purple-600/50 text-purple-300 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl rounded-tl-none px-4 py-2.5 text-xs text-slate-300 flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
              <span>Gemini AI is analyzing your code...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-3 bg-slate-950/80 border-t border-slate-800/80">
        <div className="flex items-center gap-2 bg-slate-900/90 rounded-lg border border-slate-700/80 p-1.5 focus-within:border-purple-500/60 focus-within:ring-1 focus-within:ring-purple-500/30 transition-all">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isAskingAi}
            placeholder="Ask AI Mentor a question about your attempt..."
            className="flex-1 bg-transparent px-2.5 py-1 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputQuery.trim() || isAskingAi}
            className="p-1.5 rounded-md bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white transition-all shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
