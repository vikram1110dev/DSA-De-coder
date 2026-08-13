'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { PRACTICE_PROBLEMS } from '@/data/problems';
import { storageService } from '@/lib/storage';
import { Code2, Search, CheckCircle2, ArrowRight, Filter } from 'lucide-react';
import { clsx } from 'clsx';

export default function PracticeCatalogPage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedPattern, setSelectedPattern] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const profile = storageService.getProfile();
  const solvedIds = profile.solvedProblems || [];

  const patterns = [
    'All', 'Hash Map Lookup', 'Dynamic Sliding Window', 'Search Space Reduction',
    'In-Place Pointer Manipulation', 'LIFO Stack Matching', '2D Grid Graph DFS/BFS',
    'Unbounded Knapsack / 1D DP', 'Opposite-End Two Pointers'
  ];

  const filteredProblems = PRACTICE_PROBLEMS.filter((p) => {
    const matchesDiff = selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;
    const matchesPat = selectedPattern === 'All' || p.pattern === selectedPattern;
    const matchesQuery = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.pattern.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDiff && matchesPat && matchesQuery;
  });

  const solvedCount = filteredProblems.filter(p => solvedIds.includes(p.id)).length;

  return (
    <AppLayout>
      <div className="space-y-5">
        {/* Stats bar */}
        <div className="flex items-center gap-4 text-xs font-medium text-text-muted">
          <span>{filteredProblems.length} problems</span>
          <span className="text-state-success">{solvedCount} solved</span>
          <span>{filteredProblems.length - solvedCount} remaining</span>
        </div>

        {/* Filters */}
        <div className="surface p-4 space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Difficulty pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
              {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={clsx(
                    'px-4 py-2 text-sm font-medium rounded-lg transition-all',
                    selectedDifficulty === diff
                      ? 'bg-accent text-bg-primary'
                      : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.04]'
                  )}
                >
                  {diff}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-text-muted absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search problems..."
                className="w-full surface-inset pl-10 pr-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent rounded-lg"
              />
            </div>
          </div>

          {/* Pattern filter */}
          <div className="flex items-center gap-2 pt-2 border-t border-border-subtle">
            <Filter className="w-4 h-4 text-accent" />
            <select
              value={selectedPattern}
              onChange={(e) => setSelectedPattern(e.target.value)}
              className="surface-inset px-3 py-1.5 text-sm text-text-secondary focus:outline-none focus:ring-1 focus:ring-accent rounded-md"
            >
              {patterns.map((pat) => <option key={pat} value={pat}>{pat}</option>)}
            </select>
          </div>
        </div>

        {/* Problems list */}
        <div className="space-y-2.5">
          {filteredProblems.map((prob) => {
            const isSolved = solvedIds.includes(prob.id);
            return (
              <Link
                key={prob.id}
                href={`/practice/${prob.id}`}
                className="surface-interactive flex items-center justify-between gap-4 p-5 group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={clsx(
                    'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                    isSolved ? 'bg-state-success/15 text-state-success' : 'bg-bg-inset text-text-disabled'
                  )}>
                    {isSolved ? <CheckCircle2 className="w-4 h-4" /> : <Code2 className="w-4 h-4" />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors truncate">
                        {prob.title}
                      </h3>
                      <span className="badge badge-cyan">{prob.pattern}</span>
                    </div>
                    <p className="text-xs text-text-muted truncate mt-1 max-w-lg">
                      {prob.summary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <span className={clsx(
                    'badge',
                    prob.difficulty === 'Easy' ? 'badge-emerald'
                      : prob.difficulty === 'Medium' ? 'badge-amber'
                      : 'badge-rose'
                  )}>
                    {prob.difficulty}
                  </span>
                  <span className="text-xs font-mono text-text-muted">+{prob.xpReward} XP</span>
                  <ArrowRight className="w-4 h-4 text-text-disabled group-hover:text-accent transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
