import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';

interface CurriculumRoadmapSectionProps {
  onEnterPlayground: (lang?: 'go' | 'python') => void;
}

export const CurriculumRoadmapSection: React.FC<CurriculumRoadmapSectionProps> = ({
  onEnterPlayground,
}) => {
  const [activeLang, setActiveLang] = useState<'go' | 'python'>('go');

  const goCards = [
    {
      step: '01',
      title: 'Foundations',
      desc: 'Types, control flow, functions',
      status: '7 topics',
      statusType: 'completed',
    },
    {
      step: '02',
      title: 'Data structures',
      desc: 'Slices, maps, structs',
      status: 'In progress · 4 / 10',
      statusType: 'active',
    },
    {
      step: '03',
      title: 'Concurrency',
      desc: 'Goroutines and channels',
      status: 'Up next',
      statusType: 'upcoming',
    },
    {
      step: '04',
      title: 'Build & ship',
      desc: 'Testing, APIs, production',
      status: 'Locked',
      statusType: 'locked',
    },
  ];

  return (
    <section id="curriculum" className="py-16 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Eyebrow */}
      <span className="text-[10px] font-mono uppercase tracking-widest text-[#737F94] block mb-2 select-none">
        A PATH, NOT A PLAYLIST
      </span>

      {/* Header and Language Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-7">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F2F4F8]">
            From first principles to production.
          </h2>
          <p className="text-xs sm:text-sm text-[#99A3B5] mt-1 font-normal">
            One concept at a time. Progress you can actually feel.
          </p>
        </div>

        {/* Static segmented pill toggle as seen in mockup */}
        <div className="flex items-center p-1 rounded-[10px] bg-[#121620] text-xs font-medium self-start sm:self-auto select-none">
          <button
            onClick={() => setActiveLang('go')}
            className={`px-3 py-1 rounded-[8px] transition-all cursor-pointer ${activeLang === 'go'
                ? 'bg-[#1E2536] text-[#F2F4F8] font-semibold'
                : 'text-[#99A3B5] hover:text-[#F2F4F8]'
              }`}
          >
            Go
          </button>
          <button
            onClick={() => setActiveLang('python')}
            className={`px-3 py-1 rounded-[8px] transition-all cursor-pointer ${activeLang === 'python'
                ? 'bg-[#1E2536] text-[#F2F4F8] font-semibold'
                : 'text-[#99A3B5] hover:text-[#F2F4F8]'
              }`}
          >
            Python
          </button>
        </div>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {goCards.map((c, i) => (
          <div
            key={i}
            onClick={() => onEnterPlayground(activeLang)}
            className={`rounded-[10px] p-5 flex flex-col justify-between transition-all cursor-pointer duration-200 ${c.statusType === 'active'
                ? 'bg-[#121620] ring-1 ring-[#3B82F6]/60 shadow-sm shadow-[#3B82F6]/10'
                : 'bg-[#121620] hover:bg-[#151A26]'
              }`}
          >
            <div>
              <span
                className={`text-xs font-mono font-semibold ${c.statusType === 'active'
                    ? 'text-[#3B82F6] px-1.5 py-0.5 rounded bg-[#3B82F6]/15'
                    : 'text-[#737F94]'
                  }`}
              >
                {c.step}
              </span>
              <h3 className="text-sm font-bold text-[#F2F4F8] mt-3.5 tracking-tight">
                {c.title}
              </h3>
              <p className="text-xs text-[#99A3B5] mt-1 leading-relaxed">
                {c.desc}
              </p>
            </div>

            <div className="mt-8 pt-2">
              {c.statusType === 'completed' && (
                <div className="flex items-center space-x-1.5 text-xs text-[#737F94] font-medium">
                  <Check className="w-3.5 h-3.5 text-[#737F94]" />
                  <span>{c.status}</span>
                </div>
              )}
              {c.statusType === 'active' && (
                <span className="text-xs font-medium text-[#3B82F6]">
                  {c.status}
                </span>
              )}
              {(c.statusType === 'upcoming' || c.statusType === 'locked') && (
                <span className="text-xs text-[#737F94]">
                  {c.status}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Summary Bar */}
      <div className="mt-7 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-[#737F94] gap-2">
        <span>32 lessons · 8 projects · 4 milestone quizzes</span>
        <button
          onClick={() => onEnterPlayground(activeLang)}
          className="text-xs font-medium text-[#99A3B5] hover:text-[#F2F4F8] flex items-center space-x-1 transition-colors cursor-pointer"
        >
          <span>Explore the {activeLang === 'go' ? 'Go' : 'Python'} curriculum</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  );
};
