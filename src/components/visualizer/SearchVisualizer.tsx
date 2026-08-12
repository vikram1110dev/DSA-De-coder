'use client';

import React, { useState, useEffect } from 'react';
import { AlgorithmLab, AlgorithmStep } from './AlgorithmLab';
import { clsx } from 'clsx';

interface SearchStep extends AlgorithmStep {
  low: number;
  mid: number;
  high: number;
  foundIndex?: number;
  discarded: number[];
}

const BINARY_SEARCH_CODE = [
  'low = 0, high = n - 1',
  'while low <= high:',
  '  mid = low + (high - low) / 2',
  '  if arr[mid] == target: return mid',
  '  else if arr[mid] < target: low = mid + 1',
  '  else: high = mid - 1',
  'return -1 (not found)',
];

export const SearchVisualizer: React.FC = () => {
  const [array] = useState<number[]>([2, 5, 8, 12, 16, 23, 38, 56, 72, 91]);
  const [target, setTarget] = useState(23);
  const [targetInput, setTargetInput] = useState('23');
  const [steps, setSteps] = useState<SearchStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const generateSteps = (arr: number[], tgt: number) => {
    const generated: SearchStep[] = [];
    let low = 0;
    let high = arr.length - 1;
    const discarded: number[] = [];

    generated.push({ low, mid: -1, high, discarded: [], message: `Searching for target=${tgt} in sorted array of ${arr.length} elements.`, activeLineIndex: 0 });

    let found = false;
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      generated.push({ low, mid, high, discarded: [...discarded], message: `mid = ${mid}, arr[mid] = ${arr[mid]}. Comparing with target ${tgt}.`, activeLineIndex: 2 });

      if (arr[mid] === tgt) {
        generated.push({ low, mid, high, foundIndex: mid, discarded: [...discarded], message: `Found! Target ${tgt} is at index ${mid}.`, activeLineIndex: 3 });
        found = true;
        break;
      } else if (arr[mid] < tgt) {
        for (let i = low; i <= mid; i++) discarded.push(i);
        low = mid + 1;
        generated.push({ low, mid, high, discarded: [...discarded], message: `${arr[mid]} < ${tgt}. Eliminated left half. New low = ${low}.`, activeLineIndex: 4 });
      } else {
        for (let i = mid; i <= high; i++) discarded.push(i);
        high = mid - 1;
        generated.push({ low, mid, high, discarded: [...discarded], message: `${arr[mid]} > ${tgt}. Eliminated right half. New high = ${high}.`, activeLineIndex: 5 });
      }
    }

    if (!found) {
      generated.push({ low, mid: -1, high, discarded: arr.map((_, i) => i), message: `Target ${tgt} not found. Return -1.`, activeLineIndex: 6 });
    }

    setSteps(generated);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  useEffect(() => { generateSteps(array, target); }, [array, target]);

  useEffect(() => {
    if (!isPlaying) return;
    const intervalMs = Math.max(400, 1200 / speed);
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev >= steps.length - 1) { setIsPlaying(false); return prev; }
        return prev + 1;
      });
    }, intervalMs);
    return () => clearInterval(timer);
  }, [isPlaying, speed, steps.length]);

  const currentStep: SearchStep = steps[currentStepIndex] || { low: 0, mid: -1, high: array.length - 1, discarded: [], message: 'Ready', activeLineIndex: 0 };

  const handleApplyTarget = () => {
    const val = parseInt(targetInput.trim());
    if (!isNaN(val)) setTarget(val);
  };

  return (
    <div className="space-y-4">
      {/* Target input */}
      <div className="flex flex-wrap items-center justify-between gap-3 surface p-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-text-secondary">Target:</span>
          <input
            type="number"
            value={targetInput}
            onChange={(e) => setTargetInput(e.target.value)}
            className="w-20 surface-inset px-2.5 py-1.5 text-xs text-accent font-mono font-semibold focus:outline-none focus:ring-1 focus:ring-accent rounded-md"
          />
          <button onClick={handleApplyTarget} className="btn-primary py-1.5">Search</button>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xxs text-text-muted">Quick:</span>
          {[2, 23, 72, 91, 50].map((num) => (
            <button
              key={num}
              onClick={() => { setTarget(num); setTargetInput(String(num)); }}
              className={clsx(
                'px-2 py-1 text-xxs font-semibold rounded-md transition-colors',
                target === num ? 'bg-accent text-bg-primary' : 'text-text-muted hover:text-text-primary hover:bg-white/[0.04]'
              )}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      <AlgorithmLab
        algorithmName="Binary Search"
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
        codeLines={BINARY_SEARCH_CODE}
        whyExplanation="Binary search works because the array is sorted. By comparing the target with the middle element, we can eliminate half of the remaining elements in each step. This gives us O(log n) time complexity — searching 1 billion elements takes only ~30 steps."
        complexityInfo={{ time: 'O(log n)', space: 'O(1)' }}
      >
        {/* Visualization */}
        <div className="flex flex-col items-center gap-4">
          {/* Pointer legend */}
          <div className="flex items-center gap-4 text-xxs font-medium">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-viz-pointer-low" />Low ({currentStep.low})</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-viz-pointer-mid" />Mid ({currentStep.mid >= 0 ? currentStep.mid : '—'})</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-viz-pointer-high" />High ({currentStep.high})</span>
          </div>

          {/* Array cells */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {array.map((val, idx) => {
              const isLow = idx === currentStep.low;
              const isMid = idx === currentStep.mid;
              const isHigh = idx === currentStep.high;
              const isFound = idx === currentStep.foundIndex;
              const isDiscarded = currentStep.discarded.includes(idx);

              return (
                <div key={idx} className="flex flex-col items-center gap-1.5">
                  {/* Pointer badge */}
                  <div className="h-5 flex items-center">
                    {isFound ? (
                      <span className="text-xxs font-bold px-1.5 py-0.5 bg-viz-found text-bg-primary rounded animate-step-pulse">FOUND</span>
                    ) : isMid ? (
                      <span className="text-xxs font-bold px-1.5 py-0.5 bg-viz-pointer-mid text-bg-primary rounded">MID</span>
                    ) : isLow && isHigh ? (
                      <span className="text-xxs font-bold px-1.5 py-0.5 bg-viz-pointer-low text-bg-primary rounded">L/H</span>
                    ) : isLow ? (
                      <span className="text-xxs font-bold px-1.5 py-0.5 bg-viz-pointer-low text-bg-primary rounded">LOW</span>
                    ) : isHigh ? (
                      <span className="text-xxs font-bold px-1.5 py-0.5 bg-viz-pointer-high text-bg-primary rounded">HIGH</span>
                    ) : null}
                  </div>

                  {/* Cell */}
                  <div
                    className={clsx(
                      'w-12 h-14 rounded-xl flex items-center justify-center font-mono font-bold text-sm transition-all duration-300',
                      isFound ? 'bg-viz-found text-bg-primary scale-110 shadow-glow-emerald'
                        : isMid ? 'bg-viz-pointer-mid text-bg-primary scale-105 ring-2 ring-viz-pointer-mid/50'
                        : isDiscarded ? 'bg-bg-inset text-text-disabled opacity-30'
                        : 'bg-bg-surface border border-border-default text-text-primary'
                    )}
                  >
                    {val}
                  </div>
                  <span className="text-xxs font-mono text-text-disabled">[{idx}]</span>
                </div>
              );
            })}
          </div>
        </div>
      </AlgorithmLab>
    </div>
  );
};
