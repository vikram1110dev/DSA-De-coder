'use client';

import React from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { DSA_TOPICS } from '@/data/topics';
import {
  CheckCircle2, ArrowRight, BookOpen, Eye, Code2
} from 'lucide-react';
import { clsx } from 'clsx';

export default function RoadmapPage() {
  const categories = ['Foundations', 'Data Structures', 'Algorithms', 'Advanced'];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Roadmap tiers */}
        {categories.map((cat, catIdx) => {
          const catTopics = DSA_TOPICS.filter((t) => t.category === cat);

          return (
            <div key={cat} className="surface space-y-5 p-6">
              {/* Tier header */}
              <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-md bg-accent-muted text-accent flex items-center justify-center text-xs font-mono font-bold">
                    {catIdx + 1}
                  </span>
                  <h2 className="text-lg font-bold text-text-primary">{cat}</h2>
                </div>
                <span className="text-xs font-mono text-text-muted">
                  {catTopics.length} topics
                </span>
              </div>

              {/* Topic cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {catTopics.map((topic) => (
                  <div
                    key={topic.id}
                    className="surface-interactive p-5 space-y-3 flex flex-col justify-between group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={clsx(
                          'text-xs font-bold',
                          topic.difficulty === 'Easy' ? 'text-state-success'
                            : topic.difficulty === 'Medium' ? 'text-accent-amber'
                            : 'text-accent-rose'
                        )}>
                          {topic.difficulty}
                        </span>
                        <span className="text-xs font-mono text-text-disabled">
                          ~{topic.estimatedMinutes}m
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-text-primary group-hover:text-accent transition-colors">
                        {topic.title}
                      </h3>
                      <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
                        {topic.summary}
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 pt-2">
                      <Link
                        href={`/learn/${topic.id}`}
                        className="btn-ghost text-xs"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        Learn
                      </Link>
                      <Link href="/visualizer" className="btn-ghost text-xs">
                        <Eye className="w-3.5 h-3.5" />
                        Visualize
                      </Link>
                      <Link href="/practice" className="btn-ghost text-xs">
                        <Code2 className="w-3.5 h-3.5" />
                        Practice
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </AppLayout>
  );
}
