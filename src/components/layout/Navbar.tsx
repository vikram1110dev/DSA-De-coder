'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Menu,
  Search,
  Sparkles,
  Flame,
  Bell,
  CheckCheck,
  Award,
  Calendar,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { storageService } from '@/lib/storage';
import { NotificationItem, UserProfile } from '@/types';
import { SearchModal } from './SearchModal';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const [profile, setProfile] = useState<UserProfile>(storageService.getProfile());
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  useEffect(() => {
    setProfile(storageService.getProfile());
    setNotifications(storageService.getNotifications());

    // Listen for storage changes or updates
    const handleUpdate = () => {
      setProfile(storageService.getProfile());
      setNotifications(storageService.getNotifications());
    };

    window.addEventListener('storage', handleUpdate);
    return () => window.removeEventListener('storage', handleUpdate);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAllRead = () => {
    const updated = storageService.markAllNotificationsRead();
    setNotifications(updated);
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-[#090d16]/90 backdrop-blur-md border-b border-slate-800/80">
        {/* Left Side: Mobile Menu + Search Bar */}
        <div className="flex items-center gap-3 lg:gap-4 flex-1 max-w-xl">
          <button
            onClick={onToggleSidebar}
            className="p-2 text-slate-400 hover:text-white rounded-xl lg:hidden hover:bg-slate-800 transition-colors"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search Trigger Button */}
          <button
            onClick={() => setShowSearchModal(true)}
            className="flex items-center gap-3 w-full max-w-md px-3.5 py-2 text-xs font-medium text-slate-400 bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-xl transition-all shadow-inner group"
          >
            <Search className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
            <span className="flex-1 text-left truncate">
              Search topics, algorithms, or problem patterns...
            </span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold text-slate-400 bg-slate-800 border border-slate-700 rounded">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick AI Button */}
          <Link
            href="/ai-decoder"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-cyan-300 bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 border border-cyan-500/30 rounded-xl transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
            <span>AI De-coder</span>
          </Link>

          {/* Live Streak Pill */}
          <Link
            href="/progress"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 rounded-xl transition-all"
          >
            <Flame className="w-4 h-4 fill-amber-400 text-amber-500" />
            <span>12d</span>
          </Link>

          {/* Notification Bell Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              className="relative p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/80 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
                </span>
              )}
            </button>

            {/* Notification Dropdown Popover */}
            {showNotifDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifDropdown(false)}
                />
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/60">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="px-1.5 py-0.2 text-[10px] font-extrabold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-full">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60 custom-scrollbar">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-slate-500 text-xs">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-3 hover:bg-slate-800/50 transition-colors ${
                            !notif.isRead ? 'bg-cyan-500/5' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="text-xs font-bold text-slate-200">
                              {notif.title}
                            </div>
                            <span className="text-[10px] text-slate-500 whitespace-nowrap">
                              {notif.createdAt}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                            {notif.message}
                          </p>
                          {notif.linkUrl && (
                            <Link
                              href={notif.linkUrl}
                              onClick={() => setShowNotifDropdown(false)}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-400 hover:underline mt-1.5"
                            >
                              <span>View details</span>
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-2 border-t border-slate-800 bg-slate-950/40 text-center">
                    <Link
                      href="/reminders"
                      onClick={() => setShowNotifDropdown(false)}
                      className="text-[11px] font-semibold text-slate-400 hover:text-white"
                    >
                      Manage Notification Settings →
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Profile Dropdown Badge */}
          <Link
            href="/settings"
            className="flex items-center gap-2 pl-2 border-l border-slate-800 group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-500 p-0.5 shadow-md">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-xs font-black text-cyan-300">
                {profile.name[0] || 'V'}
              </div>
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">
                {profile.name}
              </div>
              <div className="text-[10px] text-slate-400 font-medium">
                {profile.dsaLevel.toUpperCase()}
              </div>
            </div>
          </Link>
        </div>
      </header>

      {/* Global Search Dialog */}
      <SearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
      />
    </>
  );
};
