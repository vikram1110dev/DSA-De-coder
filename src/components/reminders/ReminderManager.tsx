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
  Smartphone,
  CalendarRange
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

  const handleExportICS = () => {
    const enabledReminders = reminders.filter((r) => r.isEnabled);
    if (enabledReminders.length === 0) {
      alert('No enabled reminders to export.');
      return;
    }

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//DSA De-coder//Reminder Calendar//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH'
    ];

    enabledReminders.forEach((rem) => {
      const now = new Date();
      const timeParts = rem.time.split(':');
      const hours = parseInt(timeParts[0] || '0', 10);
      const minutes = parseInt(timeParts[1] || '0', 10);

      const startDate = new Date();
      startDate.setHours(hours, minutes, 0, 0);

      const formatDate = (date: Date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      };

      const startStr = formatDate(startDate);
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
      const endStr = formatDate(endDate);

      icsContent.push('BEGIN:VEVENT');
      icsContent.push(`UID:rem-${rem.id}@dsa-decoder.local`);
      icsContent.push(`DTSTAMP:${formatDate(now)}`);
      icsContent.push(`DTSTART:${startStr}`);
      icsContent.push(`DTEND:${endStr}`);
      icsContent.push(`SUMMARY:DSA Study: ${rem.title}`);
      icsContent.push(`DESCRIPTION:Scheduled reminder for your ${rem.type} session using DSA De-coder.`);

      if (rem.repeatType === 'daily') {
        icsContent.push('RRULE:FREQ=DAILY');
      } else if (rem.repeatType === 'weekdays') {
        icsContent.push('RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR');
      } else if (rem.repeatType === 'weekends') {
        icsContent.push('RRULE:FREQ=WEEKLY;BYDAY=SA,SU');
      }

      icsContent.push('END:VEVENT');
    });

    icsContent.push('END:VCALENDAR');

    const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'dsa-study-reminders.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 surface border border-border-default rounded-3xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-accent/20 text-accent flex items-center justify-center shadow-lg">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
              Smart Study Reminders
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-accent/10 text-accent border border-accent/20">
                Quiet Hours Enabled
              </span>
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              Never break your DSA streak. Set intelligent alarms for coding sessions and revision intervals.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTestChime}
            className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold text-text-secondary bg-bg-inset hover:bg-bg-secondary border border-border-default rounded-xl transition-colors"
          >
            <Volume2 className="w-4 h-4 text-accent" />
            <span>Test Sound Chime</span>
          </button>

          <button
            onClick={handleRequestBrowserPermission}
            className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold text-text-secondary bg-bg-inset hover:bg-bg-secondary border border-border-default rounded-xl transition-colors"
          >
            <Smartphone className="w-4 h-4 text-state-success" />
            <span>Enable Alerts</span>
          </button>

          <button
            onClick={handleExportICS}
            className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold text-text-secondary bg-bg-inset hover:bg-bg-secondary border border-border-default rounded-xl transition-colors"
          >
            <CalendarRange className="w-4 h-4 text-accent-violet" />
            <span>Export Calendar</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-accent to-accent-emerald hover:opacity-95 rounded-xl transition-all shadow-md shadow-accent/20"
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
                ? 'surface border-border-default hover:border-accent/30'
                : 'surface-elevated border-border-default opacity-60'
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="text-base font-bold text-text-primary">{rem.title}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-bg-inset text-accent capitalize border border-border-default">
                    {rem.type}
                  </span>
                </div>
                {rem.description && (
                  <p className="text-sm text-text-muted">{rem.description}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleReminder(rem)}
                  className={clsx(
                    'w-10 h-6 rounded-full transition-colors relative p-0.5',
                    rem.isEnabled ? 'bg-accent' : 'bg-bg-inset border border-border-default'
                  )}
                >
                  <div
                    className={clsx(
                      'w-5 h-5 rounded-full bg-white transition-transform shadow-md',
                      rem.isEnabled ? 'translate-x-4' : 'translate-x-0'
                    )}
                  />
                </button>

                <button
                  onClick={() => handleDeleteReminder(rem.id)}
                  className="p-1.5 text-text-muted hover:text-state-error transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border-default text-sm text-text-secondary font-mono">
              <span className="flex items-center gap-1.5 text-text-primary font-bold">
                <Clock className="w-4 h-4 text-accent" />
                {rem.time}
              </span>
              <span className="capitalize font-sans">{rem.repeatType}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quiet Hours Policy Card */}
      <div className="p-7 surface border border-border-default rounded-3xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent-violet/20 text-accent-violet flex items-center justify-center">
            <Moon className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-bold text-text-primary">Quiet Hours Mode</div>
            <div className="text-xs text-text-secondary mt-0.5">
              Alarms and loud alerts are silenced between <strong className="text-text-primary">{profile.quietHoursStart}</strong> and <strong className="text-text-primary">{profile.quietHoursEnd}</strong>.
            </div>
          </div>
        </div>

        <Link
          href="/settings"
          className="text-sm font-bold text-accent hover:underline shrink-0"
        >
          Change Hours →
        </Link>
      </div>

      {/* Add Reminder Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md surface border border-border-default rounded-3xl p-7 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-text-primary">Create New Study Reminder</h3>

            <div className="space-y-4 text-sm">
              <div>
                <label className="text-text-secondary font-bold block mb-1.5">Reminder Title:</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Graph Traversal Practice"
                  className="w-full bg-bg-inset border border-border-default rounded-xl px-4 py-2.5 text-text-primary focus:outline-none focus:border-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-text-secondary font-bold block mb-1.5">Time (HH:MM):</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-bg-inset border border-border-default rounded-xl px-4 py-2.5 text-text-primary focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="text-text-secondary font-bold block mb-1.5">Frequency:</label>
                  <select
                    value={repeatType}
                    onChange={(e) => setRepeatType(e.target.value as any)}
                    className="w-full bg-bg-inset border border-border-default rounded-xl px-4 py-2.5 text-text-primary focus:outline-none focus:border-accent capitalize"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekdays">Weekdays</option>
                    <option value="weekends">Weekends</option>
                    <option value="none">One Time</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-text-secondary font-bold block mb-1.5">Category:</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full bg-bg-inset border border-border-default rounded-xl px-4 py-2.5 text-text-primary focus:outline-none focus:border-accent capitalize"
                >
                  <option value="study">Study Session</option>
                  <option value="practice">Coding Practice</option>
                  <option value="revision">Spaced Revision</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-default">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-sm font-bold text-text-muted hover:text-text-primary"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateReminder}
                disabled={!title.trim()}
                className="px-5 py-2.5 text-sm font-bold text-white bg-accent hover:bg-accent-muted disabled:opacity-40 rounded-xl transition-colors"
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
