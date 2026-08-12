'use client';

import React, { useState, useEffect } from 'react';
import { AlgorithmLab, AlgorithmStep } from './AlgorithmLab';
import { clsx } from 'clsx';

interface DPStep extends AlgorithmStep {
  table: number[];
  activeIndex: number | null;
  highlightedDeps: number[];
}

const COINS = [1, 2, 5];
const DP_CODE = [
  'dp = array of size (amount + 1), fill ∞',
  'dp[0] = 0',
  'for i = 1 to amount:',
  '  for each coin in coins:',
  '    if i - coin >= 0 and dp[i-coin] != ∞:',
  '      dp[i] = min(dp[i], dp[i-coin] + 1)',
  'return dp[amount]',
];

function generateDPSteps(amount: number): DPStep[] {
  const steps: DPStep[] = [];
  const table = new Array(amount + 1).fill(Infinity);
  table[0] = 0;

  steps.push({ table: [...table], activeIndex: 0, highlightedDeps: [], message: `Base case: dp[0] = 0. No coins needed for amount $0.`, activeLineIndex: 1 });

  for (let i = 1; i <= amount; i++) {
    const deps: number[] = [];
    for (const coin of COINS) {
      if (i - coin >= 0 && table[i - coin] !== Infinity) {
        deps.push(i - coin);
        table[i] = Math.min(table[i], table[i - coin] + 1);
      }
    }
    steps.push({
      table: [...table],
      activeIndex: i,
      highlightedDeps: deps,
      message: `dp[${i}] = ${table[i] === Infinity ? '∞' : table[i]}. ${deps.length > 0 ? `Dependencies: dp[${deps.join('], dp[')}].` : 'No valid coin combination.'}`,
      activeLineIndex: 5,
    });
  }

  steps.push({
    table: [...table],
    activeIndex: null,
    highlightedDeps: [],
    message: `Complete! Minimum coins for $${amount} = ${table[amount] === Infinity ? 'impossible' : table[amount]}.`,
    activeLineIndex: 6,
  });
  return steps;
}

export const DPVisualizer: React.FC = () => {
  const [amount, setAmount] = useState(7);
  const [steps, setSteps] = useState<DPStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    setSteps(generateDPSteps(amount));
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [amount]);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev >= steps.length - 1) { setIsPlaying(false); return prev; }
        return prev + 1;
      });
    }, Math.max(300, 800 / speed));
    return () => clearInterval(timer);
  }, [isPlaying, speed, steps.length]);

  const currentStep = steps[currentStepIndex] || { table: new Array(amount + 1).fill(Infinity), activeIndex: null, highlightedDeps: [], message: 'Ready', activeLineIndex: 0 };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 surface p-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-text-secondary">Amount:</span>
          {[5, 7, 10, 11].map((amt) => (
            <button key={amt} onClick={() => setAmount(amt)}
              className={clsx('px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all',
                amount === amt ? 'bg-accent text-bg-primary' : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.04]'
              )}
            >
              ${amt}
            </button>
          ))}
        </div>
        <div className="text-xxs text-text-muted font-mono">
          Coins: [{COINS.join(', ')}]
        </div>
      </div>

      <AlgorithmLab
        algorithmName="Coin Change (Bottom-Up DP)"
        steps={steps}
        currentStepIndex={currentStepIndex}
        totalSteps={steps.length}
        isPlaying={isPlaying}
        speed={speed}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        onStepForward={() => setCurrentStepIndex((p) => Math.min(p + 1, steps.length - 1))}
        onStepBackward={() => setCurrentStepIndex((p) => Math.max(p - 1, 0))}
        onRestart={() => { setCurrentStepIndex(0); setIsPlaying(false); }}
        onSpeedChange={setSpeed}
        codeLines={DP_CODE}
        whyExplanation="Dynamic Programming solves the Coin Change problem by building up from smaller subproblems. dp[i] stores the minimum coins needed for amount i. For each amount, we check all coins and pick the one that gives the minimum count. This avoids re-computing overlapping subproblems."
        complexityInfo={{ time: 'O(amount × coins)', space: 'O(amount)' }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="text-xxs font-mono text-text-muted uppercase tracking-wider">
            dp[amount] = min coins
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-center">
            {Array.from({ length: amount + 1 }, (_, i) => i).map((idx) => {
              const isActive = currentStep.activeIndex === idx;
              const isDep = currentStep.highlightedDeps.includes(idx);
              const val = currentStep.table[idx];
              const isFilled = val !== Infinity && val !== undefined;

              return (
                <div key={idx} className="flex flex-col items-center gap-1.5">
                  <span className="text-xxs font-mono text-text-muted">${idx}</span>
                  <div
                    className={clsx(
                      'w-12 h-14 rounded-xl flex items-center justify-center font-mono font-bold text-sm transition-all duration-300',
                      isActive ? 'bg-viz-active text-bg-primary scale-110 ring-2 ring-viz-active/50'
                        : isDep ? 'bg-accent/40 text-accent border border-accent/50'
                        : isFilled ? 'bg-accent text-bg-primary'
                        : 'bg-bg-surface border border-border-default text-text-disabled'
                    )}
                  >
                    {val === Infinity || val === undefined ? '∞' : val}
                  </div>
                  <span className="text-xxs font-mono text-text-disabled">dp[{idx}]</span>
                </div>
              );
            })}
          </div>
        </div>
      </AlgorithmLab>
    </div>
  );
};
