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
  ArrowUpDown,
  Search,
  Layers,
  GitCommitHorizontal,
  GitBranch,
  Network,
  Cpu,
  LayoutList,
} from 'lucide-react';
import { clsx } from 'clsx';

type VisualizerCategory = 'sorting' | 'searching' | 'arrays' | 'linked-list' | 'stack-queue' | 'trees' | 'graphs' | 'dp';

const CATEGORIES: { id: VisualizerCategory; name: string; icon: any }[] = [
  { id: 'sorting', name: 'Sorting', icon: ArrowUpDown },
  { id: 'searching', name: 'Binary Search', icon: Search },
  { id: 'arrays', name: 'Arrays', icon: Layers },
  { id: 'linked-list', name: 'Linked List', icon: GitCommitHorizontal },
  { id: 'stack-queue', name: 'Stack & Queue', icon: LayoutList },
  { id: 'trees', name: 'Trees', icon: GitBranch },
  { id: 'graphs', name: 'Graphs', icon: Network },
  { id: 'dp', name: 'DP', icon: Cpu },
];

export default function VisualizerPage() {
  const [activeCategory, setActiveCategory] = useState<VisualizerCategory>('sorting');

  return (
    <AppLayout>
      <div className="space-y-5">
        {/* Category selector */}
        <div className="flex items-center gap-1.5 surface p-2 overflow-x-auto">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={clsx(
                  'flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg whitespace-nowrap transition-all',
                  isActive
                    ? 'bg-accent text-bg-primary'
                    : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.04]'
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Active visualizer */}
        <div className="animate-fade-in">
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
