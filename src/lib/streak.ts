import { DSAActivityItem, UserStreakState } from '@/types';

// Activity scoring rules
export const ACTIVITY_SCORES = {
  LESSON_COMPLETED: 1,
  VISUALIZATION_COMPLETED: 1,
  PROBLEM_SOLVED_EASY: 1,
  PROBLEM_SOLVED_MEDIUM: 2,
  PROBLEM_SOLVED_HARD: 3,
  STUDY_SESSION: 1,
  REVISION_COMPLETED: 1,
  AI_CHALLENGE: 1,
  MOCK_INTERVIEW: 2,
};

export function getTodayDateString(): string {
  const today = new Date();
  return today.toISOString().split('T')[0]; // YYYY-MM-DD
}

export function formatDateToHuman(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

// Calculate streak state based on list of meaningful activities
export function calculateStreak(activities: DSAActivityItem[]): UserStreakState {
  if (!activities || activities.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalActiveDays: 0,
      lastActiveDate: null,
      streakAtRisk: true,
      freezesAvailable: 2
    };
  }

  // Get distinct active dates sorted in ascending order
  const activeDatesSet = new Set(activities.map(a => a.date));
  const activeDates = Array.from(activeDatesSet).sort();
  const totalActiveDays = activeDates.length;

  const todayStr = getTodayDateString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const lastActiveDate = activeDates[activeDates.length - 1];
  const isActiveToday = activeDatesSet.has(todayStr);
  const isActiveYesterday = activeDatesSet.has(yesterdayStr);

  // Calculate current streak
  let currentStreak = 0;
  let checkDate = new Date();

  // If not active today, start checking from yesterday
  if (!isActiveToday) {
    if (!isActiveYesterday) {
      // Streak broken (unless freeze was used)
      currentStreak = 0;
    } else {
      checkDate = yesterday;
    }
  }

  if (isActiveToday || isActiveYesterday) {
    let loopDate = new Date(checkDate);
    while (true) {
      const dStr = loopDate.toISOString().split('T')[0];
      if (activeDatesSet.has(dStr)) {
        currentStreak++;
        loopDate.setDate(loopDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  // Calculate longest streak historically
  let longestStreak = 0;
  let runningStreak = 0;
  let prevDate: Date | null = null;

  for (const dStr of activeDates) {
    const currDate = new Date(dStr + 'T00:00:00');
    if (prevDate) {
      const diffDays = Math.round((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        runningStreak++;
      } else {
        runningStreak = 1;
      }
    } else {
      runningStreak = 1;
    }
    if (runningStreak > longestStreak) {
      longestStreak = runningStreak;
    }
    prevDate = currDate;
  }

  return {
    currentStreak,
    longestStreak: Math.max(longestStreak, currentStreak),
    totalActiveDays,
    lastActiveDate,
    streakAtRisk: !isActiveToday && currentStreak > 0,
    freezesAvailable: 2
  };
}

export interface HeatmapDay {
  date: string; // YYYY-MM-DD
  count: number; // total score
  level: 0 | 1 | 2 | 3 | 4; // 0 = none, 1 = 1, 2 = 2-3, 3 = 4-6, 4 = 7+
  activities: DSAActivityItem[];
}

// Generate full 365-day activity grid
export function generate365DayHeatmap(activities: DSAActivityItem[]): HeatmapDay[] {
  const activityMap = new Map<string, DSAActivityItem[]>();
  
  for (const act of activities) {
    const existing = activityMap.get(act.date) || [];
    existing.push(act);
    activityMap.set(act.date, existing);
  }

  const days: HeatmapDay[] = [];
  const today = new Date();
  
  // 365 days back from today
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    const dayActivities = activityMap.get(dateStr) || [];
    const totalScore = dayActivities.reduce((sum, a) => sum + (a.activityScore || 1), 0);

    let level: 0 | 1 | 2 | 3 | 4 = 0;
    if (totalScore >= 7) level = 4;
    else if (totalScore >= 4) level = 3;
    else if (totalScore >= 2) level = 2;
    else if (totalScore >= 1) level = 1;

    days.push({
      date: dateStr,
      count: totalScore,
      level,
      activities: dayActivities
    });
  }

  return days;
}
