'use client';

import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Gauge,
  Sparkles
} from 'lucide-react';
import { clsx } from 'clsx';

interface VisualizerControllerProps {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  speed: number;
  onPlayPause: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onRestart: () => void;
  onSpeedChange: (speed: number) => void;
  statusMessage?: string;
  codeLines?: string[];
  activeLineIndex?: number;
}

export const VisualizerController: React.FC<VisualizerControllerProps> = ({
  currentStep,
  totalSteps,
  isPlaying,
  speed,
  onPlayPause,
  onStepForward,
  onStepBackward,
  onRestart,
  onSpeedChange,
  statusMessage,
  codeLines,
  activeLineIndex
}) => {
  return (
    <div className="space-y-4">
      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-lg">
        {/* Playback Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onRestart}
            className="p-2.5 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-xl transition-colors"
            title="Restart Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={onStepBackward}
            disabled={currentStep <= 0}
            className="p-2.5 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-colors"
            title="Step Backward"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={onPlayPause}
            className={clsx(
              'flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all',
              isPlaying
                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-amber-500/20'
                : 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 hover:opacity-95 shadow-cyan-500/20'
            )}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-slate-950" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Play Simulation</span>
              </>
            )}
          </button>

          <button
            onClick={onStepForward}
            disabled={currentStep >= totalSteps - 1}
            className="p-2.5 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-colors"
            title="Step Forward"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progress Counter */}
        <div className="flex items-center gap-3">
          <div className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-3 py-1.5 rounded-xl">
            Step {Math.min(currentStep + 1, totalSteps)} / {Math.max(totalSteps, 1)}
          </div>

          {/* Speed Selectors */}
          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
            <Gauge className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-0.5" />
            {[0.5, 1, 2, 3].map((s) => (
              <button
                key={s}
                onClick={() => onSpeedChange(s)}
                className={clsx(
                  'px-2 py-1 text-[11px] font-bold rounded-lg transition-colors',
                  speed === s
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                )}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Step Explanation Banner */}
      {statusMessage && (
        <div className="flex items-start gap-3 p-3.5 bg-gradient-to-r from-cyan-500/10 via-slate-900 to-slate-900 border border-cyan-500/25 rounded-2xl text-xs text-slate-200">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div className="flex-1 leading-relaxed">
            <span className="font-bold text-cyan-300">Live Explanation: </span>
            {statusMessage}
          </div>
        </div>
      )}

      {/* Synchronized Code Line Highlighter */}
      {codeLines && codeLines.length > 0 && (
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden font-mono text-xs shadow-inner">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Algorithm Execution State</span>
            <span className="text-[10px] text-cyan-400 lowercase font-mono">live synced</span>
          </div>
          <div className="space-y-0.5">
            {codeLines.map((line, idx) => (
              <div
                key={idx}
                className={clsx(
                  'px-2.5 py-1 rounded-md transition-colors flex items-center gap-3',
                  activeLineIndex === idx
                    ? 'bg-cyan-500/20 text-cyan-200 border-l-2 border-cyan-400 font-semibold'
                    : 'text-slate-400'
                )}
              >
                <span className="text-[10px] text-slate-600 select-none w-4 text-right">
                  {idx + 1}
                </span>
                <span className="overflow-x-auto">{line}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
