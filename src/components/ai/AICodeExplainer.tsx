'use client';

import React, { useState } from 'react';
import {
  Code2,
  Bug,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Eye,
  FileCode
} from 'lucide-react';
import { clsx } from 'clsx';
import Link from 'next/link';

type ToolTab = 'explainer' | 'debugger' | 'complexity';

export const AICodeExplainer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ToolTab>('explainer');
  const [code, setCode] = useState<string>(`function lengthOfLongestSubstring(s) {
  let left = 0, maxLen = 0;
  const map = new Map();
  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    if (map.has(char) && map.get(char) >= left) {
      left = map.get(char) + 1;
    }
    map.set(char, right);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`);
  const [errorDesc, setErrorDesc] = useState<string>('Index out of bounds when array is empty');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const endpoint =
        activeTab === 'explainer'
          ? '/api/ai/code-explainer'
          : activeTab === 'debugger'
          ? '/api/ai/debugger'
          : '/api/ai/code-explainer';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, errorDescription: errorDesc })
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex items-center gap-2 p-2 bg-slate-900 border border-slate-800 rounded-2xl">
        <button
          onClick={() => {
            setActiveTab('explainer');
            setResult(null);
          }}
          className={clsx(
            'flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all',
            activeTab === 'explainer'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white'
          )}
        >
          <Code2 className="w-4 h-4" />
          <span>AI Code Explainer</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('debugger');
            setResult(null);
          }}
          className={clsx(
            'flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all',
            activeTab === 'debugger'
              ? 'bg-rose-500 text-slate-950 shadow-md shadow-rose-500/20'
              : 'text-slate-400 hover:text-white'
          )}
        >
          <Bug className="w-4 h-4" />
          <span>AI Code Debugger</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('complexity');
            setResult(null);
          }}
          className={clsx(
            'flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all',
            activeTab === 'complexity'
              ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
              : 'text-slate-400 hover:text-white'
          )}
        >
          <Clock className="w-4 h-4" />
          <span>Complexity Analyzer</span>
        </button>
      </div>

      {/* Editor & Output Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Pane */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">
              Paste Code to Analyze:
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              JavaScript / Python / C++
            </span>
          </div>

          <textarea
            rows={12}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-cyan-200 focus:outline-none focus:border-cyan-500 leading-relaxed resize-none shadow-inner"
          />

          {activeTab === 'debugger' && (
            <div>
              <label className="text-xs font-bold text-rose-400 block mb-1">
                Bug / Error Symptom:
              </label>
              <input
                type="text"
                value={errorDesc}
                onChange={(e) => setErrorDesc(e.target.value)}
                placeholder="e.g. Fails on empty array, infinite loop on test case 4..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={loading || !code.trim()}
            className={clsx(
              'w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-bold text-slate-950 transition-all shadow-md',
              activeTab === 'debugger'
                ? 'bg-rose-400 hover:bg-rose-300 shadow-rose-500/20'
                : activeTab === 'complexity'
                ? 'bg-amber-400 hover:bg-amber-300 shadow-amber-400/20'
                : 'bg-gradient-to-r from-cyan-400 to-emerald-400 hover:opacity-95 shadow-cyan-500/20'
            )}
          >
            {loading ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>AI Analyzing Code...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>
                  {activeTab === 'debugger'
                    ? 'Debug & Fix Code'
                    : activeTab === 'complexity'
                    ? 'Compute Time & Space Complexity'
                    : 'Explain Logic & Data Structures'}
                </span>
              </>
            )}
          </button>
        </div>

        {/* Output Result Pane */}
        <div className="p-6 bg-slate-950 border border-slate-800 rounded-3xl space-y-4 shadow-2xl min-h-[380px] overflow-y-auto custom-scrollbar">
          {result ? (
            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
              {activeTab === 'explainer' || activeTab === 'complexity' ? (
                <>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-bold text-cyan-300">
                      Overall Logic & Intuition
                    </span>
                    <Link
                      href="/visualizer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-400 hover:underline"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Visualize This Code</span>
                    </Link>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
                    {result.overallLogic}
                  </p>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                      <div className="text-slate-500 text-[10px] uppercase font-bold">Time Complexity</div>
                      <div className="font-mono font-bold text-cyan-400 mt-0.5">
                        {result.timeComplexity || 'O(N)'}
                      </div>
                    </div>

                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                      <div className="text-slate-500 text-[10px] uppercase font-bold">Space Complexity</div>
                      <div className="font-mono font-bold text-emerald-400 mt-0.5">
                        {result.spaceComplexity || 'O(1)'}
                      </div>
                    </div>
                  </div>

                  {result.lineByLine?.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <div className="text-xs font-bold text-slate-400">Line-by-Line Breakdown:</div>
                      <div className="space-y-1.5 font-mono text-[11px]">
                        {result.lineByLine.slice(0, 5).map((l: any, i: number) => (
                          <div key={i} className="p-2 bg-slate-900 rounded-xl border border-slate-800">
                            <span className="text-cyan-400 font-bold">Line {l.line}: </span>
                            <span className="text-slate-300 font-sans">{l.explanation}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-400 border-b border-slate-800 pb-3">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Identified Bug: {result.error}</span>
                  </div>

                  <div className="p-3 bg-rose-950/20 border border-rose-800/40 rounded-xl text-xs text-rose-300">
                    <span className="font-bold">Root Cause: </span>
                    {result.whyItHappens}
                  </div>

                  <div>
                    <span className="text-xs font-bold text-emerald-400 block mb-1">
                      ✓ Corrected Implementation:
                    </span>
                    <pre className="p-3 bg-slate-900 border border-emerald-500/30 rounded-xl font-mono text-xs text-emerald-200 overflow-x-auto">
                      <code>{result.correctedCode}</code>
                    </pre>
                  </div>

                  <p className="text-xs text-slate-300">
                    <span className="font-bold text-slate-200">Explanation: </span>
                    {result.explanation}
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 text-xs py-16 space-y-2">
              <FileCode className="w-8 h-8 text-slate-700" />
              <div>Paste code on the left and click analyze to see instant AI feedback.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
