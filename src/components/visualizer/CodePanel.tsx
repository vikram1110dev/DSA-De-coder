'use client';

import React, { useState } from 'react';
import { clsx } from 'clsx';
import { Code2, HelpCircle, Timer } from 'lucide-react';

interface CodePanelProps {
  codeLines: string[];
  activeLineIndex: number;
  whyExplanation?: string;
  complexityInfo?: { time: string; space: string };
}

type Tab = 'code' | 'why' | 'complexity';

export const CodePanel: React.FC<CodePanelProps> = ({
  codeLines,
  activeLineIndex,
  whyExplanation,
  complexityInfo,
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('code');

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'code', label: 'Code', icon: Code2 },
    { id: 'why', label: 'Why it works', icon: HelpCircle },
    { id: 'complexity', label: 'Complexity', icon: Timer },
  ];

  return (
    <div className="surface overflow-hidden">
      {/* Tab bar */}
      <div className="flex items-center border-b border-border-subtle px-1 bg-bg-secondary">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-colors',
                activeTab === tab.id
                  ? 'text-accent border-accent'
                  : 'text-text-muted border-transparent hover:text-text-secondary'
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="p-4">
        {activeTab === 'code' && (
          <div className="space-y-0.5 font-mono text-sm">
            {codeLines.map((line, idx) => (
              <div
                key={idx}
                className={clsx(
                  'flex items-center gap-3 px-2 py-1 rounded transition-colors',
                  activeLineIndex === idx
                    ? 'bg-accent-muted border-l-2 border-accent text-accent'
                    : 'text-text-muted'
                )}
              >
                <span className="text-xs text-text-disabled select-none w-5 text-right shrink-0">
                  {idx + 1}
                </span>
                <span className="whitespace-pre">{line}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'why' && (
          <div className="text-sm text-text-secondary leading-relaxed">
            {whyExplanation || 'Select an algorithm and play the simulation to see why each step works.'}
          </div>
        )}

        {activeTab === 'complexity' && (
          <div className="space-y-3">
            {complexityInfo ? (
              <>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-text-muted uppercase w-14">Time</span>
                  <span className="font-mono text-base font-bold text-accent">{complexityInfo.time}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-text-muted uppercase w-14">Space</span>
                  <span className="font-mono text-base font-bold text-accent-emerald">{complexityInfo.space}</span>
                </div>
              </>
            ) : (
              <p className="text-sm text-text-muted">Complexity info will appear when an algorithm is selected.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
