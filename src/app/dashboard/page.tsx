'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { DSAHeatmap } from '@/components/heatmap/DSAHeatmap';
import { storageService } from '@/lib/storage';
import { UserProfile, UserStreakState, DSAActivityItem, StudyTaskItem } from '@/types';
import {
  Flame,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  BookOpen,
  Eye,
  Code2,
  BarChart3,
  Circle,
  Target,
  TrendingUp,
  Zap
} from 'lucide-react';
import { clsx } from 'clsx';

export default function DashboardPage() {
  const [profile, setProfile] = useState<UserProfile>(storageService.getProfile());
  const [streak, setStreak] = useState<UserStreakState>(storageService.getStreakState());
  const [activities, setActivities] = useState<DSAActivityItem[]>(storageService.getActivities());
  const [tasks, setTasks] = useState<StudyTaskItem[]>(storageService.getDailyTasks());

  useEffect(() => {
    setProfile(storageService.getProfile());
    setStreak(storageService.getStreakState());
    setActivities(storageService.getActivities());
    setTasks(storageService.getDailyTasks());
  }, []);

  const handleToggleTask = (taskId: string) => {
    const updated = storageService.toggleTaskCompletion(taskId);
    setTasks([...updated]);
    setStreak(storageService.getStreakState());
    setActivities(storageService.getActivities());
    setProfile(storageService.getProfile());
  };

  const completedTasks = tasks.filter((t) => t.isCompleted).length;
  const completionPct = Math.round((completedTasks / Math.max(tasks.length, 1)) * 100);

  // Get time-based greeting
  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* ── Section 1: Hero Greeting ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-bold text-text-primary">
              {getGreeting()}, {profile.name}
            </h1>
            <p className="text-xs text-text-muted mt-0.5">
              Ready to decode some DSA today.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Streak pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-accent-amber bg-accent-amber/10 border border-accent-amber/20 rounded-lg">
              <Flame className="w-3.5 h-3.5 fill-accent-amber text-accent-amber" />
              <span>{streak.currentStreak} day streak</span>
            </div>

            {/* Level */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-accent bg-accent-subtle border border-accent/10 rounded-lg">
              <Zap className="w-3.5 h-3.5" />
              <span>Level {profile.level} · {profile.xp} XP</span>
            </div>
          </div>
        </div>

        {/* ── Section 2: Today's Mission ── */}
        <div className="surface p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-accent" />
              <h2 className="text-sm font-semibold text-text-primary">Today's Mission</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xxs font-medium text-text-muted">{completedTasks}/{tasks.length} done</span>
              <div className="w-24 h-1.5 bg-bg-inset rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-500"
                  style={{ width: `${completionPct}%` }}
                />
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={clsx(
                  'flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg border transition-all',
                  task.isCompleted
                    ? 'bg-bg-inset border-border-subtle opacity-60'
                    : 'bg-bg-secondary border-border-default hover:border-accent/20'
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => handleToggleTask(task.id)}
                    className="shrink-0"
                    aria-label={task.isCompleted ? 'Mark incomplete' : 'Mark complete'}
                  >
                    {task.isCompleted ? (
                      <CheckCircle2 className="w-4.5 h-4.5 text-state-success" />
                    ) : (
                      <Circle className="w-4.5 h-4.5 text-text-disabled hover:text-accent transition-colors" />
                    )}
                  </button>
                  <span
                    className={clsx(
                      'text-xs font-medium truncate',
                      task.isCompleted ? 'text-text-disabled line-through' : 'text-text-primary'
                    )}
                  >
                    {task.title}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="badge badge-cyan">+{task.xpReward} XP</span>
                  <span className="text-xxs text-text-muted">{task.estimatedMinutes}m</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Section 3: Continue Learning + Quick Actions ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Continue Learning */}
          <div className="lg:col-span-2 surface-interactive p-5 flex items-center justify-between gap-4">
            <div className="min-w-0 space-y-1">
              <span className="text-xxs font-semibold text-accent tracking-wider uppercase">Continue Learning</span>
              <h3 className="text-sm font-bold text-text-primary truncate">
                Sliding Window Technique
              </h3>
              <p className="text-xs text-text-muted">
                Contraction invariant & hash map index tracking — 68% complete
              </p>
            </div>
            <Link
              href="/learn/sliding-window"
              className="btn-primary shrink-0"
            >
              Continue
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: BookOpen, label: 'Learn', href: '/learn', color: 'text-accent' },
              { icon: Eye, label: 'Visualize', href: '/visualizer', color: 'text-accent-emerald' },
              { icon: Code2, label: 'Practice', href: '/practice', color: 'text-accent-violet' },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="surface-interactive flex flex-col items-center justify-center gap-2 p-4 text-center group"
              >
                <action.icon className={clsx('w-5 h-5', action.color, 'group-hover:scale-110 transition-transform')} />
                <span className="text-xxs font-medium text-text-secondary group-hover:text-text-primary transition-colors">
                  {action.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Section 4: Heatmap + Topic Mastery ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Heatmap */}
          <div className="lg:col-span-2">
            <DSAHeatmap activities={activities} streak={streak} />
          </div>

          {/* Topic Mastery */}
          <div className="surface p-5 space-y-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-accent" />
              <h3 className="text-sm font-semibold text-text-primary">Topic Mastery</h3>
            </div>

            <div className="space-y-3">
              {[
                { topic: 'Arrays & Two Pointers', mastery: 86, color: 'bg-state-success' },
                { topic: 'Strings & Hash Maps', mastery: 74, color: 'bg-accent' },
                { topic: 'Binary Search', mastery: 51, color: 'bg-accent-amber' },
                { topic: 'Graphs (BFS/DFS)', mastery: 42, color: 'bg-accent-rose' },
                { topic: 'Dynamic Programming', mastery: 38, color: 'bg-accent-rose' },
              ].map((item) => (
                <div key={item.topic} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-text-secondary">{item.topic}</span>
                    <span className="text-xxs font-mono text-text-muted">{item.mastery}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-bg-inset rounded-full overflow-hidden">
                    <div
                      className={clsx('h-full rounded-full transition-all duration-700', item.color)}
                      style={{ width: `${item.mastery}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* AI Insight */}
            <div className="surface-inset p-3 mt-2">
              <div className="flex items-start gap-2">
                <Sparkles className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                <p className="text-xxs text-text-muted leading-relaxed">
                  <span className="font-semibold text-accent-amber">Focus needed:</span> DP and Graphs
                  are below 50%. Tomorrow's mission will emphasize recursion trees and BFS patterns.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Section 5: Stats Row ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Problems Solved', value: profile.solvedProblems.length, icon: Code2, color: 'text-accent' },
            { label: 'Topics Learned', value: profile.completedTopics.length, icon: BookOpen, color: 'text-accent-emerald' },
            { label: 'Study Time', value: `${profile.dailyStudyTime}m`, icon: Clock, color: 'text-accent-violet' },
            { label: 'Active Days', value: streak.totalActiveDays, icon: TrendingUp, color: 'text-accent-amber' },
          ].map((stat) => (
            <div key={stat.label} className="surface p-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xxs font-medium text-text-muted">{stat.label}</span>
                <stat.icon className={clsx('w-3.5 h-3.5', stat.color)} />
              </div>
              <div className="text-lg font-bold text-text-primary">{stat.value}</div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
