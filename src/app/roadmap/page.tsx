'use client';

import React from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { DSA_TOPICS } from '@/data/topics';
import {
  Milestone,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  Layers,
  BookOpen,
  Eye,
  Code2
} from 'lucide-react';
import { clsx } from 'clsx';

export default function RoadmapPage() {
  const categories = ['Foundations', 'Data Structures', 'Algorithms', 'Advanced'];

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/30 border border-cyan-500/20 rounded-3xl shadow-xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
            <Milestone className="w-4 h-4" />
            <span>Interactive Placement Curriculum</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            Visual DSA Roadmap
          </h1>
          <p className="text-xs text-slate-400 max-w-xl">
            A structured path from Big-O foundations to dynamic programming and advanced graph traversals. Each node connects lessons, simulations, and practice labs.
          </p>
        </div>

        {/* Roadmap Tier Sections */}
        <div className="space-y-8">
          {categories.map((cat, catIdx) => {
            const catTopics = DSA_TOPICS.filter((t) => t.category === cat);

            return (
              <div
                key={cat}
                className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-6 shadow-xl relative overflow-hidden"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-mono font-bold">
                      {catIdx + 1}
                    </span>
                    <h2 className="text-base font-bold text-white">{cat} Tier</h2>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    {catTopics.length} Concepts
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {catTopics.map((topic) => (
                    <div
                      key={topic.id}
                      className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-3 flex flex-col justify-between group shadow-md"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span
                            className={clsx(
                              'text-[10px] font-bold',
                              topic.difficulty === 'Easy'
                                ? 'text-emerald-400'
                                : topic.difficulty === 'Medium'
                                ? 'text-amber-400'
                                : 'text-rose-400'
                            )}
                          >
                            {topic.difficulty}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            ~{topic.estimatedMinutes}m
                          </span>
                        </div>

                        <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {topic.title}
                        </h3>
                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                          {topic.summary}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-xs">
                        <Link
                          href={`/learn/${topic.id}`}
                          className="text-cyan-400 hover:underline font-bold flex items-center gap-1"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Learn Concept</span>
                        </Link>

                        <Link
                          href={`/visualizer`}
                          className="p-1.5 text-slate-400 hover:text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
                          title="Open Visualizer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
