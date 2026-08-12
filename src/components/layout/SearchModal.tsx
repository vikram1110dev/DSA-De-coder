'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, BookOpen, Code2, Cpu, X, Sparkles, ArrowRight } from 'lucide-react';
import { DSA_TOPICS } from '@/data/topics';
import { PRACTICE_PROBLEMS } from '@/data/problems';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose(); // toggle if handled higher or open
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredTopics = DSA_TOPICS.filter(
    t => t.title.toLowerCase().includes(query.toLowerCase()) ||
         t.category.toLowerCase().includes(query.toLowerCase()) ||
         t.summary.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  const filteredProblems = PRACTICE_PROBLEMS.filter(
    p => p.title.toLowerCase().includes(query.toLowerCase()) ||
         p.pattern.toLowerCase().includes(query.toLowerCase()) ||
         p.difficulty.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  const handleSelect = (url: string) => {
    router.push(url);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-slate-950/60">
          <Search className="w-5 h-5 text-cyan-400 mr-3" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search concepts, algorithms, problems, or patterns... (e.g. 'Binary Search', 'Sliding Window')"
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-white mr-2">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="px-2 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-800 border border-slate-700 rounded-md">
            ESC
          </kbd>
        </div>

        {/* Search Results List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          {/* Quick AI Action */}
          {query.trim().length > 0 && (
            <button
              onClick={() => handleSelect(`/ai-decoder?q=${encodeURIComponent(query)}`)}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-cyan-500/15 via-indigo-500/10 to-transparent border border-cyan-500/30 hover:border-cyan-400 text-left transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-cyan-300">
                    Decode "{query}" with AI
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Get 20-point logic breakdown, dry run, and optimal code
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
            </button>
          )}

          {/* Topics Section */}
          {filteredTopics.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                DSA Topics & Concepts
              </div>
              <div className="space-y-1 mt-1">
                {filteredTopics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => handleSelect(`/learn/${topic.id}`)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 text-left transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <BookOpen className="w-4 h-4 text-cyan-400" />
                      <div>
                        <div className="text-xs font-semibold text-slate-200 group-hover:text-white">
                          {topic.title}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {topic.category} • {topic.difficulty}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-200 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Problems Section */}
          {filteredProblems.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Practice Problems
              </div>
              <div className="space-y-1 mt-1">
                {filteredProblems.map((prob) => (
                  <button
                    key={prob.id}
                    onClick={() => handleSelect(`/practice/${prob.id}`)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 text-left transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Code2 className="w-4 h-4 text-emerald-400" />
                      <div>
                        <div className="text-xs font-semibold text-slate-200 group-hover:text-white">
                          {prob.title}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Pattern: {prob.pattern} • {prob.difficulty}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold bg-slate-800 text-slate-300">
                      {prob.difficulty}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {query && filteredTopics.length === 0 && filteredProblems.length === 0 && (
            <div className="py-8 text-center text-slate-400 text-xs">
              No direct matches found. Try using the <span className="text-cyan-400 font-semibold">AI De-coder</span> button above to analyze this query!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
