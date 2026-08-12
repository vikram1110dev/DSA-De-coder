'use client';

import React, { useState, useEffect } from 'react';
import { PracticeProblem, ProgrammingLanguage } from '@/types';
import {
  Play,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  RotateCcw,
  Check,
  Flame,
  Award,
  Terminal,
  Clock,
  Code
} from 'lucide-react';
import { clsx } from 'clsx';
import confetti from 'canvas-confetti';
import { storageService } from '@/lib/storage';

interface CodeEditorProps {
  problem: PracticeProblem;
  onDecodedClick?: () => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ problem, onDecodedClick }) => {
  const [language, setLanguage] = useState<ProgrammingLanguage>('javascript');
  const [code, setCode] = useState<string>(problem.starterCode.javascript);
  const [activeTestCaseTab, setActiveTestCaseTab] = useState<number>(0);
  const [executing, setExecuting] = useState<boolean>(false);
  const [executionResult, setExecutionResult] = useState<any>(null);

  // Progressive Hint System: 0 = none, 1 = subtle, 2 = intermediate, 3 = approach, 4 = full solution
  const [revealedHintTier, setRevealedHintTier] = useState<number>(0);

  // Confidence rating modal after accepted submit
  const [showConfidenceModal, setShowConfidenceModal] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // When language changes, update starter code if untouched
  useEffect(() => {
    setCode(problem.starterCode[language] || problem.starterCode.javascript);
  }, [language, problem]);

  const handleRunCode = async () => {
    setExecuting(true);
    setExecutionResult(null);

    // Extract function name dynamically from starter code
    let functionName = 'twoSum';
    const match = problem.starterCode.javascript.match(/function\s+([a-zA-Z0-9_]+)\s*\(/);
    if (match && match[1]) functionName = match[1];

    try {
      const res = await fetch('/api/practice/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language,
          functionName,
          testCases: problem.testCases
        })
      });
      const data = await res.json();
      setExecutionResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setExecuting(false);
    }
  };

  const handleSubmit = async () => {
    await handleRunCode();
    setIsSubmitted(true);
    setShowConfidenceModal(true);
  };

  const handleSelectConfidence = (level: 'not_confident' | 'somewhat_confident' | 'very_confident') => {
    setShowConfidenceModal(false);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    // Record meaningful DSA activity
    storageService.recordActivity({
      activityType: 'PROBLEM_SOLVED',
      activityScore: problem.difficulty === 'Easy' ? 1 : problem.difficulty === 'Medium' ? 2 : 3,
      title: `Solved ${problem.title}`,
      referenceId: problem.id,
      metadata: { difficulty: problem.difficulty, confidence: level }
    });
  };

  const handleResetCode = () => {
    setCode(problem.starterCode[language]);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900 border border-slate-800 rounded-2xl">
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            {(['javascript', 'python', 'java', 'cpp'] as ProgrammingLanguage[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={clsx(
                  'px-3 py-1.5 text-xs font-bold rounded-lg uppercase transition-all',
                  language === lang
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                )}
              >
                {lang === 'cpp' ? 'C++' : lang === 'javascript' ? 'JS' : lang}
              </button>
            ))}
          </div>

          <button
            onClick={handleResetCode}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-xl transition-colors"
            title="Reset Starter Code"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Run & Submit Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRunCode}
            disabled={executing}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl transition-all shadow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{executing ? 'Running...' : 'Run Tests'}</span>
          </button>

          <button
            onClick={handleSubmit}
            disabled={executing}
            className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:opacity-95 rounded-xl transition-all shadow-md shadow-emerald-500/20"
          >
            <Check className="w-4 h-4" />
            <span>Submit Solution</span>
          </button>
        </div>
      </div>

      {/* Editor & Progressive Hint Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Monaco-style Code Input */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-cyan-400" />
                <span className="font-mono font-bold text-slate-300">
                  solution.{language === 'python' ? 'py' : language === 'cpp' ? 'cpp' : language === 'java' ? 'java' : 'js'}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                UTF-8 • {code.split('\n').length} lines
              </span>
            </div>

            {/* Monospace Codearea */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={16}
              spellCheck={false}
              className="w-full bg-transparent font-mono text-xs text-cyan-200/90 leading-relaxed focus:outline-none resize-y selection:bg-cyan-500/30"
            />
          </div>

          {/* Test Case Execution Output Panel */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>Test Cases & Execution Console</span>
              </div>

              {executionResult && (
                <div
                  className={clsx(
                    'px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1.5',
                    executionResult.passed
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  )}
                >
                  {executionResult.passed ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Accepted ({executionResult.passedCount}/{executionResult.totalCount})</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Failed ({executionResult.passedCount}/{executionResult.totalCount})</span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Test Case Tab Headers */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              {problem.testCases.map((tc, idx) => {
                const res = executionResult?.results?.[idx];
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveTestCaseTab(idx)}
                    className={clsx(
                      'px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5',
                      activeTestCaseTab === idx
                        ? 'bg-slate-800 text-cyan-300 border border-cyan-500/30'
                        : 'text-slate-400 hover:text-slate-200 bg-slate-950'
                    )}
                  >
                    <span>Case {idx + 1}</span>
                    {res && (
                      <span className={res.passed ? 'text-emerald-400' : 'text-rose-400'}>
                        {res.passed ? '✓' : '✗'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected Test Case Content */}
            {problem.testCases[activeTestCaseTab] && (
              <div className="space-y-2 text-xs font-mono">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                  <div className="text-[10px] text-slate-500 uppercase font-sans font-bold">Input:</div>
                  <div className="text-slate-200">{problem.testCases[activeTestCaseTab].input}</div>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                  <div className="text-[10px] text-slate-500 uppercase font-sans font-bold">Expected Output:</div>
                  <div className="text-emerald-400">{problem.testCases[activeTestCaseTab].expectedOutput}</div>
                </div>

                {executionResult?.results?.[activeTestCaseTab] && (
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                    <div className="text-[10px] text-slate-500 uppercase font-sans font-bold">Your Actual Output:</div>
                    <div
                      className={
                        executionResult.results[activeTestCaseTab].passed
                          ? 'text-cyan-300'
                          : 'text-rose-400 font-bold'
                      }
                    >
                      {executionResult.results[activeTestCaseTab].actual}
                      {executionResult.results[activeTestCaseTab].error && (
                        <div className="text-rose-400 text-[11px] mt-1">
                          Error: {executionResult.results[activeTestCaseTab].error}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Progressive Hint System & Problem Context */}
        <div className="space-y-4">
          {/* Progressive Hint Tier Engine */}
          <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Progressive AI Hints</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Don't spoil the solution! Unlock clues gradually as you think.
            </p>

            {/* Hint 1: Subtle */}
            <div className="space-y-2">
              <button
                onClick={() => setRevealedHintTier(Math.max(revealedHintTier, 1))}
                className={clsx(
                  'w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold text-left transition-all',
                  revealedHintTier >= 1
                    ? 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-300'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                )}
              >
                <span>Hint 1: Subtle Direction</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                  {revealedHintTier >= 1 ? 'Unlocked' : 'Reveal'}
                </span>
              </button>
              {revealedHintTier >= 1 && (
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 animate-in fade-in">
                  💡 {problem.hints[0]}
                </div>
              )}
            </div>

            {/* Hint 2: Intermediate */}
            <div className="space-y-2">
              <button
                onClick={() => setRevealedHintTier(Math.max(revealedHintTier, 2))}
                disabled={revealedHintTier < 1}
                className={clsx(
                  'w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold text-left transition-all',
                  revealedHintTier >= 2
                    ? 'bg-indigo-500/15 border border-indigo-500/30 text-indigo-300'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 disabled:opacity-40'
                )}
              >
                <span>Hint 2: Intermediate Strategy</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                  {revealedHintTier >= 2 ? 'Unlocked' : 'Reveal'}
                </span>
              </button>
              {revealedHintTier >= 2 && (
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 animate-in fade-in">
                  ⚡ {problem.hints[1]}
                </div>
              )}
            </div>

            {/* Hint 3: Approach */}
            <div className="space-y-2">
              <button
                onClick={() => setRevealedHintTier(Math.max(revealedHintTier, 3))}
                disabled={revealedHintTier < 2}
                className={clsx(
                  'w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold text-left transition-all',
                  revealedHintTier >= 3
                    ? 'bg-amber-500/15 border border-amber-500/30 text-amber-300'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 disabled:opacity-40'
                )}
              >
                <span>Hint 3: Full Algorithmic Approach</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                  {revealedHintTier >= 3 ? 'Unlocked' : 'Reveal'}
                </span>
              </button>
              {revealedHintTier >= 3 && (
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 animate-in fade-in">
                  🎯 {problem.hints[2]}
                </div>
              )}
            </div>

            {/* Reveal Full Solution */}
            <div className="pt-2 border-t border-slate-800">
              <button
                onClick={() => setRevealedHintTier(4)}
                className="w-full py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors text-center"
              >
                {revealedHintTier === 4 ? '✓ Solution Revealed' : 'Reveal Full Solution Code'}
              </button>
              {revealedHintTier === 4 && (
                <div className="mt-2 p-3 bg-slate-950 border border-rose-500/30 rounded-xl font-mono text-[11px] text-slate-300 overflow-x-auto max-h-56">
                  <pre>{problem.solutionCode[language] || problem.solutionCode.javascript}</pre>
                </div>
              )}
            </div>
          </div>

          {/* Complexity Target Card */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-xs space-y-2">
            <div className="font-bold text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Target Big-O Complexity</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Time Complexity:</span>
              <span className="font-mono font-bold text-cyan-400">{problem.timeComplexity}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Space Complexity:</span>
              <span className="font-mono font-bold text-emerald-400">{problem.spaceComplexity}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Confidence Feedback Modal */}
      {showConfidenceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
              <Award className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">
                Submission Recorded! (+{problem.xpReward} XP)
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                How confident do you feel about this problem's logic?
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleSelectConfidence('not_confident')}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 text-center transition-all group"
              >
                <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">😕</div>
                <div className="text-xs font-bold text-slate-300">Shaky</div>
                <div className="text-[10px] text-slate-500">Need Review</div>
              </button>

              <button
                onClick={() => handleSelectConfidence('somewhat_confident')}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 text-center transition-all group"
              >
                <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">🙂</div>
                <div className="text-xs font-bold text-slate-300">Good</div>
                <div className="text-[10px] text-slate-500">Understood</div>
              </button>

              <button
                onClick={() => handleSelectConfidence('very_confident')}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 text-center transition-all group"
              >
                <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">😎</div>
                <div className="text-xs font-bold text-slate-300">Mastered</div>
                <div className="text-[10px] text-slate-500">Ready to Teach</div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
