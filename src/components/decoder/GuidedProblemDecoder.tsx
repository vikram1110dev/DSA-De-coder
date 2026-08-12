'use client';

import React, { useState } from 'react';
import { PracticeProblem } from '@/types';
import {
  HelpCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Send,
  AlertCircle,
  Lightbulb,
  ListOrdered
} from 'lucide-react';
import { clsx } from 'clsx';

interface GuidedProblemDecoderProps {
  problem: PracticeProblem;
  onProceedToCode: () => void;
}

export const GuidedProblemDecoder: React.FC<GuidedProblemDecoderProps> = ({
  problem,
  onProceedToCode
}) => {
  const [given, setGiven] = useState('');
  const [needed, setNeeded] = useState('');
  const [constraints, setConstraints] = useState('');
  const [clues, setClues] = useState('');
  const [pattern, setPattern] = useState('');

  const [evaluating, setEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<{
    score: number;
    feedback: string;
    strengths: string[];
    suggestions: string[];
    correctPattern: string;
  } | null>(null);

  const [showGuidedHints, setShowGuidedHints] = useState(false);

  const handleEvaluate = async () => {
    setEvaluating(true);
    try {
      const res = await fetch('/api/ai/eval-reasoning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemStatement: problem.problemStatement,
          userGiven: given,
          userNeeded: needed,
          userConstraints: constraints,
          userClues: clues,
          userPattern: pattern
        })
      });
      const data = await res.json();
      setEvaluationResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setEvaluating(false);
    }
  };

  const handleFillExamples = () => {
    setGiven(problem.given.join('; '));
    setNeeded(problem.needed.join('; '));
    setConstraints(problem.constraints.join('; '));
    setClues(problem.importantClues.join('; '));
    setPattern(problem.suggestedPattern);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 bg-gradient-to-r from-cyan-950/50 via-slate-900 to-indigo-950/40 border border-cyan-500/25 rounded-3xl shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shadow-lg">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Problem De-coding Canvas
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Think Before Coding
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Dissect the logic: Don't memorize solutions. Analyze the given inputs, constraints, and clues first.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleFillExamples}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 px-3 py-1.5 rounded-xl bg-cyan-950/60 border border-cyan-800/60 hover:border-cyan-600 transition-colors"
            >
              Fill Sample Reasoning
            </button>
            <button
              onClick={() => setShowGuidedHints(!showGuidedHints)}
              className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 transition-colors"
            >
              {showGuidedHints ? 'Hide Clues' : 'Reveal Clues'}
            </button>
          </div>
        </div>

        {/* Guided Clues Box */}
        {showGuidedHints && (
          <div className="mt-4 p-4 bg-slate-950/80 border border-cyan-500/30 rounded-2xl text-xs space-y-2 animate-in fade-in duration-200">
            <div className="font-bold text-cyan-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Architectural Hints for this Problem:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-300">
              {problem.importantClues.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 5-Step Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. What are we given? */}
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-2">
          <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
            <span className="w-5 h-5 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] font-black">
              1
            </span>
            What are we given? (Inputs & types)
          </label>
          <textarea
            rows={2}
            value={given}
            onChange={(e) => setGiven(e.target.value)}
            placeholder="e.g. Array of integers nums, integer target sum"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 resize-none"
          />
        </div>

        {/* 2. What do we need? */}
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-2">
          <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
            <span className="w-5 h-5 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] font-black">
              2
            </span>
            What do we need to return? (Outputs & conditions)
          </label>
          <textarea
            rows={2}
            value={needed}
            onChange={(e) => setNeeded(e.target.value)}
            placeholder="e.g. Indices [i, j] of elements summing to target"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 resize-none"
          />
        </div>

        {/* 3. Constraints */}
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-2">
          <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
            <span className="w-5 h-5 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] font-black">
              3
            </span>
            What are the constraints & limits?
          </label>
          <textarea
            rows={2}
            value={constraints}
            onChange={(e) => setConstraints(e.target.value)}
            placeholder="e.g. 2 <= length <= 10^4, Time target O(N)"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 resize-none"
          />
        </div>

        {/* 4. Important Clues */}
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-2">
          <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
            <span className="w-5 h-5 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] font-black">
              4
            </span>
            What words or properties are important clues?
          </label>
          <textarea
            rows={2}
            value={clues}
            onChange={(e) => setClues(e.target.value)}
            placeholder="e.g. 'Exactly one solution', 'Contiguous range', 'Sorted'"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 resize-none"
          />
        </div>

        {/* 5. Suggested Pattern */}
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-2 md:col-span-2">
          <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
            <span className="w-5 h-5 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-black">
              5
            </span>
            What algorithm or data structure pattern should apply?
          </label>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="e.g. Hash Map Complement Lookup, Sliding Window, Two Pointers..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={handleEvaluate}
          disabled={evaluating || !pattern.trim()}
          className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-all shadow-md shadow-cyan-500/20"
        >
          {evaluating ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>AI Analyzing Your Reasoning...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Submit Thinking for AI Review</span>
            </>
          )}
        </button>

        <button
          onClick={onProceedToCode}
          className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl transition-all"
        >
          <span>Skip / Open Code Editor</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* AI Evaluation Review Card */}
      {evaluationResult && (
        <div className="p-6 bg-slate-900 border border-cyan-500/30 rounded-3xl space-y-4 shadow-xl animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-bold text-white">
                AI Mentor Evaluation
              </span>
            </div>
            <div className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full font-black text-xs">
              Score: {evaluationResult.score} / 100
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-2xl border border-slate-800">
            {evaluationResult.feedback}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {evaluationResult.strengths?.length > 0 && (
              <div className="p-3.5 bg-emerald-950/20 border border-emerald-800/40 rounded-2xl">
                <div className="font-bold text-emerald-400 mb-1.5">Key Strengths:</div>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  {evaluationResult.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {evaluationResult.suggestions?.length > 0 && (
              <div className="p-3.5 bg-amber-950/20 border border-amber-800/40 rounded-2xl">
                <div className="font-bold text-amber-400 mb-1.5">Improvement Suggestions:</div>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  {evaluationResult.suggestions.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={onProceedToCode}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-xl hover:opacity-95 transition-all shadow-md shadow-emerald-500/20"
            >
              <span>Ready to Code →</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
