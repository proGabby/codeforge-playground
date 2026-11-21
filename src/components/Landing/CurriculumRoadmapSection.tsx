import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import type { SupportedLanguage } from '../../types';

interface CurriculumRoadmapSectionProps {
  onEnterPlayground: (lang?: SupportedLanguage) => void;
}

export const CurriculumRoadmapSection: React.FC<CurriculumRoadmapSectionProps> = ({
  onEnterPlayground,
}) => {
  const [activeLang, setActiveLang] = useState<SupportedLanguage>('go');

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

  const pythonCards = [
    {
      step: '01',
      title: 'Foundations',
      desc: 'Variables, loops, control flow',
      status: '6 topics',
      statusType: 'completed',
    },
    {
      step: '02',
      title: 'Collections',
      desc: 'Lists, dicts, tuples, sets',
      status: 'In progress · 3 / 6',
      statusType: 'active',
    },
    {
      step: '03',
      title: 'OOP & Idioms',
      desc: 'Classes, comprehensions, lambdas',
      status: 'Up next',
      statusType: 'upcoming',
    },
    {
      step: '04',
      title: 'Modern Python',
      desc: 'Type hints, decorators, generators',
      status: 'Locked',
      statusType: 'locked',
    },
  ];

  const jsCards = [
    {
      step: '01',
      title: 'Foundations',
      desc: 'Variables, scope, operators, closures',
      status: '3 topics',
      statusType: 'completed',
    },
    {
      step: '02',
      title: 'Collections & Idioms',
      desc: 'map, filter, reduce & immutability',
      status: 'In progress · 1 / 3',
      statusType: 'active',
    },
    {
      step: '03',
      title: 'Objects & ES6+',
      desc: 'Destructuring, rest/spread, shorthand',
      status: 'Up next',
      statusType: 'upcoming',
    },
    {
      step: '04',
      title: 'Async JavaScript',
      desc: 'Promises, async/await, event loop',
      status: 'Locked',
      statusType: 'locked',
    },
  ];

  const tsCards = [
    {
      step: '01',
      title: 'Type Foundations',
      desc: 'Static typing, annotations & inference',
      status: '3 topics',
      statusType: 'completed',
    },
    {
      step: '02',
      title: 'Interfaces & Unions',
      desc: 'Structural contracts & narrowing',
      status: 'In progress · 1 / 3',
      statusType: 'active',
    },
    {
      step: '03',
      title: 'Generics & Utility Types',
      desc: 'Type parameters, Partial, Pick, Record',
      status: 'Up next',
      statusType: 'upcoming',
    },
    {
      step: '04',
      title: 'Tuples & Advanced Types',
      desc: 'Fixed-length arrays & type assertions',
      status: 'Locked',
      statusType: 'locked',
    },
  ];

  const currentCards =
  activeLang === 'typescript'
    ? tsCards
    : activeLang === 'javascript'
      ? jsCards
      : activeLang === 'python'
        ? pythonCards
        : goCards;

  const langDisplayName =
  activeLang === 'typescript'
    ? 'TypeScript'
    : activeLang === 'javascript'
      ? 'JavaScript'
      : activeLang === 'python'
        ? 'Python'
        : 'Go';

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
          <button
            onClick={() => setActiveLang('javascript')}
            className={`px-3 py-1 rounded-[8px] transition-all cursor-pointer ${activeLang === 'javascript'
                ? 'bg-[#1E2536] text-[#F2F4F8] font-semibold'
                : 'text-[#99A3B5] hover:text-[#F2F4F8]'
              }`}
          >
            JavaScript
          </button>
          <button
            onClick={() => setActiveLang('typescript')}
            className={`px-3 py-1 rounded-[8px] transition-all cursor-pointer ${activeLang === 'typescript'
              ? 'bg-[#1E2536] text-[#F2F4F8] font-semibold'
              : 'text-[#99A3B5] hover:text-[#F2F4F8]'
              }`}
          >
            TypeScript
          </button>
        </div>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {currentCards.map((c, i) => (
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
        <span>
          {activeLang === 'typescript'
            ? '6 topics · 18 milestone questions · TypeScript 5.x runtime'
            : activeLang === 'javascript'
              ? '6 topics · 18 milestone questions · Node.js runtime'
              : activeLang === 'python'
          ? '12 topics · 36 milestone questions · Python 3 runtime'
            : '27 topics · 81 milestone questions · Go 1.22 runtime'}
        </span>
        <button
          onClick={() => onEnterPlayground(activeLang)}
          className="text-xs font-medium text-[#99A3B5] hover:text-[#F2F4F8] flex items-center space-x-1 transition-colors cursor-pointer"
        >
          <span>Explore the {langDisplayName} curriculum</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  );
};
