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
            className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Problem List</span>
          </Link>

          {/* Mode Switcher: 5-Step Decoder vs Code Editor */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-900 p-1 rounded-2xl border border-slate-800">
              <button
                onClick={() => setViewMode('decoder')}
                className={clsx(
                  'flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all',
                  viewMode === 'decoder'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white'
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
                    ? 'bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
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
                  ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              )}
              title="Bookmark Problem"
            >
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Problem Title Banner */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-3 shadow-xl">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={clsx(
                'px-2.5 py-0.5 rounded-full text-[10px] font-extrabold',
                problem.difficulty === 'Easy'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : problem.difficulty === 'Medium'
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
              )}
            >
              {problem.difficulty}
            </span>

            <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-slate-950 text-cyan-400 border border-slate-800">
              Pattern: {problem.pattern}
            </span>

            <span className="text-[10px] text-slate-500 font-mono">
              Reward: +{problem.xpReward} XP
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {problem.title}
          </h1>

          <div className="text-xs text-slate-300 leading-relaxed font-sans prose prose-invert max-w-none">
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
