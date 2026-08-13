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
    <div className="min-h-screen bg-bg-primary text-text-primary flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-xl surface p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden">
        {/* Glowing backdrop */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 blur-[90px] pointer-events-none" />

        {/* Top Stepper Indicator */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-text-muted">
            <span className="text-accent flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Step {step} of 6
            </span>
            <span>{Math.round((step / 6) * 100)}% Completed</span>
          </div>
          <div className="w-full h-1.5 bg-bg-inset rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent to-accent-emerald transition-all duration-300"
              style={{ width: `${(step / 6) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: DSA Level */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-text-primary">
                What is your current DSA level?
              </h2>
              <p className="text-xs text-text-muted">
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
                      ? 'bg-accent/15 border-accent text-text-primary shadow-md'
                      : 'bg-bg-inset border-border-default text-text-secondary hover:border-accent'
                  )}
                >
                  <div>
                    <div className="text-xs font-bold text-text-primary">{lvl.title}</div>
                    <div className="text-[11px] text-text-muted mt-0.5">{lvl.desc}</div>
                  </div>
                  {dsaLevel === lvl.id && <Check className="w-4 h-4 text-accent" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Language */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-text-primary">
                Primary Programming Language?
              </h2>
              <p className="text-xs text-text-muted">
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
                      ? 'bg-accent/15 border-accent text-text-primary'
                      : 'bg-bg-inset border-border-default text-text-secondary hover:border-accent'
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
              <h2 className="text-xl sm:text-2xl font-black text-text-primary">
                Daily Study Commitment?
              </h2>
              <p className="text-xs text-text-muted">
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
                      ? 'bg-accent/15 border-accent text-text-primary'
                      : 'bg-bg-inset border-border-default text-text-secondary hover:border-accent'
                  )}
                >
                  <div className="text-xs font-bold text-text-primary">{opt.label}</div>
                  <div className="text-[11px] text-text-muted mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Primary Goal */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-text-primary">
                What is your primary goal?
              </h2>
              <p className="text-xs text-text-muted">
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
                      ? 'bg-accent/15 border-accent text-text-primary'
                      : 'bg-bg-inset border-border-default text-text-secondary hover:border-accent'
                  )}
                >
                  <span>{g.name}</span>
                  {goal === g.id && <Check className="w-4 h-4 text-accent" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Target Timeline */}
        {step === 5 && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-text-primary">
                Target Roadmap Timeline?
              </h2>
              <p className="text-xs text-text-muted">
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
                      ? 'bg-accent/15 border-accent text-text-primary'
                      : 'bg-bg-inset border-border-default text-text-secondary hover:border-accent'
                  )}
                >
                  <div className="text-xs font-bold text-text-primary">{t.label}</div>
                  <div className="text-[10px] text-text-muted mt-1">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 6: Preferred Study Hour */}
        {step === 6 && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-text-primary">
                Preferred Study Hour?
              </h2>
              <p className="text-xs text-text-muted">
                We'll schedule your daily smart reminder at this time.
              </p>
            </div>

            <div className="space-y-3">
              <input
                type="time"
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="w-full bg-bg-inset border border-border-default rounded-2xl p-4 text-center font-mono font-bold text-xl text-accent focus:outline-none focus:border-accent"
              />

              <div className="flex flex-wrap gap-2 justify-center">
                {['08:00', '14:00', '19:00', '21:00'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setPreferredTime(t)}
                    className="px-3 py-1.5 bg-bg-inset border border-border-default text-xs font-mono text-text-secondary rounded-xl hover:border-accent"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-border-default">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-text-muted hover:text-text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : <div />}

          {step < 6 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-bg-primary bg-accent hover:bg-accent-hover rounded-xl transition-all shadow-md shadow-accent/20"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-accent-emerald to-accent hover:opacity-95 rounded-xl transition-all shadow-md shadow-accent-emerald/20"
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
