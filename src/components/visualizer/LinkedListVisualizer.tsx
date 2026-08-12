'use client';

import React, { useState, useEffect } from 'react';
import { AlgorithmLab, AlgorithmStep } from './AlgorithmLab';
import { clsx } from 'clsx';

interface LLStep extends AlgorithmStep {
  nodes: number[];
  headIdx: number;
  currentIdx: number | null;
  prevIdx: number | null;
  nextIdx: number | null;
  reversed: number[];
}

const LL_CODE = [
  'prev = null, current = head',
  'while current != null:',
  '  next = current.next',
  '  current.next = prev',
  '  prev = current',
  '  current = next',
  'return prev (new head)',
];

function generateReversalSteps(nodes: number[]): LLStep[] {
  const steps: LLStep[] = [];
  const n = nodes.length;
  const reversed: number[] = [];

  steps.push({ nodes: [...nodes], headIdx: 0, currentIdx: 0, prevIdx: null, nextIdx: 1, reversed: [], message: `Starting linked list reversal. Head = ${nodes[0]}. prev = null, current = ${nodes[0]}.`, activeLineIndex: 0 });

  let prevIdx: number | null = null;
  let currIdx: number | null = 0;

  while (currIdx !== null && currIdx < n) {
    const nextIdx: number | null = currIdx + 1 < n ? currIdx + 1 : null;
    steps.push({ nodes: [...nodes], headIdx: 0, currentIdx: currIdx, prevIdx, nextIdx, reversed: [...reversed], message: `Save next = ${nextIdx !== null ? nodes[nextIdx] : 'null'}. Reverse pointer: ${nodes[currIdx]}.next = ${prevIdx !== null ? nodes[prevIdx] : 'null'}.`, activeLineIndex: 3 });

    reversed.unshift(nodes[currIdx]);
    steps.push({ nodes: [...nodes], headIdx: 0, currentIdx: currIdx, prevIdx, nextIdx, reversed: [...reversed], message: `Move forward: prev = ${nodes[currIdx]}, current = ${nextIdx !== null ? nodes[nextIdx] : 'null'}.`, activeLineIndex: 5 });

    prevIdx = currIdx;
    currIdx = nextIdx;
  }

  steps.push({ nodes: [...nodes], headIdx: n - 1, currentIdx: null, prevIdx, nextIdx: null, reversed: [...reversed], message: `Reversal complete! New head = ${nodes[n - 1]}. List: ${reversed.join(' → ')}.`, activeLineIndex: 6 });
  return steps;
}

export const LinkedListVisualizer: React.FC = () => {
  const [nodes] = useState([10, 20, 30, 40, 50]);
  const [steps, setSteps] = useState<LLStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    setSteps(generateReversalSteps(nodes));
    setCurrentStepIndex(0);
  }, [nodes]);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev >= steps.length - 1) { setIsPlaying(false); return prev; }
        return prev + 1;
      });
    }, Math.max(500, 1200 / speed));
    return () => clearInterval(timer);
  }, [isPlaying, speed, steps.length]);

  const currentStep = steps[currentStepIndex] || { nodes, headIdx: 0, currentIdx: null, prevIdx: null, nextIdx: null, reversed: [], message: 'Ready', activeLineIndex: 0 };

  return (
    <AlgorithmLab
      algorithmName="Linked List Reversal"
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
      codeLines={LL_CODE}
      whyExplanation="We reverse a linked list by changing each node's next pointer to point to the previous node instead. Using three pointers (prev, current, next), we can do this in O(n) time with O(1) space — no extra data structure needed."
      complexityInfo={{ time: 'O(n)', space: 'O(1)' }}
    >
      <div className="flex flex-col items-center gap-6">
        {/* Pointer labels */}
        <div className="flex items-center gap-4 text-xxs font-medium">
          <span className="text-accent-violet">prev: {currentStep.prevIdx !== null ? nodes[currentStep.prevIdx] : 'null'}</span>
          <span className="text-accent">current: {currentStep.currentIdx !== null ? nodes[currentStep.currentIdx] : 'null'}</span>
          <span className="text-accent-amber">next: {currentStep.nextIdx !== null ? nodes[currentStep.nextIdx] : 'null'}</span>
        </div>

        {/* Node chain */}
        <div className="flex items-center gap-0">
          {nodes.map((val, idx) => {
            const isCurrent = currentStep.currentIdx === idx;
            const isPrev = currentStep.prevIdx === idx;
            const isNext = currentStep.nextIdx === idx;

            return (
              <React.Fragment key={idx}>
                <div className="flex flex-col items-center gap-1">
                  {/* Label */}
                  <div className="h-4 text-xxs font-bold">
                    {isCurrent && <span className="text-accent">curr</span>}
                    {isPrev && <span className="text-accent-violet">prev</span>}
                    {isNext && <span className="text-accent-amber">next</span>}
                  </div>

                  {/* Node box */}
                  <div className={clsx(
                    'w-14 h-10 rounded-lg flex items-center justify-center font-mono font-bold text-sm transition-all duration-300 border',
                    isCurrent ? 'bg-accent text-bg-primary border-accent'
                      : isPrev ? 'bg-accent-violet/20 text-accent-violet border-accent-violet/40'
                      : isNext ? 'bg-accent-amber/20 text-accent-amber border-accent-amber/40'
                      : 'bg-bg-surface text-text-primary border-border-default'
                  )}>
                    {val}
                  </div>
                </div>

                {/* Arrow */}
                {idx < nodes.length - 1 && (
                  <div className="flex items-center px-1 mt-4">
                    <div className="w-6 h-0.5 bg-border-strong" />
                    <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-border-strong" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
          {/* null */}
          <div className="flex items-center px-1 mt-4">
            <div className="w-4 h-0.5 bg-border-subtle" />
            <span className="text-xxs text-text-disabled ml-1">null</span>
          </div>
        </div>

        {/* Reversed so far */}
        {currentStep.reversed.length > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="text-xxs text-text-muted">Reversed:</span>
            {currentStep.reversed.map((v, i) => (
              <span key={i} className="badge badge-emerald">{v}</span>
            ))}
          </div>
        )}
      </div>
    </AlgorithmLab>
  );
};
