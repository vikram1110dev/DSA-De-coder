'use client';

import React, { useState } from 'react';
import { DSAActivityItem, UserStreakState } from '@/types';
import { generate365DayHeatmap, HeatmapDay, formatDateToHuman } from '@/lib/streak';
import { Flame, Shield, AlertTriangle, Trophy, Calendar, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';

interface DSAHeatmapProps {
  activities: DSAActivityItem[];
  streak: UserStreakState;
}

export const DSAHeatmap: React.FC<DSAHeatmapProps> = ({ activities, streak }) => {
  const days: HeatmapDay[] = generate365DayHeatmap(activities);
  const [hoveredDay, setHoveredDay] = useState<HeatmapDay | null>(null);

  // Split 365 days into 52 weeks (columns of 7 days)
  const weeks: HeatmapDay[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const getLevelColor = (level: number) => {
    switch (level) {
      case 4:
        return 'bg-emerald-400 shadow-sm shadow-emerald-400/40 border border-emerald-300';
      case 3:
        return 'bg-emerald-500/80 border border-emerald-500';
      case 2:
        return 'bg-cyan-500/60 border border-cyan-500/50';
      case 1:
        return 'bg-cyan-800/40 border border-cyan-700/40';
      default:
        return 'bg-slate-900 border border-slate-800/60';
    }
  };

  return (
    <div className="space-y-6">
      {/* Streak Alert / Risk Banners */}
      {streak.streakAtRisk ? (
        <div className="p-4 bg-gradient-to-r from-amber-500/15 via-slate-900 to-amber-950/20 border border-amber-500/30 rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-300">
                ⚠️ Your {streak.currentStreak}-day streak is at risk today!
              </div>
              <div className="text-[11px] text-slate-400">
                Complete at least one meaningful DSA activity (lesson, problem, or visualizer) to secure your streak before midnight.
              </div>
            </div>
          </div>
          <a
            href="/practice"
            className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors shrink-0 shadow-md shadow-amber-500/20"
          >
            Solve a Problem →
          </a>
        </div>
      ) : (
        <div className="p-4 bg-gradient-to-r from-emerald-500/15 via-slate-900 to-cyan-950/20 border border-emerald-500/30 rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Flame className="w-5 h-5 fill-emerald-400" />
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-300">
                🔥 Streak Secured! ({streak.currentStreak} Days Active)
              </div>
              <div className="text-[11px] text-slate-400">
                Great job! Today's meaningful DSA activity has been recorded on your timeline.
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 border border-emerald-500/30 rounded-xl text-xs font-bold text-emerald-300">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>{streak.freezesAvailable} Freezes Available</span>
          </div>
        </div>
      )}

      {/* Streak Metric Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Current Streak</span>
          </div>
          <div className="text-xl font-extrabold text-white">
            {streak.currentStreak} <span className="text-xs text-amber-400 font-semibold">days</span>
          </div>
        </div>

        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-cyan-400" />
            <span>Longest Streak</span>
          </div>
          <div className="text-xl font-extrabold text-white">
            {streak.longestStreak} <span className="text-xs text-cyan-400 font-semibold">days</span>
          </div>
        </div>

        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>Total Active Days</span>
          </div>
          <div className="text-xl font-extrabold text-white">
            {streak.totalActiveDays} <span className="text-xs text-emerald-400 font-semibold">days</span>
          </div>
        </div>

        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-indigo-400" />
            <span>Streak Freeze</span>
          </div>
          <div className="text-xl font-extrabold text-white">
            {streak.freezesAvailable} <span className="text-xs text-indigo-400 font-semibold">available</span>
          </div>
        </div>
      </div>

      {/* Heatmap Card */}
      <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>DSA Activity Timeline</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                Last 365 Days
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Hover over any square to view exact problem and lesson contributions for that day.
            </p>
          </div>

          {/* Activity Intensity Scale */}
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
            <span>Less</span>
            {[0, 1, 2, 3, 4].map((lvl) => (
              <div
                key={lvl}
                className={clsx('w-2.5 h-2.5 rounded-sm', getLevelColor(lvl))}
              />
            ))}
            <span>More</span>
          </div>
        </div>

        {/* Heatmap Grid (52 Weeks x 7 Days) */}
        <div className="overflow-x-auto pb-2 custom-scrollbar">
          <div className="flex gap-1.5 min-w-max p-1">
            {weeks.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-1.5">
                {week.map((day) => (
                  <button
                    key={day.date}
                    onMouseEnter={() => setHoveredDay(day)}
                    className={clsx(
                      'w-3 h-3 rounded-[3px] transition-all hover:scale-125 focus:outline-none',
                      getLevelColor(day.level)
                    )}
                    aria-label={`${day.date}: ${day.count} activities`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Tooltip Detail View */}
        <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl min-h-[56px] flex items-center justify-between text-xs">
          {hoveredDay ? (
            <>
              <div>
                <span className="font-bold text-cyan-300 font-mono">
                  {formatDateToHuman(hoveredDay.date)}
                </span>
                <span className="text-slate-400 ml-2">
                  — {hoveredDay.count} Contribution{hoveredDay.count === 1 ? '' : 's'}
                </span>
                {hoveredDay.activities.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-1 text-[11px] text-slate-300">
                    {hoveredDay.activities.map((a, i) => (
                      <span key={i} className="px-2 py-0.2 bg-slate-900 rounded-md border border-slate-800">
                        • {a.title}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-cyan-500/20 text-cyan-400">
                Tier {hoveredDay.level}
              </span>
            </>
          ) : (
            <div className="text-slate-500 italic text-[11px]">
              Hover over any square on the timeline above to view details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
