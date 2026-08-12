'use client';

import React, { useState, useEffect } from 'react';
import { VisualizerController } from './VisualizerController';
import { clsx } from 'clsx';
import { Search } from 'lucide-react';

interface SearchStep {
  low: number;
  mid: number;
  high: number;
  currIndex?: number;
  foundIndex?: number;
  discarded: number[];
  message: string;
  activeLineIndex: number;
}

const BINARY_SEARCH_CODE = [
  'low = 0, high = n - 1',
  'while low <= high:',
  '  mid = low + (high - low) / 2',
  '  if arr[mid] == target: return mid',
  '  else if arr[mid] < target: low = mid + 1',
  '  else: high = mid - 1',
  'return -1 (not found)'
];

export const SearchVisualizer: React.FC = () => {
  const [array] = useState<number[]>([2, 5, 8, 12, 16, 23, 38, 56, 72, 91]);
  const [target, setTarget] = useState<number>(23);
  const [targetInput, setTargetInput] = useState<string>('23');
  const [steps, setSteps] = useState<SearchStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);

  const generateBinarySearchSteps = (arr: number[], tgt: number) => {
    const generated: SearchStep[] = [];
    let low = 0;
    let high = arr.length - 1;
    const discarded: number[] = [];

    generated.push({
      low,
      mid: -1,
      high,
      discarded: [],
      message: `Initial search interval [${low} ... ${high}]. Searching for target = ${tgt}.`,
      activeLineIndex: 0
    });

    let found = false;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      generated.push({
        low,
        mid,
        high,
        discarded: [...discarded],
        message: `Calculated mid = ${mid} (value = ${arr[mid]}). Comparing arr[${mid}] with target (${tgt}).`,
        activeLineIndex: 2
      });

      if (arr[mid] === tgt) {
        generated.push({
          low,
          mid,
          high,
          foundIndex: mid,
          discarded: [...discarded],
          message: `🎯 Target ${tgt} found at index ${mid}! Binary search completed successfully.`,
          activeLineIndex: 3
        });
        found = true;
        break;
      } else if (arr[mid] < tgt) {
        // Discard left half
        for (let i = low; i <= mid; i++) discarded.push(i);
        low = mid + 1;
        generated.push({
          low,
          mid,
          high,
          discarded: [...discarded],
          message: `${arr[mid]} < ${tgt}: Target must be on the right. Discarded left half (indices <= ${mid}). Updated low = ${low}.`,
          activeLineIndex: 4
        });
      } else {
        // Discard right half
        for (let i = mid; i <= high; i++) discarded.push(i);
        high = mid - 1;
        generated.push({
          low,
          mid,
          high,
          discarded: [...discarded],
          message: `${arr[mid]} > ${tgt}: Target must be on the left. Discarded right half (indices >= ${mid}). Updated high = ${high}.`,
          activeLineIndex: 5
        });
      }
    }

    if (!found) {
      generated.push({
        low,
        mid: -1,
        high,
        discarded: arr.map((_, i) => i),
        message: `❌ Target ${tgt} was not found in the array. Return -1.`,
        activeLineIndex: 6
      });
    }

    setSteps(generated);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  useEffect(() => {
    generateBinarySearchSteps(array, target);
  }, [array, target]);

  // Autoplay
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
    low: 0,
    mid: -1,
    high: array.length - 1,
    discarded: [],
    message: 'Ready',
    activeLineIndex: 0
  };

  const handleApplyTarget = () => {
    const val = parseInt(targetInput.trim());
    if (!isNaN(val)) {
      setTarget(val);
    }
  };

  return (
    <div className="space-y-6">
      {/* Target input selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900 border border-slate-800 rounded-2xl">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-slate-300">Target Value:</span>
          <input
            type="number"
            value={targetInput}
            onChange={(e) => setTargetInput(e.target.value)}
            className="w-20 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-cyan-300 font-bold focus:outline-none focus:border-cyan-500"
          />
          <button
            onClick={handleApplyTarget}
            className="px-3 py-1 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors"
          >
            Search
          </button>
        </div>

        {/* Quick Target Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <span className="text-[11px] text-slate-500 font-semibold mr-1">Quick Picks:</span>
          {[2, 23, 72, 91, 50].map((num) => (
            <button
              key={num}
              onClick={() => {
                setTarget(num);
                setTargetInput(String(num));
              }}
              className={clsx(
                'px-2.5 py-1 rounded-lg text-xs font-bold transition-colors',
                target === num
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              )}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      {/* Visualizer Canvas */}
      <div className="p-6 sm:p-8 bg-slate-950 border border-slate-800 rounded-3xl min-h-[300px] flex flex-col justify-center items-center shadow-2xl relative overflow-hidden">
        {/* Pointers Legend */}
        <div className="flex items-center gap-4 text-xs font-bold mb-6">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            Low ({currentStep.low})
          </span>
          <span className="flex items-center gap-1.5 text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            Mid ({currentStep.mid !== -1 ? currentStep.mid : '-'})
          </span>
          <span className="flex items-center gap-1.5 text-purple-400">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
            High ({currentStep.high})
          </span>
        </div>

        {/* Array Cells with Pointer Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-full">
          {array.map((val, idx) => {
            const isLow = idx === currentStep.low;
            const isMid = idx === currentStep.mid;
            const isHigh = idx === currentStep.high;
            const isFound = idx === currentStep.foundIndex;
            const isDiscarded = currentStep.discarded.includes(idx);

            return (
              <div key={idx} className="flex flex-col items-center gap-1.5">
                {/* Top Pointer Badge */}
                <div className="h-5 flex items-center justify-center">
                  {isFound ? (
                    <span className="text-[10px] font-black px-1.5 py-0.2 bg-emerald-500 text-slate-950 rounded-full animate-bounce">
                      MATCH
                    </span>
                  ) : isMid ? (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 bg-amber-400 text-slate-950 rounded-md">
                      MID
                    </span>
                  ) : isLow && isHigh ? (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 bg-cyan-400 text-slate-950 rounded-md">
                      L/H
                    </span>
                  ) : isLow ? (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 bg-cyan-500 text-slate-950 rounded-md">
                      LOW
                    </span>
                  ) : isHigh ? (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 bg-purple-400 text-slate-950 rounded-md">
                      HIGH
                    </span>
                  ) : null}
                </div>

                {/* Array Box */}
                <div
                  className={clsx(
                    'w-12 h-14 sm:w-14 sm:h-16 rounded-2xl flex items-center justify-center font-mono font-bold text-sm sm:text-base transition-all duration-300 shadow-lg',
                    isFound
                      ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/50 scale-110'
                      : isMid
                      ? 'bg-amber-400 text-slate-950 shadow-amber-400/40 scale-105 ring-2 ring-amber-300'
                      : isDiscarded
                      ? 'bg-slate-900/40 text-slate-600 border border-slate-900 line-through opacity-40'
                      : 'bg-slate-900 text-slate-200 border border-slate-700 shadow-slate-950'
                  )}
                >
                  {val}
                </div>

                {/* Index label */}
                <span className="text-[10px] font-mono text-slate-500">
                  [{idx}]
                </span>
              </div>
            );
          })}
        </div>
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
        codeLines={BINARY_SEARCH_CODE}
        activeLineIndex={currentStep.activeLineIndex}
      />
    </div>
  );
};
