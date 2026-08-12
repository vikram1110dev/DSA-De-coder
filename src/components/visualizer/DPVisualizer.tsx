'use client';

import React, { useState } from 'react';
import { clsx } from 'clsx';
import { Play } from 'lucide-react';

export const DPVisualizer: React.FC = () => {
  const [amount, setAmount] = useState<number>(7);
  const [coins] = useState<number[]>([1, 2, 5]);
  const [dpTable, setDpTable] = useState<number[]>(new Array(8).fill(Infinity));
  const [activeAmount, setActiveAmount] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('Click Run DP to step through the bottom-up Coin Change tabulation table.');

  const runCoinChangeDP = async () => {
    const n = amount + 1;
    const table = new Array(n).fill(Infinity);
    table[0] = 0;
    setDpTable([...table]);
    setStatusMessage('Base case initialized: dp[0] = 0 (0 coins required for amount $0).');

    for (let i = 1; i <= amount; i++) {
      setActiveAmount(i);
      setStatusMessage(`Computing dp[${i}] across available coins [1, 2, 5]...`);
      await new Promise((r) => setTimeout(r, 450));

      for (const coin of coins) {
        if (i - coin >= 0 && table[i - coin] !== Infinity) {
          table[i] = Math.min(table[i], table[i - coin] + 1);
        }
      }

      setDpTable([...table]);
      setStatusMessage(`dp[${i}] = ${table[i] === Infinity ? -1 : table[i]} min coins.`);
      await new Promise((r) => setTimeout(r, 350));
    }

    setActiveAmount(null);
    setStatusMessage(`🎉 Tabulation Complete! Minimum coins needed for $${amount} is ${table[amount]} coins.`);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900 border border-slate-800 rounded-2xl">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-300">Target Amount:</span>
          <div className="flex items-center gap-1.5">
            {[5, 7, 10, 11].map((amt) => (
              <button
                key={amt}
                onClick={() => {
                  setAmount(amt);
                  setDpTable(new Array(amt + 1).fill(Infinity));
                }}
                className={clsx(
                  'px-3 py-1 text-xs font-bold rounded-lg transition-colors',
                  amount === amt
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                )}
              >
                ${amt}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={runCoinChangeDP}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-500 to-emerald-400 hover:opacity-95 rounded-xl transition-all shadow-md shadow-cyan-500/20"
        >
          <Play className="w-3.5 h-3.5 fill-slate-950" />
          <span>Run DP Tabulation</span>
        </button>
      </div>

      {/* Canvas */}
      <div className="p-8 bg-slate-950 border border-slate-800 rounded-3xl min-h-[300px] flex flex-col justify-center items-center shadow-2xl relative overflow-x-auto">
        <div className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider">
          1D DP State Table: <code className="text-cyan-300">dp[amount] = min coins</code>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {Array.from({ length: amount + 1 }, (_, i) => i).map((idx) => {
            const isActive = activeAmount === idx;
            const val = dpTable[idx];

            return (
              <div key={idx} className="flex flex-col items-center gap-2">
                <span className="text-[11px] font-mono font-bold text-slate-500">
                  ${idx}
                </span>

                <div
                  className={clsx(
                    'w-12 h-14 sm:w-14 sm:h-16 rounded-2xl flex items-center justify-center font-mono font-bold text-base transition-all duration-300 shadow-md',
                    isActive
                      ? 'bg-amber-400 text-slate-950 scale-110 shadow-amber-400/40 ring-2 ring-amber-300'
                      : val !== Infinity && val !== undefined
                      ? 'bg-gradient-to-tr from-cyan-600 to-cyan-400 text-slate-950 shadow-cyan-500/20'
                      : 'bg-slate-900 text-slate-600 border border-slate-800'
                  )}
                >
                  {val === Infinity || val === undefined ? '∞' : val}
                </div>

                <span className="text-[10px] font-mono text-slate-500">
                  dp[{idx}]
                </span>
              </div>
            );
          })}
        </div>

        {/* Live Message */}
        <div className="mt-8 text-xs text-cyan-300 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl">
          {statusMessage}
        </div>
      </div>
    </div>
  );
};
