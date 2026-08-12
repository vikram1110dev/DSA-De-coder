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
            <div key={cat} className="surface space-y-4 p-5">
              {/* Tier header */}
              <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-md bg-accent-muted text-accent flex items-center justify-center text-xxs font-mono font-bold">
                    {catIdx + 1}
                  </span>
                  <h2 className="text-sm font-bold text-text-primary">{cat}</h2>
                </div>
                <span className="text-xxs font-mono text-text-muted">
                  {catTopics.length} topics
                </span>
              </div>

              {/* Topic cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {catTopics.map((topic) => (
                  <div
                    key={topic.id}
                    className="surface-interactive p-4 space-y-2.5 flex flex-col justify-between group"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className={clsx(
                          'text-xxs font-bold',
                          topic.difficulty === 'Easy' ? 'text-state-success'
                            : topic.difficulty === 'Medium' ? 'text-accent-amber'
                            : 'text-accent-rose'
                        )}>
                          {topic.difficulty}
                        </span>
                        <span className="text-xxs font-mono text-text-disabled">
                          ~{topic.estimatedMinutes}m
                        </span>
                      </div>

                      <h3 className="text-xs font-bold text-text-primary group-hover:text-accent transition-colors">
                        {topic.title}
                      </h3>
                      <p className="text-xxs text-text-muted leading-relaxed line-clamp-2">
                        {topic.summary}
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5 pt-1">
                      <Link
                        href={`/learn/${topic.id}`}
                        className="btn-ghost text-xxs"
                      >
                        <BookOpen className="w-3 h-3" />
                        Learn
                      </Link>
                      <Link href="/visualizer" className="btn-ghost text-xxs">
                        <Eye className="w-3 h-3" />
                        Visualize
                      </Link>
                      <Link href="/practice" className="btn-ghost text-xxs">
                        <Code2 className="w-3 h-3" />
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
