'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { DSAHeatmap } from '@/components/heatmap/DSAHeatmap';
import { storageService } from '@/lib/storage';
import { UserStreakState, DSAActivityItem, UserProfile } from '@/types';
import {
  Activity,
  BarChart3,
  Flame,
  Trophy,
  Calendar,
  Clock,
  CheckCircle2,
  TrendingUp,
  Award,
  Sparkles
} from 'lucide-react';
import { clsx } from 'clsx';

export default function ProgressPage() {
  const [profile, setProfile] = useState<UserProfile>(storageService.getProfile());
  const [streak, setStreak] = useState<UserStreakState>(storageService.getStreakState());
  const [activities, setActivities] = useState<DSAActivityItem[]>(storageService.getActivities());

  useEffect(() => {
    setProfile(storageService.getProfile());
    setStreak(storageService.getStreakState());
    setActivities(storageService.getActivities());
  }, []);

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/30 border border-cyan-500/20 rounded-3xl shadow-xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
            <Activity className="w-4 h-4" />
            <span>Real-time Learning Analytics</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            DSA Progress & Contribution Timeline
          </h1>
          <p className="text-xs text-slate-400 max-w-xl">
            Detailed tracking of solved problems, topic mastery percentages, study hours, and your continuous 365-day activity record.
          </p>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-1 shadow-lg">
            <div className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>Overall Progress</span>
            </div>
            <div className="text-2xl font-black text-white">64%</div>
            <div className="text-[11px] text-cyan-400 font-medium">16 / 25 Topics Mastered</div>
          </div>

          <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-1 shadow-lg">
            <div className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Problems Solved</span>
            </div>
            <div className="text-2xl font-black text-white">141</div>
            <div className="text-[11px] text-emerald-400 font-medium">Easy: 82 • Med: 47 • Hard: 12</div>
          </div>

          <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-1 shadow-lg">
            <div className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>Study Hours</span>
            </div>
            <div className="text-2xl font-black text-white">38h 45m</div>
            <div className="text-[11px] text-indigo-400 font-medium">Avg: 42 mins / day</div>
          </div>

          <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-1 shadow-lg">
            <div className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Total XP & Level</span>
            </div>
            <div className="text-2xl font-black text-white">
              {profile.xp} <span className="text-xs text-amber-400 font-bold">XP</span>
            </div>
            <div className="text-[11px] text-amber-400 font-medium">Level {profile.level} Scholar</div>
          </div>
        </div>

        {/* 365-Day Activity Heatmap */}
        <DSAHeatmap activities={activities} streak={streak} />

        {/* Monthly & Yearly Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Monthly Breakdown */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span>Current Month Performance (August)</span>
              </h3>
              <span className="text-xs font-mono text-cyan-400 font-bold">18 Active Days</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-slate-500 font-bold">Monthly Problems Solved</div>
                <div className="text-lg font-black text-white">42 Problems</div>
              </div>
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-slate-500 font-bold">Study Time Recorded</div>
                <div className="text-lg font-black text-white">16h 35m</div>
              </div>
            </div>
          </div>

          {/* Yearly Historical Record */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Yearly Milestones</span>
              </h3>
              <span className="text-xs font-mono text-amber-400 font-bold">146 Active Days</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-slate-500 font-bold">Total Problems Mastered</div>
                <div className="text-lg font-black text-white">328 Problems</div>
              </div>
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-slate-500 font-bold">Longest Streak Achieved</div>
                <div className="text-lg font-black text-white">31 Days</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
