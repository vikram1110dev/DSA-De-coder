'use client';

import {
  UserProfile,
  UserStreakState,
  DSAActivityItem,
  StudyTaskItem,
  ReminderItem,
  NotificationItem,
  BookmarkItem,
  NoteItem,
  AchievementItem
} from '@/types';
import { ACHIEVEMENTS_DATA } from '@/data/achievements';
import { calculateStreak, getTodayDateString } from './streak';
import { playNotificationSound, sendBrowserNotification, isWithinQuietHours } from './notifications';

const PROFILE_KEY = 'dsa_decoder_user_profile';
const ACTIVITIES_KEY = 'dsa_decoder_activities';
const TASKS_KEY = 'dsa_decoder_daily_tasks';
const REMINDERS_KEY = 'dsa_decoder_reminders';
const NOTIFICATIONS_KEY = 'dsa_decoder_notifications';
const BOOKMARKS_KEY = 'dsa_decoder_bookmarks';
const NOTES_KEY = 'dsa_decoder_notes';
const ACHIEVEMENTS_KEY = 'dsa_decoder_unlocked_achievements';

// Default User Profile
export const DEFAULT_PROFILE: UserProfile = {
  id: 'usr_vikram_01',
  name: 'Vikram',
  email: 'vikram@example.com',
  avatar: '👨‍💻',
  dsaLevel: 'beginner',
  language: 'javascript',
  dailyStudyTime: 45,
  goal: 'interviews',
  targetDays: 60,
  preferredTime: '19:00',
  aiMode: 'standard',
  xp: 480,
  level: 3,
  streakFreeze: 2,
  quietHoursStart: '22:00',
  quietHoursEnd: '07:00',
  completedTopics: ['big-o-complexity', 'arrays'],
  solvedProblems: ['two-sum', 'binary-search-basic'],
  bookmarkedItems: ['longest-substring-without-repeating-characters']
};

// Seed initial realistic activity history over the last 20 days so the heatmap and streak feel alive
function generateInitialActivities(): DSAActivityItem[] {
  const activities: DSAActivityItem[] = [];
  const today = new Date();

  // Create streak over past 12 days
  for (let i = 12; i >= 1; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    activities.push({
      id: `act_${dateStr}_1`,
      date: dateStr,
      activityType: 'LESSON_COMPLETED',
      activityScore: 1,
      title: 'Completed DSA Concept',
      timestamp: d.getTime()
    });

    if (i % 2 === 0) {
      activities.push({
        id: `act_${dateStr}_2`,
        date: dateStr,
        activityType: 'PROBLEM_SOLVED',
        activityScore: 2,
        title: 'Solved Practice Problem',
        timestamp: d.getTime() + 1000
      });
    }

    if (i % 3 === 0) {
      activities.push({
        id: `act_${dateStr}_3`,
        date: dateStr,
        activityType: 'VISUALIZATION_COMPLETED',
        activityScore: 1,
        title: 'Explored Algorithm Visualizer',
        timestamp: d.getTime() + 2000
      });
    }
  }

  return activities;
}

// Initial Daily Tasks
function generateInitialDailyTasks(): StudyTaskItem[] {
  const todayStr = getTodayDateString();
  return [
    {
      id: 'task_1',
      dayNumber: 13,
      topicId: 'sliding-window',
      title: 'Understand Sliding Window Concept',
      description: 'Review fixed vs dynamic window sizes and subarray sum invariants.',
      type: 'concept',
      estimatedMinutes: 15,
      xpReward: 20,
      isCompleted: true,
      dateScheduled: todayStr
    },
    {
      id: 'task_2',
      dayNumber: 13,
      topicId: 'sliding-window',
      title: 'Step through Sliding Window Visualizer',
      description: 'Observe dynamic window expansion and contraction animations.',
      type: 'visualizer',
      estimatedMinutes: 10,
      xpReward: 15,
      isCompleted: true,
      dateScheduled: todayStr
    },
    {
      id: 'task_3',
      dayNumber: 13,
      topicId: 'sliding-window',
      title: 'Decode Longest Substring Without Repeating Characters',
      description: 'Dissect the 5-step problem reasoning before writing solution code.',
      type: 'practice',
      estimatedMinutes: 20,
      xpReward: 35,
      isCompleted: false,
      dateScheduled: todayStr
    },
    {
      id: 'task_4',
      dayNumber: 13,
      topicId: 'two-pointers',
      title: 'Solve Container With Most Water',
      description: 'Practice opposite-end two pointer elimination in O(N) time.',
      type: 'practice',
      estimatedMinutes: 20,
      xpReward: 35,
      isCompleted: false,
      dateScheduled: todayStr
    },
    {
      id: 'task_5',
      dayNumber: 13,
      topicId: 'hash-maps',
      title: 'Complete AI Mini Challenge on Hash Maps',
      description: 'Explain collision resolution trade-offs to your AI DSA mentor.',
      type: 'ai_challenge',
      estimatedMinutes: 10,
      xpReward: 25,
      isCompleted: false,
      dateScheduled: todayStr
    }
  ];
}

// Initial Reminders
function generateInitialReminders(): ReminderItem[] {
  return [
    {
      id: 'rem_1',
      title: 'Daily DSA Mastery Session',
      description: 'Prime study hour for algorithm concepts and practice decoding.',
      type: 'study',
      time: '19:00',
      repeatType: 'daily',
      notificationType: 'browser',
      isEnabled: true
    },
    {
      id: 'rem_2',
      title: 'Binary Search Spaced Revision',
      description: 'Review boundary invariants and mid-point calculation.',
      type: 'revision',
      time: '20:30',
      repeatType: 'none',
      notificationType: 'sound',
      isEnabled: true
    }
  ];
}

// Initial Notifications
function generateInitialNotifications(): NotificationItem[] {
  return [
    {
      id: 'notif_1',
      title: '🔥 12-Day Streak Active!',
      message: 'Keep going! Complete 1 more task to secure today\'s streak.',
      type: 'streak',
      linkUrl: '/dashboard',
      isRead: false,
      createdAt: '10m ago'
    },
    {
      id: 'notif_2',
      title: '🔔 Upcoming DSA Session at 7:00 PM',
      message: 'Your personalized Sliding Window study plan is ready.',
      type: 'reminder',
      linkUrl: '/planner',
      isRead: false,
      createdAt: '1h ago'
    },
    {
      id: 'notif_3',
      title: '🏆 Achievement Unlocked: Week Warrior',
      message: 'You earned 150 XP for maintaining a 7-day learning streak!',
      type: 'achievement',
      linkUrl: '/achievements',
      isRead: true,
      createdAt: '2d ago'
    }
  ];
}

// Client Storage API
export const storageService = {
  getProfile(): UserProfile {
    if (typeof window === 'undefined') return DEFAULT_PROFILE;
    const stored = localStorage.getItem(PROFILE_KEY);
    if (!stored) {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(DEFAULT_PROFILE));
      return DEFAULT_PROFILE;
    }
    return JSON.parse(stored);
  },

  updateProfile(updates: Partial<UserProfile>): UserProfile {
    const curr = this.getProfile();
    const updated = { ...curr, ...updates };
    if (typeof window !== 'undefined') {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
    }
    return updated;
  },

  getActivities(): DSAActivityItem[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(ACTIVITIES_KEY);
    if (!stored) {
      const hasReset = localStorage.getItem('dsa_decoder_has_reset') === 'true';
      const initial = hasReset ? [] : generateInitialActivities();
      localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(stored);
  },

  recordActivity(activity: Omit<DSAActivityItem, 'id' | 'date' | 'timestamp'>): DSAActivityItem {
    const todayStr = getTodayDateString();
    const newActivity: DSAActivityItem = {
      ...activity,
      id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      date: todayStr,
      timestamp: Date.now()
    };

    const activities = this.getActivities();
    activities.push(newActivity);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities));
    }

    // Award XP and check level up
    const profile = this.getProfile();
    const addedXP = (activity.activityScore || 1) * 20;
    const newXP = profile.xp + addedXP;
    const newLevel = Math.floor(newXP / 200) + 1;
    this.updateProfile({ xp: newXP, level: newLevel });

    // Send in-app notification & sound
    if (!isWithinQuietHours(profile.quietHoursStart, profile.quietHoursEnd)) {
      playNotificationSound();
      sendBrowserNotification('🔥 Activity Recorded!', {
        body: `You completed "${activity.title}". Streak secured!`
      });
    }

    this.addNotification({
      title: '🔥 Activity Recorded!',
      message: `Completed "${activity.title}" (+${addedXP} XP). Streak secured!`,
      type: 'streak',
      linkUrl: '/dashboard'
    });

    return newActivity;
  },

  getStreakState(): UserStreakState {
    const activities = this.getActivities();
    return calculateStreak(activities);
  },

  getDailyTasks(): StudyTaskItem[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(TASKS_KEY);
    if (!stored) {
      const hasReset = localStorage.getItem('dsa_decoder_has_reset') === 'true';
      const initial = hasReset ? [] : generateInitialDailyTasks();
      localStorage.setItem(TASKS_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(stored);
  },

  toggleTaskCompletion(taskId: string): StudyTaskItem[] {
    const tasks = this.getDailyTasks();
    const task = tasks.find(t => t.id === taskId);
    if (!task) return tasks;

    task.isCompleted = !task.isCompleted;
    if (task.isCompleted) {
      this.recordActivity({
        activityType: task.type === 'concept' ? 'LESSON_COMPLETED' : task.type === 'visualizer' ? 'VISUALIZATION_COMPLETED' : 'PROBLEM_SOLVED',
        activityScore: 1,
        title: task.title,
        referenceId: task.topicId
      });
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    }
    return tasks;
  },

  getReminders(): ReminderItem[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(REMINDERS_KEY);
    if (!stored) {
      const hasReset = localStorage.getItem('dsa_decoder_has_reset') === 'true';
      const initial = hasReset ? [] : generateInitialReminders();
      localStorage.setItem(REMINDERS_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(stored);
  },

  saveReminder(reminder: ReminderItem): ReminderItem[] {
    const reminders = this.getReminders();
    const idx = reminders.findIndex(r => r.id === reminder.id);
    if (idx >= 0) {
      reminders[idx] = reminder;
    } else {
      reminders.push(reminder);
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));
    }
    return reminders;
  },

  deleteReminder(reminderId: string): ReminderItem[] {
    const reminders = this.getReminders().filter(r => r.id !== reminderId);
    if (typeof window !== 'undefined') {
      localStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));
    }
    return reminders;
  },

  getNotifications(): NotificationItem[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(NOTIFICATIONS_KEY);
    if (!stored) {
      const hasReset = localStorage.getItem('dsa_decoder_has_reset') === 'true';
      const initial = hasReset ? [] : generateInitialNotifications();
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(stored);
  },

  addNotification(notif: Omit<NotificationItem, 'id' | 'isRead' | 'createdAt'>): NotificationItem {
    const newNotif: NotificationItem = {
      ...notif,
      id: `notif_${Date.now()}`,
      isRead: false,
      createdAt: 'Just now'
    };
    const notifications = this.getNotifications();
    notifications.unshift(newNotif);
    if (typeof window !== 'undefined') {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    }
    return newNotif;
  },

  markAllNotificationsRead(): NotificationItem[] {
    const notifications = this.getNotifications().map(n => ({ ...n, isRead: true }));
    if (typeof window !== 'undefined') {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    }
    return notifications;
  },

  getBookmarks(): BookmarkItem[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(BOOKMARKS_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  toggleBookmark(item: BookmarkItem): BookmarkItem[] {
    let bookmarks = this.getBookmarks();
    const exists = bookmarks.some(b => b.itemId === item.itemId);
    if (exists) {
      bookmarks = bookmarks.filter(b => b.itemId !== item.itemId);
    } else {
      bookmarks.push(item);
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    }
    return bookmarks;
  },

  getNotes(): NoteItem[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(NOTES_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  saveNote(note: NoteItem): NoteItem[] {
    const notes = this.getNotes();
    const idx = notes.findIndex(n => n.id === note.id);
    if (idx >= 0) {
      notes[idx] = note;
    } else {
      notes.unshift(note);
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    }
    return notes;
  },

  deleteNote(noteId: string): NoteItem[] {
    const notes = this.getNotes().filter(n => n.id !== noteId);
    if (typeof window !== 'undefined') {
      localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    }
    return notes;
  },

  resetAllData(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(PROFILE_KEY);
      localStorage.removeItem(ACTIVITIES_KEY);
      localStorage.removeItem(TASKS_KEY);
      localStorage.removeItem(REMINDERS_KEY);
      localStorage.removeItem(NOTIFICATIONS_KEY);
      localStorage.removeItem(BOOKMARKS_KEY);
      localStorage.removeItem(NOTES_KEY);
      localStorage.removeItem(ACHIEVEMENTS_KEY);
      // Also remove theme
      localStorage.removeItem('dsa-decoder-theme');
      
      // Set a flag so initial mock data is not regenerated
      localStorage.setItem('dsa_decoder_has_reset', 'true');
    }
  }
};
