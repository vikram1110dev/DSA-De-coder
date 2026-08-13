'use client';

import React, { useEffect, useCallback } from 'react';
import { StepTimeline } from './StepTimeline';
import { CodePanel } from './CodePanel';
import {
  Play, Pause, SkipBack, SkipForward, RotateCcw, Gauge,
} from 'lucide-react';
import { clsx } from 'clsx';

export interface AlgorithmStep {
  message: string;
  activeLineIndex: number;
  detail?: string;
}

interface AlgorithmLabProps {
  algorithmName: string;
  steps: AlgorithmStep[];
  currentStepIndex: number;
  totalSteps: number;
  isPlaying: boolean;
  speed: number;
  onPlayPause: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onRestart: () => void;
  onSpeedChange: (speed: number) => void;
  codeLines: string[];
  children: React.ReactNode; // visualization canvas
  whyExplanation?: string;
  complexityInfo?: { time: string; space: string };
  counters?: { label: string; value: number }[];
}

export const AlgorithmLab: React.FC<AlgorithmLabProps> = ({
  algorithmName,
  steps,
  currentStepIndex,
  totalSteps,
  isPlaying,
  speed,
  onPlayPause,
  onStepForward,
  onStepBackward,
  onRestart,
  onSpeedChange,
  codeLines,
  children,
  whyExplanation,
  complexityInfo,
  counters,
}) => {
  const currentStep = steps[currentStepIndex];
  const isComplete = currentStepIndex >= totalSteps - 1;

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
    switch (e.key) {
      case ' ':
        e.preventDefault();
        onPlayPause();
        break;
      case 'ArrowRight':
        e.preventDefault();
        onStepForward();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        onStepBackward();
        break;
      case 'r':
      case 'R':
        e.preventDefault();
        onRestart();
        break;
      case ']':
        e.preventDefault();
        onSpeedChange(Math.min(speed + 0.5, 5));
        break;
      case '[':
        e.preventDefault();
        onSpeedChange(Math.max(speed - 0.5, 0.25));
        break;
    }
  }, [onPlayPause, onStepForward, onStepBackward, onRestart, onSpeedChange, speed]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="space-y-3">
      {/* ── Header bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 surface p-4">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-semibold text-text-primary">{algorithmName}</h2>
          <span className="badge badge-cyan">
            Step {Math.min(currentStepIndex + 1, totalSteps)} / {totalSteps}
          </span>
          {counters && counters.map((c) => (
            <span key={c.label} className="text-xs font-mono text-text-muted">
              {c.label}: <span className="text-accent font-semibold">{c.value}</span>
            </span>
          ))}
        </div>

        {/* Playback controls */}
        <div className="flex items-center gap-1.5">
          <button onClick={onRestart} className="btn-ghost p-2" title="Restart (R)" aria-label="Restart">
            <RotateCcw className="w-4 h-4" />
          </button>
          <button onClick={onStepBackward} disabled={currentStepIndex <= 0} className="btn-ghost p-2 disabled:opacity-30" title="Step back (←)" aria-label="Step backward">
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={onPlayPause}
            className={clsx(
              'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all',
              isPlaying
                ? 'bg-accent-amber text-bg-primary hover:bg-accent-amber/90'
                 : 'bg-accent text-bg-primary hover:bg-accent-hover'
            )}
            title="Play/Pause (Space)"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          <button onClick={onStepForward} disabled={isComplete} className="btn-ghost p-2 disabled:opacity-30" title="Step forward (→)" aria-label="Step forward">
            <SkipForward className="w-4 h-4" />
          </button>

          {/* Speed selector */}
          <div className="flex items-center gap-0.5 ml-2 surface-inset px-1.5 py-1 rounded-md">
            <Gauge className="w-3.5 h-3.5 text-text-muted ml-1" />
            {[0.25, 0.5, 1, 2, 5].map((s) => (
              <button
                key={s}
                onClick={() => onSpeedChange(s)}
                className={clsx(
                  'px-2 py-1 text-xs font-semibold rounded transition-colors',
                  speed === s ? 'bg-accent text-bg-primary' : 'text-text-muted hover:text-text-secondary'
                )}
                title={`Speed shortcut: [ to slow down, ] to speed up`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main workspace: 3-panel layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-3">
        {/* Left: Step Timeline */}
        <div className="hidden lg:block">
          <StepTimeline
            steps={steps}
            currentStepIndex={currentStepIndex}
          />
        </div>

        {/* Center: Visualization canvas */}
        <div className="surface-inset p-6 min-h-[380px] flex flex-col justify-center items-center relative overflow-hidden">
          {/* Subtle glow */}
          <div className="absolute inset-0 bg-hero-glow pointer-events-none opacity-30" />
          <div className="relative w-full">
            {children}
          </div>
        </div>
      </div>

      {/* ── Bottom: Live explanation + Code panel ── */}
      {currentStep && (
        <div className="surface-accent px-4 py-3 flex items-start gap-2.5">
          <div className="w-2 h-2 rounded-full bg-accent mt-1.5 shrink-0 animate-step-pulse" />
          <p className="text-sm text-text-primary leading-relaxed">
            {currentStep.message}
          </p>
        </div>
      )}

      <CodePanel
        codeLines={codeLines}
        activeLineIndex={currentStep?.activeLineIndex ?? 0}
        whyExplanation={whyExplanation}
        complexityInfo={complexityInfo}
      />
    </div>
  );
};
