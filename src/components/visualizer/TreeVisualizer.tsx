'use client';

import React, { useState } from 'react';
import { clsx } from 'clsx';
import { Search, Play } from 'lucide-react';

interface TreeNodeData {
  val: number;
  left?: TreeNodeData;
  right?: TreeNodeData;
  x: number;
  y: number;
}

export const TreeVisualizer: React.FC = () => {
  const [activeNodeVal, setActiveNodeVal] = useState<number | null>(null);
  const [visitedNodes, setVisitedNodes] = useState<number[]>([]);
  const [traversalType, setTraversalType] = useState<'inorder' | 'preorder' | 'postorder'>('inorder');
  const [statusMessage, setStatusMessage] = useState<string>('Select a traversal to observe order of node visits.');

  // Pre-configured BST
  //        40
  //      /    \
  //    20      60
  //   /  \    /  \
  //  10  30  50  70
  const rootNode: TreeNodeData = {
    val: 40,
    x: 250,
    y: 40,
    left: {
      val: 20,
      x: 130,
      y: 110,
      left: { val: 10, x: 70, y: 180 },
      right: { val: 30, x: 190, y: 180 }
    },
    right: {
      val: 60,
      x: 370,
      y: 110,
      left: { val: 50, x: 310, y: 180 },
      right: { val: 70, x: 430, y: 180 }
    }
  };

  const handleRunTraversal = async (type: 'inorder' | 'preorder' | 'postorder') => {
    setTraversalType(type);
    setVisitedNodes([]);
    setActiveNodeVal(null);

    const order: number[] = [];
    const traverse = (node?: TreeNodeData) => {
      if (!node) return;
      if (type === 'preorder') order.push(node.val);
      traverse(node.left);
      if (type === 'inorder') order.push(node.val);
      traverse(node.right);
      if (type === 'postorder') order.push(node.val);
    };
    traverse(rootNode);

    setStatusMessage(`Running ${type.toUpperCase()} traversal: [${order.join(', ')}]`);

    const visited: number[] = [];
    for (const val of order) {
      setActiveNodeVal(val);
      visited.push(val);
      setVisitedNodes([...visited]);
      await new Promise((r) => setTimeout(r, 600));
    }
    setActiveNodeVal(null);
    setStatusMessage(`${type.toUpperCase()} completed: [${order.join(' → ')}]`);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900 border border-slate-800 rounded-2xl">
        <div className="flex items-center gap-2">
          {(['inorder', 'preorder', 'postorder'] as const).map((type) => (
            <button
              key={type}
              onClick={() => handleRunTraversal(type)}
              className={clsx(
                'px-4 py-2 text-xs font-bold rounded-xl capitalize transition-all flex items-center gap-1.5',
                traversalType === type
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white bg-slate-800'
              )}
            >
              <Play className="w-3 h-3 fill-current" />
              {type} Traversal
            </button>
          ))}
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="p-8 bg-slate-950 border border-slate-800 rounded-3xl min-h-[340px] flex flex-col justify-center items-center shadow-2xl relative">
        <svg viewBox="0 0 500 240" className="w-full max-w-lg h-60">
          {/* Edges */}
          <line x1={250} y1={40} x2={130} y2={110} stroke="#334155" strokeWidth="2" />
          <line x1={250} y1={40} x2={370} y2={110} stroke="#334155" strokeWidth="2" />
          <line x1={130} y1={110} x2={70} y2={180} stroke="#334155" strokeWidth="2" />
          <line x1={130} y1={110} x2={190} y2={180} stroke="#334155" strokeWidth="2" />
          <line x1={370} y1={110} x2={310} y2={180} stroke="#334155" strokeWidth="2" />
          <line x1={370} y1={110} x2={430} y2={180} stroke="#334155" strokeWidth="2" />

          {/* Node Render Function */}
          {[
            { val: 40, x: 250, y: 40 },
            { val: 20, x: 130, y: 110 },
            { val: 60, x: 370, y: 110 },
            { val: 10, x: 70, y: 180 },
            { val: 30, x: 190, y: 180 },
            { val: 50, x: 310, y: 180 },
            { val: 70, x: 430, y: 180 },
          ].map((node) => {
            const isActive = activeNodeVal === node.val;
            const isVisited = visitedNodes.includes(node.val);

            return (
              <g key={node.val} className="transition-all duration-300">
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={20}
                  className={clsx(
                    'transition-all duration-300',
                    isActive
                      ? 'fill-amber-400 stroke-amber-200 stroke-2'
                      : isVisited
                      ? 'fill-cyan-500 stroke-cyan-300 stroke-2'
                      : 'fill-slate-900 stroke-slate-700 stroke-1'
                  )}
                />
                <text
                  x={node.x}
                  y={node.y + 4}
                  textAnchor="middle"
                  className={clsx(
                    'text-xs font-mono font-bold select-none',
                    isActive || isVisited ? 'fill-slate-950' : 'fill-slate-200'
                  )}
                >
                  {node.val}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Visited Sequence Stream */}
        <div className="flex items-center gap-2 mt-4 text-xs font-bold text-slate-300">
          <span className="text-slate-500">Visited Order:</span>
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
