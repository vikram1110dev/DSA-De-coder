'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  Search,
  Sparkles,
  Flame,
  Bell,
  CheckCheck,
  ExternalLink,
} from 'lucide-react';
import { storageService } from '@/lib/storage';
import { NotificationItem, UserProfile } from '@/types';
import { SearchModal } from './SearchModal';
import { clsx } from 'clsx';

interface NavbarProps {
  onToggleSidebar: () => void;
}

// Map routes to page titles
const ROUTE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/roadmap': 'Roadmap',
  '/learn': 'Learn DSA',
  '/visualizer': 'Algorithm Lab',
  '/practice': 'Practice',
  '/ai-decoder': 'AI De-coder',
  '/ai-chat': 'AI Mentor',
  '/planner': 'Study Planner',
  '/reminders': 'Reminders',
  '/progress': 'Progress',
  '/achievements': 'Achievements',
  '/bookmarks': 'Bookmarks',
  '/notes': 'Notes',
  '/settings': 'Settings',
};

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const pathname = usePathname();
  const [profile, setProfile] = useState<UserProfile>(storageService.getProfile());
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  useEffect(() => {
    setProfile(storageService.getProfile());
    setNotifications(storageService.getNotifications());

    const handleUpdate = () => {
      setProfile(storageService.getProfile());
      setNotifications(storageService.getNotifications());
    };
    window.addEventListener('storage', handleUpdate);
    return () => window.removeEventListener('storage', handleUpdate);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const streak = storageService.getStreakState();

  const handleMarkAllRead = () => {
    const updated = storageService.markAllNotificationsRead();
    setNotifications(updated);
  };

  // Get page title from route
  const getPageTitle = () => {
    if (pathname.startsWith('/learn/')) return 'Topic';
    if (pathname.startsWith('/practice/')) return 'Problem';
    return ROUTE_TITLES[pathname] || 'DSA De-coder';
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-4 sm:px-6 bg-bg-primary/80 backdrop-blur-lg border-b border-border-subtle">
        {/* Left: Mobile menu + Page title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-1.5 text-text-muted hover:text-text-primary rounded-md lg:hidden"
            aria-label="Toggle navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <h1 className="text-sm font-semibold text-text-primary hidden sm:block">
            {getPageTitle()}
          </h1>
        </div>

        {/* Center: Search */}
        <button
          onClick={() => setShowSearchModal(true)}
          className="flex items-center gap-2 max-w-sm w-full mx-4 px-3 py-1.5 text-xs text-text-muted bg-bg-surface border border-border-default hover:border-border-strong rounded-lg transition-colors group"
        >
          <Search className="w-3.5 h-3.5 text-text-muted group-hover:text-accent transition-colors" />
          <span className="flex-1 text-left truncate hidden sm:block">Search topics, problems...</span>
          <kbd className="hidden md:inline-block px-1.5 py-0.5 text-xxs font-medium text-text-muted bg-bg-inset border border-border-subtle rounded">
            ⌘K
          </kbd>
        </button>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5">
          {/* AI De-coder shortcut */}
          <Link
            href="/ai-decoder"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-accent bg-accent-subtle hover:bg-accent-muted border border-transparent hover:border-accent/20 rounded-lg transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI</span>
          </Link>

          {/* Streak */}
          <Link
            href="/progress"
            className="flex items-center gap-1 px-2 py-1.5 text-xs font-semibold text-accent-amber rounded-lg hover:bg-accent-amber/10 transition-colors"
          >
            <Flame className="w-3.5 h-3.5 fill-accent-amber text-accent-amber" />
            <span>{streak.currentStreak}</span>
          </Link>



          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              className="relative p-2 text-text-muted hover:text-text-primary rounded-lg hover:bg-white/[0.04] transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
              )}
            </button>

            {showNotifDropdown && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifDropdown(false)} />
                <div className="absolute right-0 mt-1.5 w-80 surface-elevated z-50 overflow-hidden animate-scale-in">
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-border-subtle">
                    <span className="text-xs font-semibold text-text-primary">Notifications</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-xxs font-medium text-accent hover:underline flex items-center gap-1"
                      >
                        <CheckCheck className="w-3 h-3" />
                        Mark read
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-border-subtle">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-text-muted text-xs">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.slice(0, 8).map((notif) => (
                        <div
                          key={notif.id}
                          className={clsx(
                            'px-4 py-2.5 hover:bg-white/[0.02] transition-colors',
                            !notif.isRead && 'bg-accent-subtle'
                          )}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-medium text-text-primary">{notif.title}</span>
                            <span className="text-xxs text-text-muted whitespace-nowrap">{notif.createdAt}</span>
                          </div>
                          <p className="text-xxs text-text-secondary mt-0.5 leading-relaxed">{notif.message}</p>
                          {notif.linkUrl && (
                            <Link
                              href={notif.linkUrl}
                              onClick={() => setShowNotifDropdown(false)}
                              className="inline-flex items-center gap-1 text-xxs font-medium text-accent hover:underline mt-1"
                            >
                              View <ExternalLink className="w-2.5 h-2.5" />
                            </Link>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Profile */}
          <Link
            href="/settings"
            className="w-7 h-7 rounded-lg bg-accent/20 flex items-center justify-center text-xxs font-bold text-accent hover:bg-accent/30 transition-colors ml-1"
          >
            {profile.name[0] || 'V'}
          </Link>
        </div>
      </header>

      <SearchModal isOpen={showSearchModal} onClose={() => setShowSearchModal(false)} />
    </>
  );
};
