'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { DSAHeatmap } from '@/components/heatmap/DSAHeatmap';
import { storageService } from '@/lib/storage';
import { UserStreakState, DSAActivityItem, UserProfile } from '@/types';
import {
  TrendingUp, CheckCircle2, Clock, Award, Calendar, Trophy
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
      <div className="space-y-5">
        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Overall Progress', value: '64%', detail: '16 / 25 Topics', icon: TrendingUp, color: 'text-accent' },
            { label: 'Problems Solved', value: '141', detail: 'Easy 82 · Med 47 · Hard 12', icon: CheckCircle2, color: 'text-state-success' },
            { label: 'Study Hours', value: '38h 45m', detail: 'Avg: 42 mins / day', icon: Clock, color: 'text-accent-violet' },
            { label: 'Total XP', value: `${profile.xp}`, detail: `Level ${profile.level} Scholar`, icon: Award, color: 'text-accent-amber' },
          ].map((stat) => (
            <div key={stat.label} className="surface p-4 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xxs font-medium text-text-muted">{stat.label}</span>
                <stat.icon className={clsx('w-3.5 h-3.5', stat.color)} />
              </div>
              <div className="text-lg font-bold text-text-primary">{stat.value}</div>
              <div className={clsx('text-xxs font-medium', stat.color)}>{stat.detail}</div>
            </div>
          ))}
        </div>

        {/* Heatmap */}
        <DSAHeatmap activities={activities} streak={streak} />

        {/* Monthly + Yearly */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="surface p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-border-subtle pb-2.5">
              <h3 className="text-xs font-semibold text-text-primary flex items-center gap-2">
                <Calendar className="w-4 h-4 text-accent" /> This Month
              </h3>
              <span className="text-xxs font-mono text-accent">18 active days</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="surface-inset p-3 space-y-0.5">
                <div className="text-xxs text-text-muted">Problems Solved</div>
                <div className="text-sm font-bold text-text-primary">42</div>
              </div>
              <div className="surface-inset p-3 space-y-0.5">
                <div className="text-xxs text-text-muted">Study Time</div>
                <div className="text-sm font-bold text-text-primary">16h 35m</div>
              </div>
            </div>
          </div>

          <div className="surface p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-border-subtle pb-2.5">
              <h3 className="text-xs font-semibold text-text-primary flex items-center gap-2">
                <Trophy className="w-4 h-4 text-accent-amber" /> Yearly Milestones
              </h3>
              <span className="text-xxs font-mono text-accent-amber">146 active days</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="surface-inset p-3 space-y-0.5">
                <div className="text-xxs text-text-muted">Total Mastered</div>
                <div className="text-sm font-bold text-text-primary">328</div>
              </div>
              <div className="surface-inset p-3 space-y-0.5">
                <div className="text-xxs text-text-muted">Longest Streak</div>
                <div className="text-sm font-bold text-text-primary">31 Days</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
