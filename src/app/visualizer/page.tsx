'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SortingVisualizer } from '@/components/visualizer/SortingVisualizer';
import { SearchVisualizer } from '@/components/visualizer/SearchVisualizer';
import { ArrayVisualizer } from '@/components/visualizer/ArrayVisualizer';
import { LinkedListVisualizer } from '@/components/visualizer/LinkedListVisualizer';
import { StackQueueVisualizer } from '@/components/visualizer/StackQueueVisualizer';
import { TreeVisualizer } from '@/components/visualizer/TreeVisualizer';
import { GraphVisualizer } from '@/components/visualizer/GraphVisualizer';
import { DPVisualizer } from '@/components/visualizer/DPVisualizer';
import {
  Eye,
  ArrowUpDown,
  Search,
  Layers,
  GitCommit,
  GitBranch,
  Network,
  Cpu,
  Sparkles
} from 'lucide-react';
import { clsx } from 'clsx';

type VisualizerCategory =
  | 'sorting'
  | 'searching'
  | 'arrays'
  | 'linked-list'
  | 'stack-queue'
  | 'trees'
  | 'graphs'
  | 'dp';

const CATEGORIES: { id: VisualizerCategory; name: string; icon: any }[] = [
  { id: 'sorting', name: 'Sorting (5 Algos)', icon: ArrowUpDown },
  { id: 'searching', name: 'Binary Search', icon: Search },
  { id: 'arrays', name: 'Two Pointers & Window', icon: Layers },
  { id: 'linked-list', name: 'Linked List', icon: GitCommit },
  { id: 'stack-queue', name: 'Stack & Queue', icon: Layers },
  { id: 'trees', name: 'Binary Search Trees', icon: GitBranch },
  { id: 'graphs', name: 'Graphs (BFS/DFS)', icon: Network },
  { id: 'dp', name: 'Dynamic Programming', icon: Cpu },
];

export default function VisualizerPage() {
  const [activeCategory, setActiveCategory] = useState<VisualizerCategory>('sorting');

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/30 border border-cyan-500/20 rounded-3xl shadow-xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
            <Eye className="w-4 h-4" />
            <span>Interactive Algorithm Simulation Engine</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            DSA Algorithm Visualizer
          </h1>
          <p className="text-xs text-slate-400 max-w-xl">
            Watch algorithms execute step by step. Control speed, step forward/backward, supply custom input datasets, and observe line-by-line code execution.
          </p>
        </div>

        {/* Algorithm Category Selector Bar */}
        <div className="flex items-center gap-2 p-2 bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto custom-scrollbar">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={clsx(
                  'flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all',
                  isActive
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Render Selected Visualizer Engine */}
        <div className="animate-in fade-in zoom-in-95 duration-200">
          {activeCategory === 'sorting' && <SortingVisualizer />}
          {activeCategory === 'searching' && <SearchVisualizer />}
          {activeCategory === 'arrays' && <ArrayVisualizer />}
          {activeCategory === 'linked-list' && <LinkedListVisualizer />}
          {activeCategory === 'stack-queue' && <StackQueueVisualizer />}
          {activeCategory === 'trees' && <TreeVisualizer />}
          {activeCategory === 'graphs' && <GraphVisualizer />}
          {activeCategory === 'dp' && <DPVisualizer />}
        </div>
      </div>
    </AppLayout>
  );
}
