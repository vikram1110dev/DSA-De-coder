'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ReminderItem, UserProfile } from '@/types';
import { storageService } from '@/lib/storage';
import {
  Bell,
  Plus,
  Trash2,
  Clock,
  Volume2,
  Moon,
  Sparkles,
  Check,
  Smartphone
} from 'lucide-react';
import { clsx } from 'clsx';
import {
  playNotificationSound,
  requestNotificationPermission,
  sendBrowserNotification
} from '@/lib/notifications';

export const ReminderManager: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(storageService.getProfile());
  const [reminders, setReminders] = useState<ReminderItem[]>(storageService.getReminders());
  const [showAddModal, setShowAddModal] = useState(false);

  // New Reminder Form State
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('19:00');
  const [type, setType] = useState<'study' | 'practice' | 'revision' | 'custom'>('study');
  const [repeatType, setRepeatType] = useState<'daily' | 'weekdays' | 'weekends' | 'none'>('daily');
  const [notificationType, setNotificationType] = useState<'browser' | 'sound' | 'in_app'>('browser');

  const handleToggleReminder = (rem: ReminderItem) => {
    const updated = storageService.saveReminder({ ...rem, isEnabled: !rem.isEnabled });
    setReminders([...updated]);
  };

  const handleDeleteReminder = (id: string) => {
    const updated = storageService.deleteReminder(id);
    setReminders([...updated]);
  };

  const handleCreateReminder = () => {
    if (!title.trim()) return;

    const newRem: ReminderItem = {
      id: `rem_${Date.now()}`,
      title,
      type,
      time,
      repeatType,
      notificationType,
      isEnabled: true
    };

    const updated = storageService.saveReminder(newRem);
    setReminders([...updated]);
    setShowAddModal(false);
    setTitle('');
  };

  const handleTestChime = () => {
    playNotificationSound();
  };

  const handleRequestBrowserPermission = async () => {
    const perm = await requestNotificationPermission();
    if (perm === 'granted') {
      sendBrowserNotification('🧠 DSA De-coder Connected!', {
        body: 'Browser notifications are successfully configured. You will receive study reminders on time!'
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shadow-lg">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Smart Study Reminders
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                Quiet Hours Enabled
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Never break your DSA streak. Set intelligent alarms for coding sessions and revision intervals.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTestChime}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl transition-colors"
          >
            <Volume2 className="w-4 h-4 text-cyan-400" />
            <span>Test Sound Chime</span>
          </button>

          <button
            onClick={handleRequestBrowserPermission}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl transition-colors"
          >
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>Enable Browser Alerts</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:opacity-95 rounded-xl transition-all shadow-md shadow-cyan-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>New Reminder</span>
          </button>
        </div>
      </div>

      {/* Reminders List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reminders.map((rem) => (
          <div
            key={rem.id}
            className={clsx(
              'p-5 rounded-3xl border transition-all space-y-3 flex flex-col justify-between shadow-lg',
              rem.isEnabled
                ? 'bg-slate-900 border-slate-800 hover:border-cyan-500/30'
                : 'bg-slate-900/40 border-slate-800/60 opacity-60'
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{rem.title}</span>
                  <span className="text-[10px] px-2 py-0.2 rounded-full font-bold bg-slate-800 text-cyan-400 capitalize">
                    {rem.type}
                  </span>
                </div>
                {rem.description && (
                  <p className="text-xs text-slate-400">{rem.description}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleReminder(rem)}
                  className={clsx(
                    'w-10 h-6 rounded-full transition-colors relative p-0.5',
                    rem.isEnabled ? 'bg-cyan-500' : 'bg-slate-800'
                  )}
                >
                  <div
                    className={clsx(
                      'w-5 h-5 rounded-full bg-slate-950 transition-transform shadow-md',
                      rem.isEnabled ? 'translate-x-4' : 'translate-x-0'
                    )}
                  />
                </button>

                <button
                  onClick={() => handleDeleteReminder(rem.id)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1.5 text-slate-200 font-bold">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                {rem.time}
              </span>
              <span className="capitalize font-sans">{rem.repeatType}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quiet Hours Policy Card */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
            <Moon className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Quiet Hours Mode</div>
            <div className="text-[11px] text-slate-400">
              Alarms and loud alerts are silenced between <strong className="text-slate-200">{profile.quietHoursStart}</strong> and <strong className="text-slate-200">{profile.quietHoursEnd}</strong>.
            </div>
          </div>
        </div>

        <Link
          href="/settings"
          className="text-xs font-bold text-cyan-400 hover:underline shrink-0"
        >
          Change Hours →
        </Link>
      </div>

      {/* Add Reminder Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <h3 className="text-base font-bold text-white">Create New Study Reminder</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Reminder Title:</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Graph Traversal Practice"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Time (HH:MM):</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Frequency:</label>
                  <select
                    value={repeatType}
                    onChange={(e) => setRepeatType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500 capitalize"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekdays">Weekdays</option>
                    <option value="weekends">Weekends</option>
                    <option value="none">One Time</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Category:</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500 capitalize"
                >
                  <option value="study">Study Session</option>
                  <option value="practice">Coding Practice</option>
                  <option value="revision">Spaced Revision</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateReminder}
                disabled={!title.trim()}
                className="px-5 py-2 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-40 rounded-xl transition-colors"
              >
                Save Reminder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
