'use client';

import React, { useState, useEffect } from 'react';
import { VisualizerController } from './VisualizerController';
import { clsx } from 'clsx';

type ArrayMode = 'two-pointers' | 'sliding-window';

interface ArrayStep {
  left: number;
  right: number;
  windowElements: number[];
  currentSum?: number;
  bestSum?: number;
  message: string;
  activeLineIndex: number;
}

const TWO_POINTERS_CODE = [
  'left = 0, right = n - 1',
  'while left < right:',
  '  sum = arr[left] + arr[right]',
  '  if sum == target: return [left, right]',
  '  else if sum < target: left++',
  '  else: right--'
];

const SLIDING_WINDOW_CODE = [
  'windowSum = sum(arr[0..k-1]), maxSum = windowSum',
  'for i = k to n - 1:',
  '  windowSum += arr[i] - arr[i - k]',
  '  maxSum = max(maxSum, windowSum)',
  'return maxSum'
];

export const ArrayVisualizer: React.FC = () => {
  const [mode, setMode] = useState<ArrayMode>('two-pointers');
  const [array] = useState<number[]>([2, 3, 5, 8, 11, 15, 19, 24]);
  const [target] = useState<number>(19);
  const [windowSize] = useState<number>(3);
  const [steps, setSteps] = useState<ArrayStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);

  const generateTwoPointersSteps = (arr: number[], tgt: number) => {
    const generated: ArrayStep[] = [];
    let left = 0;
    let right = arr.length - 1;

    generated.push({
      left,
      right,
      windowElements: [left, right],
      message: `Initial two pointers: left at index 0 (${arr[0]}), right at index ${right} (${arr[right]}). Target sum = ${tgt}.`,
      activeLineIndex: 0
    });

    while (left < right) {
      const sum = arr[left] + arr[right];
      generated.push({
        left,
        right,
        windowElements: [left, right],
        currentSum: sum,
        message: `Sum = arr[${left}] (${arr[left]}) + arr[${right}] (${arr[right]}) = ${sum}. Target is ${tgt}.`,
        activeLineIndex: 2
      });

      if (sum === tgt) {
        generated.push({
          left,
          right,
          windowElements: [left, right],
          currentSum: sum,
          message: `🎉 Target sum ${tgt} found at indices [${left}, ${right}] (${arr[left]} + ${arr[right]} == ${tgt})!`,
          activeLineIndex: 3
        });
        break;
      } else if (sum < tgt) {
        left++;
        generated.push({
          left,
          right,
          windowElements: [left, right],
          currentSum: sum,
          message: `${sum} < ${tgt}: Need a larger sum. Moving left pointer right -> index ${left} (${arr[left]}).`,
          activeLineIndex: 4
        });
      } else {
        right--;
        generated.push({
          left,
          right,
          windowElements: [left, right],
          currentSum: sum,
          message: `${sum} > ${tgt}: Need a smaller sum. Moving right pointer left -> index ${right} (${arr[right]}).`,
          activeLineIndex: 5
        });
      }
    }

    setSteps(generated);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const generateSlidingWindowSteps = (arr: number[], k: number) => {
    const generated: ArrayStep[] = [];
    let windowSum = 0;
    for (let i = 0; i < k; i++) windowSum += arr[i];
    let maxSum = windowSum;

    generated.push({
      left: 0,
      right: k - 1,
      windowElements: Array.from({ length: k }, (_, idx) => idx),
      currentSum: windowSum,
      bestSum: maxSum,
      message: `Initial window [0 .. ${k - 1}] of size k=${k}. Initial sum = ${windowSum}.`,
      activeLineIndex: 0
    });

    for (let i = k; i < arr.length; i++) {
      const left = i - k + 1;
      const right = i;
      const outgoing = arr[i - k];
      const incoming = arr[i];
      windowSum = windowSum - outgoing + incoming;
      maxSum = Math.max(maxSum, windowSum);

      generated.push({
        left,
        right,
        windowElements: Array.from({ length: k }, (_, idx) => left + idx),
        currentSum: windowSum,
        bestSum: maxSum,
        message: `Slid window to [${left} .. ${right}]. Subtracted ${outgoing}, Added ${incoming}. New sum = ${windowSum}, Max sum = ${maxSum}.`,
        activeLineIndex: 2
      });
    }

    setSteps(generated);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  useEffect(() => {
    if (mode === 'two-pointers') {
      generateTwoPointersSteps(array, target);
    } else {
      generateSlidingWindowSteps(array, windowSize);
    }
  }, [mode, array, target, windowSize]);

  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      const intervalMs = Math.max(300, 1200 / speed);
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, intervalMs);
    }
    return () => clearInterval(timer);
  }, [isPlaying, speed, steps.length]);

  const currentStep = steps[currentStepIndex] || {
    left: 0,
    right: array.length - 1,
    windowElements: [],
    message: 'Ready',
    activeLineIndex: 0
  };

  return (
    <div className="space-y-6">
      {/* Mode Switcher */}
      <div className="flex items-center gap-3 p-4 bg-slate-900 border border-slate-800 rounded-2xl">
        <button
          onClick={() => setMode('two-pointers')}
          className={clsx(
            'px-4 py-2 text-xs font-bold rounded-xl transition-all',
            mode === 'two-pointers'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white bg-slate-800'
          )}
        >
          Two Pointers (Target Sum: {target})
        </button>
        <button
          onClick={() => setMode('sliding-window')}
          className={clsx(
            'px-4 py-2 text-xs font-bold rounded-xl transition-all',
            mode === 'sliding-window'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white bg-slate-800'
          )}
        >
          Sliding Window (Size: {windowSize})
        </button>
      </div>

      {/* Canvas */}
      <div className="p-8 bg-slate-950 border border-slate-800 rounded-3xl min-h-[300px] flex flex-col justify-center items-center shadow-2xl relative">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {array.map((val, idx) => {
            const isLeft = idx === currentStep.left;
            const isRight = idx === currentStep.right;
            const isInWindow = currentStep.windowElements.includes(idx);

            return (
              <div key={idx} className="flex flex-col items-center gap-1.5">
                {/* Pointer tags */}
                <div className="h-5">
                  {isLeft && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 bg-cyan-400 text-slate-950 rounded-md">
                      LEFT
                    </span>
                  )}
                  {isRight && !isLeft && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 bg-purple-400 text-slate-950 rounded-md">
                      RIGHT
                    </span>
                  )}
                </div>

                {/* Number block */}
                <div
                  className={clsx(
                    'w-14 h-16 rounded-2xl flex items-center justify-center font-mono font-bold text-base transition-all duration-300 shadow-md',
                    isInWindow
                      ? 'bg-gradient-to-tr from-cyan-600 to-cyan-400 text-slate-950 shadow-cyan-500/30 scale-105 ring-2 ring-cyan-300'
                      : 'bg-slate-900 text-slate-300 border border-slate-800'
                  )}
                >
                  {val}
                </div>

                <span className="text-[10px] font-mono text-slate-500">[{idx}]</span>
              </div>
            );
          })}
        </div>

        {/* Live Metrics */}
        <div className="flex items-center gap-6 mt-8 text-xs font-bold">
          {currentStep.currentSum !== undefined && (
            <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-slate-300">
              Current Sum: <span className="text-cyan-400">{currentStep.currentSum}</span>
            </div>
          )}
          {currentStep.bestSum !== undefined && (
            <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-slate-300">
              Maximum Sum: <span className="text-emerald-400">{currentStep.bestSum}</span>
            </div>
          )}
        </div>
      </div>

      {/* Controller */}
      <VisualizerController
        currentStep={currentStepIndex}
        totalSteps={steps.length}
        isPlaying={isPlaying}
        speed={speed}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        onStepForward={() => setCurrentStepIndex((p) => Math.min(p + 1, steps.length - 1))}
        onStepBackward={() => setCurrentStepIndex((p) => Math.max(p - 1, 0))}
        onRestart={() => {
          setCurrentStepIndex(0);
          setIsPlaying(false);
        }}
        onSpeedChange={setSpeed}
        statusMessage={currentStep.message}
        codeLines={mode === 'two-pointers' ? TWO_POINTERS_CODE : SLIDING_WINDOW_CODE}
        activeLineIndex={currentStep.activeLineIndex}
      />
    </div>
  );
};
