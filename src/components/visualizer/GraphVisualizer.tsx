'use client';

import React, { useState, useEffect } from 'react';
import { AlgorithmLab, AlgorithmStep } from './AlgorithmLab';
import { clsx } from 'clsx';

interface GraphStep extends AlgorithmStep {
  activeNode: string | null;
  visitedNodes: string[];
  visitedEdges: [string, string][];
  queueOrStack: string[];
}

interface GraphNode {
  id: string;
  x: number;
  y: number;
  neighbors: string[];
}

const NODES: Record<string, GraphNode> = {
  A: { id: 'A', x: 80, y: 120, neighbors: ['B', 'C'] },
  B: { id: 'B', x: 220, y: 50, neighbors: ['A', 'D', 'E'] },
  C: { id: 'C', x: 220, y: 190, neighbors: ['A', 'F'] },
  D: { id: 'D', x: 360, y: 30, neighbors: ['B'] },
  E: { id: 'E', x: 360, y: 120, neighbors: ['B', 'F'] },
  F: { id: 'F', x: 360, y: 210, neighbors: ['C', 'E'] },
};

const EDGES: [string, string][] = [['A', 'B'], ['A', 'C'], ['B', 'D'], ['B', 'E'], ['C', 'F'], ['E', 'F']];

const BFS_CODE = ['queue = [start]', 'visited = {start}', 'while queue not empty:', '  node = queue.dequeue()', '  process(node)', '  for neighbor in node.neighbors:', '    if neighbor not in visited:', '      visited.add(neighbor)', '      queue.enqueue(neighbor)'];
const DFS_CODE = ['stack = [start]', 'visited = {}', 'while stack not empty:', '  node = stack.pop()', '  if node in visited: continue', '  visited.add(node)', '  process(node)', '  for neighbor in node.neighbors:', '    stack.push(neighbor)'];

function generateBFSSteps(): GraphStep[] {
  const steps: GraphStep[] = [];
  const queue: string[] = ['A'];
  const visited = new Set<string>(['A']);
  const order: string[] = [];
  const edges: [string, string][] = [];

  steps.push({ activeNode: null, visitedNodes: [], visitedEdges: [], queueOrStack: ['A'], message: 'Starting BFS from Node A. Queue = [A].', activeLineIndex: 0 });

  while (queue.length > 0) {
    const curr = queue.shift()!;
    order.push(curr);
    steps.push({ activeNode: curr, visitedNodes: [...order], visitedEdges: [...edges], queueOrStack: [...queue], message: `Dequeued "${curr}". Processing node. Queue = [${queue.join(', ')}].`, activeLineIndex: 4 });

    for (const nbr of NODES[curr].neighbors) {
      if (!visited.has(nbr)) {
        visited.add(nbr);
        queue.push(nbr);
        edges.push([curr, nbr]);
        steps.push({ activeNode: curr, visitedNodes: [...order], visitedEdges: [...edges], queueOrStack: [...queue], message: `Discovered "${nbr}" via "${curr}". Enqueued. Queue = [${queue.join(', ')}].`, activeLineIndex: 8 });
      }
    }
  }

  steps.push({ activeNode: null, visitedNodes: [...order], visitedEdges: [...edges], queueOrStack: [], message: `BFS complete: [${order.join(' → ')}].`, activeLineIndex: 2 });
  return steps;
}

function generateDFSSteps(): GraphStep[] {
  const steps: GraphStep[] = [];
  const stack: string[] = ['A'];
  const visited = new Set<string>();
  const order: string[] = [];
  const edges: [string, string][] = [];

  steps.push({ activeNode: null, visitedNodes: [], visitedEdges: [], queueOrStack: ['A'], message: 'Starting DFS from Node A. Stack = [A].', activeLineIndex: 0 });

  while (stack.length > 0) {
    const curr = stack.pop()!;
    if (visited.has(curr)) continue;
    visited.add(curr);
    order.push(curr);

    steps.push({ activeNode: curr, visitedNodes: [...order], visitedEdges: [...edges], queueOrStack: [...stack], message: `Popped "${curr}". Processing. Stack = [${stack.join(', ')}].`, activeLineIndex: 6 });

    for (const nbr of [...NODES[curr].neighbors].reverse()) {
      if (!visited.has(nbr)) {
        stack.push(nbr);
        edges.push([curr, nbr]);
        steps.push({ activeNode: curr, visitedNodes: [...order], visitedEdges: [...edges], queueOrStack: [...stack], message: `Pushed "${nbr}" onto stack. Stack = [${stack.join(', ')}].`, activeLineIndex: 8 });
      }
    }
  }

  steps.push({ activeNode: null, visitedNodes: [...order], visitedEdges: [...edges], queueOrStack: [], message: `DFS complete: [${order.join(' → ')}].`, activeLineIndex: 2 });
  return steps;
}

export const GraphVisualizer: React.FC = () => {
  const [traversalType, setTraversalType] = useState<'bfs' | 'dfs'>('bfs');
  const [steps, setSteps] = useState<GraphStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    setSteps(traversalType === 'bfs' ? generateBFSSteps() : generateDFSSteps());
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [traversalType]);

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

  const currentStep = steps[currentStepIndex] || { activeNode: null, visitedNodes: [], visitedEdges: [], queueOrStack: [], message: 'Ready', activeLineIndex: 0 };

  const isEdgeVisited = (a: string, b: string) => currentStep.visitedEdges.some(([x, y]) => (x === a && y === b) || (x === b && y === a));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-1.5 surface p-3">
        {(['bfs', 'dfs'] as const).map((type) => (
          <button key={type} onClick={() => setTraversalType(type)}
            className={clsx('px-3 py-1.5 text-xs font-medium rounded-lg uppercase transition-all',
              traversalType === type ? 'bg-accent text-bg-primary' : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.04]'
            )}
          >
            {type === 'bfs' ? 'BFS (Breadth-First)' : 'DFS (Depth-First)'}
          </button>
        ))}
      </div>

      <AlgorithmLab
        algorithmName={`Graph ${traversalType.toUpperCase()}`}
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
        codeLines={traversalType === 'bfs' ? BFS_CODE : DFS_CODE}
        whyExplanation={traversalType === 'bfs' ? 'BFS uses a queue (FIFO) to explore nodes level by level — all neighbors before moving deeper. This guarantees shortest path in unweighted graphs.' : 'DFS uses a stack (LIFO) to explore as deep as possible before backtracking. Useful for cycle detection, topological sort, and pathfinding in mazes.'}
        complexityInfo={{ time: 'O(V + E)', space: 'O(V)' }}
      >
        <div className="flex flex-col items-center gap-4">
          <svg viewBox="0 0 440 240" className="w-full max-w-lg h-60">
            {/* Edges */}
            {EDGES.map(([a, b], i) => {
              const na = NODES[a], nb = NODES[b];
              const visited = isEdgeVisited(a, b);
              return (
                <line key={i} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
                  stroke={visited ? '#06b6d4' : 'rgba(255,255,255,0.08)'}
                  strokeWidth={visited ? 2.5 : 1.5}
                  className="transition-all duration-300"
                />
              );
            })}

            {/* Nodes */}
            {Object.values(NODES).map((node) => {
              const isActive = currentStep.activeNode === node.id;
              const isVisited = currentStep.visitedNodes.includes(node.id);
              return (
                <g key={node.id}>
                  <circle cx={node.x} cy={node.y} r={22}
                    className={clsx('transition-all duration-300',
                      isActive ? 'fill-viz-active stroke-viz-active/50 stroke-2'
                        : isVisited ? 'fill-accent stroke-accent/50 stroke-2'
                        : 'fill-bg-surface stroke-border-default stroke-1'
                    )}
                  />
                  <text x={node.x} y={node.y + 5} textAnchor="middle"
                    className={clsx('text-sm font-mono font-bold select-none', isActive || isVisited ? 'fill-bg-primary' : 'fill-text-primary')}
                  >
                    {node.id}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Data structure state */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-xxs font-medium text-text-muted">{traversalType === 'bfs' ? 'Queue' : 'Stack'}:</span>
              {currentStep.queueOrStack.length === 0 ? (
                <span className="text-xxs text-text-disabled italic">empty</span>
              ) : (
                currentStep.queueOrStack.map((v, i) => (
                  <span key={i} className="badge badge-amber">{v}</span>
                ))
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xxs font-medium text-text-muted">Visited:</span>
              {currentStep.visitedNodes.map((v, i) => (
                <span key={i} className="badge badge-cyan">{v}</span>
              ))}
            </div>
          </div>
        </div>
      </AlgorithmLab>
    </div>
  );
};
