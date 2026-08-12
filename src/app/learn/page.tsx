'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { DSA_TOPICS } from '@/data/topics';
import { BookOpen, Search, Sparkles, ArrowRight, Eye, Layers } from 'lucide-react';
import { clsx } from 'clsx';

export default function LearnPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Foundations', 'Data Structures', 'Algorithms', 'Advanced'];

  const filteredTopics = DSA_TOPICS.filter((topic) => {
    const matchesCat = selectedCategory === 'All' || topic.category === selectedCategory;
    const matchesQuery =
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/30 border border-cyan-500/20 rounded-3xl shadow-xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
            <BookOpen className="w-4 h-4" />
            <span>Structured DSA Curriculum</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            Learn Data Structures & Algorithms
          </h1>
          <p className="text-xs text-slate-400 max-w-xl">
            Deep intuitive guides across 4 learning modes (Beginner, Standard, Deep Dive, Interview), with step-by-step dry runs, complexities, edge cases, and mistakes to avoid.
          </p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto custom-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={clsx(
                  'px-3.5 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all',
                  selectedCategory === cat
                    ? 'bg-cyan-500 text-slate-950 shadow-sm shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white bg-slate-800'
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter topics by name or concept..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTopics.map((topic) => (
            <Link
              key={topic.id}
              href={`/learn/${topic.id}`}
              className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4 shadow-lg group card-hover"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-950 text-cyan-400 border border-slate-800">
                    {topic.category}
                  </span>
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
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {topic.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {topic.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono text-[11px]">~{topic.estimatedMinutes} mins</span>
                <span className="text-cyan-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Start Lesson</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
