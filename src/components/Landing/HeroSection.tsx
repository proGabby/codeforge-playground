import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onEnterPlayground: () => void;
  onScrollToCurriculum: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onEnterPlayground,
  onScrollToCurriculum,
}) => {
  return (
    <section className="relative pt-16 sm:pt-20 pb-16 px-4 sm:px-6 max-w-6xl mx-auto flex flex-col items-center text-center">
      {/* Top Subtle Pill Tag */}
      <div className="inline-flex items-center px-3 py-1 rounded-[10px] bg-[#121620] text-[11px] font-mono text-[#99A3B5] mb-6 select-none">
        <span>Go 1.22 & Python 3.12</span>
      </div>

      {/* Main Hero Headline */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#F2F4F8] max-w-3xl leading-[1.15]">
        Master systems and scripting through compiler execution.
      </h1>

      {/* Hero Subtitle */}
      <p className="mt-4 sm:mt-5 text-sm sm:text-base text-[#99A3B5] max-w-xl leading-relaxed font-normal">
        Less watching. More building. Learn Go and Python in a real sandbox, with precise feedback and a mentor that helps you think.
      </p>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
        <button
          onClick={onEnterPlayground}
          className="w-full sm:w-auto px-5 py-2.5 rounded-[10px] bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-semibold flex items-center justify-center space-x-1.5 shadow-md shadow-[#3B82F6]/20 transition-all cursor-pointer transform active:scale-98"
        >
          <span>Explore Playground</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onScrollToCurriculum}
          className="w-full sm:w-auto px-5 py-2.5 rounded-[10px] bg-[#121620] hover:bg-[#181D2A] text-[#F2F4F8] text-xs font-medium transition-all cursor-pointer"
        >
          View Curriculum
        </button>
      </div>

      <p className="mt-3.5 text-[11px] text-[#737F94] font-normal">
        No setup file restrictions. Instant execution in your browser.
      </p>

      {/* Hero Preview Interactive Graphic (Vector-Sharp & High-Res) */}
      <div className="mt-12 sm:mt-14 w-full relative">
        <div className="relative mx-auto max-w-4xl rounded-[10px] overflow-hidden shadow-2xl shadow-black/80">
          <picture>
            <source srcSet="/images/hero-preview.svg" type="image/svg+xml" />
            <img
              src="/images/hero-preview.png"
              alt="CodeForge Interactive Compiler Playground"
              className="w-full h-auto object-cover rounded-[10px] block"
              loading="eager"
            />
          </picture>
        </div>
      </div>
    </section>
  );
};
