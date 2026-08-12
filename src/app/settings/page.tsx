'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { UserProfile, DSALevel, ProgrammingLanguage, LearningGoal, AIMode } from '@/types';
import { storageService } from '@/lib/storage';
import {
  Settings,
  User,
  BookOpen,
  Bell,
  Sparkles,
  Save,
  Check,
  Moon,
  Shield,
  Download,
  RotateCcw
} from 'lucide-react';
import { clsx } from 'clsx';

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile>(storageService.getProfile());
  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    setProfile(storageService.getProfile());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.updateProfile(profile);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  const handleExportData = () => {
    const data = {
      profile: storageService.getProfile(),
      activities: storageService.getActivities(),
      tasks: storageService.getDailyTasks(),
      reminders: storageService.getReminders(),
      notes: storageService.getNotes(),
      bookmarks: storageService.getBookmarks()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dsa_decoder_backup_${Date.now()}.json`;
    a.click();
  };

  return (
    <AppLayout>
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/30 border border-cyan-500/20 rounded-3xl shadow-xl flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
              <Settings className="w-4 h-4" />
              <span>Preferences & Calibration</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              Application Settings
            </h1>
            <p className="text-xs text-slate-400">
              Manage your DSA profile, reminder schedule, AI depth preferences, and data privacy.
            </p>
          </div>

          {savedMessage && (
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-2xl text-xs font-bold animate-in fade-in">
              <Check className="w-4 h-4" />
              <span>Settings Saved!</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Section 1: Profile & Identity */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 shadow-xl">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <User className="w-4 h-4 text-cyan-400" />
              <span>Profile Details</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Your Name:</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Email Address:</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Learning Calibration */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 shadow-xl">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Learning Preferences & Goals</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">DSA Level:</label>
                <select
                  value={profile.dsaLevel}
                  onChange={(e) => setProfile({ ...profile, dsaLevel: e.target.value as DSALevel })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 capitalize"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Preferred Language:</label>
                <select
                  value={profile.language}
                  onChange={(e) =>
                    setProfile({ ...profile, language: e.target.value as ProgrammingLanguage })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 capitalize"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Primary Goal:</label>
                <select
                  value={profile.goal}
                  onChange={(e) => setProfile({ ...profile, goal: e.target.value as LearningGoal })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 capitalize"
                >
                  <option value="placements">Campus Placements</option>
                  <option value="interviews">Tech Interviews</option>
                  <option value="cp">Competitive Programming</option>
                  <option value="college">College Exams</option>
                  <option value="skills">Skill Development</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: AI Explanations & Quiet Hours */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 shadow-xl">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>AI Mode & Quiet Hours Policy</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">AI Explanations Depth:</label>
                <select
                  value={profile.aiMode}
                  onChange={(e) => setProfile({ ...profile, aiMode: e.target.value as AIMode })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 capitalize"
                >
                  <option value="beginner">Beginner (Analogies & Simplicity)</option>
                  <option value="standard">Standard (Balanced Technical)</option>
                  <option value="deep-dive">Deep Dive (Advanced Invariants)</option>
                  <option value="interview">Interview (Trade-offs & Polish)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Quiet Hours Start:</label>
                <input
                  type="time"
                  value={profile.quietHoursStart}
                  onChange={(e) => setProfile({ ...profile, quietHoursStart: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Quiet Hours End:</label>
                <input
                  type="time"
                  value={profile.quietHoursEnd}
                  onChange={(e) => setProfile({ ...profile, quietHoursEnd: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
            <button
              type="button"
              onClick={handleExportData}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl transition-colors"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Export Learning Backup (.json)</span>
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:opacity-95 rounded-xl transition-all shadow-md shadow-cyan-500/20"
            >
              <Save className="w-4 h-4" />
              <span>Save Preferences</span>
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
