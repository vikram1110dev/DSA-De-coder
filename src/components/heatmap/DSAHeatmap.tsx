'use client';

import React, { useState } from 'react';
import { DSAActivityItem, UserStreakState } from '@/types';
import { generate365DayHeatmap, HeatmapDay, formatDateToHuman } from '@/lib/streak';
import { Flame, Shield, AlertTriangle, Calendar } from 'lucide-react';
import { clsx } from 'clsx';

interface DSAHeatmapProps {
  activities: DSAActivityItem[];
  streak: UserStreakState;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

export const DSAHeatmap: React.FC<DSAHeatmapProps> = ({ activities, streak }) => {
  const days: HeatmapDay[] = generate365DayHeatmap(activities);
  const [hoveredDay, setHoveredDay] = useState<HeatmapDay | null>(null);

  // Split into weeks
  const weeks: HeatmapDay[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  // Calculate month labels with positions
  const monthPositions: { label: string; index: number }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, wIdx) => {
    const firstDay = week[0];
    if (firstDay) {
      const month = new Date(firstDay.date).getMonth();
      if (month !== lastMonth) {
        monthPositions.push({ label: MONTHS[month], index: wIdx });
        lastMonth = month;
      }
    }
  });

  const getLevelColor = (level: number) => {
    switch (level) {
      case 4: return 'bg-emerald-400';
      case 3: return 'bg-emerald-500/80';
      case 2: return 'bg-accent/60';
      case 1: return 'bg-accent/25';
      default: return 'bg-bg-elevated';
    }
  };

  return (
    <div className="surface p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-accent" />
          <h3 className="text-sm font-semibold text-text-primary">Activity Timeline</h3>
          <span className="badge badge-cyan">365 days</span>
        </div>

        {/* Streak status */}
        <div className="flex items-center gap-3">
          {streak.streakAtRisk ? (
            <span className="flex items-center gap-1.5 text-xxs font-medium text-accent-amber">
              <AlertTriangle className="w-3 h-3" />
              Streak at risk
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-xxs font-medium text-state-success">
              <Flame className="w-3 h-3 fill-state-success" />
              {streak.currentStreak}d active
            </span>
          )}
          <span className="flex items-center gap-1 text-xxs text-text-muted">
            <Shield className="w-3 h-3" />
            {streak.freezesAvailable} freezes
          </span>
        </div>
      </div>

      {/* Heatmap grid */}
      <div className="overflow-x-auto pb-1">
        <div className="min-w-max">
          {/* Month labels */}
          <div className="flex ml-8 mb-1">
            {monthPositions.map((m, i) => (
              <div
                key={i}
                className="text-xxs text-text-muted font-medium"
                style={{
                  position: 'relative',
                  left: `${m.index * 14}px`,
                  marginRight: i < monthPositions.length - 1
                    ? `${((monthPositions[i + 1]?.index || 0) - m.index) * 14 - 24}px`
                    : '0px',
                }}
              >
                {m.label}
              </div>
            ))}
          </div>

          <div className="flex gap-0">
            {/* Day-of-week labels */}
            <div className="flex flex-col gap-[3px] mr-1.5 pt-0">
              {DAY_LABELS.map((label, i) => (
                <div key={i} className="h-[11px] flex items-center">
                  <span className="text-xxs text-text-muted w-6 text-right">{label}</span>
                </div>
              ))}
            </div>

            {/* Week columns */}
            <div className="flex gap-[3px]">
              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-[3px]">
                  {week.map((day) => (
                    <button
                      key={day.date}
                      onMouseEnter={() => setHoveredDay(day)}
                      onMouseLeave={() => setHoveredDay(null)}
                      className={clsx(
                        'w-[11px] h-[11px] rounded-[2px] transition-all hover:scale-[1.4] hover:ring-1 hover:ring-text-muted/30',
                        getLevelColor(day.level)
                      )}
                      aria-label={`${day.date}: ${day.count} activities`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend + Tooltip */}
      <div className="flex items-center justify-between">
        {/* Hover detail */}
        <div className="text-xxs text-text-muted min-h-[20px]">
          {hoveredDay ? (
            <span>
              <span className="font-medium text-text-secondary">{formatDateToHuman(hoveredDay.date)}</span>
              <span className="mx-1">—</span>
              <span className="text-accent font-medium">{hoveredDay.count} contribution{hoveredDay.count !== 1 ? 's' : ''}</span>
              {hoveredDay.activities.length > 0 && (
                <span className="text-text-muted ml-1">
                  ({hoveredDay.activities.map(a => a.title).join(', ')})
                </span>
              )}
            </span>
          ) : (
            <span className="italic">Hover over cells to see daily activity</span>
          )}
        </div>

        {/* Scale */}
        <div className="flex items-center gap-1 text-xxs text-text-muted">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((lvl) => (
            <div key={lvl} className={clsx('w-[11px] h-[11px] rounded-[2px]', getLevelColor(lvl))} />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
};
