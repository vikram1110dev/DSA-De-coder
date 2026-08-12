'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles, ArrowRight, Eye, Cpu, Flame, Activity, Code2, Calendar, Bot
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      {/* Navbar */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 sm:px-12 py-3.5 backdrop-blur-lg bg-bg-primary/80 border-b border-border-subtle">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center group-hover:shadow-glow-cyan transition-shadow">
            <Sparkles className="w-4 h-4 text-bg-primary" />
          </div>
          <span className="text-base font-bold tracking-tight">
            DSA <span className="text-accent">De-coder</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-xs font-medium text-text-secondary hover:text-text-primary transition-colors">
            Dashboard
          </Link>
          <Link
            href="/onboarding"
            className="btn-primary text-xs"
          >
            Start Learning
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-20 pb-16 sm:pt-28 sm:pb-24 px-4 sm:px-6 max-w-5xl mx-auto text-center space-y-6">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-accent/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-bg-surface border border-accent/20 text-xxs font-semibold text-accent">
          <Sparkles className="w-3.5 h-3.5" />
          Don't memorize DSA. Understand it.
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight max-w-3xl mx-auto leading-[1.1]">
          Master DSA by{' '}
          <span className="text-gradient-brand">Decoding the Logic.</span>
        </h1>

        <p className="text-sm sm:text-base text-text-secondary max-w-2xl mx-auto leading-relaxed">
          Learn algorithms through visual step-by-step simulations, guided problem decoding,
          and an AI mentor that explains the <strong className="text-accent font-semibold">"why"</strong> behind every solution.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link href="/onboarding" className="btn-primary px-6 py-3 text-sm group">
            Start Learning
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/ai-decoder" className="btn-secondary px-6 py-3 text-sm">
            <Cpu className="w-4 h-4 text-accent" />
            Try AI De-coder
          </Link>
        </div>

        {/* Preview window */}
        <div className="mt-10 surface p-1.5 max-w-4xl mx-auto shadow-elevation-4">
          <div className="surface-inset p-5 space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-accent-rose/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-accent-amber/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-state-success/60" />
                <span className="text-xxs font-mono text-text-muted ml-2">dsa-decoder/dashboard</span>
              </div>
              <div className="flex items-center gap-1.5 text-xxs font-semibold text-accent-amber">
                <Flame className="w-3.5 h-3.5 fill-accent-amber" />
                12 Day Streak
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { label: 'Continue Learning', title: 'Sliding Window', detail: '68% completed', color: 'text-accent' },
                { label: 'Weak Areas', title: 'Graphs (42%) & DP (38%)', detail: 'Arrays: 86% mastered', color: 'text-accent-amber' },
                { label: 'Next Reminder', title: 'Today • 7:00 PM', detail: 'Binary Search Revision', color: 'text-accent-violet' },
              ].map((card) => (
                <div key={card.label} className="surface p-3.5 space-y-1">
                  <div className="text-xxs text-text-muted font-medium">{card.label}</div>
                  <div className="text-xs font-bold text-text-primary">{card.title}</div>
                  <div className={`text-xxs font-mono ${card.color}`}>{card.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7-Step Framework */}
      <section className="py-16 px-6 border-y border-border-subtle bg-bg-secondary/40">
        <div className="max-w-5xl mx-auto space-y-10 text-center">
          <div>
            <span className="text-xxs font-bold uppercase tracking-widest text-accent">Learning Framework</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mt-2">The 7-Step Mastery Loop</h2>
            <p className="text-xs text-text-muted mt-1.5 max-w-md mx-auto">Build permanent algorithm intuition instead of rote memorization.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {[
              { step: '1', title: 'Understand', desc: 'Real-world intuition' },
              { step: '2', title: 'Visualize', desc: 'Step-by-step simulation' },
              { step: '3', title: 'Decode', desc: 'Pattern analysis' },
              { step: '4', title: 'Practice', desc: 'Sandboxed IDE' },
              { step: '5', title: 'Solve', desc: 'Hints & test cases' },
              { step: '6', title: 'Review', desc: 'AI feedback' },
              { step: '7', title: 'Master', desc: 'Streak & revision' },
            ].map((s) => (
              <div key={s.step} className="surface-interactive p-3 text-left space-y-1.5">
                <div className="w-6 h-6 rounded-md bg-accent-muted text-accent flex items-center justify-center font-mono text-xxs font-bold">
                  {s.step}
                </div>
                <div className="text-xs font-semibold text-text-primary">{s.title}</div>
                <div className="text-xxs text-text-muted leading-tight">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 max-w-5xl mx-auto space-y-10">
        <div className="text-center">
          <span className="text-xxs font-bold uppercase tracking-widest text-accent">Features</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mt-2">Built for Interview Success</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Eye, title: 'Interactive Visualizers', desc: '8 algorithm categories with step control, custom inputs, and code highlighting.', color: 'text-accent' },
            { icon: Cpu, title: 'AI DSA De-coder', desc: 'Gemini-powered 10-section breakdown: pattern, brute force vs optimal, dry run, code.', color: 'text-accent-emerald' },
            { icon: Activity, title: '365-Day Heatmap', desc: 'GitHub-style contribution tracking, streak protection, and milestone badges.', color: 'text-accent-amber' },
            { icon: Code2, title: 'Practice IDE', desc: '50+ curated problems with multi-language editor, hints, and automated test runner.', color: 'text-accent-violet' },
            { icon: Calendar, title: 'Smart Planner', desc: 'AI-generated daily study tasks with reminders, quiet hours, and progress tracking.', color: 'text-accent-rose' },
            { icon: Bot, title: 'AI Mentor Chat', desc: 'Ask questions in natural language. Get concept explanations, debugging help, and guidance.', color: 'text-accent-blue' },
          ].map((feat) => (
            <div key={feat.title} className="surface-interactive p-5 space-y-2.5">
              <feat.icon className={`w-5 h-5 ${feat.color}`} />
              <h3 className="text-sm font-bold text-text-primary">{feat.title}</h3>
              <p className="text-xxs text-text-muted leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 border-t border-border-subtle text-center space-y-4">
        <h2 className="text-2xl sm:text-4xl font-black text-text-primary">
          Start decoding DSA today.
        </h2>
        <p className="text-sm text-text-muted max-w-md mx-auto">
          Join developers mastering algorithms through logic, visualization, and AI guidance.
        </p>
        <Link href="/onboarding" className="btn-primary px-6 py-3 text-sm inline-flex">
          Get Your Study Plan
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}
