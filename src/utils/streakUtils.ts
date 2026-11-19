/**
 * Timezone-safe local date formatting and calendar day streak management.
 */

export function getLocalDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getCalendarDayDiff(dateStr1: string, dateStr2: string): number {
  const [y1, m1, d1] = dateStr1.split('-').map(Number);
  const [y2, m2, d2] = dateStr2.split('-').map(Number);
  const utc1 = Date.UTC(y1, m1 - 1, d1);
  const utc2 = Date.UTC(y2, m2 - 1, d2);
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((utc2 - utc1) / msPerDay);
}

export function evaluateStreakStatus(
  streakDays: number,
  lastCompletedDate?: string,
  completedCount: number = 0
): { streakDays: number; isCompletedToday: boolean } {
  if (!lastCompletedDate) {
    return {
      streakDays: completedCount > 0 ? Math.max(1, streakDays) : 0,
      isCompletedToday: false,
    };
  }

  const today = getLocalDateString();
  const diff = getCalendarDayDiff(lastCompletedDate, today);

  if (diff <= 0) {
    // Completed an exercise today
    return { streakDays: Math.max(1, streakDays), isCompletedToday: true };
  } else if (diff === 1) {
    // Completed yesterday; streak is intact awaiting today's practice
    return { streakDays: Math.max(1, streakDays), isCompletedToday: false };
  } else {
    // Missed yesterday or earlier: streak expired
    return { streakDays: 0, isCompletedToday: false };
  }
}

export function recordExerciseCompletionStreak(
  currentStreakDays: number,
  lastCompletedDate?: string
): { streakDays: number; lastCompletedDate: string; streakIncreased: boolean } {
  const today = getLocalDateString();

  if (!lastCompletedDate) {
    return {
      streakDays: 1,
      lastCompletedDate: today,
      streakIncreased: true,
    };
  }

  const diff = getCalendarDayDiff(lastCompletedDate, today);

  if (diff <= 0) {
    // Already completed today: keep current streak intact
    return {
      streakDays: Math.max(1, currentStreakDays),
      lastCompletedDate: today,
      streakIncreased: false,
    };
  } else if (diff === 1) {
    // Completed yesterday: increment streak!
    return {
      streakDays: (currentStreakDays || 0) + 1,
      lastCompletedDate: today,
      streakIncreased: true,
    };
  } else {
    // Missed a day: start fresh streak at 1
    return {
      streakDays: 1,
      lastCompletedDate: today,
      streakIncreased: true,
    };
  }
}
