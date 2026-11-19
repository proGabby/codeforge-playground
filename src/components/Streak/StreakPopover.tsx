import React from 'react';
import { Flame, Check, Sparkles } from 'lucide-react';

interface StreakPopoverProps {
  streakDays: number;
  isStreakActiveToday: boolean;
  onClose: () => void;
  onOpenEmailSync?: () => void;
  userEmail?: string | null;
}

export const StreakPopover: React.FC<StreakPopoverProps> = ({
  streakDays,
  isStreakActiveToday,
  onClose,
  onOpenEmailSync,
  userEmail,
}) => {
  // Generate 30 days for activity heatmap (last 30 days)
  const days = Array.from({ length: 30 }, (_, i) => {
    const dayNumber = 30 - i;
    // Highlight the recent `streakDays` count as active
    const isActive = dayNumber <= streakDays;
    return { dayNumber, isActive };
  }).reverse();

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Popover Card */}
      <div className="absolute right-0 top-full mt-2 w-72 bg-[#121620] text-[#F2F4F8] rounded-[10px] p-4 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1E2536]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-[8px] bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Flame className="w-4 h-4 fill-amber-400" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#F2F4F8]">
                {streakDays} Day{streakDays === 1 ? '' : 's'} Streak
              </h4>
              <p className="text-[10px] text-[#737F94]">
                {isStreakActiveToday ? 'Active for today' : 'Complete a lesson to extend'}
              </p>
            </div>
          </div>
          {isStreakActiveToday && (
            <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              <Check className="w-3 h-3" /> Done
            </span>
          )}
        </div>

        {/* 30-day activity matrix */}
        <div className="py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-semibold text-[#737F94] uppercase tracking-wider">
              Last 30 Days Activity
            </span>
            <span className="text-[10px] text-[#737F94] font-mono">
              {Math.min(streakDays, 30)}/30 Active
            </span>
          </div>

          <div className="grid grid-cols-10 gap-1.5 p-2 bg-[#0B0E14] rounded-[8px]">
            {days.map((d, idx) => (
              <div
                key={idx}
                title={`Day ${idx + 1}: ${d.isActive ? 'Lesson completed' : 'No activity'}`}
                className={`w-4 h-4 rounded-[3px] transition-colors ${
                  d.isActive
                    ? 'bg-[#3B82F6] shadow-sm shadow-blue-500/30'
                    : 'bg-[#161D2B] hover:bg-[#1E273A]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Footer info / Sync prompt */}
        <div className="pt-2 text-center">
          <p className="text-[11px] text-[#99A3B5] leading-relaxed">
            {isStreakActiveToday
              ? 'Great work today! Return tomorrow to keep your momentum.'
              : 'Complete any code run or quiz today to keep your streak burning!'}
          </p>

          {!userEmail && onOpenEmailSync && (
            <button
              onClick={() => {
                onClose();
                onOpenEmailSync();
              }}
              className="mt-3 w-full py-1.5 px-3 rounded-[8px] bg-[#1E2536] hover:bg-[#253046] text-[#F2F4F8] text-[11px] font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#3B82F6]" />
              <span>Sync streak to cloud</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
};
