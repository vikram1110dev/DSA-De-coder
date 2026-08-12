'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { DSA_TOPICS } from '@/data/topics';
import { AIMode, ProgrammingLanguage } from '@/types';
import { storageService } from '@/lib/storage';
import {
  BookOpen,
  ArrowLeft,
  ArrowRight,
  Eye,
  Code2,
  Sparkles,
  Layers,
  AlertTriangle,
  Clock,
  Briefcase,
  CheckCircle2,
  Bookmark,
  Share2,
  StickyNote
} from 'lucide-react';
import { clsx } from 'clsx';

export default function TopicDetailPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.topicId as string;

  const topic = DSA_TOPICS.find((t) => t.id === topicId) || DSA_TOPICS[0];

  const [mode, setMode] = useState<AIMode>('standard');
  const [language, setLanguage] = useState<ProgrammingLanguage>('javascript');
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(false);

  const handleMarkComplete = () => {
    setCompleted(true);
    storageService.recordActivity({
      activityType: 'LESSON_COMPLETED',
      activityScore: 1,
      title: `Completed ${topic.title}`,
      referenceId: topic.id
    });
  };

  const handleToggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    storageService.toggleBookmark({
      id: `bm_${topic.id}`,
      itemType: 'topic',
      itemId: topic.id,
      title: topic.title,
      subtitle: topic.category,
      createdAt: 'Just now'
    });
  };

  return (
    <AppLayout>
      <div className="space-y-8 max-w-5xl mx-auto">
        {/* Navigation & Breadcrumb Bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/learn"
            className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Topics</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleBookmark}
              className={clsx(
                'p-2 rounded-xl border transition-colors',
                isBookmarked
                  ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              )}
              title="Bookmark Topic"
            >
              <Bookmark className="w-4 h-4" />
            </button>

            <Link
              href={`/visualizer`}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-all shadow-md shadow-cyan-500/20"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Visualize Topic</span>
            </Link>
          </div>
        </div>

        {/* Topic Header Card */}
        <div className="p-6 sm:p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-0.5 rounded-full font-bold bg-slate-950 text-cyan-400 border border-slate-800">
                {topic.category}
              </span>
              <span className="text-slate-400 font-medium">Difficulty: {topic.difficulty}</span>
              <span className="text-slate-400">• ~{topic.estimatedMinutes} mins read</span>
            </div>

            {/* Learning Mode Switcher */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
              {(['beginner', 'standard', 'deep-dive', 'interview'] as AIMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={clsx(
                    'px-2.5 py-1 text-[11px] font-bold rounded-lg capitalize transition-colors',
                    mode === m
                      ? 'bg-cyan-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  )}
                >
                  {m === 'deep-dive' ? 'Deep Dive' : m}
                </button>
              ))}
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {topic.title}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {topic.summary}
          </p>

          {/* Active Mode Explanation Callout */}
          <div className="p-4 bg-cyan-950/30 border border-cyan-500/30 rounded-2xl text-xs text-cyan-200 space-y-1">
            <div className="font-bold text-cyan-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span className="capitalize">{mode} Mode Lens:</span>
            </div>
            <p className="leading-relaxed">
              {topic.learningModes[mode === 'deep-dive' ? 'deepDive' : mode]}
            </p>
          </div>
        </div>

        {/* Intuition & Why it Exists */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-2 shadow-lg">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Why Does This Concept Exist?</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {topic.whyItExists}
            </p>
          </div>

          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-2 shadow-lg">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Mental Model & Intuition</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {topic.intuition}
            </p>
          </div>
        </div>

        {/* Algorithm Steps & Pseudocode */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Code2 className="w-4 h-4 text-cyan-400" />
            <span>Algorithm Step-by-Step Logic</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300 font-sans">
              {topic.algorithmSteps.map((step, idx) => (
                <li key={idx} className="leading-relaxed">
                  {step}
                </li>
              ))}
            </ol>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl font-mono text-xs text-cyan-300 overflow-x-auto">
              <div className="text-[10px] text-slate-500 uppercase font-sans font-bold mb-2">Pseudocode:</div>
              <pre className="whitespace-pre-wrap">{topic.pseudocode}</pre>
            </div>
          </div>
        </div>

        {/* Multi-Language Code Implementations */}
        <div className="p-6 bg-slate-950 border border-slate-800 rounded-3xl space-y-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span>Reference Implementation ({language.toUpperCase()})</span>
            </div>

            <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
              {(['javascript', 'python', 'java', 'cpp'] as ProgrammingLanguage[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={clsx(
                    'px-2.5 py-1 text-[11px] font-bold rounded-lg uppercase transition-colors',
                    language === lang ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  )}
                >
                  {lang === 'cpp' ? 'C++' : lang === 'javascript' ? 'JS' : lang}
                </button>
              ))}
            </div>
          </div>

          <pre className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl font-mono text-xs text-cyan-200 overflow-x-auto leading-relaxed">
            <code>{topic.codeImplementations[language] || topic.codeImplementations.javascript}</code>
          </pre>
        </div>

        {/* Dry Run Simulation */}
        {topic.dryRun && (
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-3 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Step-by-Step Dry Run ({topic.dryRun.input})</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3 w-16">Step</th>
                    <th className="p-3 w-48">Execution State</th>
                    <th className="p-3 font-sans">Explanation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {topic.dryRun.steps.map((s, idx) => (
                    <tr key={idx} className="hover:bg-slate-850/50">
                      <td className="p-3 text-cyan-400 font-bold">{s.step}</td>
                      <td className="p-3 text-amber-300">{s.state}</td>
                      <td className="p-3 font-sans text-slate-300">{s.explanation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Complexity, Edge Cases & Common Mistakes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-2">
            <div className="font-bold text-xs text-cyan-400 flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>Big-O Complexity</span>
            </div>
            <div className="text-xs text-slate-300 font-mono">Time: {topic.complexity.time}</div>
            <div className="text-xs text-slate-300 font-mono">Space: {topic.complexity.space}</div>
            <p className="text-[11px] text-slate-400 pt-1">{topic.complexity.explanation}</p>
          </div>

          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-2">
            <div className="font-bold text-xs text-amber-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>Edge Cases</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
              {topic.edgeCases.map((ec, idx) => (
                <li key={idx}>{ec}</li>
              ))}
            </ul>
          </div>

          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-2">
            <div className="font-bold text-xs text-rose-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>Common Mistakes</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
              {topic.commonMistakes.map((cm, idx) => (
                <li key={idx}>{cm}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Interview Tips & Mark Completed Action */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-emerald-950/30 border border-emerald-500/30 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="font-bold text-xs text-emerald-400 flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              <span>Placement & Interview Pro Tips:</span>
            </div>
            <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
              {topic.interviewTips.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleMarkComplete}
              className={clsx(
                'flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold transition-all shadow-md',
                completed
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-emerald-500/20'
              )}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{completed ? '✓ Lesson Completed' : 'Mark as Completed (+20 XP)'}</span>
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
