'use client';

import React from 'react';
import { AlgorithmStep } from './AlgorithmLab';
import { clsx } from 'clsx';
import { Check, ChevronRight, Circle } from 'lucide-react';

interface StepTimelineProps {
  steps: AlgorithmStep[];
  currentStepIndex: number;
}

export const StepTimeline: React.FC<StepTimelineProps> = ({ steps, currentStepIndex }) => {
  return (
    <div className="surface h-full max-h-[460px] overflow-y-auto p-3 space-y-0.5">
      <div className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 px-1">
        Algorithm Steps
      </div>

      {steps.map((step, idx) => {
        const isComplete = idx < currentStepIndex;
        const isCurrent = idx === currentStepIndex;
        const isPending = idx > currentStepIndex;

        return (
          <div
            key={idx}
            className={clsx(
              'flex items-start gap-2 px-2 py-1.5 rounded-md transition-colors text-xs',
              isCurrent && 'bg-accent-muted',
              isComplete && 'opacity-60',
            )}
          >
            {/* State icon */}
            <div className="shrink-0 mt-0.5">
              {isComplete ? (
                <Check className="w-3.5 h-3.5 text-state-success" />
              ) : isCurrent ? (
                <ChevronRight className="w-3.5 h-3.5 text-accent animate-pulse" />
              ) : (
                <Circle className="w-3.5 h-3.5 text-text-disabled" />
              )}
            </div>

            {/* Step text */}
            <span
              className={clsx(
                'leading-tight',
                isCurrent ? 'text-accent font-medium' : isComplete ? 'text-text-muted' : 'text-text-disabled'
              )}
            >
              {step.message.length > 60 ? step.message.slice(0, 57) + '...' : step.message}
            </span>
          </div>
        );
      })}
    </div>
  );
};
