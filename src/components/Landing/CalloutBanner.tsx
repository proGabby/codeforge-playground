import React from 'react';
import { ArrowRight } from 'lucide-react';

interface CalloutBannerProps {
  onOpenEmailModal: () => void;
}

export const CalloutBanner: React.FC<CalloutBannerProps> = ({ onOpenEmailModal }) => {
  return (
    <section className="py-12 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="bg-[#121620] rounded-[10px] p-7 sm:p-9 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#F2F4F8] tracking-tight">
            Your next skill starts with one line.
          </h2>
          <p className="text-xs sm:text-sm text-[#99A3B5] mt-1.5 font-normal">
            Open the playground. Run your first program. Build from there.
          </p>
        </div>

        <button
          onClick={() => onOpenEmailModal()}
          className="self-start sm:self-auto px-5 py-2.5 rounded-[10px] bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-semibold flex items-center space-x-2 shadow-md shadow-[#3B82F6]/20 transition-all cursor-pointer transform active:scale-98 whitespace-nowrap"
        >
          <span>Start learning for free</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  );
};
