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
      <div className="p-6 bg-gradient-to-r from-accent/20 via-bg-surface to-accent-violet/10 border border-accent/20 rounded-3xl shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-accent-subtle text-accent flex items-center justify-center shadow-lg">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
                Problem De-coding Canvas
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-accent-subtle text-accent border border-accent/30">
                  Think Before Coding
                </span>
              </h2>
              <p className="text-xs text-text-muted">
                Dissect the logic: Don't memorize solutions. Analyze the given inputs, constraints, and clues first.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleFillExamples}
              className="text-xs font-semibold text-accent hover:text-accent-muted px-3 py-1.5 rounded-xl bg-bg-inset border border-border-default hover:border-accent transition-colors"
            >
              Fill Sample Reasoning
            </button>
            <button
              onClick={() => setShowGuidedHints(!showGuidedHints)}
              className="text-xs font-semibold text-text-secondary hover:text-text-primary px-3 py-1.5 rounded-xl surface border border-border-default transition-colors"
            >
              {showGuidedHints ? 'Hide Clues' : 'Reveal Clues'}
            </button>
          </div>
        </div>

        {/* Guided Clues Box */}
        {showGuidedHints && (
          <div className="mt-4 p-4 bg-bg-inset border border-accent/30 rounded-2xl text-xs space-y-2 animate-in fade-in duration-200">
            <div className="font-bold text-accent flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Architectural Hints for this Problem:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-text-secondary">
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
        <div className="p-4 surface border border-border-default rounded-2xl space-y-2">
          <label className="text-xs font-bold text-text-primary flex items-center gap-2">
            <span className="w-5 h-5 rounded-lg bg-accent-subtle text-accent flex items-center justify-center text-[10px] font-black">
              1
            </span>
            What are we given? (Inputs & types)
          </label>
          <textarea
            rows={2}
            value={given}
            onChange={(e) => setGiven(e.target.value)}
            placeholder="e.g. Array of integers nums, integer target sum"
            className="w-full bg-bg-inset border border-border-default rounded-xl p-3 text-xs text-text-primary focus:outline-none focus:border-accent resize-none"
          />
        </div>

        {/* 2. What do we need? */}
        <div className="p-4 surface border border-border-default rounded-2xl space-y-2">
          <label className="text-xs font-bold text-text-primary flex items-center gap-2">
            <span className="w-5 h-5 rounded-lg bg-accent-subtle text-accent flex items-center justify-center text-[10px] font-black">
              2
            </span>
            What do we need to return? (Outputs & conditions)
          </label>
          <textarea
            rows={2}
            value={needed}
            onChange={(e) => setNeeded(e.target.value)}
            placeholder="e.g. Indices [i, j] of elements summing to target"
            className="w-full bg-bg-inset border border-border-default rounded-xl p-3 text-xs text-text-primary focus:outline-none focus:border-accent resize-none"
          />
        </div>

        {/* 3. Constraints */}
        <div className="p-4 surface border border-border-default rounded-2xl space-y-2">
          <label className="text-xs font-bold text-text-primary flex items-center gap-2">
            <span className="w-5 h-5 rounded-lg bg-accent-subtle text-accent flex items-center justify-center text-[10px] font-black">
              3
            </span>
            What are the constraints & limits?
          </label>
          <textarea
            rows={2}
            value={constraints}
            onChange={(e) => setConstraints(e.target.value)}
            placeholder="e.g. 2 <= length <= 10^4, Time target O(N)"
            className="w-full bg-bg-inset border border-border-default rounded-xl p-3 text-xs text-text-primary focus:outline-none focus:border-accent resize-none"
          />
        </div>

        {/* 4. Important Clues */}
        <div className="p-4 surface border border-border-default rounded-2xl space-y-2">
          <label className="text-xs font-bold text-text-primary flex items-center gap-2">
            <span className="w-5 h-5 rounded-lg bg-accent-subtle text-accent flex items-center justify-center text-[10px] font-black">
              4
            </span>
            What words or properties are important clues?
          </label>
          <textarea
            rows={2}
            value={clues}
            onChange={(e) => setClues(e.target.value)}
            placeholder="e.g. 'Exactly one solution', 'Contiguous range', 'Sorted'"
            className="w-full bg-bg-inset border border-border-default rounded-xl p-3 text-xs text-text-primary focus:outline-none focus:border-accent resize-none"
          />
        </div>

        {/* 5. Suggested Pattern */}
        <div className="p-4 surface border border-border-default rounded-2xl space-y-2 md:col-span-2">
          <label className="text-xs font-bold text-text-primary flex items-center gap-2">
            <span className="w-5 h-5 rounded-lg bg-state-success/20 text-state-success flex items-center justify-center text-[10px] font-black">
              5
            </span>
            What algorithm or data structure pattern should apply?
          </label>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="e.g. Hash Map Complement Lookup, Sliding Window, Two Pointers..."
            className="w-full bg-bg-inset border border-border-default rounded-xl p-3 text-xs text-text-primary focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={handleEvaluate}
          disabled={evaluating || !pattern.trim()}
          className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-accent to-accent-emerald hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-all shadow-md shadow-accent/20"
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
          className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-text-secondary hover:text-text-primary surface border border-border-default hover:border-accent/40 rounded-xl transition-all"
        >
          <span>Skip / Open Code Editor</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* AI Evaluation Review Card */}
      {evaluationResult && (
        <div className="p-6 surface border border-accent/30 rounded-3xl space-y-4 shadow-xl animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-state-success" />
              <span className="text-sm font-bold text-text-primary">
                AI Mentor Evaluation
              </span>
            </div>
            <div className="px-3 py-1 bg-state-success/10 text-state-success border border-state-success/20 rounded-full font-black text-xs">
              Score: {evaluationResult.score} / 100
            </div>
          </div>

          <p className="text-xs text-text-secondary leading-relaxed bg-bg-inset p-4 rounded-2xl border border-border-default">
            {evaluationResult.feedback}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {evaluationResult.strengths?.length > 0 && (
              <div className="p-3.5 bg-state-success/5 border border-state-success/20 rounded-2xl">
                <div className="font-bold text-state-success mb-1.5">Key Strengths:</div>
                <ul className="list-disc list-inside space-y-1 text-text-secondary">
                  {evaluationResult.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {evaluationResult.suggestions?.length > 0 && (
              <div className="p-3.5 bg-state-warning/5 border border-state-warning/20 rounded-2xl">
                <div className="font-bold text-state-warning mb-1.5">Improvement Suggestions:</div>
                <ul className="list-disc list-inside space-y-1 text-text-secondary">
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
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-accent-emerald to-accent rounded-xl hover:opacity-95 transition-all shadow-md shadow-accent/20"
            >
              <span>Ready to Code →</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
