'use client';

import React, { useState } from 'react';
import { AIDecoderResult, ProgrammingLanguage } from '@/types';
import {
  Cpu, Sparkles, CheckCircle2, AlertTriangle, Code2, Clock,
  Layers, Lightbulb, Copy, Check, ChevronDown, ChevronRight,
  Target, Zap, BookOpen
} from 'lucide-react';
import { clsx } from 'clsx';

interface SectionProps {
  number: string;
  title: string;
  icon: any;
  defaultOpen?: boolean;
  children: React.ReactNode;
  color?: string;
}

const Section: React.FC<SectionProps> = ({ number, title, icon: Icon, defaultOpen = false, children, color = 'text-accent' }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="surface overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold text-text-muted w-6">{number}</span>
          <Icon className={clsx('w-5 h-5', color)} />
          <span className="text-sm font-semibold text-text-primary">{title}</span>
        </div>
        {isOpen ? <ChevronDown className="w-4 h-4 text-text-muted" /> : <ChevronRight className="w-4 h-4 text-text-muted" />}
      </button>
      {isOpen && <div className="px-4 pb-4 border-t border-border-subtle pt-3">{children}</div>}
    </div>
  );
};

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
        body: JSON.stringify({ query: q, language }),
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
    <div className="space-y-5">
      {/* Search input */}
      <div className="surface p-6 space-y-5">
        <div className="flex items-center gap-3">
          <Cpu className="w-6 h-6 text-accent" />
          <div>
            <h2 className="text-base font-bold text-text-primary">AI DSA De-coder</h2>
            <p className="text-xs text-text-muted mt-0.5">Paste any coding problem. AI deconstructs logic, pattern, code, and dry run.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleDecode()}
            placeholder="e.g. 'Two Sum', 'Trapping Rain Water', 'Longest Palindromic Substring'..."
            className="flex-1 surface-inset px-4 py-3 text-sm text-text-primary placeholder-text-disabled focus:outline-none focus:ring-1 focus:ring-accent rounded-lg"
          />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as ProgrammingLanguage)}
            className="surface-inset px-4 py-3 text-sm font-medium text-text-secondary focus:outline-none focus:ring-1 focus:ring-accent rounded-lg"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>
          <button
            onClick={() => handleDecode()}
            disabled={loading || !query.trim()}
            className="btn-primary px-6 py-3 text-sm disabled:opacity-40"
          >
            {loading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loading ? 'Decoding...' : 'Decode'}
          </button>
        </div>

        {/* Quick examples */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-text-muted">Try:</span>
          {['Longest Substring Without Repeating Characters', 'Search in Rotated Sorted Array', 'Coin Change', 'Number of Islands'].map((ex) => (
            <button
              key={ex}
              onClick={() => { setQuery(ex); handleDecode(ex); }}
              className="px-3 py-1.5 text-xs text-text-muted hover:text-accent surface-inset hover:border-accent/20 rounded-md transition-colors"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="surface p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-accent animate-spin" />
            <span className="text-sm font-medium text-text-secondary">Analyzing problem structure...</span>
          </div>
          <div className="space-y-2.5">
            {['Parsing constraints', 'Detecting pattern', 'Generating optimal solution', 'Building dry run'].map((step, i) => (
              <div key={i} className="flex items-center gap-2.5 text-xs text-text-muted">
                <div className={clsx('w-2 h-2 rounded-full', i === 0 ? 'bg-accent animate-pulse' : 'bg-bg-elevated')} />
                {step}
              </div>
            ))}
          </div>
          <div className="space-y-2 mt-4">
            <div className="skeleton h-4 w-2/3" />
            <div className="skeleton h-4 w-1/2" />
            <div className="skeleton h-20 w-full" />
          </div>
        </div>
      )}

      {/* Structured result sections */}
      {result && (
        <div className="space-y-2 animate-fade-in">
          {/* 01 Problem */}
          <Section number="01" title="Problem Restatement" icon={Lightbulb} defaultOpen={true} color="text-accent">
            <p className="text-sm text-text-secondary leading-relaxed">{result.problemRestatement}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="surface-inset p-4 rounded-xl">
                <div className="text-xs font-semibold text-accent mb-2">Inputs</div>
                <ul className="list-disc list-inside text-sm text-text-secondary space-y-1">
                  {result.inputs?.map((inp, i) => <li key={i}>{inp}</li>)}
                </ul>
              </div>
              <div className="surface-inset p-4 rounded-xl">
                <div className="text-xs font-semibold text-state-success mb-2">Outputs</div>
                <ul className="list-disc list-inside text-sm text-text-secondary space-y-1">
                  {result.outputs?.map((out, i) => <li key={i}>{out}</li>)}
                </ul>
              </div>
            </div>
          </Section>

          {/* 02 Constraints & Clues */}
          <Section number="02" title="Constraints & Clues" icon={Target} defaultOpen={true} color="text-accent-amber">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-semibold text-accent-amber mb-2">Constraints</div>
                <ul className="list-disc list-inside text-sm text-text-secondary space-y-1">
                  {result.constraints?.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </div>
              <div>
                <div className="text-xs font-semibold text-accent-violet mb-2">Hidden Clues</div>
                <ul className="list-disc list-inside text-sm text-text-secondary space-y-1">
                  {result.clues?.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </div>
            </div>
          </Section>

          {/* 03 Pattern */}
          <Section number="03" title={`Pattern: ${result.pattern}`} icon={Zap} defaultOpen={true} color="text-accent-emerald">
            <p className="text-sm text-text-secondary leading-relaxed">{result.patternWhy}</p>
          </Section>

          {/* 04 Brute Force */}
          <Section number="04" title="Brute Force Approach" icon={AlertTriangle} color="text-accent-rose">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-text-secondary">{result.bruteForce.description}</span>
              <span className="font-mono text-xs text-accent-rose font-bold">{result.bruteForce.timeComplexity}</span>
            </div>
            <div className="surface-inset p-3.5 rounded-xl text-xs text-accent-rose">
              <strong>Why slow:</strong> {result.bruteForce.whySlow}
            </div>
          </Section>

          {/* 05 Optimal */}
          <Section number="05" title="Optimal Approach" icon={CheckCircle2} defaultOpen={true} color="text-state-success">
            <p className="text-sm text-text-secondary leading-relaxed mb-4">{result.optimalApproach.description}</p>
            <div className="surface-inset p-4 rounded-xl font-mono text-xs text-text-secondary">
              <div className="text-xs font-semibold text-accent mb-2">Pseudocode</div>
              <pre className="whitespace-pre-wrap">{result.optimalApproach.pseudocode}</pre>
            </div>
            <div className="flex gap-3 mt-4 text-xs font-bold">
              <span className="badge badge-cyan text-xs py-1 px-2.5">Time: {result.optimalApproach.timeComplexity}</span>
              <span className="badge badge-emerald text-xs py-1 px-2.5">Space: {result.optimalApproach.spaceComplexity}</span>
            </div>
          </Section>

          {/* 06 Dry Run */}
          {result.dryRun?.length > 0 && (
            <Section number="06" title="Dry Run Simulation" icon={Layers} color="text-accent">
              <div className="overflow-x-auto rounded-xl">
                <table className="w-full text-left text-sm">
                  <thead className="bg-bg-inset text-text-muted border-b border-border-subtle">
                    <tr>
                      <th className="p-3 w-16 font-mono">Step</th>
                      <th className="p-3 w-48 font-mono">State</th>
                      <th className="p-3">Explanation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {result.dryRun.map((step, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.02]">
                        <td className="p-3 font-mono font-bold text-accent">{step.step || idx + 1}</td>
                        <td className="p-3 font-mono text-accent-amber">{step.state}</td>
                        <td className="p-3 text-text-secondary">{step.explanation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
          )}

          {/* 07 Code */}
          <Section number="07" title={`Code (${language.toUpperCase()})`} icon={Code2} defaultOpen={true} color="text-accent">
            <div className="flex justify-end mb-2">
              <button onClick={handleCopyCode} className="btn-ghost text-xs">
                {copied ? <Check className="w-4 h-4 text-state-success" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="surface-inset p-5 font-mono text-sm text-accent/90 overflow-x-auto leading-relaxed rounded-xl">
              <code>{result.optimalApproach.code}</code>
            </pre>
            {result.optimalApproach.lineByLineExplanation?.length > 0 && (
              <div className="mt-4 space-y-1.5">
                <div className="text-xs font-semibold text-text-muted mb-2">Line-by-line</div>
                {result.optimalApproach.lineByLineExplanation.map((line, i) => (
                  <div key={i} className="flex gap-3 text-xs">
                    <span className="font-mono text-accent shrink-0 w-8 text-right">L{line.line}</span>
                    <span className="text-text-muted">{line.explanation}</span>
                  </div>
                ))}
              </div>
            )}
          </Section>

          {/* 08 Edge Cases */}
          <Section number="08" title="Edge Cases" icon={AlertTriangle} color="text-accent-amber">
            <ul className="list-disc list-inside text-sm text-text-secondary space-y-1.5">
              {result.edgeCases?.map((ec, i) => <li key={i}>{ec}</li>)}
            </ul>
          </Section>

          {/* 09 Common Mistakes */}
          <Section number="09" title="Common Mistakes" icon={AlertTriangle} color="text-accent-rose">
            <ul className="list-disc list-inside text-sm text-text-secondary space-y-1.5">
              {result.commonMistakes?.map((cm, i) => <li key={i}>{cm}</li>)}
            </ul>
          </Section>

          {/* 10 Interview Follow-ups */}
          {result.interviewFollowUps?.length > 0 && (
            <Section number="10" title="Interview Follow-ups" icon={BookOpen} color="text-accent-violet">
              <ul className="list-disc list-inside text-sm text-text-secondary space-y-1.5">
                {result.interviewFollowUps.map((fu, i) => <li key={i}>{fu}</li>)}
              </ul>
            </Section>
          )}
        </div>
      )}
    </div>
  );
};
