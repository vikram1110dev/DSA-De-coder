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
  Bell,
  BookOpen,
  Eye,
  Code2,
  Cpu,
  BarChart3,
  Award,
  Circle
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

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Top Greeting & AI Recommendation Banner */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/30 border border-cyan-500/20 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span>Good evening, {profile.name}</span>
              <span className="animate-bounce">👋</span>
            </h1>
            <p className="text-xs text-slate-300">
              Ready to decode some DSA? Your algorithmic reasoning is strengthening daily.
            </p>
            <div className="pt-2 p-3 bg-cyan-950/50 border border-cyan-500/30 rounded-2xl text-xs text-cyan-200 flex items-start gap-2 max-w-2xl">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                <strong>AI Recommendation: </strong> You have made solid progress in Arrays. Spend 15 minutes reviewing <strong>Sliding Window</strong> boundary contraction before starting dynamic programming.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/practice"
              className="flex items-center gap-2 px-5 py-3 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:opacity-95 rounded-2xl transition-all shadow-md shadow-cyan-500/20"
            >
              <span>Solve Today's Problem</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* 4 Core Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Streak Card */}
          <Link
            href="/progress"
            className="p-5 bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-3xl space-y-2 transition-all shadow-lg group"
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold">Current Streak</span>
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400 group-hover:scale-125 transition-transform" />
            </div>
            <div className="text-2xl font-black text-white">
              🔥 {streak.currentStreak} <span className="text-xs text-amber-400 font-semibold">Days</span>
            </div>
            <div className="text-[11px] text-emerald-400 font-medium">
              Active & Protected • +{profile.xp} XP
            </div>
          </Link>

          {/* Daily Goal Card */}
          <Link
            href="/planner"
            className="p-5 bg-slate-900 border border-slate-800 hover:border-cyan-500/40 rounded-3xl space-y-2 transition-all shadow-lg group"
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold">Today's Goal</span>
              <CheckCircle2 className="w-4 h-4 text-cyan-400 group-hover:scale-125 transition-transform" />
            </div>
            <div className="text-2xl font-black text-white">
              {completedTasks} / {tasks.length} <span className="text-xs text-cyan-400 font-semibold">Tasks</span>
            </div>
            <div className="text-[11px] text-slate-400">
              {Math.round((completedTasks / Math.max(tasks.length, 1)) * 100)}% Completed today
            </div>
          </Link>

          {/* Study Time Card */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold">Study Time</span>
              <Clock className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white">
              32 / {profile.dailyStudyTime} <span className="text-xs text-emerald-400 font-semibold">Mins</span>
            </div>
            <div className="text-[11px] text-slate-400">
              On track for {profile.targetDays}-day placement target
            </div>
          </div>

          {/* Next Reminder Card */}
          <Link
            href="/reminders"
            className="p-5 bg-slate-900 border border-slate-800 hover:border-purple-500/40 rounded-3xl space-y-2 transition-all shadow-lg group"
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold">Next Reminder</span>
              <Bell className="w-4 h-4 text-purple-400 group-hover:scale-125 transition-transform" />
            </div>
            <div className="text-2xl font-black text-white">
              {profile.preferredTime} <span className="text-xs text-purple-400 font-semibold">Today</span>
            </div>
            <div className="text-[11px] text-slate-400 truncate">
              Daily DSA Mastery Session
            </div>
          </Link>
        </div>

        {/* Middle Split: Continue Learning & Weak-Area Radar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Continue Learning & Today's Tasks */}
          <div className="lg:col-span-2 space-y-6">
            {/* Continue Learning Banner */}
            <div className="p-6 bg-gradient-to-r from-cyan-900/30 to-slate-900 border border-cyan-500/30 rounded-3xl flex items-center justify-between gap-4 shadow-xl">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                  Resume Concept
                </span>
                <h3 className="text-base font-bold text-white">
                  Sliding Window Technique (Dynamic Window)
                </h3>
                <p className="text-xs text-slate-400">
                  Lesson 3: Contraction Invariant & Hash Map Index Tracking (68% complete)
                </p>
              </div>

              <Link
                href="/learn/sliding-window"
                className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-colors shrink-0 flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
              >
                <span>Continue →</span>
              </Link>
            </div>

            {/* Today's Missions List */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Today's Missions</span>
                </h3>
                <Link
                  href="/planner"
                  className="text-xs font-bold text-cyan-400 hover:underline"
                >
                  View Full Schedule →
                </Link>
              </div>

              <div className="space-y-2.5">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className={clsx(
                      'p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3',
                      task.isCompleted
                        ? 'bg-slate-950/60 border-slate-800/60 opacity-80'
                        : 'bg-slate-950 border-slate-800 hover:border-cyan-500/30'
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={() => handleToggleTask(task.id)}
                        className="shrink-0 text-slate-500 hover:text-cyan-400"
                      >
                        {task.isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-600 hover:text-cyan-400" />
                        )}
                      </button>
                      <span
                        className={clsx(
                          'text-xs font-semibold truncate',
                          task.isCompleted ? 'text-slate-500 line-through' : 'text-slate-200'
                        )}
                      >
                        {task.title}
                      </span>
                    </div>

                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-900 border border-slate-800 text-slate-400 shrink-0">
                      +{task.xpReward} XP
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Col: Weak-Topic Mastery Radar */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-cyan-400" />
                  <span>Topic Mastery & Weak-Areas</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Updated today</span>
              </div>

              <div className="space-y-4 pt-4">
                {[
                  { topic: 'Arrays & Two Pointers', mastery: 86, color: 'bg-emerald-400' },
                  { topic: 'Strings & Hash Maps', mastery: 74, color: 'bg-cyan-400' },
                  { topic: 'Binary Search Trees', mastery: 51, color: 'bg-amber-400' },
                  { topic: 'Graphs (BFS/DFS)', mastery: 42, color: 'bg-rose-400' },
                  { topic: 'Dynamic Programming', mastery: 38, color: 'bg-rose-500' },
                ].map((item) => (
                  <div key={item.topic} className="space-y-1 text-xs">
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-300">{item.topic}</span>
                      <span className="text-slate-400 font-mono">{item.mastery}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className={clsx('h-full rounded-full transition-all duration-500', item.color)}
                        style={{ width: `${item.mastery}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 text-[11px] text-slate-300 space-y-1">
              <span className="font-bold text-amber-400">Adaptive AI Note:</span>
              <p className="text-slate-400 leading-tight">
                DP and Graphs need reinforcement. Tomorrow's mission will emphasize recursion trees.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section: 365-Day Activity Heatmap */}
        <DSAHeatmap activities={activities} streak={streak} />
      </div>
    </AppLayout>
  );
}
