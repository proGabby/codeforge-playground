import React from 'react';
import { Terminal, Sparkles, Award } from 'lucide-react';

export const FeedbackLoopSection: React.FC = () => {
  const cards = [
    {
      num: '01 / COMPILER',
      icon: Terminal,
      title: 'Real code. Real feedback.',
      description:
        'Run Go and Python in a sandboxed runtime. Real compiler diagnostics when errors happen, not a mock in your browser console.',
      meta: 'compiler: ready',
    },
    {
      num: '02 / MENTOR',
      icon: Sparkles,
      title: 'A mentor, not a shortcut.',
      description:
        'Get a thoughtful question when you\'re stuck. Your Socratic mentor builds intuition without giving the answer away.',
      meta: '"What does this function return?"',
    },
    {
      num: '03 / RETENTION',
      icon: Award,
      title: 'Make knowledge stick.',
      description:
        'Turn each section into lasting knowledge with milestone quizzes designed around active recall.',
      meta: 'Section quizzes · +50 XP',
    },
  ];

  return (
    <section id="features" className="py-16 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Header Eyebrow */}
      <span className="text-[10px] font-mono uppercase tracking-widest text-[#737F94] block mb-2 select-none">
        BUILT FOR UNDERSTANDING
      </span>

      {/* Main Row */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-7">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F2F4F8]">
          The feedback loop is the curriculum.
        </h2>
        <span className="text-xs text-[#737F94] font-normal tracking-wide">
          Write. Run. Understand. Repeat.
        </span>
      </div>

      {/* 3 Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div
              key={i}
              className="bg-[#121620] rounded-[10px] p-6 flex flex-col justify-between transition-all duration-200 hover:bg-[#151A26]"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-[#737F94]">
                  <span>{c.num}</span>
                  <Icon className="w-4 h-4 text-[#737F94]" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-[#F2F4F8] mt-4 tracking-tight">
                  {c.title}
                </h3>
                <p className="text-xs sm:text-[13px] text-[#99A3B5] leading-relaxed mt-2 font-normal">
                  {c.description}
                </p>
              </div>

              <div className="mt-8 pt-2">
                <span className="text-[11px] font-mono text-[#737F94] block">
                  {c.meta}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
