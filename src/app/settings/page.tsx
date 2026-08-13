'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { UserProfile, DSALevel, ProgrammingLanguage, LearningGoal, AIMode } from '@/types';
import { storageService } from '@/lib/storage';
import { User, BookOpen, Sparkles, Save, Check, Download, AlertTriangle, Trash2 } from 'lucide-react';

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile>(storageService.getProfile());
  const [savedMessage, setSavedMessage] = useState(false);
  const [showResetWarning, setShowResetWarning] = useState(false);

  useEffect(() => { setProfile(storageService.getProfile()); }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.updateProfile(profile);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  const handleExportData = () => {
    const data = {
      profile: storageService.getProfile(), activities: storageService.getActivities(),
      tasks: storageService.getDailyTasks(), reminders: storageService.getReminders(),
      notes: storageService.getNotes(), bookmarks: storageService.getBookmarks()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `dsa_decoder_backup_${Date.now()}.json`; a.click();
  };

  const handleReset = () => {
    storageService.resetAllData();
    window.location.reload();
  };

  const inputClass = "w-full surface-inset px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent rounded-lg";
  const labelClass = "text-xs font-semibold text-text-secondary block mb-1.5";

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-5 max-w-3xl mx-auto">
        {/* Saved indicator */}
        {savedMessage && (
          <div className="flex items-center gap-2 px-4 py-2 bg-state-success/15 text-state-success border border-state-success/20 rounded-lg text-sm font-medium animate-fade-in">
            <Check className="w-4 h-4" /> Settings saved!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          {/* Profile */}
          <div className="surface p-6 space-y-5">
            <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2 border-b border-border-subtle pb-3">
              <User className="w-5 h-5 text-accent" /> Profile
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Name</label>
                <input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className={inputClass} />
              </div>
            </div>
          </div>

          {/* Learning */}
          <div className="surface p-6 space-y-5">
            <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2 border-b border-border-subtle pb-3">
              <BookOpen className="w-5 h-5 text-accent" /> Learning Preferences
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className={labelClass}>DSA Level</label>
                <select value={profile.dsaLevel} onChange={(e) => setProfile({ ...profile, dsaLevel: e.target.value as DSALevel })} className={inputClass}>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Language</label>
                <select value={profile.language} onChange={(e) => setProfile({ ...profile, language: e.target.value as ProgrammingLanguage })} className={inputClass}>
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Goal</label>
                <select value={profile.goal} onChange={(e) => setProfile({ ...profile, goal: e.target.value as LearningGoal })} className={inputClass}>
                  <option value="placements">Campus Placements</option>
                  <option value="interviews">Tech Interviews</option>
                  <option value="cp">Competitive Programming</option>
                  <option value="college">College Exams</option>
                  <option value="skills">Skill Development</option>
                </select>
              </div>
            </div>
          </div>

          {/* AI & Quiet Hours */}
          <div className="surface p-6 space-y-5">
            <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2 border-b border-border-subtle pb-3">
              <Sparkles className="w-5 h-5 text-accent" /> AI Mode & Quiet Hours
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className={labelClass}>AI Depth</label>
                <select value={profile.aiMode} onChange={(e) => setProfile({ ...profile, aiMode: e.target.value as AIMode })} className={inputClass}>
                  <option value="beginner">Beginner (Analogies)</option>
                  <option value="standard">Standard</option>
                  <option value="deep-dive">Deep Dive (Invariants)</option>
                  <option value="interview">Interview (Trade-offs)</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Quiet Hours Start</label>
                <input type="time" value={profile.quietHoursStart} onChange={(e) => setProfile({ ...profile, quietHoursStart: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Quiet Hours End</label>
                <input type="time" value={profile.quietHoursEnd} onChange={(e) => setProfile({ ...profile, quietHoursEnd: e.target.value })} className={inputClass} />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
            <div className="flex gap-2">
              <button type="button" onClick={handleExportData} className="btn-secondary">
                <Download className="w-4 h-4" /> Export Backup
              </button>
              <button type="button" onClick={() => setShowResetWarning(true)} className="btn-secondary !text-state-error border-state-error/20 hover:border-state-error/50 hover:bg-state-error/10">
                <Trash2 className="w-4 h-4" /> Reset App
              </button>
            </div>
            <button type="submit" className="btn-primary px-5 py-2.5">
              <Save className="w-4 h-4" /> Save Preferences
            </button>
          </div>
        </form>
      </div>

      {/* Reset Warning Modal */}
      {showResetWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-primary/80 backdrop-blur-sm animate-fade-in">
          <div className="surface-elevated max-w-md w-full p-6 animate-scale-in">
            <div className="flex items-center gap-3 text-state-error mb-4">
              <div className="w-10 h-10 rounded-full bg-state-error/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold">Reset All Data?</h2>
            </div>
            
            <p className="text-sm text-text-secondary mb-6 leading-relaxed">
              This action will permanently delete all your progress, solved problems, streaks, notes, bookmarks, and settings. <strong>This cannot be undone.</strong>
            </p>

            <div className="flex items-center justify-end gap-3">
              <button 
                onClick={() => setShowResetWarning(false)}
                className="btn-ghost"
              >
                Cancel
              </button>
              <button 
                onClick={handleReset}
                className="px-4 py-2 text-sm font-semibold text-white bg-state-error rounded-lg hover:bg-state-error/90 transition-colors"
              >
                Yes, Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
