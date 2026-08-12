'use client';

import React, { useState, useEffect } from 'react';
import { AlgorithmLab, AlgorithmStep } from './AlgorithmLab';
import { clsx } from 'clsx';
import { RefreshCw } from 'lucide-react';

type SortAlgorithm = 'bubble' | 'selection' | 'insertion' | 'merge' | 'quick';

interface SortStep extends AlgorithmStep {
  array: number[];
  comparing: number[];
  swapping: number[];
  sorted: number[];
}

const ALGORITHM_CODE: Record<SortAlgorithm, string[]> = {
  bubble: [
    'for i = 0 to n - 1:',
    '  for j = 0 to n - i - 2:',
    '    if arr[j] > arr[j + 1]:',
    '      swap(arr[j], arr[j + 1])',
    'return sorted array',
  ],
  selection: [
    'for i = 0 to n - 1:',
    '  minIndex = i',
    '  for j = i + 1 to n - 1:',
    '    if arr[j] < arr[minIndex]: minIndex = j',
    '  swap(arr[i], arr[minIndex])',
  ],
  insertion: [
    'for i = 1 to n - 1:',
    '  key = arr[i], j = i - 1',
    '  while j >= 0 and arr[j] > key:',
    '    arr[j + 1] = arr[j], j--',
    '  arr[j + 1] = key',
  ],
  merge: [
    'function mergeSort(arr, l, r):',
    '  if l >= r: return',
    '  mid = (l + r) / 2',
    '  mergeSort(arr, l, mid)',
    '  mergeSort(arr, mid+1, r)',
    '  merge(arr, l, mid, r)',
  ],
  quick: [
    'function quickSort(arr, low, high):',
    '  if low < high:',
    '    pivot = arr[high]',
    '    i = low - 1',
    '    for j = low to high - 1:',
    '      if arr[j] <= pivot: i++, swap(arr[i], arr[j])',
    '    swap(arr[i+1], arr[high])',
    '    quickSort(left); quickSort(right)',
  ],
};

const WHY_EXPLANATIONS: Record<SortAlgorithm, string> = {
  bubble: 'Bubble Sort repeatedly swaps adjacent elements if they are in the wrong order. After each full pass, the largest unsorted element "bubbles up" to its correct position at the end. This guarantees that after n passes, the entire array is sorted.',
  selection: 'Selection Sort divides the array into sorted and unsorted regions. In each iteration, it finds the minimum element from the unsorted region and places it at the beginning of the unsorted region, growing the sorted region by one.',
  insertion: 'Insertion Sort builds the sorted array one element at a time. It takes each element and inserts it into its correct position within the already-sorted portion, shifting larger elements to the right.',
  merge: 'Merge Sort uses divide-and-conquer: split the array in half recursively until single elements remain, then merge sorted halves back together. Merging two sorted arrays is O(n), and the tree depth is O(log n), giving O(n log n) total.',
  quick: 'Quick Sort picks a pivot and partitions the array so elements smaller than the pivot go left and larger go right. The pivot is then in its final position. Recursing on both partitions sorts the entire array. Average case is O(n log n).',
};

const COMPLEXITY: Record<SortAlgorithm, { time: string; space: string }> = {
  bubble: { time: 'O(n²)', space: 'O(1)' },
  selection: { time: 'O(n²)', space: 'O(1)' },
  insertion: { time: 'O(n²)', space: 'O(1)' },
  merge: { time: 'O(n log n)', space: 'O(n)' },
  quick: { time: 'O(n log n) avg', space: 'O(log n)' },
};

function generateBubbleSortSteps(arr: number[]): SortStep[] {
  const list = [...arr];
  const steps: SortStep[] = [];
  const n = list.length;
  const sortedIndices: number[] = [];

  steps.push({ array: [...list], comparing: [], swapping: [], sorted: [], message: `Starting Bubble Sort on ${n} elements.`, activeLineIndex: 0 });

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({ array: [...list], comparing: [j, j + 1], swapping: [], sorted: [...sortedIndices], message: `Comparing arr[${j}]=${list[j]} with arr[${j + 1}]=${list[j + 1]}.`, activeLineIndex: 2 });
      if (list[j] > list[j + 1]) {
        [list[j], list[j + 1]] = [list[j + 1], list[j]];
        steps.push({ array: [...list], comparing: [], swapping: [j, j + 1], sorted: [...sortedIndices], message: `Swapped! ${list[j]} ↔ ${list[j + 1]}.`, activeLineIndex: 3 });
      }
    }
    sortedIndices.push(n - i - 1);
  }

  steps.push({ array: [...list], comparing: [], swapping: [], sorted: list.map((_, i) => i), message: 'Array is fully sorted!', activeLineIndex: 4 });
  return steps;
}

function generateSelectionSortSteps(arr: number[]): SortStep[] {
  const list = [...arr];
  const steps: SortStep[] = [];
  const n = list.length;
  const sortedIndices: number[] = [];

  steps.push({ array: [...list], comparing: [], swapping: [], sorted: [], message: `Starting Selection Sort on ${n} elements.`, activeLineIndex: 0 });

  for (let i = 0; i < n; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      steps.push({ array: [...list], comparing: [minIdx, j], swapping: [], sorted: [...sortedIndices], message: `Finding minimum: comparing arr[${j}]=${list[j]} with current min arr[${minIdx}]=${list[minIdx]}.`, activeLineIndex: 3 });
      if (list[j] < list[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      [list[i], list[minIdx]] = [list[minIdx], list[i]];
      steps.push({ array: [...list], comparing: [], swapping: [i, minIdx], sorted: [...sortedIndices, i], message: `Placed ${list[i]} at position ${i}.`, activeLineIndex: 4 });
    }
    sortedIndices.push(i);
  }

  steps.push({ array: [...list], comparing: [], swapping: [], sorted: list.map((_, i) => i), message: 'Selection Sort complete!', activeLineIndex: 4 });
  return steps;
}

function generateInsertionSortSteps(arr: number[]): SortStep[] {
  const list = [...arr];
  const steps: SortStep[] = [];
  const n = list.length;

  steps.push({ array: [...list], comparing: [], swapping: [], sorted: [0], message: `Starting Insertion Sort. First element is trivially sorted.`, activeLineIndex: 0 });

  for (let i = 1; i < n; i++) {
    const key = list[i];
    let j = i - 1;
    steps.push({ array: [...list], comparing: [i], swapping: [], sorted: Array.from({ length: i }, (_, k) => k), message: `Picking key=${key} at index ${i}. Inserting into sorted portion.`, activeLineIndex: 1 });

    while (j >= 0 && list[j] > key) {
      list[j + 1] = list[j];
      steps.push({ array: [...list], comparing: [j, j + 1], swapping: [j, j + 1], sorted: [], message: `Shifted arr[${j}]=${list[j]} right. Searching for key=${key}'s position.`, activeLineIndex: 3 });
      j--;
    }
    list[j + 1] = key;
    steps.push({ array: [...list], comparing: [], swapping: [], sorted: Array.from({ length: i + 1 }, (_, k) => k), message: `Inserted key=${key} at position ${j + 1}.`, activeLineIndex: 4 });
  }

  steps.push({ array: [...list], comparing: [], swapping: [], sorted: list.map((_, i) => i), message: 'Insertion Sort complete!', activeLineIndex: 4 });
  return steps;
}

function generateMergeSortSteps(arr: number[]): SortStep[] {
  const list = [...arr];
  const steps: SortStep[] = [];

  steps.push({ array: [...list], comparing: [], swapping: [], sorted: [], message: `Starting Merge Sort on ${list.length} elements using divide-and-conquer.`, activeLineIndex: 0 });

  function mergeSort(l: number, r: number) {
    if (l >= r) return;
    const mid = Math.floor((l + r) / 2);
    steps.push({ array: [...list], comparing: Array.from({ length: r - l + 1 }, (_, i) => l + i), swapping: [], sorted: [], message: `Dividing arr[${l}..${r}] at mid=${mid}.`, activeLineIndex: 2 });

    mergeSort(l, mid);
    mergeSort(mid + 1, r);

    // Merge
    const left = list.slice(l, mid + 1);
    const right = list.slice(mid + 1, r + 1);
    let i = 0, j = 0, k = l;

    while (i < left.length && j < right.length) {
      steps.push({ array: [...list], comparing: [l + i, mid + 1 + j], swapping: [], sorted: [], message: `Merging: comparing ${left[i]} with ${right[j]}.`, activeLineIndex: 5 });
      if (left[i] <= right[j]) {
        list[k] = left[i]; i++;
      } else {
        list[k] = right[j]; j++;
      }
      steps.push({ array: [...list], comparing: [], swapping: [k], sorted: [], message: `Placed ${list[k]} at position ${k}.`, activeLineIndex: 5 });
      k++;
    }
    while (i < left.length) { list[k] = left[i]; i++; k++; }
    while (j < right.length) { list[k] = right[j]; j++; k++; }
    steps.push({ array: [...list], comparing: [], swapping: [], sorted: Array.from({ length: r - l + 1 }, (_, i) => l + i), message: `Merged arr[${l}..${r}] successfully.`, activeLineIndex: 5 });
  }

  mergeSort(0, list.length - 1);
  steps.push({ array: [...list], comparing: [], swapping: [], sorted: list.map((_, i) => i), message: 'Merge Sort complete!', activeLineIndex: 5 });
  return steps;
}

function generateQuickSortSteps(arr: number[]): SortStep[] {
  const list = [...arr];
  const steps: SortStep[] = [];
  const globalSorted: Set<number> = new Set();

  steps.push({ array: [...list], comparing: [], swapping: [], sorted: [], message: `Starting Quick Sort on ${list.length} elements.`, activeLineIndex: 0 });

  function quickSort(low: number, high: number) {
    if (low >= high) {
      if (low === high) globalSorted.add(low);
      return;
    }
    const pivot = list[high];
    steps.push({ array: [...list], comparing: [high], swapping: [], sorted: Array.from(globalSorted), message: `Pivot = ${pivot} (index ${high}). Partitioning arr[${low}..${high}].`, activeLineIndex: 2 });

    let i = low - 1;
    for (let j = low; j < high; j++) {
      steps.push({ array: [...list], comparing: [j, high], swapping: [], sorted: Array.from(globalSorted), message: `Comparing arr[${j}]=${list[j]} with pivot=${pivot}.`, activeLineIndex: 5 });
      if (list[j] <= pivot) {
        i++;
        [list[i], list[j]] = [list[j], list[i]];
        if (i !== j) {
          steps.push({ array: [...list], comparing: [], swapping: [i, j], sorted: Array.from(globalSorted), message: `Swapped arr[${i}]=${list[i]} ↔ arr[${j}]=${list[j]}.`, activeLineIndex: 5 });
        }
      }
    }
    [list[i + 1], list[high]] = [list[high], list[i + 1]];
    const pivotIdx = i + 1;
    globalSorted.add(pivotIdx);
    steps.push({ array: [...list], comparing: [], swapping: [pivotIdx, high], sorted: Array.from(globalSorted), message: `Pivot ${pivot} placed at final position ${pivotIdx}.`, activeLineIndex: 6 });

    quickSort(low, pivotIdx - 1);
    quickSort(pivotIdx + 1, high);
  }

  quickSort(0, list.length - 1);
  steps.push({ array: [...list], comparing: [], swapping: [], sorted: list.map((_, i) => i), message: 'Quick Sort complete!', activeLineIndex: 7 });
  return steps;
}

const STEP_GENERATORS: Record<SortAlgorithm, (arr: number[]) => SortStep[]> = {
  bubble: generateBubbleSortSteps,
  selection: generateSelectionSortSteps,
  insertion: generateInsertionSortSteps,
  merge: generateMergeSortSteps,
  quick: generateQuickSortSteps,
};

export const SortingVisualizer: React.FC = () => {
  const [algorithm, setAlgorithm] = useState<SortAlgorithm>('bubble');
  const [initialArray, setInitialArray] = useState<number[]>([45, 12, 85, 32, 89, 39, 69, 22]);
  const [steps, setSteps] = useState<SortStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [customInput, setCustomInput] = useState('45, 12, 85, 32, 89, 39, 69, 22');

  const generateSteps = (arr: number[], algo: SortAlgorithm) => {
    const generated = STEP_GENERATORS[algo](arr);
    setSteps(generated);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  useEffect(() => {
    generateSteps(initialArray, algorithm);
  }, [algorithm, initialArray]);

  useEffect(() => {
    if (!isPlaying) return;
    const intervalMs = Math.max(200, 1000 / speed);
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev >= steps.length - 1) { setIsPlaying(false); return prev; }
        return prev + 1;
      });
    }, intervalMs);
    return () => clearInterval(timer);
  }, [isPlaying, speed, steps.length]);

  const handleRandomize = () => {
    const random = Array.from({ length: 8 }, () => Math.floor(Math.random() * 90) + 10);
    setInitialArray(random);
    setCustomInput(random.join(', '));
  };

  const handleApplyCustom = () => {
    const parsed = customInput.split(',').map((s) => parseInt(s.trim())).filter((n) => !isNaN(n) && n > 0 && n <= 100);
    if (parsed.length >= 2) setInitialArray(parsed.slice(0, 12));
  };

  const currentStep = steps[currentStepIndex] || { array: initialArray, comparing: [], swapping: [], sorted: [], message: 'Ready', activeLineIndex: 0 };
  const maxVal = Math.max(...currentStep.array, 100);

  // Count comparisons and swaps
  const comparisons = steps.slice(0, currentStepIndex + 1).filter(s => s.comparing.length > 0).length;
  const swaps = steps.slice(0, currentStepIndex + 1).filter(s => s.swapping.length > 0).length;

  return (
    <div className="space-y-4">
      {/* Algorithm selector + custom input */}
      <div className="flex flex-wrap items-center justify-between gap-3 surface p-3">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {(['bubble', 'selection', 'insertion', 'merge', 'quick'] as SortAlgorithm[]).map((algo) => (
            <button
              key={algo}
              onClick={() => setAlgorithm(algo)}
              className={clsx(
                'px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-all whitespace-nowrap',
                algorithm === algo ? 'bg-accent text-bg-primary' : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.04]'
              )}
            >
              {algo}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="e.g. 50, 10, 80"
            className="w-44 surface-inset px-2.5 py-1.5 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-accent rounded-md"
          />
          <button onClick={handleApplyCustom} className="btn-primary py-1.5">Apply</button>
          <button onClick={handleRandomize} className="btn-ghost py-1.5">
            <RefreshCw className="w-3 h-3" /> Random
          </button>
        </div>
      </div>

      {/* AlgorithmLab wrapper */}
      <AlgorithmLab
        algorithmName={`${algorithm.charAt(0).toUpperCase() + algorithm.slice(1)} Sort`}
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
        codeLines={ALGORITHM_CODE[algorithm]}
        whyExplanation={WHY_EXPLANATIONS[algorithm]}
        complexityInfo={COMPLEXITY[algorithm]}
        counters={[
          { label: 'Comparisons', value: comparisons },
          { label: 'Swaps', value: swaps },
        ]}
      >
        {/* Visualization: Array bars */}
        <div className="flex flex-col items-center gap-2">
          {/* Legend */}
          <div className="flex items-center gap-4 text-xxs font-medium text-text-muted mb-2">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-accent" />Default</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-viz-comparing" />Comparing</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-viz-swapping" />Swapping</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-viz-sorted" />Sorted</span>
          </div>

          {/* Bars */}
          <div className="flex items-end justify-center gap-2 sm:gap-3 h-52 w-full">
            {currentStep.array.map((value, idx) => {
              const isComparing = currentStep.comparing.includes(idx);
              const isSwapping = currentStep.swapping.includes(idx);
              const isSorted = currentStep.sorted.includes(idx);
              const heightPct = Math.max(12, (value / maxVal) * 100);

              return (
                <div key={idx} className="flex-1 max-w-[52px] flex flex-col items-center gap-1.5">
                  <span className="text-xxs font-mono font-semibold text-text-secondary">{value}</span>
                  <div
                    style={{ height: `${heightPct}%` }}
                    className={clsx(
                      'w-full rounded-t-lg transition-all duration-200',
                      isSwapping ? 'bg-viz-swapping shadow-glow-amber scale-105'
                        : isComparing ? 'bg-viz-comparing shadow-glow-amber'
                        : isSorted ? 'bg-viz-sorted shadow-glow-emerald'
                        : 'bg-gradient-to-t from-accent/80 to-accent'
                    )}
                  />
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
