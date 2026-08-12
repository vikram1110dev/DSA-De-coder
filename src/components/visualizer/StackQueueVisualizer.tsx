'use client';

import React, { useState, useEffect } from 'react';
import { AlgorithmLab, AlgorithmStep } from './AlgorithmLab';
import { clsx } from 'clsx';

type DSMode = 'stack' | 'queue';

interface DSStep extends AlgorithmStep {
  elements: number[];
  topOrFront: number | null;
  action: 'push' | 'pop' | 'enqueue' | 'dequeue' | 'peek' | 'idle';
  actionValue?: number;
}

const STACK_CODE = ['stack = []', 'push(x): stack.append(x)', 'pop(): return stack.pop()', 'peek(): return stack[-1]', 'isEmpty(): return len(stack) == 0'];
const QUEUE_CODE = ['queue = []', 'enqueue(x): queue.append(x)', 'dequeue(): return queue.pop(0)', 'front(): return queue[0]', 'isEmpty(): return len(queue) == 0'];

const STACK_OPS = [
  { op: 'push', val: 10 }, { op: 'push', val: 20 }, { op: 'push', val: 30 },
  { op: 'peek' }, { op: 'pop' }, { op: 'push', val: 40 }, { op: 'pop' }, { op: 'pop' },
];

const QUEUE_OPS = [
  { op: 'enqueue', val: 10 }, { op: 'enqueue', val: 20 }, { op: 'enqueue', val: 30 },
  { op: 'front' }, { op: 'dequeue' }, { op: 'enqueue', val: 40 }, { op: 'dequeue' }, { op: 'dequeue' },
];

function generateStackSteps(): DSStep[] {
  const steps: DSStep[] = [];
  const stack: number[] = [];
  steps.push({ elements: [], topOrFront: null, action: 'idle', message: 'Stack initialized. LIFO — Last In, First Out.', activeLineIndex: 0 });

  for (const op of STACK_OPS) {
    if (op.op === 'push' && op.val !== undefined) {
      stack.push(op.val);
      steps.push({ elements: [...stack], topOrFront: stack.length - 1, action: 'push', actionValue: op.val, message: `push(${op.val}). Stack: [${stack.join(', ')}]. Top = ${op.val}.`, activeLineIndex: 1 });
    } else if (op.op === 'pop') {
      const val = stack.pop();
      steps.push({ elements: [...stack], topOrFront: stack.length > 0 ? stack.length - 1 : null, action: 'pop', actionValue: val, message: `pop() → ${val}. Stack: [${stack.join(', ')}].`, activeLineIndex: 2 });
    } else if (op.op === 'peek') {
      steps.push({ elements: [...stack], topOrFront: stack.length - 1, action: 'peek', actionValue: stack[stack.length - 1], message: `peek() → ${stack[stack.length - 1]}. Stack unchanged.`, activeLineIndex: 3 });
    }
  }
  steps.push({ elements: [...stack], topOrFront: null, action: 'idle', message: `Operations complete. Final stack: [${stack.join(', ')}].`, activeLineIndex: 4 });
  return steps;
}

function generateQueueSteps(): DSStep[] {
  const steps: DSStep[] = [];
  const queue: number[] = [];
  steps.push({ elements: [], topOrFront: null, action: 'idle', message: 'Queue initialized. FIFO — First In, First Out.', activeLineIndex: 0 });

  for (const op of QUEUE_OPS) {
    if (op.op === 'enqueue' && op.val !== undefined) {
      queue.push(op.val);
      steps.push({ elements: [...queue], topOrFront: 0, action: 'enqueue', actionValue: op.val, message: `enqueue(${op.val}). Queue: [${queue.join(', ')}]. Front = ${queue[0]}.`, activeLineIndex: 1 });
    } else if (op.op === 'dequeue') {
      const val = queue.shift();
      steps.push({ elements: [...queue], topOrFront: queue.length > 0 ? 0 : null, action: 'dequeue', actionValue: val, message: `dequeue() → ${val}. Queue: [${queue.join(', ')}].`, activeLineIndex: 2 });
    } else if (op.op === 'front') {
      steps.push({ elements: [...queue], topOrFront: 0, action: 'peek', actionValue: queue[0], message: `front() → ${queue[0]}. Queue unchanged.`, activeLineIndex: 3 });
    }
  }
  steps.push({ elements: [...queue], topOrFront: null, action: 'idle', message: `Operations complete. Final queue: [${queue.join(', ')}].`, activeLineIndex: 4 });
  return steps;
}

export const StackQueueVisualizer: React.FC = () => {
  const [mode, setMode] = useState<DSMode>('stack');
  const [steps, setSteps] = useState<DSStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    setSteps(mode === 'stack' ? generateStackSteps() : generateQueueSteps());
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [mode]);

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

  const currentStep = steps[currentStepIndex] || { elements: [], topOrFront: null, action: 'idle', message: 'Ready', activeLineIndex: 0 };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-1.5 surface p-3">
        {(['stack', 'queue'] as DSMode[]).map((m) => (
          <button key={m} onClick={() => setMode(m)}
            className={clsx('px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-all',
              mode === m ? 'bg-accent text-bg-primary' : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.04]'
            )}
          >
            {m} ({m === 'stack' ? 'LIFO' : 'FIFO'})
          </button>
        ))}
      </div>

      <AlgorithmLab
        algorithmName={mode === 'stack' ? 'Stack (LIFO)' : 'Queue (FIFO)'}
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
        codeLines={mode === 'stack' ? STACK_CODE : QUEUE_CODE}
        whyExplanation={mode === 'stack' ? 'A Stack follows Last-In-First-Out (LIFO). The last element added is the first removed. Used in function calls, undo operations, expression evaluation, and DFS.' : 'A Queue follows First-In-First-Out (FIFO). The first element added is the first removed. Used in BFS, task scheduling, and message buffers.'}
        complexityInfo={{ time: 'O(1) per operation', space: 'O(n)' }}
      >
        <div className="flex flex-col items-center gap-4">
          {/* Action indicator */}
          {currentStep.action !== 'idle' && (
            <div className="badge badge-amber text-xs">
              {currentStep.action}({currentStep.actionValue ?? ''})
            </div>
          )}

          {mode === 'stack' ? (
            /* Stack: Vertical, TOP at top */
            <div className="flex flex-col items-center gap-1 min-h-[160px] justify-end">
              {currentStep.elements.length === 0 ? (
                <span className="text-xs text-text-disabled italic">Empty Stack</span>
              ) : (
                [...currentStep.elements].reverse().map((val, displayIdx) => {
                  const realIdx = currentStep.elements.length - 1 - displayIdx;
                  const isTop = realIdx === currentStep.elements.length - 1;
                  return (
                    <div key={`${displayIdx}-${val}`} className="flex items-center gap-2">
                      <div className={clsx(
                        'w-20 h-10 rounded-lg flex items-center justify-center font-mono font-bold text-sm border transition-all',
                        isTop ? 'bg-accent text-bg-primary border-accent' : 'bg-bg-surface text-text-primary border-border-default'
                      )}>
                        {val}
                      </div>
                      {isTop && <span className="text-xxs font-bold text-accent">← TOP</span>}
                    </div>
                  );
                })
              )}
              <div className="w-24 h-0.5 bg-border-strong mt-1" />
              <span className="text-xxs text-text-disabled">Bottom</span>
            </div>
          ) : (
            /* Queue: Horizontal, FRONT at left */
            <div className="flex items-center gap-1 min-h-[80px]">
              {currentStep.elements.length === 0 ? (
                <span className="text-xs text-text-disabled italic">Empty Queue</span>
              ) : (
                <>
                  <span className="text-xxs font-bold text-accent mr-1">FRONT →</span>
                  {currentStep.elements.map((val, idx) => {
                    const isFront = idx === 0;
                    const isRear = idx === currentStep.elements.length - 1;
                    return (
                      <div key={`${idx}-${val}`} className={clsx(
                        'w-14 h-12 rounded-lg flex items-center justify-center font-mono font-bold text-sm border transition-all',
                        isFront ? 'bg-accent text-bg-primary border-accent'
                          : isRear ? 'bg-accent-emerald/20 text-accent-emerald border-accent-emerald/40'
                          : 'bg-bg-surface text-text-primary border-border-default'
                      )}>
                        {val}
                      </div>
                    );
                  })}
                  <span className="text-xxs font-bold text-accent-emerald ml-1">← REAR</span>
                </>
              )}
            </div>
          )}
        </div>
      </AlgorithmLab>
    </div>
  );
};
