'use client';

import React, { useState } from 'react';
import { StudyTaskItem, UserProfile } from '@/types';
import { storageService } from '@/lib/storage';
import {
  CalendarDays,
  CheckCircle2,
  Circle,
  Sparkles,
  BookOpen,
  Eye,
  Code2,
  Flame,
  Award,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { clsx } from 'clsx';
import Link from 'next/link';

export const StudyPlannerView: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(storageService.getProfile());
  const [tasks, setTasks] = useState<StudyTaskItem[]>(storageService.getDailyTasks());

  const handleToggleTask = (taskId: string) => {
    const updated = storageService.toggleTaskCompletion(taskId);
    setTasks([...updated]);
    setProfile(storageService.getProfile());
  };

  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const progressPct = Math.round((completedCount / Math.max(tasks.length, 1)) * 100);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/30 border border-cyan-500/20 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
            <Sparkles className="w-4 h-4" />
            <span>AI Adaptive Roadmap • Day 13 of {profile.targetDays}</span>
          </div>
          <h2 className="text-xl font-extrabold text-white">
            Daily DSA Missions & Spaced Revision
          </h2>
          <p className="text-xs text-slate-400 max-w-xl">
            Target Goal: <strong className="text-slate-200 capitalize">{profile.goal} Preparation</strong> in <strong className="text-slate-200">{profile.targetDays} Days</strong>. Personalized daily schedule optimized around your weak areas.
          </p>
        </div>

        {/* Daily Goal Gauge */}
        <div className="flex items-center gap-4 p-4 bg-slate-950/80 border border-slate-800 rounded-2xl shrink-0">
          <div className="text-center">
            <div className="text-2xl font-black text-cyan-400">
              {completedCount} / {tasks.length}
            </div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">Tasks Completed</div>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-cyan-400 flex items-center justify-center font-bold text-xs text-white">
            {progressPct}%
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-cyan-400" />
          <span>Today's Actionable Missions</span>
        </h3>

        <div className="grid grid-cols-1 gap-3">
          {tasks.map((task) => {
            const Icon =
              task.type === 'concept'
                ? BookOpen
                : task.type === 'visualizer'
                ? Eye
                : task.type === 'practice'
                ? Code2
                : Sparkles;

            return (
              <div
                key={task.id}
                className={clsx(
                  'p-4 rounded-2xl border transition-all flex items-center justify-between gap-4',
                  task.isCompleted
                    ? 'bg-slate-900/40 border-slate-800/60 opacity-80'
                    : 'bg-slate-900 border-slate-800 hover:border-cyan-500/40 shadow-md'
                )}
              >
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <button
                    onClick={() => handleToggleTask(task.id)}
                    className="shrink-0 p-1 text-slate-500 hover:text-cyan-400 transition-colors"
                  >
                    {task.isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-600 hover:text-cyan-400" />
                    )}
                  </button>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={clsx(
                          'text-xs font-bold truncate',
                          task.isCompleted ? 'text-slate-400 line-through' : 'text-slate-100'
                        )}
                      >
                        {task.title}
                      </span>
                      <span className="text-[10px] px-2 py-0.2 rounded-full font-bold bg-slate-800 text-slate-400">
                        +{task.xpReward} XP
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {task.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="hidden sm:inline-block text-[11px] text-slate-500 font-mono">
                    ~{task.estimatedMinutes} mins
                  </span>

                  <Link
                    href={
                      task.type === 'concept'
                        ? `/learn/${task.topicId}`
                        : task.type === 'visualizer'
                        ? '/visualizer'
                        : task.type === 'practice'
                        ? '/practice'
                        : '/ai-decoder'
                    }
                    className="p-2 bg-slate-800 hover:bg-cyan-500 text-slate-400 hover:text-slate-950 rounded-xl transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Spaced Revision Timeline */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-cyan-400" />
            <span>Automated Spaced Revision Schedule (Ebbinghaus Curve)</span>
          </h3>
          <span className="text-xs text-slate-400">Retention Rate: 94%</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-4 bg-slate-950 border border-emerald-500/30 rounded-2xl">
            <div className="text-emerald-400 font-bold">Day 1 (Today)</div>
            <div className="text-slate-200 mt-1 font-sans font-semibold">Sliding Window</div>
            <div className="text-[11px] text-slate-500 font-sans mt-1">Concept + Visualization</div>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
            <div className="text-cyan-400 font-bold">Day 3 (In 2 days)</div>
            <div className="text-slate-200 mt-1 font-sans font-semibold">Binary Search</div>
            <div className="text-[11px] text-slate-500 font-sans mt-1">Boundary Condition Lab</div>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
            <div className="text-indigo-400 font-bold">Day 7 (Next Week)</div>
            <div className="text-slate-200 mt-1 font-sans font-semibold">Linked Lists & Pointers</div>
            <div className="text-[11px] text-slate-500 font-sans mt-1">Cycle Detection Review</div>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
            <div className="text-purple-400 font-bold">Day 14 (Fortnight)</div>
            <div className="text-slate-200 mt-1 font-sans font-semibold">Big-O & Hash Maps</div>
            <div className="text-[11px] text-slate-500 font-sans mt-1">Speed Coding Drill</div>
          </div>
        </div>
      </div>
    </div>
  );
};
