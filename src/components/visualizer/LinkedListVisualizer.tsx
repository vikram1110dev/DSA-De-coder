'use client';

import React, { useState, useEffect } from 'react';
import { VisualizerController } from './VisualizerController';
import { clsx } from 'clsx';
import { ArrowRight, CornerDownRight } from 'lucide-react';

interface LLStep {
  nodes: number[];
  reversedPointers: number[]; // index of nodes whose next pointer points to prev
  prevIndex: number;
  currIndex: number;
  message: string;
  activeLineIndex: number;
}

const REVERSE_LL_CODE = [
  'prev = null, curr = head',
  'while curr != null:',
  '  nextTemp = curr.next',
  '  curr.next = prev',
  '  prev = curr, curr = nextTemp',
  'return prev (new head)'
];

export const LinkedListVisualizer: React.FC = () => {
  const [initialNodes] = useState<number[]>([10, 20, 30, 40, 50]);
  const [steps, setSteps] = useState<LLStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);

  const generateReverseSteps = (nodes: number[]) => {
    const generated: LLStep[] = [];
    const reversedPointers: number[] = [];

    generated.push({
      nodes: [...nodes],
      reversedPointers: [],
      prevIndex: -1,
      currIndex: 0,
      message: 'Initialized prev = null, curr = Node(10). Ready to reverse linked list.',
      activeLineIndex: 0
    });

    for (let i = 0; i < nodes.length; i++) {
      generated.push({
        nodes: [...nodes],
        reversedPointers: [...reversedPointers],
        prevIndex: i - 1,
        currIndex: i,
        message: `Saved nextTemp = ${i + 1 < nodes.length ? `Node(${nodes[i + 1]})` : 'null'}. Pointing Node(${nodes[i]}).next to ${i > 0 ? `Node(${nodes[i - 1]})` : 'null'}.`,
        activeLineIndex: 3
      });

      reversedPointers.push(i);

      generated.push({
        nodes: [...nodes],
        reversedPointers: [...reversedPointers],
        prevIndex: i,
        currIndex: i + 1,
        message: `Advanced pointers: prev = Node(${nodes[i]}), curr = ${i + 1 < nodes.length ? `Node(${nodes[i + 1]})` : 'null'}.`,
        activeLineIndex: 4
      });
    }

    generated.push({
      nodes: [...nodes],
      reversedPointers: [...reversedPointers],
      prevIndex: nodes.length - 1,
      currIndex: nodes.length,
      message: `Loop completed! Return prev = Node(${nodes[nodes.length - 1]}) as the new head of the reversed list.`,
      activeLineIndex: 5
    });

    setSteps(generated);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  useEffect(() => {
    generateReverseSteps(initialNodes);
  }, [initialNodes]);

  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      const intervalMs = Math.max(350, 1400 / speed);
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
    nodes: initialNodes,
    reversedPointers: [],
    prevIndex: -1,
    currIndex: 0,
    message: 'Ready',
    activeLineIndex: 0
  };

  return (
    <div className="space-y-6">
      {/* Canvas */}
      <div className="p-8 bg-slate-950 border border-slate-800 rounded-3xl min-h-[300px] flex flex-col justify-center items-center shadow-2xl relative overflow-x-auto">
        <div className="flex items-center gap-3 sm:gap-4 min-w-max px-4">
          {currentStep.nodes.map((val, idx) => {
            const isPrev = idx === currentStep.prevIndex;
            const isCurr = idx === currentStep.currIndex;
            const isReversed = currentStep.reversedPointers.includes(idx);

            return (
              <React.Fragment key={idx}>
                <div className="flex flex-col items-center gap-2">
                  {/* Top Pointer Badges */}
                  <div className="h-5 flex items-center gap-1">
                    {isPrev && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 bg-amber-400 text-slate-950 rounded-md">
                        PREV
                      </span>
                    )}
                    {isCurr && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 bg-cyan-400 text-slate-950 rounded-md">
                        CURR
                      </span>
                    )}
                  </div>

                  {/* Node Box */}
                  <div
                    className={clsx(
                      'w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-mono font-bold shadow-lg transition-all duration-300',
                      isCurr
                        ? 'bg-cyan-500 text-slate-950 ring-2 ring-cyan-300 scale-105 shadow-cyan-500/30'
                        : isPrev
                        ? 'bg-amber-400 text-slate-950 shadow-amber-400/30'
                        : 'bg-slate-900 text-slate-200 border border-slate-700'
                    )}
                  >
                    <span className="text-base">{val}</span>
                    <span className="text-[9px] opacity-75 font-normal">node</span>
                  </div>

                  <span className="text-[10px] font-mono text-slate-500">[{idx}]</span>
                </div>

                {/* Arrow Connector */}
                {idx < currentStep.nodes.length - 1 && (
                  <div className="flex items-center text-slate-600 px-1 transition-transform">
                    {isReversed ? (
                      <div className="flex items-center gap-1 text-emerald-400 rotate-180">
                        <ArrowRight className="w-5 h-5 animate-pulse" />
                      </div>
                    ) : (
                      <ArrowRight className="w-5 h-5 text-slate-600" />
                    )}
                  </div>
                )}
              </React.Fragment>
            );
          })}

          {/* Null Terminator */}
          <div className="flex items-center gap-2 pl-2">
            <ArrowRight className="w-4 h-4 text-slate-700" />
            <div className="px-3 py-1.5 bg-slate-900 border border-slate-800 text-slate-500 rounded-xl font-mono text-xs">
              null
            </div>
          </div>
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
        codeLines={REVERSE_LL_CODE}
        activeLineIndex={currentStep.activeLineIndex}
      />
    </div>
  );
};
