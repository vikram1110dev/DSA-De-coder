'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Eye,
  Cpu,
  Flame,
  CheckCircle2,
  Layers,
  Code2,
  Compass,
  Calendar,
  Activity,
  Bot
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#080d1a] text-slate-100 selection:bg-cyan-500/30">
      {/* Top Floating Navbar */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 sm:px-12 py-4 backdrop-blur-md bg-[#080d1a]/80 border-b border-slate-800/80">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 via-cyan-500 to-emerald-400 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-slate-950" />
          </div>
          <span className="text-lg font-black tracking-tight text-white">
            DSA <span className="text-cyan-400">De-coder</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/onboarding"
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:opacity-95 rounded-xl transition-all shadow-md shadow-cyan-500/20"
          >
            <span>Start Learning Free</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 sm:pt-28 sm:pb-24 px-4 sm:px-6 max-w-6xl mx-auto text-center space-y-8">
        {/* Glow backdrop */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-cyan-500/15 blur-[120px] rounded-full pointer-events-none" />

        {/* Badge Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-cyan-500/30 text-xs font-bold text-cyan-300 shadow-sm animate-pulse-glow">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Don't memorize DSA. Understand it.</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight max-w-4xl mx-auto leading-[1.1]">
          Master DSA by{' '}
          <span className="gradient-text-cyan">Decoding the Logic.</span>
        </h1>

        {/* Description */}
        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Learn Data Structures & Algorithms through visual step-by-step simulations, guided problem decoding, personalized study plans, and an AI mentor that explains the <strong className="text-cyan-300 font-bold">"why"</strong> behind every solution.
        </p>

        {/* Hero CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href="/onboarding"
            className="flex items-center gap-2 px-8 py-4 text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:opacity-95 rounded-2xl transition-all shadow-xl shadow-cyan-500/25 group"
          >
            <span>Start Learning</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/ai-decoder"
            className="flex items-center gap-2 px-8 py-4 text-sm font-bold text-slate-200 hover:text-white bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-2xl transition-all shadow-lg"
          >
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Try AI De-coder</span>
          </Link>
        </div>

        {/* Interactive App Preview Window */}
        <div className="mt-12 p-2 bg-slate-900/60 border border-slate-800 rounded-3xl shadow-2xl backdrop-blur-md max-w-5xl mx-auto overflow-hidden">
          <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs font-mono text-slate-500 ml-2">
                  dsa-decoder.app/dashboard
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                <Flame className="w-4 h-4 fill-amber-400" />
                <span>12 Day Streak</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
                <div className="text-[11px] text-slate-400 font-bold">Continue Learning:</div>
                <div className="text-sm font-bold text-white">Sliding Window Technique</div>
                <div className="text-xs text-cyan-400 font-mono">68% completed</div>
              </div>

              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
                <div className="text-[11px] text-slate-400 font-bold">AI Weak-Area Radar:</div>
                <div className="text-sm font-bold text-white">Graphs (42%) & DP (38%)</div>
                <div className="text-xs text-emerald-400 font-mono">Arrays: 86% Mastered</div>
              </div>

              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
                <div className="text-[11px] text-slate-400 font-bold">Next Smart Reminder:</div>
                <div className="text-sm font-bold text-white">Today • 7:00 PM</div>
                <div className="text-xs text-indigo-400 font-mono">Binary Search Revision</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The 7-Step Learning Philosophy */}
      <section className="py-20 px-6 bg-slate-950/60 border-y border-slate-800/80">
        <div className="max-w-6xl mx-auto space-y-12 text-center">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-400">
              Our Core Learning Framework
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              The 7-Step Mastery Loop
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl mx-auto">
              How thousands of students build permanent algorithm intuition instead of rote syntax memorization.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {[
              { step: '1', title: 'Understand', desc: 'Real-world intuition & why it exists' },
              { step: '2', title: 'Visualize', desc: 'Interactive step-by-step simulations' },
              { step: '3', title: 'Decode', desc: '5-step problem analysis before coding' },
              { step: '4', title: 'Practice', desc: 'Multi-language sandboxed IDE' },
              { step: '5', title: 'Solve', desc: 'Progressive hints & test cases' },
              { step: '6', title: 'Review', desc: 'AI mentor feedback & complexity' },
              { step: '7', title: 'Master', desc: 'Streak, spaced revision & XP' },
            ].map((s) => (
              <div
                key={s.step}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-left space-y-2 hover:border-cyan-500/40 transition-colors group"
              >
                <div className="w-7 h-7 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-mono font-bold text-xs group-hover:scale-110 transition-transform">
                  {s.step}
                </div>
                <div className="text-xs font-bold text-white">{s.title}</div>
                <div className="text-[11px] text-slate-400 leading-tight">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Major Features Grid */}
      <section className="py-20 px-6 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-400">
            Everything You Need
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Built for Placement & Interview Success
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Interactive Visualizers</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Step through Arrays, Sorting, Binary Search, Trees, Graphs (BFS/DFS), and Dynamic Programming with custom inputs, speed control, and line highlights.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">AI DSA De-coder</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Input any question. Gemini analyzes clues, detects patterns, provides brute force vs optimal trade-offs, dry runs, and line-by-line code.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">365-Day Activity Heatmap</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Original contribution heatmap recording only meaningful DSA completions. Track your streak, freeze safeguards, and earn milestone badges.
            </p>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 px-6 bg-gradient-to-b from-slate-900 to-[#080d1a] border-t border-slate-800 text-center space-y-6">
        <h2 className="text-3xl sm:text-5xl font-black text-white">
          Start decoding DSA today.
        </h2>
        <p className="text-sm text-slate-400 max-w-lg mx-auto">
          Join thousands of developers and placement students mastering algorithms through logic and intuition.
        </p>
        <Link
          href="/onboarding"
          className="inline-flex items-center gap-2 px-8 py-4 text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:opacity-95 rounded-2xl transition-all shadow-xl shadow-cyan-500/20"
        >
          <span>Get Your Personalized Study Plan</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}
