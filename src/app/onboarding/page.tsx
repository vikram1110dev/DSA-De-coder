'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DSALevel, ProgrammingLanguage, LearningGoal } from '@/types';
import { storageService } from '@/lib/storage';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Code2,
  Clock,
  Target,
  Calendar,
  Bell,
  GraduationCap
} from 'lucide-react';
import { clsx } from 'clsx';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Form State
  const [dsaLevel, setDsaLevel] = useState<DSALevel>('beginner');
  const [language, setLanguage] = useState<ProgrammingLanguage>('javascript');
  const [dailyStudyTime, setDailyStudyTime] = useState<number>(45);
  const [goal, setGoal] = useState<LearningGoal>('interviews');
  const [targetDays, setTargetDays] = useState<number>(60);
  const [preferredTime, setPreferredTime] = useState<string>('19:00');

  const handleFinish = () => {
    storageService.updateProfile({
      dsaLevel,
      language,
      dailyStudyTime,
      goal,
      targetDays,
      preferredTime
    });

    // Create study reminder for preferred time
    storageService.saveReminder({
      id: 'rem_daily_study',
      title: 'Daily DSA Study Session',
      description: 'Your prime scheduled hour for DSA concepts and problem decoding.',
      type: 'study',
      time: preferredTime,
      repeatType: 'daily',
      notificationType: 'browser',
      isEnabled: true
    });

    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#080d1a] text-slate-100 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden">
        {/* Glowing backdrop */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[90px] pointer-events-none" />

        {/* Top Stepper Indicator */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span className="text-cyan-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Step {step} of 6
            </span>
            <span>{Math.round((step / 6) * 100)}% Completed</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-300"
              style={{ width: `${(step / 6) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: DSA Level */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-white">
                What is your current DSA level?
              </h2>
              <p className="text-xs text-slate-400">
                We will calibrate explanation depth and problem hints accordingly.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {[
                { id: 'beginner', title: 'Beginner', desc: 'Knows basic syntax, starting DSA from scratch' },
                { id: 'intermediate', title: 'Intermediate', desc: 'Familiar with arrays & linked lists, learning DP/graphs' },
                { id: 'advanced', title: 'Advanced', desc: 'Practicing for top tech company placements' },
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  onClick={() => setDsaLevel(lvl.id as DSALevel)}
                  className={clsx(
                    'p-4 rounded-2xl border text-left transition-all flex items-center justify-between',
                    dsaLevel === lvl.id
                      ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-200 shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  )}
                >
                  <div>
                    <div className="text-xs font-bold text-white">{lvl.title}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{lvl.desc}</div>
                  </div>
                  {dsaLevel === lvl.id && <Check className="w-4 h-4 text-cyan-400" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Language */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Primary Programming Language?
              </h2>
              <p className="text-xs text-slate-400">
                Code examples, starter templates, and AI explanations will use this language.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'javascript', name: 'JavaScript' },
                { id: 'python', name: 'Python' },
                { id: 'java', name: 'Java' },
                { id: 'cpp', name: 'C++' },
              ].map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => setLanguage(lang.id as ProgrammingLanguage)}
                  className={clsx(
                    'p-4 rounded-2xl border text-center font-bold text-xs transition-all',
                    language === lang.id
                      ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  )}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Daily Study Time */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Daily Study Commitment?
              </h2>
              <p className="text-xs text-slate-400">
                How many minutes can you dedicate each day?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { mins: 15, label: '15 Minutes', desc: 'Quick daily habit' },
                { mins: 30, label: '30 Minutes', desc: '1 concept + 1 problem' },
                { mins: 45, label: '45 Minutes', desc: 'Recommended pace' },
                { mins: 60, label: '1 Hour +', desc: 'Fast placement prep' },
              ].map((opt) => (
                <button
                  key={opt.mins}
                  onClick={() => setDailyStudyTime(opt.mins)}
                  className={clsx(
                    'p-4 rounded-2xl border text-left transition-all',
                    dailyStudyTime === opt.mins
                      ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-200'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  )}
                >
                  <div className="text-xs font-bold text-white">{opt.label}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Primary Goal */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-white">
                What is your primary goal?
              </h2>
              <p className="text-xs text-slate-400">
                Tailors practice problems toward campus placements or tech company interviews.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {[
                { id: 'placements', name: 'Campus Placements' },
                { id: 'interviews', name: 'Tech Company Coding Interviews' },
                { id: 'cp', name: 'Competitive Programming' },
                { id: 'college', name: 'College University Exams' },
                { id: 'skills', name: 'Software Developer Skill Growth' },
              ].map((g) => (
                <button
                  key={g.id}
                  onClick={() => setGoal(g.id as LearningGoal)}
                  className={clsx(
                    'p-3.5 rounded-2xl border text-left text-xs font-bold transition-all flex items-center justify-between',
                    goal === g.id
                      ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-200'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  )}
                >
                  <span>{g.name}</span>
                  {goal === g.id && <Check className="w-4 h-4 text-cyan-400" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Target Timeline */}
        {step === 5 && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Target Roadmap Timeline?
              </h2>
              <p className="text-xs text-slate-400">
                Choose the milestone duration for your full curriculum roadmap.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { days: 30, label: '30 Days', desc: 'Intensive Sprint' },
                { days: 60, label: '60 Days', desc: 'Standard Pace' },
                { days: 90, label: '90 Days', desc: 'Deep Mastery' },
              ].map((t) => (
                <button
                  key={t.days}
                  onClick={() => setTargetDays(t.days)}
                  className={clsx(
                    'p-4 rounded-2xl border text-center transition-all',
                    targetDays === t.days
                      ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-200'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  )}
                >
                  <div className="text-xs font-bold text-white">{t.label}</div>
                  <div className="text-[10px] text-slate-400 mt-1">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 6: Preferred Study Hour */}
        {step === 6 && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Preferred Study Hour?
              </h2>
              <p className="text-xs text-slate-400">
                We'll schedule your daily smart reminder at this time.
              </p>
            </div>

            <div className="space-y-3">
              <input
                type="time"
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center font-mono font-bold text-xl text-cyan-300 focus:outline-none focus:border-cyan-500"
              />

              <div className="flex flex-wrap gap-2 justify-center">
                {['08:00', '14:00', '19:00', '21:00'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setPreferredTime(t)}
                    className="px-3 py-1.5 bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 rounded-xl hover:border-cyan-500"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : <div />}

          {step < 6 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-all shadow-md shadow-cyan-500/20"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:opacity-95 rounded-xl transition-all shadow-md shadow-emerald-500/20"
            >
              <span>Generate My Roadmap</span>
              <Sparkles className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
