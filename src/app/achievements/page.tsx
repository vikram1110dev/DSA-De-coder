'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ACHIEVEMENTS_DATA } from '@/data/achievements';
import { Award, CheckCircle2, Lock } from 'lucide-react';
import { clsx } from 'clsx';

export default function AchievementsPage() {
  const unlockedIds = ['first-step', 'week-warrior', 'problem-solver-bronze', 'visual-learner'];
  const unlockedCount = unlockedIds.length;

  return (
    <AppLayout>
      <div className="space-y-5">
        {/* Stats */}
        <div className="flex items-center gap-4 text-xxs font-medium text-text-muted">
          <span className="flex items-center gap-1"><Award className="w-3 h-3 text-accent-amber" /> {unlockedCount}/{ACHIEVEMENTS_DATA.length} unlocked</span>
          <span>{ACHIEVEMENTS_DATA.reduce((sum, a) => sum + (unlockedIds.includes(a.id) ? a.xp : 0), 0)} XP earned</span>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ACHIEVEMENTS_DATA.map((ach) => {
            const isUnlocked = unlockedIds.includes(ach.id);
            return (
              <div
                key={ach.id}
                className={clsx(
                  'surface p-4 space-y-3 transition-all',
                  isUnlocked ? 'border-accent-amber/20' : 'opacity-50'
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={clsx(
                      'w-10 h-10 rounded-xl flex items-center justify-center text-xl',
                      isUnlocked ? 'bg-accent-amber/15 ring-1 ring-accent-amber/30' : 'bg-bg-inset grayscale'
                    )}>
                      {ach.icon}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-text-primary">{ach.title}</h3>
                      <span className="badge badge-amber">{ach.category}</span>
                    </div>
                  </div>
                  <span className="text-xxs font-mono font-bold text-accent-amber">+{ach.xp} XP</span>
                </div>

                <p className="text-xxs text-text-muted leading-relaxed">{ach.description}</p>

                <div className="pt-2 border-t border-border-subtle flex items-center text-xxs font-medium">
                  {isUnlocked ? (
                    <span className="text-state-success flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Unlocked
                    </span>
                  ) : (
                    <span className="text-text-disabled flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Locked
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
