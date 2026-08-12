'use client';

import React, { useState } from 'react';
import { AIDecoderResult, ProgrammingLanguage } from '@/types';
import {
  Cpu,
  Sparkles,
  Search,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Clock,
  Layers,
  ArrowRight,
  Lightbulb,
  Copy,
  Check
} from 'lucide-react';
import { clsx } from 'clsx';

export const AIDecoderStudio: React.FC<{ initialQuery?: string }> = ({ initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery);
  const [language, setLanguage] = useState<ProgrammingLanguage>('javascript');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIDecoderResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleDecode = async (searchQuery?: string) => {
    const q = searchQuery || query;
    if (!q.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/ai/decoder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, language })
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error('Failed to decode:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (result?.optimalApproach.code) {
      navigator.clipboard.writeText(result.optimalApproach.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Search Input Hero */}
      <div className="p-6 sm:p-8 bg-slate-900/90 border border-cyan-500/30 rounded-3xl shadow-2xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shadow-lg">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              AI DSA De-coder
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-500/30">
                20-Point Dynamic Breakdown
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Enter ANY coding problem, algorithm question, or concept. Gemini will deconstruct the underlying logic, dry run, and optimal code.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleDecode()}
              placeholder="e.g. 'Find longest substring without repeating characters' or 'Trapping Rain Water'..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 shadow-inner"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as ProgrammingLanguage)}
              className="bg-slate-950 border border-slate-800 rounded-2xl px-3 py-3.5 text-xs font-bold text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>

            <button
              onClick={() => handleDecode()}
              disabled={loading || !query.trim()}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:opacity-95 disabled:opacity-40 rounded-2xl transition-all shadow-md shadow-cyan-500/20"
            >
              {loading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Decoding...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Decode Logic</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Sample Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-[11px] text-slate-500 font-semibold">Try Quick Examples:</span>
          {[
            'Longest Substring Without Repeating Characters',
            'Search in Rotated Sorted Array',
            'Coin Change Minimum Coins',
            'Number of Connected Islands'
          ].map((ex) => (
            <button
              key={ex}
              onClick={() => {
                setQuery(ex);
                handleDecode(ex);
              }}
              className="px-3 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-cyan-300 rounded-xl text-[11px] transition-colors"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="p-8 bg-slate-900/60 border border-slate-800 rounded-3xl space-y-4 animate-pulse">
          <div className="h-6 w-1/3 bg-slate-800 rounded-xl" />
          <div className="h-4 w-2/3 bg-slate-800/60 rounded-lg" />
          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="h-28 bg-slate-800/40 rounded-2xl" />
            <div className="h-28 bg-slate-800/40 rounded-2xl" />
            <div className="h-28 bg-slate-800/40 rounded-2xl" />
          </div>
        </div>
      )}

      {/* 20-Point Structured Result Display */}
      {result && (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
          {/* Section 1-4: Restatement, Clues & Pattern Recognition */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Restatement & Inputs/Outputs */}
            <div className="lg:col-span-2 p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 shadow-xl">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-cyan-400" />
                  <span>Problem Restatement & Intuition</span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mt-2 p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
                  {result.problemRestatement}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
                  <div className="font-bold text-cyan-400 mb-1.5">Expected Inputs:</div>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    {result.inputs?.map((inp, idx) => (
                      <li key={idx}>{inp}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
                  <div className="font-bold text-emerald-400 mb-1.5">Expected Outputs:</div>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    {result.outputs?.map((out, idx) => (
                      <li key={idx}>{out}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {result.constraints?.length > 0 && (
                <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 text-xs">
                  <div className="font-bold text-amber-400 mb-1.5">Key Constraints:</div>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    {result.constraints.map((c, idx) => (
                      <li key={idx}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Pattern Badge Card */}
            <div className="p-6 bg-gradient-to-br from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-cyan-500/30 rounded-3xl space-y-4 shadow-xl flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-400">
                  Detected Pattern
                </span>
                <h4 className="text-lg font-black text-white mt-1">
                  {result.pattern}
                </h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {result.patternWhy}
                </p>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-2xl border border-cyan-500/20 text-xs space-y-1.5">
                <div className="font-bold text-cyan-300">Important Clues:</div>
                <ul className="list-disc list-inside text-slate-300 space-y-1">
                  {result.clues?.map((clue, idx) => (
                    <li key={idx}>{clue}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Brute Force vs Optimal Approach */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Brute Force Card */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400">Brute Force Approach</span>
                <span className="text-xs font-mono font-bold text-slate-400">
                  {result.bruteForce.timeComplexity}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {result.bruteForce.description}
              </p>
              <div className="p-3 bg-rose-950/20 border border-rose-800/40 rounded-2xl text-xs text-rose-300">
                <span className="font-bold">Why it's slow: </span>
                {result.bruteForce.whySlow}
              </div>
            </div>

            {/* Optimal Approach Card */}
            <div className="p-6 bg-slate-900 border border-emerald-500/30 rounded-3xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400">Optimal Algorithm</span>
                <span className="text-xs font-mono font-bold text-emerald-300">
                  {result.optimalApproach.timeComplexity}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {result.optimalApproach.description}
              </p>
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 font-mono text-[11px] text-slate-300">
                <div className="font-bold text-cyan-300 mb-1">Pseudocode:</div>
                <pre className="whitespace-pre-wrap">{result.optimalApproach.pseudocode}</pre>
              </div>
            </div>
          </div>

          {/* Step-by-step Dry Run Table */}
          {result.dryRun?.length > 0 && (
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-3 shadow-xl">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Simulation & Dry Run Steps</span>
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3 w-16">Step</th>
                      <th className="p-3 w-48">State</th>
                      <th className="p-3 font-sans">Explanation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {result.dryRun.map((step, idx) => (
                      <tr key={idx} className="hover:bg-slate-850/50 transition-colors">
                        <td className="p-3 text-cyan-400 font-bold">{step.step || idx + 1}</td>
                        <td className="p-3 text-amber-300">{step.state}</td>
                        <td className="p-3 font-sans text-slate-300">{step.explanation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Optimal Code Implementation */}
          <div className="p-6 bg-slate-950 border border-slate-800 rounded-3xl space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Code2 className="w-4 h-4 text-cyan-400" />
                <span>Optimal Working Code ({language.toUpperCase()})</span>
              </div>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-300 bg-slate-850 hover:bg-slate-800 rounded-xl transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>

            <pre className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl font-mono text-xs text-cyan-200 overflow-x-auto leading-relaxed">
              <code>{result.optimalApproach.code}</code>
            </pre>
          </div>

          {/* Edge Cases & Common Mistakes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
              <div className="font-bold text-xs text-amber-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Critical Edge Cases to Test</span>
              </div>
              <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-300">
                {result.edgeCases?.map((ec, idx) => (
                  <li key={idx}>{ec}</li>
                ))}
              </ul>
            </div>

            <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
              <div className="font-bold text-xs text-rose-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Common Traps & Pitfalls</span>
              </div>
              <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-300">
                {result.commonMistakes?.map((cm, idx) => (
                  <li key={idx}>{cm}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
