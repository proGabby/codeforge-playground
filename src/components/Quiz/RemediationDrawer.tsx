import React, { useState, useEffect } from 'react';
import {
  X,
  Maximize2,
  Minimize2,
  Sparkles,
  Clock,
  ArrowRight,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import type { RemediationArticle, QuizQuestion } from '../../types';

interface RemediationDrawerProps {
  isOpen: boolean;
  quizId: string;
  question: QuizQuestion | null;
  selectedOptionId: string;
  onClose: () => void;
  onAskMentor?: (concept: string) => void;
}

export const RemediationDrawer: React.FC<RemediationDrawerProps> = ({
  isOpen,
  quizId,
  question,
  selectedOptionId,
  onClose,
  onAskMentor,
}) => {
  const [article, setArticle] = useState<RemediationArticle | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (isFullScreen) {
          setIsFullScreen(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isFullScreen, onClose]);

  // Fetch remediation article whenever drawer opens for a question
  useEffect(() => {
    if (!isOpen || !question) {
      setArticle(null);
      setError(null);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setError(null);

    fetch('/api/quizzes/remediation-article', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quizId,
        questionId: question.id,
        selectedOptionId,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load remediation article');
        return res.json();
      })
      .then((data: RemediationArticle) => {
        if (isMounted) {
          setArticle(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching remediation article:', err);
        if (isMounted) {
          setError('Failed to generate remediation guide. Please try again.');
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, quizId, question, selectedOptionId]);

  if (!isOpen || !question) return null;

  // Simple, elegant Markdown renderer for well-paragraphed reading
  const renderMarkdownContent = (md: string) => {
    const blocks = md.split('\n\n');

    return blocks.map((block, index) => {
      const trimmed = block.trim();

      // Heading 1
      if (trimmed.startsWith('# ')) {
        return (
          <h1
            key={index}
            className="text-xl sm:text-2xl font-bold text-[#F2F4F8] tracking-tight mt-2 mb-4 leading-snug"
          >
            {trimmed.replace(/^#\s+/, '')}
          </h1>
        );
      }

      // Heading 2
      if (trimmed.startsWith('## ')) {
        return (
          <h2
            key={index}
            className="text-base sm:text-lg font-semibold text-[#60A5FA] tracking-tight mt-6 mb-3 border-b border-[#1E2536] pb-2 flex items-center gap-2"
          >
            <span>{trimmed.replace(/^##\s+/, '')}</span>
          </h2>
        );
      }

      // Heading 3
      if (trimmed.startsWith('### ')) {
        return (
          <h3
            key={index}
            className="text-sm sm:text-base font-semibold text-[#F2F4F8] mt-4 mb-2"
          >
            {trimmed.replace(/^###\s+/, '')}
          </h3>
        );
      }

      // Code Block
      if (trimmed.startsWith('```')) {
        const cleanCode = trimmed.replace(/^```[a-z]*\n?/i, '').replace(/\n?```$/, '');
        return (
          <div
            key={index}
            className="bg-[#090D15] border border-[#171E2D] rounded-xl p-4 my-4 font-mono text-xs text-[#E2E8F0] leading-relaxed overflow-x-auto shadow-inner"
          >
            <pre>
              <code>{cleanCode}</code>
            </pre>
          </div>
        );
      }

      // List Items
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || /^\d+\.\s+/.test(trimmed)) {
        const items = trimmed.split('\n');
        return (
          <ul key={index} className="space-y-2.5 my-3 text-xs sm:text-sm text-[#D1D5DB] leading-relaxed pl-1">
            {items.map((item, itemIdx) => {
              const cleanItem = item.replace(/^[\*\-\d\.\s]+/, '').trim();
              const isBoldStart = cleanItem.startsWith('**');
              return (
                <li key={itemIdx} className="flex items-start gap-2.5">
                  <span className="text-[#3B82F6] font-bold select-none mt-0.5">•</span>
                  <span className="flex-1">
                    {isBoldStart ? (
                      cleanItem.split('**').map((part, pIdx) =>
                        pIdx % 2 === 1 ? (
                          <strong key={pIdx} className="text-[#F2F4F8] font-semibold">
                            {part}
                          </strong>
                        ) : (
                          <span key={pIdx}>{part}</span>
                        )
                      )
                    ) : (
                      cleanItem
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        );
      }

      // Standard Paragraph with inline bold parsing
      return (
        <p key={index} className="text-xs sm:text-sm text-[#D1D5DB] leading-relaxed my-3">
          {trimmed.includes('**') ? (
            trimmed.split('**').map((part, pIdx) =>
              pIdx % 2 === 1 ? (
                <strong key={pIdx} className="text-[#F2F4F8] font-semibold">
                  {part}
                </strong>
              ) : (
                <span key={pIdx}>{part}</span>
              )
            )
          ) : (
            trimmed
          )}
        </p>
      );
    });
  };

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex justify-end animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className={`bg-[#0E121B] border-l border-[#1E2536] text-[#F2F4F8] shadow-2xl flex flex-col transition-all duration-300 ${
          isFullScreen
            ? 'w-full h-full'
            : 'w-full max-w-2xl h-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="h-14 px-5 border-b border-[#1E2536] flex items-center justify-between shrink-0 bg-[#0B0E14]/60">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#3B82F6]/10 border border-[#3B82F6]/20 flex items-center justify-center text-[#3B82F6]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#737F94] font-semibold">
                AI Remediation Guide
              </span>
              <div className="flex items-center gap-2 text-xs text-[#99A3B5]">
                <span className="text-[#F2F4F8] font-medium truncate max-w-xs">
                  {article?.title || 'Targeted Concept Guide'}
                </span>
                {article && (
                  <span className="flex items-center gap-1 text-[#737F94]">
                    <Clock className="w-3 h-3" />
                    <span>~{article.estimatedReadMinutes} min read</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle Fullscreen / Drawer mode */}
            <button
              onClick={() => setIsFullScreen((prev) => !prev)}
              className="p-1.5 rounded-lg bg-[#121620] hover:bg-[#1E2536] border border-[#1E2536] text-[#99A3B5] hover:text-[#F2F4F8] transition-colors cursor-pointer"
              title={isFullScreen ? 'Switch to side drawer' : 'Expand to full screen'}
            >
              {isFullScreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#121620] hover:bg-[#1E2536] border border-[#1E2536] text-[#99A3B5] hover:text-[#F2F4F8] transition-colors cursor-pointer group"
              title="Close guide (esc)"
            >
              <span className="text-[10px] font-mono px-1 py-0.5 rounded bg-[#1E2536] text-[#737F94] group-hover:text-[#F2F4F8]">
                esc
              </span>
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 select-text custom-scrollbar space-y-6">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-4">
              <div className="w-8 h-8 border-2 border-[#3B82F6] border-t-transparent rounded-full animate-spin" />
              <div className="text-center space-y-1">
                <span className="text-sm font-medium text-[#F2F4F8]">
                  Generating targeted remediation guide...
                </span>
                <p className="text-xs text-[#737F94] max-w-sm">
                  Analyzing your choice, identifying the underlying misconception, and framing the production mental model.
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-950/20 border border-red-800/40 rounded-xl p-5 text-center space-y-3 my-8">
              <AlertTriangle className="w-6 h-6 text-red-400 mx-auto" />
              <p className="text-xs text-red-300">{error}</p>
              <button
                onClick={() => {
                  setIsLoading(true);
                  setError(null);
                }}
                className="px-3 py-1.5 bg-[#121620] hover:bg-[#1E2536] border border-[#1E2536] text-xs rounded-lg text-[#F2F4F8]"
              >
                Retry
              </button>
            </div>
          ) : article ? (
            <div className={`mx-auto ${isFullScreen ? 'max-w-3xl' : 'max-w-full'} space-y-6`}>
              {/* Diagnostic Banner */}
              {article.diagnosticSummary && (
                <div className="bg-[#121620] border border-[#1E2536] rounded-xl p-4 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div className="space-y-1 text-xs">
                    <span className="font-semibold text-[#F2F4F8]">Identified Misconception</span>
                    <p className="text-[#99A3B5] leading-relaxed">
                      {article.diagnosticSummary}
                    </p>
                  </div>
                </div>
              )}

              {/* Main Article Text */}
              <div className="article-body">
                {renderMarkdownContent(article.markdown)}
              </div>

              {/* Key Takeaways Callout Card */}
              {article.keyTakeaways && article.keyTakeaways.length > 0 && (
                <div className="bg-[#121620] border border-[#3B82F6]/30 rounded-xl p-5 my-6 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#60A5FA]">
                    <CheckCircle2 className="w-4 h-4 text-[#3B82F6]" />
                    <span>Quick Takeaways (Save for Interviews)</span>
                  </div>
                  <ul className="space-y-2 text-xs text-[#D1D5DB] leading-relaxed">
                    {article.keyTakeaways.map((point, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2">
                        <span className="text-[#3B82F6] font-bold">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Bottom Actions Bar */}
        <div className="h-16 px-6 border-t border-[#1E2536] flex items-center justify-between shrink-0 bg-[#0B0E14]/80">
          <button
            onClick={() => {
              onClose();
              if (onAskMentor && article) {
                onAskMentor(article.conceptTag || article.title);
              }
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#121620] hover:bg-[#1E2536] border border-[#1E2536] text-xs font-medium text-[#F2F4F8] transition-colors cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#3B82F6]" />
            <span>Ask AI Mentor a follow-up</span>
          </button>

          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-medium shadow-sm transition-colors cursor-pointer"
          >
            <span>Return to Quiz</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
