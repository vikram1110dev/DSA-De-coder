'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { PRACTICE_PROBLEMS } from '@/data/problems';
import { storageService } from '@/lib/storage';
import {
  Code2,
  Search,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Bookmark,
  Layers,
  Filter
} from 'lucide-react';
import { clsx } from 'clsx';

export default function PracticeCatalogPage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedPattern, setSelectedPattern] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const profile = storageService.getProfile();
  const solvedIds = profile.solvedProblems || [];

  const patterns = [
    'All',
    'Hash Map Lookup',
    'Dynamic Sliding Window',
    'Search Space Reduction',
    'In-Place Pointer Manipulation',
    'LIFO Stack Matching',
    '2D Grid Graph DFS/BFS',
    'Unbounded Knapsack / 1D DP',
    'Opposite-End Two Pointers'
  ];

  const filteredProblems = PRACTICE_PROBLEMS.filter((p) => {
    const matchesDiff = selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;
    const matchesPat = selectedPattern === 'All' || p.pattern === selectedPattern;
    const matchesQuery =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.pattern.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDiff && matchesPat && matchesQuery;
  });

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-emerald-950/30 border border-emerald-500/20 rounded-3xl shadow-xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
            <Code2 className="w-4 h-4" />
            <span>50+ Interactive Coding Labs</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            DSA Practice Platform & Problem Decoder
          </h1>
          <p className="text-xs text-slate-400 max-w-xl">
            Test your understanding through guided 5-step problem decoding, progressive hints, multi-language sandbox, and instant test case verification.
          </p>
        </div>

        {/* Filters & Search */}
        <div className="space-y-3 p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Difficulty Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
              {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={clsx(
                    'px-3 py-1.5 text-xs font-bold rounded-xl transition-all',
                    selectedDifficulty === diff
                      ? 'bg-cyan-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white bg-slate-800'
                  )}
                >
                  {diff}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search problems by name or pattern..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Pattern Dropdown Filter */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80 text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-cyan-400" />
              Filter by Pattern:
            </span>
            <select
              value={selectedPattern}
              onChange={(e) => setSelectedPattern(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1 text-xs text-slate-300 font-medium focus:outline-none focus:border-cyan-500"
            >
              {patterns.map((pat) => (
                <option key={pat} value={pat}>
                  {pat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Problems Table / Cards */}
        <div className="grid grid-cols-1 gap-3">
          {filteredProblems.map((prob) => {
            const isSolved = solvedIds.includes(prob.id);

            return (
              <Link
                key={prob.id}
                href={`/practice/${prob.id}`}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group shadow-md"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={clsx(
                      'w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0',
                      isSolved
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-500'
                    )}
                  >
                    {isSolved ? <CheckCircle2 className="w-4 h-4" /> : <Code2 className="w-4 h-4" />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                        {prob.title}
                      </h3>
                      <span className="text-[10px] px-2 py-0.2 rounded-full font-bold bg-slate-950 text-cyan-400 border border-slate-800">
                        {prob.pattern}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5 max-w-xl">
                      {prob.summary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center shrink-0 text-xs">
                  <span
                    className={clsx(
                      'px-2.5 py-0.5 rounded-full font-bold text-[10px]',
                      prob.difficulty === 'Easy'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : prob.difficulty === 'Medium'
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                    )}
                  >
                    {prob.difficulty}
                  </span>

                  <span className="text-[11px] text-slate-500 font-mono">
                    +{prob.xpReward} XP
                  </span>

                  <div className="p-2 bg-slate-800 text-slate-400 group-hover:bg-cyan-500 group-hover:text-slate-950 rounded-xl transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
