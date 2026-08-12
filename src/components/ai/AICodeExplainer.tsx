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
      <div className="flex items-center gap-2 p-2 surface border border-border-default rounded-2xl">
        <button
          onClick={() => {
            setActiveTab('explainer');
            setResult(null);
          }}
          className={clsx(
            'flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all',
            activeTab === 'explainer'
              ? 'bg-accent text-white shadow-md shadow-accent/20'
              : 'text-text-muted hover:text-text-primary'
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
              ? 'bg-state-error text-white shadow-md shadow-state-error/20'
              : 'text-text-muted hover:text-text-primary'
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
              ? 'bg-state-warning text-white shadow-md shadow-state-warning/20'
              : 'text-text-muted hover:text-text-primary'
          )}
        >
          <Clock className="w-4 h-4" />
          <span>Complexity Analyzer</span>
        </button>
      </div>

      {/* Editor & Output Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Pane */}
        <div className="p-6 surface border border-border-default rounded-3xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text-secondary">
              Paste Code to Analyze:
            </span>
            <span className="text-[10px] text-text-muted font-mono">
              JavaScript / Python / C++
            </span>
          </div>

          <textarea
            rows={12}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full bg-bg-inset border border-border-default rounded-2xl p-4 font-mono text-xs text-text-primary focus:outline-none focus:border-accent leading-relaxed resize-none shadow-inner custom-scrollbar"
          />

          {activeTab === 'debugger' && (
            <div>
              <label className="text-xs font-bold text-state-error block mb-1">
                Bug / Error Symptom:
              </label>
              <input
                type="text"
                value={errorDesc}
                onChange={(e) => setErrorDesc(e.target.value)}
                placeholder="e.g. Fails on empty array, infinite loop on test case 4..."
                className="w-full bg-bg-inset border border-border-default rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-state-error"
              />
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={loading || !code.trim()}
            className={clsx(
              'w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-bold text-white transition-all shadow-md',
              activeTab === 'debugger'
                ? 'bg-state-error hover:opacity-90 shadow-state-error/20'
                : activeTab === 'complexity'
                ? 'bg-state-warning hover:opacity-90 shadow-state-warning/20'
                : 'bg-gradient-to-r from-accent to-accent-emerald hover:opacity-95 shadow-accent/20'
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
        <div className="p-6 bg-bg-inset border border-border-default rounded-3xl space-y-4 shadow-2xl min-h-[380px] overflow-y-auto custom-scrollbar">
          {result ? (
            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
              {activeTab === 'explainer' || activeTab === 'complexity' ? (
                <>
                  <div className="flex items-center justify-between border-b border-border-default pb-3">
                    <span className="text-xs font-bold text-accent">
                      Overall Logic & Intuition
                    </span>
                    <Link
                      href="/visualizer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-accent hover:underline"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Visualize This Code</span>
                    </Link>
                  </div>

                  <p className="text-xs text-text-secondary leading-relaxed surface p-4 rounded-2xl border border-border-default">
                    {result.overallLogic}
                  </p>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 surface border border-border-default rounded-xl">
                      <div className="text-text-muted text-[10px] uppercase font-bold">Time Complexity</div>
                      <div className="font-mono font-bold text-accent mt-0.5">
                        {result.timeComplexity || 'O(N)'}
                      </div>
                    </div>

                    <div className="p-3 surface border border-border-default rounded-xl">
                      <div className="text-text-muted text-[10px] uppercase font-bold">Space Complexity</div>
                      <div className="font-mono font-bold text-state-success mt-0.5">
                        {result.spaceComplexity || 'O(1)'}
                      </div>
                    </div>
                  </div>

                  {result.lineByLine?.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <div className="text-xs font-bold text-text-secondary">Line-by-Line Breakdown:</div>
                      <div className="space-y-1.5 font-mono text-[11px]">
                        {result.lineByLine.slice(0, 5).map((l: any, i: number) => (
                          <div key={i} className="p-2 surface rounded-xl border border-border-default">
                            <span className="text-accent font-bold">Line {l.line}: </span>
                            <span className="text-text-secondary font-sans">{l.explanation}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-xs font-bold text-state-error border-b border-border-default pb-3">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Identified Bug: {result.error}</span>
                  </div>

                  <div className="p-3 bg-state-error/10 border border-state-error/20 rounded-xl text-xs text-state-error">
                    <span className="font-bold">Root Cause: </span>
                    {result.whyItHappens}
                  </div>

                  <div>
                    <span className="text-xs font-bold text-state-success block mb-1">
                      ✓ Corrected Implementation:
                    </span>
                    <pre className="p-3 surface border border-state-success/30 rounded-xl font-mono text-xs text-text-primary overflow-x-auto">
                      <code>{result.correctedCode}</code>
                    </pre>
                  </div>

                  <p className="text-xs text-text-secondary">
                    <span className="font-bold text-text-primary">Explanation: </span>
                    {result.explanation}
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-text-muted text-xs py-16 space-y-2">
              <FileCode className="w-8 h-8 text-text-muted opacity-50" />
              <div>Paste code on the left and click analyze to see instant AI feedback.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
