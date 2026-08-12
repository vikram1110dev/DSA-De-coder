'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ACHIEVEMENTS_DATA } from '@/data/achievements';
import { Award, Flame, Sparkles, CheckCircle2, Lock } from 'lucide-react';
import { clsx } from 'clsx';

export default function AchievementsPage() {
  // Simulate unlocked status for first 4 achievements
  const unlockedIds = ['first-step', 'week-warrior', 'problem-solver-bronze', 'visual-learner'];

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-amber-950/30 border border-amber-500/20 rounded-3xl shadow-xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
            <Award className="w-4 h-4" />
            <span>Gamified Milestone Rewards</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            DSA Achievements & Badges
          </h1>
          <p className="text-xs text-slate-400 max-w-xl">
            Earn XP, unlock developer titles, and celebrate your consistent problem solving habits.
          </p>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ACHIEVEMENTS_DATA.map((ach) => {
            const isUnlocked = unlockedIds.includes(ach.id);

            return (
              <div
                key={ach.id}
                className={clsx(
                  'p-6 rounded-3xl border transition-all flex flex-col justify-between space-y-4 shadow-lg relative overflow-hidden',
                  isUnlocked
                    ? 'bg-slate-900 border-amber-500/30 hover:border-amber-500/50'
                    : 'bg-slate-900/40 border-slate-800/60 opacity-60'
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={clsx(
                        'w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-md',
                        isUnlocked ? 'bg-amber-500/20 ring-2 ring-amber-500/30' : 'bg-slate-800 grayscale'
                      )}
                    >
                      {ach.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{ach.title}</h3>
                      <span className="text-[10px] px-2 py-0.2 rounded-full font-bold bg-slate-950 text-amber-400 capitalize border border-slate-800">
                        {ach.category}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold text-amber-400">
                    +{ach.xp} XP
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {ach.description}
                </p>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold">
                  {isUnlocked ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Unlocked & Claimed</span>
                    </span>
                  ) : (
                    <span className="text-slate-500 flex items-center gap-1">
                      <Lock className="w-4 h-4" />
                      <span>Locked Milestone</span>
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
