'use client';

import React, { useState } from 'react';
import { clsx } from 'clsx';
import { Layers, ArrowDown, ArrowUp, ArrowRight, CornerDownLeft } from 'lucide-react';

export const StackQueueVisualizer: React.FC = () => {
  const [structure, setStructure] = useState<'stack' | 'queue'>('stack');
  const [stackItems, setStackItems] = useState<number[]>([10, 20, 30, 40]);
  const [queueItems, setQueueItems] = useState<number[]>([10, 20, 30, 40]);
  const [inputValue, setInputValue] = useState<string>('50');
  const [lastAction, setLastAction] = useState<string>('Ready for operations');

  const handlePushStack = () => {
    const val = parseInt(inputValue);
    if (!isNaN(val) && stackItems.length < 8) {
      setStackItems([...stackItems, val]);
      setLastAction(`Pushed ${val} onto top of Stack.`);
      setInputValue(String(val + 10));
    }
  };

  const handlePopStack = () => {
    if (stackItems.length > 0) {
      const popped = stackItems[stackItems.length - 1];
      setStackItems(stackItems.slice(0, -1));
      setLastAction(`Popped ${popped} from top of Stack (LIFO).`);
    }
  };

  const handleEnqueue = () => {
    const val = parseInt(inputValue);
    if (!isNaN(val) && queueItems.length < 8) {
      setQueueItems([...queueItems, val]);
      setLastAction(`Enqueued ${val} at the back of Queue.`);
      setInputValue(String(val + 10));
    }
  };

  const handleDequeue = () => {
    if (queueItems.length > 0) {
      const dequeued = queueItems[0];
      setQueueItems(queueItems.slice(1));
      setLastAction(`Dequeued ${dequeued} from the front of Queue (FIFO).`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Switcher & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900 border border-slate-800 rounded-2xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStructure('stack')}
            className={clsx(
              'px-4 py-2 text-xs font-bold rounded-xl transition-all',
              structure === 'stack'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white bg-slate-800'
            )}
          >
            Stack (LIFO)
          </button>
          <button
            onClick={() => setStructure('queue')}
            className={clsx(
              'px-4 py-2 text-xs font-bold rounded-xl transition-all',
              structure === 'queue'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white bg-slate-800'
            )}
          >
            Queue (FIFO)
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-16 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-cyan-300 font-bold focus:outline-none focus:border-cyan-500"
          />

          {structure === 'stack' ? (
            <>
              <button
                onClick={handlePushStack}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors"
              >
                <ArrowDown className="w-3.5 h-3.5" />
                Push
              </button>
              <button
                onClick={handlePopStack}
                disabled={stackItems.length === 0}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-slate-950 bg-rose-400 hover:bg-rose-300 disabled:opacity-40 rounded-lg transition-colors"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                Pop
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleEnqueue}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                Enqueue
              </button>
              <button
                onClick={handleDequeue}
                disabled={queueItems.length === 0}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-slate-950 bg-rose-400 hover:bg-rose-300 disabled:opacity-40 rounded-lg transition-colors"
              >
                <CornerDownLeft className="w-3.5 h-3.5" />
                Dequeue
              </button>
            </>
          )}
        </div>
      </div>

      {/* Canvas */}
      <div className="p-8 bg-slate-950 border border-slate-800 rounded-3xl min-h-[340px] flex flex-col justify-center items-center shadow-2xl relative">
        {structure === 'stack' ? (
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-cyan-400 mb-2">▲ Top of Stack (LIFO)</span>
            <div className="w-48 border-x-2 border-b-2 border-slate-700 p-2 flex flex-col-reverse gap-2 bg-slate-900/40 rounded-b-2xl min-h-[220px]">
              {stackItems.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-slate-600 text-xs italic">
                  Stack is Empty
                </div>
              ) : (
                stackItems.map((val, idx) => (
                  <div
                    key={idx}
                    className={clsx(
                      'p-3 rounded-xl font-mono font-bold text-center text-sm shadow-md transition-all animate-in slide-in-from-top-4 duration-200',
                      idx === stackItems.length - 1
                        ? 'bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 shadow-cyan-500/20'
                        : 'bg-slate-800 text-slate-200 border border-slate-700'
                    )}
                  >
                    {val}
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center w-full max-w-xl">
            <div className="flex items-center justify-between w-full text-xs font-bold mb-3 px-4">
              <span className="text-rose-400 flex items-center gap-1">
                <CornerDownLeft className="w-3.5 h-3.5" /> Front (Dequeue)
              </span>
              <span className="text-emerald-400 flex items-center gap-1">
                Back (Enqueue) <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="flex items-center gap-3 p-4 bg-slate-900/60 border border-slate-800 rounded-2xl w-full justify-start overflow-x-auto min-h-[90px]">
              {queueItems.length === 0 ? (
                <div className="w-full text-center text-slate-600 text-xs italic py-4">
                  Queue is Empty
                </div>
              ) : (
                queueItems.map((val, idx) => (
                  <div
                    key={idx}
                    className={clsx(
                      'w-14 h-14 rounded-2xl flex items-center justify-center font-mono font-bold text-sm shadow-md transition-all animate-in slide-in-from-right-4 duration-200 shrink-0',
                      idx === 0
                        ? 'bg-gradient-to-r from-rose-500 to-amber-400 text-slate-950 ring-2 ring-rose-300'
                        : idx === queueItems.length - 1
                        ? 'bg-emerald-400 text-slate-950'
                        : 'bg-slate-800 text-slate-200 border border-slate-700'
                    )}
                  >
                    {val}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Action log message */}
        <div className="mt-8 text-xs font-semibold text-slate-400 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl">
          Operation: <span className="text-cyan-300">{lastAction}</span>
        </div>
      </div>
    </div>
  );
};
