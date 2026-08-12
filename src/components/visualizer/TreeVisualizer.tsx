'use client';

import React, { useState, useEffect } from 'react';
import { AlgorithmLab, AlgorithmStep } from './AlgorithmLab';
import { clsx } from 'clsx';

type TraversalType = 'inorder' | 'preorder' | 'postorder' | 'bfs';

interface TreeStep extends AlgorithmStep {
  activeNodeVal: number | null;
  visitedNodes: number[];
}

interface TreeNodeDef {
  val: number;
  x: number;
  y: number;
  left?: TreeNodeDef;
  right?: TreeNodeDef;
}

const TREE_NODES: TreeNodeDef = {
  val: 40, x: 250, y: 40,
  left: {
    val: 20, x: 130, y: 120,
    left: { val: 10, x: 70, y: 200 },
    right: { val: 30, x: 190, y: 200 },
  },
  right: {
    val: 60, x: 370, y: 120,
    left: { val: 50, x: 310, y: 200 },
    right: { val: 70, x: 430, y: 200 },
  },
};

const FLAT_NODES = [
  { val: 40, x: 250, y: 40 },
  { val: 20, x: 130, y: 120 },
  { val: 60, x: 370, y: 120 },
  { val: 10, x: 70, y: 200 },
  { val: 30, x: 190, y: 200 },
  { val: 50, x: 310, y: 200 },
  { val: 70, x: 430, y: 200 },
];

const EDGES = [
  [250, 40, 130, 120], [250, 40, 370, 120],
  [130, 120, 70, 200], [130, 120, 190, 200],
  [370, 120, 310, 200], [370, 120, 430, 200],
];

const CODE_LINES: Record<TraversalType, string[]> = {
  inorder: ['function inorder(node):', '  if node == null: return', '  inorder(node.left)', '  visit(node.val)', '  inorder(node.right)'],
  preorder: ['function preorder(node):', '  if node == null: return', '  visit(node.val)', '  preorder(node.left)', '  preorder(node.right)'],
  postorder: ['function postorder(node):', '  if node == null: return', '  postorder(node.left)', '  postorder(node.right)', '  visit(node.val)'],
  bfs: ['queue = [root]', 'while queue not empty:', '  node = queue.dequeue()', '  visit(node.val)', '  if node.left: queue.enqueue(node.left)', '  if node.right: queue.enqueue(node.right)'],
};

function generateTraversalSteps(type: TraversalType): TreeStep[] {
  const steps: TreeStep[] = [];
  const order: number[] = [];

  steps.push({ activeNodeVal: null, visitedNodes: [], message: `Starting ${type.toUpperCase()} traversal of BST.`, activeLineIndex: 0 });

  if (type === 'bfs') {
    const queue: TreeNodeDef[] = [TREE_NODES];
    while (queue.length > 0) {
      const node = queue.shift()!;
      order.push(node.val);
      steps.push({ activeNodeVal: node.val, visitedNodes: [...order], message: `Dequeued ${node.val}. Queue: [${queue.map(n => n.val).join(', ')}].`, activeLineIndex: 3 });
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  } else {
    const traverse = (node: TreeNodeDef | undefined, depth: number) => {
      if (!node) return;
      if (type === 'preorder') {
        order.push(node.val);
        steps.push({ activeNodeVal: node.val, visitedNodes: [...order], message: `Visit ${node.val} (pre-order: visit before children).`, activeLineIndex: 2 });
      }
      traverse(node.left, depth + 1);
      if (type === 'inorder') {
        order.push(node.val);
        steps.push({ activeNodeVal: node.val, visitedNodes: [...order], message: `Visit ${node.val} (in-order: visit between children).`, activeLineIndex: 3 });
      }
      traverse(node.right, depth + 1);
      if (type === 'postorder') {
        order.push(node.val);
        steps.push({ activeNodeVal: node.val, visitedNodes: [...order], message: `Visit ${node.val} (post-order: visit after children).`, activeLineIndex: 4 });
      }
    };
    traverse(TREE_NODES, 0);
  }

  steps.push({ activeNodeVal: null, visitedNodes: [...order], message: `${type.toUpperCase()} complete: [${order.join(' → ')}].`, activeLineIndex: type === 'bfs' ? 5 : 4 });
  return steps;
}

export const TreeVisualizer: React.FC = () => {
  const [traversalType, setTraversalType] = useState<TraversalType>('inorder');
  const [steps, setSteps] = useState<TreeStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    setSteps(generateTraversalSteps(traversalType));
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

  const currentStep = steps[currentStepIndex] || { activeNodeVal: null, visitedNodes: [], message: 'Ready', activeLineIndex: 0 };

  return (
    <div className="space-y-4">
      {/* Traversal selector */}
      <div className="flex items-center gap-1.5 surface p-3">
        {(['inorder', 'preorder', 'postorder', 'bfs'] as TraversalType[]).map((type) => (
          <button
            key={type}
            onClick={() => setTraversalType(type)}
            className={clsx(
              'px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-all',
              traversalType === type ? 'bg-accent text-bg-primary' : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.04]'
            )}
          >
            {type === 'bfs' ? 'BFS (Level Order)' : `${type} Traversal`}
          </button>
        ))}
      </div>

      <AlgorithmLab
        algorithmName={`Tree ${traversalType === 'bfs' ? 'BFS' : traversalType.charAt(0).toUpperCase() + traversalType.slice(1)} Traversal`}
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
        codeLines={CODE_LINES[traversalType]}
        whyExplanation={traversalType === 'inorder' ? 'Inorder traversal of a BST visits nodes in sorted order because it processes left subtree (smaller values), then root, then right subtree (larger values).' : traversalType === 'bfs' ? 'BFS uses a queue to visit nodes level by level, ensuring all nodes at distance d are visited before distance d+1.' : undefined}
        complexityInfo={{ time: 'O(n)', space: traversalType === 'bfs' ? 'O(w) where w=max width' : 'O(h) where h=height' }}
      >
        {/* SVG Tree */}
        <div className="flex flex-col items-center gap-4">
          <svg viewBox="0 0 500 240" className="w-full max-w-lg h-60">
            {/* Edges */}
            {EDGES.map(([x1, y1, x2, y2], i) => (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
            ))}

            {/* Nodes */}
            {FLAT_NODES.map((node) => {
              const isActive = currentStep.activeNodeVal === node.val;
              const isVisited = currentStep.visitedNodes.includes(node.val);
              return (
                <g key={node.val}>
                  <circle
                    cx={node.x} cy={node.y} r={20}
                    className={clsx(
                      'transition-all duration-300',
                      isActive ? 'fill-viz-active stroke-viz-active/50 stroke-2'
                        : isVisited ? 'fill-accent stroke-accent/50 stroke-2'
                        : 'fill-bg-surface stroke-border-default stroke-1'
                    )}
                  />
                  <text
                    x={node.x} y={node.y + 4} textAnchor="middle"
                    className={clsx('text-xs font-mono font-bold select-none', isActive || isVisited ? 'fill-bg-primary' : 'fill-text-primary')}
                  >
                    {node.val}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Visited sequence */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xxs text-text-muted font-medium">Order:</span>
            {currentStep.visitedNodes.length === 0 ? (
              <span className="text-xxs text-text-disabled italic">—</span>
            ) : (
              currentStep.visitedNodes.map((v, i) => (
                <span key={i} className="badge badge-cyan">{v}</span>
              ))
            )}
          </div>
        </div>
      </AlgorithmLab>
    </div>
  );
};
