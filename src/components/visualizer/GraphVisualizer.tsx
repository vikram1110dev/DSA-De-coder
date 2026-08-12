'use client';

import React, { useState } from 'react';
import { clsx } from 'clsx';
import { Play } from 'lucide-react';

interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
  neighbors: string[];
}

export const GraphVisualizer: React.FC = () => {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [visitedNodes, setVisitedNodes] = useState<string[]>([]);
  const [traversalType, setTraversalType] = useState<'bfs' | 'dfs'>('bfs');
  const [statusMessage, setStatusMessage] = useState<string>('Select BFS or DFS to observe graph search mechanics.');

  const nodes: Record<string, GraphNode> = {
    A: { id: 'A', label: 'A (Root)', x: 100, y: 120, neighbors: ['B', 'C'] },
    B: { id: 'B', label: 'B', x: 230, y: 60, neighbors: ['A', 'D', 'E'] },
    C: { id: 'C', label: 'C', x: 230, y: 180, neighbors: ['A', 'F'] },
    D: { id: 'D', label: 'D', x: 370, y: 40, neighbors: ['B'] },
    E: { id: 'E', label: 'E', x: 370, y: 120, neighbors: ['B', 'F'] },
    F: { id: 'F', label: 'F', x: 370, y: 200, neighbors: ['C', 'E'] },
  };

  const runBFS = async () => {
    setTraversalType('bfs');
    setVisitedNodes([]);
    setActiveNode(null);

    const queue: string[] = ['A'];
    const visited = new Set<string>(['A']);
    const order: string[] = [];

    setStatusMessage('Starting BFS from Node A using a Queue (FIFO wavefront)...');

    while (queue.length > 0) {
      const curr = queue.shift()!;
      order.push(curr);
      setActiveNode(curr);
      setVisitedNodes([...order]);
      await new Promise((r) => setTimeout(r, 700));

      for (const nbr of nodes[curr].neighbors) {
        if (!visited.has(nbr)) {
          visited.add(nbr);
          queue.push(nbr);
        }
      }
    }
    setActiveNode(null);
    setStatusMessage(`BFS Completed: [${order.join(' → ')}]`);
  };

  const runDFS = async () => {
    setTraversalType('dfs');
    setVisitedNodes([]);
    setActiveNode(null);

    const visited = new Set<string>();
    const order: string[] = [];

    setStatusMessage('Starting DFS from Node A exploring depth-first recursion...');

    const dfsHelper = async (curr: string) => {
      visited.add(curr);
      order.push(curr);
      setActiveNode(curr);
      setVisitedNodes([...order]);
      await new Promise((r) => setTimeout(r, 700));

      for (const nbr of nodes[curr].neighbors) {
        if (!visited.has(nbr)) {
          await dfsHelper(nbr);
        }
      }
    };

    await dfsHelper('A');
    setActiveNode(null);
    setStatusMessage(`DFS Completed: [${order.join(' → ')}]`);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900 border border-slate-800 rounded-2xl">
        <div className="flex items-center gap-2">
          <button
            onClick={runBFS}
            className={clsx(
              'px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5',
              traversalType === 'bfs'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white bg-slate-800'
            )}
          >
            <Play className="w-3 h-3 fill-current" />
            Run BFS (Breadth-First)
          </button>
          <button
            onClick={runDFS}
            className={clsx(
              'px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5',
              traversalType === 'dfs'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white bg-slate-800'
            )}
          >
            <Play className="w-3 h-3 fill-current" />
            Run DFS (Depth-First)
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="p-8 bg-slate-950 border border-slate-800 rounded-3xl min-h-[340px] flex flex-col justify-center items-center shadow-2xl relative">
        <svg viewBox="0 0 480 240" className="w-full max-w-lg h-60">
          {/* Edges */}
          <line x1={100} y1={120} x2={230} y2={60} stroke="#334155" strokeWidth="2" />
          <line x1={100} y1={120} x2={230} y2={180} stroke="#334155" strokeWidth="2" />
          <line x1={230} y1={60} x2={370} y2={40} stroke="#334155" strokeWidth="2" />
          <line x1={230} y1={60} x2={370} y2={120} stroke="#334155" strokeWidth="2" />
          <line x1={230} y1={180} x2={370} y2={200} stroke="#334155" strokeWidth="2" />
          <line x1={370} y1={120} x2={370} y2={200} stroke="#334155" strokeWidth="2" />

          {/* Nodes */}
          {Object.values(nodes).map((node) => {
            const isActive = activeNode === node.id;
            const isVisited = visitedNodes.includes(node.id);

            return (
              <g key={node.id} className="transition-all duration-300">
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={22}
                  className={clsx(
                    'transition-all duration-300',
                    isActive
                      ? 'fill-amber-400 stroke-amber-200 stroke-2 animate-pulse'
                      : isVisited
                      ? 'fill-cyan-500 stroke-cyan-300 stroke-2'
                      : 'fill-slate-900 stroke-slate-700 stroke-1'
                  )}
                />
                <text
                  x={node.x}
                  y={node.y + 5}
                  textAnchor="middle"
                  className={clsx(
                    'text-xs font-mono font-bold select-none',
                    isActive || isVisited ? 'fill-slate-950' : 'fill-slate-200'
                  )}
                >
                  {node.id}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Visited Sequence Stream */}
        <div className="flex items-center gap-2 mt-4 text-xs font-bold text-slate-300">
          <span className="text-slate-500">Exploration Order:</span>
          {visitedNodes.length === 0 ? (
            <span className="text-slate-600 italic">None yet</span>
          ) : (
            visitedNodes.map((v, i) => (
              <span key={i} className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-md">
                {v}
              </span>
            ))
          )}
        </div>

        {/* Live Message */}
        <div className="mt-4 text-xs text-cyan-300 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl">
          {statusMessage}
        </div>
      </div>
    </div>
  );
};
