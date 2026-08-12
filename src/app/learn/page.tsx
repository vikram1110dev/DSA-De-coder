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
        <div className="p-6 sm:p-8 bg-gradient-to-r from-accent/20 via-bg-surface to-accent-violet/10 border border-accent/20 rounded-3xl shadow-xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-accent">
            <BookOpen className="w-4 h-4" />
            <span>Structured DSA Curriculum</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-text-primary">
            Learn Data Structures & Algorithms
          </h1>
          <p className="text-xs text-text-muted max-w-xl">
            Deep intuitive guides across 4 learning modes (Beginner, Standard, Deep Dive, Interview), with step-by-step dry runs, complexities, edge cases, and mistakes to avoid.
          </p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 surface rounded-2xl">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto custom-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={clsx(
                  'px-3.5 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all',
                  selectedCategory === cat
                    ? 'bg-accent text-white shadow-sm shadow-accent/20'
                    : 'text-text-muted hover:text-text-primary bg-bg-inset'
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-text-muted absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter topics by name or concept..."
              className="w-full bg-bg-inset border border-border-default rounded-xl pl-9 pr-3 py-2 text-xs text-text-primary focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTopics.map((topic) => (
            <Link
              key={topic.id}
              href={`/learn/${topic.id}`}
              className="p-6 rounded-3xl surface-interactive flex flex-col justify-between space-y-4 shadow-lg group card-hover"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-bg-inset text-accent border border-border-default">
                    {topic.category}
                  </span>
                  <span
                    className={clsx(
                      'text-[10px] font-bold',
                      topic.difficulty === 'Easy'
                        ? 'text-state-success'
                        : topic.difficulty === 'Medium'
                        ? 'text-state-warning'
                        : 'text-state-error'
                    )}
                  >
                    {topic.difficulty}
                  </span>
                </div>

                <h3 className="text-base font-bold text-text-primary group-hover:text-accent transition-colors">
                  {topic.title}
                </h3>
                <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
                  {topic.summary}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[10px] font-semibold text-text-secondary">
                  ~{topic.estimatedMinutes} mins
                </span>
                <span className="text-xs font-bold text-accent flex items-center gap-1 group-hover:gap-1.5 transition-all">
                  Start Lesson <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
