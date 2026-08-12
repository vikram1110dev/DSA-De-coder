'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { PRACTICE_PROBLEMS } from '@/data/problems';
import { GuidedProblemDecoder } from '@/components/decoder/GuidedProblemDecoder';
import { CodeEditor } from '@/components/practice/CodeEditor';
import {
  ArrowLeft,
  Lightbulb,
  Code2,
  Cpu,
  Bookmark,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Clock,
  Layers
} from 'lucide-react';
import { clsx } from 'clsx';
import { storageService } from '@/lib/storage';

export default function ProblemDetailPage() {
  const params = useParams();
  const problemId = params.problemId as string;

  const problem = PRACTICE_PROBLEMS.find((p) => p.id === problemId) || PRACTICE_PROBLEMS[0];
  const [viewMode, setViewMode] = useState<'decoder' | 'editor'>('decoder');
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleToggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    storageService.toggleBookmark({
      id: `bm_${problem.id}`,
      itemType: 'problem',
      itemId: problem.id,
      title: problem.title,
      subtitle: `${problem.difficulty} • ${problem.pattern}`,
      createdAt: 'Just now'
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Top Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/practice"
            className="flex items-center gap-2 text-xs font-bold text-text-muted hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Problem List</span>
          </Link>

          {/* Mode Switcher: 5-Step Decoder vs Code Editor */}
          <div className="flex items-center gap-2">
            <div className="flex items-center surface p-1 rounded-2xl border border-border-default">
              <button
                onClick={() => setViewMode('decoder')}
                className={clsx(
                  'flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all',
                  viewMode === 'decoder'
                    ? 'bg-accent text-white shadow-md shadow-accent/20'
                    : 'text-text-muted hover:text-text-primary'
                )}
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>1. Decode Logic</span>
              </button>

              <button
                onClick={() => setViewMode('editor')}
                className={clsx(
                  'flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all',
                  viewMode === 'editor'
                    ? 'bg-gradient-to-r from-accent-emerald to-accent text-white shadow-md'
                    : 'text-text-muted hover:text-text-primary'
                )}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>2. Code & Test</span>
              </button>
            </div>

            <button
              onClick={handleToggleBookmark}
              className={clsx(
                'p-2.5 rounded-xl border transition-colors',
                isBookmarked
                  ? 'bg-accent/20 border-accent/40 text-accent'
                  : 'surface border-border-default text-text-muted hover:text-text-primary'
              )}
              title="Bookmark Problem"
            >
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Problem Title Banner */}
        <div className="p-6 surface border border-border-default rounded-3xl space-y-3 shadow-xl">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={clsx(
                'px-2.5 py-0.5 rounded-full text-[10px] font-extrabold',
                problem.difficulty === 'Easy'
                  ? 'bg-state-success/15 text-state-success border border-state-success/30'
                  : problem.difficulty === 'Medium'
                  ? 'bg-state-warning/15 text-state-warning border border-state-warning/30'
                  : 'bg-state-error/15 text-state-error border border-state-error/30'
              )}
            >
              {problem.difficulty}
            </span>

            <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-bg-inset text-accent border border-border-default">
              Pattern: {problem.pattern}
            </span>

            <span className="text-[10px] text-text-muted font-mono">
              Reward: +{problem.xpReward} XP
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-text-primary">
            {problem.title}
          </h1>

          <div className="text-xs text-text-secondary leading-relaxed font-sans prose dark:prose-invert max-w-none">
            <p className="whitespace-pre-wrap">{problem.problemStatement}</p>
          </div>
        </div>

        {/* Conditional View: 5-Step Decoder vs Code Editor */}
        {viewMode === 'decoder' ? (
          <GuidedProblemDecoder
            problem={problem}
            onProceedToCode={() => setViewMode('editor')}
          />
        ) : (
          <CodeEditor problem={problem} onDecodedClick={() => setViewMode('decoder')} />
        )}
      </div>
    </AppLayout>
  );
}
