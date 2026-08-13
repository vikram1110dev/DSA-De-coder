'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ACHIEVEMENTS_DATA } from '@/data/achievements';
import { Award, CheckCircle2, Lock, Sparkles, Trophy } from 'lucide-react';
import { clsx } from 'clsx';
import confetti from 'canvas-confetti';

export default function AchievementsPage() {
  const unlockedIds = ['first-step', 'week-warrior', 'problem-solver-bronze', 'visual-learner'];
  const unlockedCount = unlockedIds.length;

  const totalXP = ACHIEVEMENTS_DATA.reduce((sum, a) => sum + (unlockedIds.includes(a.id) ? a.xp : 0), 0);
  const currentLevel = Math.floor(totalXP / 500) + 1;
  const xpForNextLevel = 500;
  const currentLevelXP = totalXP % xpForNextLevel;
  const progressPercent = Math.min((currentLevelXP / xpForNextLevel) * 100, 100);

  const handleBadgeClick = (isUnlocked: boolean) => {
    if (isUnlocked) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#fbbf24', '#f59e0b', '#3b82f6', '#10b981'],
      });
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Modern XP Progress Dashboard */}
        <div className="surface p-6 border border-border-default rounded-3xl shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-accent-amber/20 text-accent-amber flex items-center justify-center shadow-lg">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
                  Level {currentLevel} Scholar
                </h2>
                <p className="text-xs text-text-secondary">
                  Unlock more badges by completing daily tasks and algorithms.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold text-text-muted bg-bg-inset px-4 py-2 rounded-2xl border border-border-default">
              <span className="flex items-center gap-1"><Award className="w-4 h-4 text-accent-amber" /> {unlockedCount}/{ACHIEVEMENTS_DATA.length} Unlocked</span>
              <span className="w-px h-4 bg-border-default" />
              <span className="flex items-center gap-1 text-accent-amber"><Sparkles className="w-4 h-4" /> {totalXP} Total XP</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xxs font-bold text-text-secondary">
              <span>LEVEL PROGRESS</span>
              <span>{currentLevelXP} / {xpForNextLevel} XP to Level {currentLevel + 1}</span>
            </div>
            <div className="w-full h-3 bg-bg-inset rounded-full overflow-hidden p-0.5 border border-border-default">
              <div
                className="h-full bg-gradient-to-r from-accent-amber to-accent-orange rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ACHIEVEMENTS_DATA.map((ach) => {
            const isUnlocked = unlockedIds.includes(ach.id);
            return (
              <div
                key={ach.id}
                onClick={() => handleBadgeClick(isUnlocked)}
                className={clsx(
                  'surface p-5 space-y-3 transition-all border border-border-default rounded-3xl shadow-lg',
                  isUnlocked
                    ? 'hover:border-accent-amber/50 cursor-pointer hover:shadow-xl hover:scale-[1.01]'
                    : 'opacity-50 select-none'
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={clsx(
                      'w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner',
                      isUnlocked ? 'bg-accent-amber/10 border border-accent-amber/30' : 'bg-bg-inset grayscale'
                    )}>
                      {ach.icon}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-text-primary">{ach.title}</h3>
                      <span className="badge badge-amber mt-1">{ach.category}</span>
                    </div>
                  </div>
                  <span className="text-xxs font-mono font-bold text-accent-amber">+{ach.xp} XP</span>
                </div>

                <p className="text-xxs text-text-muted leading-relaxed">{ach.description}</p>

                <div className="pt-3 border-t border-border-subtle flex items-center text-xxs font-semibold">
                  {isUnlocked ? (
                    <span className="text-state-success flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 fill-state-success/10" /> Unlocked (Click for cheer!)
                    </span>
                  ) : (
                    <span className="text-text-disabled flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" /> Locked
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
