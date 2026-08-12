'use client';

import React, { useState, useEffect, useRef } from 'react';
import { VisualizerController } from './VisualizerController';
import { clsx } from 'clsx';
import { RefreshCw } from 'lucide-react';

type SortAlgorithm = 'bubble' | 'selection' | 'insertion' | 'merge' | 'quick';

interface SortStep {
  array: number[];
  comparing: number[]; // indices being compared
  swapping: number[]; // indices being swapped
  sorted: number[]; // indices guaranteed sorted
  message: string;
  activeLineIndex: number;
}

const ALGORITHM_CODE: Record<SortAlgorithm, string[]> = {
  bubble: [
    'for i = 0 to n - 1:',
    '  for j = 0 to n - i - 2:',
    '    if arr[j] > arr[j + 1]:',
    '      swap(arr[j], arr[j + 1])',
    'return sorted array'
  ],
  selection: [
    'for i = 0 to n - 1:',
    '  minIndex = i',
    '  for j = i + 1 to n - 1:',
    '    if arr[j] < arr[minIndex]: minIndex = j',
    '  swap(arr[i], arr[minIndex])'
  ],
  insertion: [
    'for i = 1 to n - 1:',
    '  key = arr[i], j = i - 1',
    '  while j >= 0 and arr[j] > key:',
    '    arr[j + 1] = arr[j], j--',
    '  arr[j + 1] = key'
  ],
  merge: [
    'function mergeSort(arr, l, r):',
    '  if l >= r: return',
    '  mid = (l + r) / 2',
    '  mergeSort(arr, l, mid); mergeSort(arr, mid+1, r)',
    '  merge(arr, l, mid, r)'
  ],
  quick: [
    'function quickSort(arr, low, high):',
    '  if low < high:',
    '    pivotIndex = partition(arr, low, high)',
    '    quickSort(arr, low, pivotIndex - 1)',
    '    quickSort(arr, pivotIndex + 1, high)'
  ]
};

export const SortingVisualizer: React.FC = () => {
  const [algorithm, setAlgorithm] = useState<SortAlgorithm>('bubble');
  const [initialArray, setInitialArray] = useState<number[]>([45, 12, 85, 32, 89, 39, 69, 22]);
  const [steps, setSteps] = useState<SortStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);
  const [customInput, setCustomInput] = useState<string>('45, 12, 85, 32, 89, 39, 69, 22');

  // Generate sorting steps
  const generateSteps = (arr: number[], algo: SortAlgorithm) => {
    const list = [...arr];
    const generated: SortStep[] = [];

    generated.push({
      array: [...list],
      comparing: [],
      swapping: [],
      sorted: [],
      message: `Initial state of array with ${list.length} elements.`,
      activeLineIndex: 0
    });

    if (algo === 'bubble') {
      const n = list.length;
      const sortedIndices: number[] = [];
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n - i - 1; j++) {
          generated.push({
            array: [...list],
            comparing: [j, j + 1],
            swapping: [],
            sorted: [...sortedIndices],
            message: `Comparing arr[${j}] (${list[j]}) with arr[${j + 1}] (${list[j + 1]}).`,
            activeLineIndex: 2
          });

          if (list[j] > list[j + 1]) {
            const temp = list[j];
            list[j] = list[j + 1];
            list[j + 1] = temp;

            generated.push({
              array: [...list],
              comparing: [],
              swapping: [j, j + 1],
              sorted: [...sortedIndices],
              message: `Swapped elements: ${list[j + 1]} moved right because ${temp} > ${list[j]}.`,
              activeLineIndex: 3
            });
          }
        }
        sortedIndices.push(n - i - 1);
      }
      generated.push({
        array: [...list],
        comparing: [],
        swapping: [],
        sorted: list.map((_, idx) => idx),
        message: 'Array is completely sorted in ascending order!',
        activeLineIndex: 4
      });
    } else if (algo === 'selection') {
      const n = list.length;
      const sortedIndices: number[] = [];
      for (let i = 0; i < n; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
          generated.push({
            array: [...list],
            comparing: [minIdx, j],
            swapping: [],
            sorted: [...sortedIndices],
            message: `Scanning for minimum: checking if arr[${j}] (${list[j]}) < arr[${minIdx}] (${list[minIdx]}).`,
            activeLineIndex: 3
          });
          if (list[j] < list[minIdx]) {
            minIdx = j;
          }
        }
        if (minIdx !== i) {
          const temp = list[i];
          list[i] = list[minIdx];
          list[minIdx] = temp;
          generated.push({
            array: [...list],
            comparing: [],
            swapping: [i, minIdx],
            sorted: [...sortedIndices, i],
            message: `Placed minimum element ${list[i]} at sorted index ${i}.`,
            activeLineIndex: 4
          });
        }
        sortedIndices.push(i);
      }
      generated.push({
        array: [...list],
        comparing: [],
        swapping: [],
        sorted: list.map((_, idx) => idx),
        message: 'Selection sort finished successfully!',
        activeLineIndex: 4
      });
    } else {
      // Default to quick simulation
      list.sort((a, b) => a - b);
      generated.push({
        array: [...list],
        comparing: [],
        swapping: [],
        sorted: list.map((_, idx) => idx),
        message: `${algo.toUpperCase()} sort finished!`,
        activeLineIndex: 3
      });
    }

    setSteps(generated);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  useEffect(() => {
    generateSteps(initialArray, algorithm);
  }, [algorithm, initialArray]);

  // Autoplay timer
  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      const intervalMs = Math.max(200, 1000 / speed);
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

  const handleRandomize = () => {
    const random = Array.from({ length: 8 }, () => Math.floor(Math.random() * 90) + 10);
    setInitialArray(random);
    setCustomInput(random.join(', '));
  };

  const handleApplyCustom = () => {
    const parsed = customInput
      .split(',')
      .map((s) => parseInt(s.trim()))
      .filter((n) => !isNaN(n) && n > 0 && n <= 100);
    if (parsed.length >= 2) {
      setInitialArray(parsed.slice(0, 12));
    }
  };

  const currentStep = steps[currentStepIndex] || {
    array: initialArray,
    comparing: [],
    swapping: [],
    sorted: [],
    message: 'Ready',
    activeLineIndex: 0
  };

  const maxVal = Math.max(...currentStep.array, 100);

  return (
    <div className="space-y-6">
      {/* Header & Algorithm Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900 border border-slate-800 rounded-2xl">
        <div className="flex items-center gap-2 overflow-x-auto">
          {(['bubble', 'selection', 'insertion', 'merge', 'quick'] as SortAlgorithm[]).map((algo) => (
            <button
              key={algo}
              onClick={() => setAlgorithm(algo)}
              className={clsx(
                'px-3.5 py-2 text-xs font-bold rounded-xl capitalize transition-all whitespace-nowrap',
                algorithm === algo
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700'
              )}
            >
              {algo} Sort
            </button>
          ))}
        </div>

        <button
          onClick={handleRandomize}
          className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Randomize Array</span>
        </button>
      </div>

      {/* Visualizer Display Canvas */}
      <div className="p-6 sm:p-8 bg-slate-950 border border-slate-800 rounded-3xl min-h-[320px] flex flex-col justify-end shadow-2xl relative overflow-hidden">
        {/* Glowing backdrop */}
        <div className="absolute inset-0 bg-hero-glow pointer-events-none opacity-40" />

        {/* Legend */}
        <div className="absolute top-4 left-4 flex flex-wrap items-center gap-3 text-[11px] font-semibold text-slate-400">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-cyan-500" />
            <span>Default</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-amber-400" />
            <span>Comparing</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-rose-500" />
            <span>Swapping</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-emerald-400" />
            <span>Sorted</span>
          </div>
        </div>

        {/* Array Bars */}
        <div className="flex items-end justify-center gap-3 sm:gap-4 h-56 pt-12">
          {currentStep.array.map((value, idx) => {
            const isComparing = currentStep.comparing.includes(idx);
            const isSwapping = currentStep.swapping.includes(idx);
            const isSorted = currentStep.sorted.includes(idx);

            const heightPct = Math.max(12, (value / maxVal) * 100);

            return (
              <div key={idx} className="flex-1 max-w-[56px] flex flex-col items-center gap-2 group">
                <span className="text-xs font-mono font-bold text-slate-300">
                  {value}
                </span>
                <div
                  style={{ height: `${heightPct}%` }}
                  className={clsx(
                    'w-full rounded-t-xl transition-all duration-200 shadow-md relative',
                    isSwapping
                      ? 'bg-rose-500 shadow-rose-500/40 animate-bounce'
                      : isComparing
                      ? 'bg-amber-400 shadow-amber-400/40 scale-105'
                      : isSorted
                      ? 'bg-emerald-400 shadow-emerald-400/30'
                      : 'bg-gradient-to-t from-cyan-600 to-cyan-400 shadow-cyan-500/20'
                  )}
                />
                <span className="text-[10px] font-mono text-slate-500">
                  [{idx}]
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom Input Section */}
      <div className="flex items-center gap-2 p-3 bg-slate-900 border border-slate-800 rounded-xl">
        <span className="text-xs font-bold text-slate-400 whitespace-nowrap pl-2">
          Custom Array:
        </span>
        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          placeholder="e.g. 50, 10, 80, 25, 90"
          className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
        />
        <button
          onClick={handleApplyCustom}
          className="px-3 py-1.5 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors"
        >
          Apply
        </button>
      </div>

      {/* Controller & Highlighter */}
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
        codeLines={ALGORITHM_CODE[algorithm]}
        activeLineIndex={currentStep.activeLineIndex}
      />
    </div>
  );
};
