'use client';

import React, { useState, useEffect } from 'react';
import { AlgorithmLab, AlgorithmStep } from './AlgorithmLab';
import { clsx } from 'clsx';

type ArrayMode = 'two-pointers' | 'sliding-window';

interface ArrayStep extends AlgorithmStep {
  left: number;
  right: number;
  windowElements: number[];
  currentSum?: number;
  bestSum?: number;
}

const TWO_POINTERS_CODE = [
  'left = 0, right = n - 1',
  'while left < right:',
  '  sum = arr[left] + arr[right]',
  '  if sum == target: return [left, right]',
  '  else if sum < target: left++',
  '  else: right--',
];

const SLIDING_WINDOW_CODE = [
  'windowSum = sum(arr[0..k-1])',
  'maxSum = windowSum',
  'for i = k to n - 1:',
  '  windowSum += arr[i] - arr[i - k]',
  '  maxSum = max(maxSum, windowSum)',
  'return maxSum',
];

function genTwoPointerSteps(arr: number[], tgt: number): ArrayStep[] {
  const steps: ArrayStep[] = [];
  let left = 0, right = arr.length - 1;

  steps.push({ left, right, windowElements: [left, right], message: `Two pointers: left=0 (${arr[0]}), right=${right} (${arr[right]}). Target sum = ${tgt}.`, activeLineIndex: 0 });

  while (left < right) {
    const sum = arr[left] + arr[right];
    steps.push({ left, right, windowElements: [left, right], currentSum: sum, message: `Sum = ${arr[left]} + ${arr[right]} = ${sum}. Target = ${tgt}.`, activeLineIndex: 2 });

    if (sum === tgt) {
      steps.push({ left, right, windowElements: [left, right], currentSum: sum, message: `Found! Indices [${left}, ${right}] sum to ${tgt}.`, activeLineIndex: 3 });
      break;
    } else if (sum < tgt) {
      left++;
      steps.push({ left, right, windowElements: [left, right], currentSum: sum, message: `${sum} < ${tgt}. Move left → index ${left}.`, activeLineIndex: 4 });
    } else {
      right--;
      steps.push({ left, right, windowElements: [left, right], currentSum: sum, message: `${sum} > ${tgt}. Move right ← index ${right}.`, activeLineIndex: 5 });
    }
  }
  return steps;
}

function genSlidingWindowSteps(arr: number[], k: number): ArrayStep[] {
  const steps: ArrayStep[] = [];
  let windowSum = 0;
  for (let i = 0; i < k; i++) windowSum += arr[i];
  let maxSum = windowSum;

  steps.push({ left: 0, right: k - 1, windowElements: Array.from({ length: k }, (_, i) => i), currentSum: windowSum, bestSum: maxSum, message: `Initial window [0..${k - 1}]. Sum = ${windowSum}.`, activeLineIndex: 0 });

  for (let i = k; i < arr.length; i++) {
    const left = i - k + 1;
    const outgoing = arr[i - k], incoming = arr[i];
    windowSum = windowSum - outgoing + incoming;
    maxSum = Math.max(maxSum, windowSum);

    steps.push({ left, right: i, windowElements: Array.from({ length: k }, (_, idx) => left + idx), currentSum: windowSum, bestSum: maxSum, message: `Slide → [${left}..${i}]. Removed ${outgoing}, added ${incoming}. Sum = ${windowSum}, Max = ${maxSum}.`, activeLineIndex: 3 });
  }

  steps.push({ left: arr.length - k, right: arr.length - 1, windowElements: [], currentSum: windowSum, bestSum: maxSum, message: `Done! Maximum subarray sum of size ${k} = ${maxSum}.`, activeLineIndex: 5 });
  return steps;
}

export const ArrayVisualizer: React.FC = () => {
  const [mode, setMode] = useState<ArrayMode>('two-pointers');
  const [array] = useState([2, 3, 5, 8, 11, 15, 19, 24]);
  const [target] = useState(19);
  const [windowSize] = useState(3);
  const [steps, setSteps] = useState<ArrayStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    setSteps(mode === 'two-pointers' ? genTwoPointerSteps(array, target) : genSlidingWindowSteps(array, windowSize));
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [mode, array, target, windowSize]);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev >= steps.length - 1) { setIsPlaying(false); return prev; }
        return prev + 1;
      });
    }, Math.max(400, 1000 / speed));
    return () => clearInterval(timer);
  }, [isPlaying, speed, steps.length]);

  const currentStep = steps[currentStepIndex] || { left: 0, right: array.length - 1, windowElements: [], message: 'Ready', activeLineIndex: 0 };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-1.5 surface p-3">
        {(['two-pointers', 'sliding-window'] as ArrayMode[]).map((m) => (
          <button key={m} onClick={() => setMode(m)}
            className={clsx('px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-all',
              mode === m ? 'bg-accent text-bg-primary' : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.04]'
            )}
          >
            {m.replace('-', ' ')}
          </button>
        ))}
      </div>

      <AlgorithmLab
        algorithmName={mode === 'two-pointers' ? 'Two Pointers' : 'Sliding Window'}
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
        codeLines={mode === 'two-pointers' ? TWO_POINTERS_CODE : SLIDING_WINDOW_CODE}
        whyExplanation={mode === 'two-pointers' ? 'Two pointers works on sorted arrays because moving the left pointer right increases the sum, and moving the right pointer left decreases it. This lets us converge on the target in O(n).' : 'Sliding window maintains a running sum by adding the incoming element and subtracting the outgoing one. This avoids recomputing the sum from scratch each time, giving O(n) instead of O(n×k).'}
        complexityInfo={{ time: 'O(n)', space: 'O(1)' }}
      >
        <div className="flex flex-col items-center gap-4">
          {/* Info badges */}
          <div className="flex items-center gap-3 text-xxs font-medium">
            {mode === 'two-pointers' ? (
              <>
                <span className="text-viz-pointer-low">← LEFT [{currentStep.left}]</span>
                {currentStep.currentSum !== undefined && <span className="text-text-muted">Sum: {currentStep.currentSum}</span>}
                <span className="text-viz-pointer-high">RIGHT [{currentStep.right}] →</span>
              </>
            ) : (
              <>
                {currentStep.currentSum !== undefined && <span className="text-accent">Window Sum: {currentStep.currentSum}</span>}
                {currentStep.bestSum !== undefined && <span className="text-state-success">Max: {currentStep.bestSum}</span>}
              </>
            )}
          </div>

          {/* Array cells */}
          <div className="flex items-center gap-2 relative">
            {/* Sliding window frame */}
            {mode === 'sliding-window' && currentStep.windowElements.length > 0 && (
              <div
                className="absolute border-2 border-accent rounded-xl pointer-events-none transition-all duration-300 -inset-y-1"
                style={{
                  left: `${currentStep.windowElements[0] * 56}px`,
                  width: `${currentStep.windowElements.length * 56 - 8}px`,
                }}
              />
            )}

            {array.map((val, idx) => {
              const isLeft = mode === 'two-pointers' && idx === currentStep.left;
              const isRight = mode === 'two-pointers' && idx === currentStep.right;
              const isInWindow = currentStep.windowElements.includes(idx);

              return (
                <div key={idx} className="flex flex-col items-center gap-1.5 w-12">
                  {/* Pointer label */}
                  <div className="h-4 flex items-center">
                    {isLeft && <span className="text-xxs font-bold text-viz-pointer-low">L</span>}
                    {isRight && <span className="text-xxs font-bold text-viz-pointer-high">R</span>}
                  </div>

                  <div className={clsx(
                    'w-12 h-12 rounded-lg flex items-center justify-center font-mono font-bold text-sm transition-all duration-300',
                    isLeft || isRight ? 'bg-accent text-bg-primary scale-105'
                      : isInWindow ? 'bg-accent/30 text-accent border border-accent/40'
                      : 'bg-bg-surface border border-border-default text-text-primary'
                  )}>
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
