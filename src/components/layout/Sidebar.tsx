'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  Milestone,
  Eye,
  Code2,
  Cpu,
  MessageSquareCode,
  CalendarDays,
  Bell,
  Activity,
  Award,
  Bookmark,
  StickyNote,
  Settings,
  Sparkles,
  ChevronRight,
  Flame,
  X
} from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  streakCount?: number;
}

const NAV_ITEMS = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Learn DSA', href: '/learn', icon: BookOpen },
  { name: 'Roadmap', href: '/roadmap', icon: Milestone },
  { name: 'Visualizer', href: '/visualizer', icon: Eye, badge: 'Interactive' },
  { name: 'Practice', href: '/practice', icon: Code2, badge: '50+ Labs' },
  { name: 'AI De-coder', href: '/ai-decoder', icon: Cpu, badge: 'Gemini' },
  { name: 'AI Mentor Chat', href: '/ai-chat', icon: MessageSquareCode },
  { name: 'Study Planner', href: '/planner', icon: CalendarDays },
  { name: 'Reminders', href: '/reminders', icon: Bell },
  { name: 'Progress & Heatmap', href: '/progress', icon: Activity },
  { name: 'Achievements', href: '/achievements', icon: Award },
  { name: 'Bookmarks', href: '/bookmarks', icon: Bookmark },
  { name: 'Notes', href: '/notes', icon: StickyNote },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose, streakCount = 12 }) => {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        className={clsx(
          'fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 bg-[#090d16] border-r border-slate-800/80 transition-transform duration-300 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800/80 bg-slate-950/40">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 via-cyan-500 to-emerald-400 text-slate-950 font-black shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white flex items-center gap-1">
                DSA <span className="text-cyan-400">De-coder</span>
              </span>
              <span className="block text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                AI Learning Platform
              </span>
            </div>
          </Link>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg lg:hidden hover:bg-slate-800"
              aria-label="Close Sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Streak Quick Card */}
        <div className="px-3.5 py-3 border-b border-slate-800/60 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent">
          <Link
            href="/progress"
            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-amber-500/20 hover:border-amber-500/40 transition-colors group"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 group-hover:scale-110 transition-transform">
                <Flame className="w-5 h-5 fill-amber-400 text-amber-500 animate-pulse" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-200">
                  {streakCount} Day Streak
                </div>
                <div className="text-[11px] text-amber-400/90 font-medium">
                  Active & Protected 🔥
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto custom-scrollbar">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={clsx(
                  'flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group',
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/15 to-cyan-500/5 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={clsx(
                      'w-4 h-4 transition-transform group-hover:scale-110',
                      isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                    )}
                  />
                  <span>{item.name}</span>
                </div>

                {item.badge && (
                  <span
                    className={clsx(
                      'text-[10px] px-1.5 py-0.5 rounded-full font-bold',
                      item.badge === 'Gemini'
                        ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'bg-slate-800 text-slate-300'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Footer Card */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
          <Link
            href="/settings"
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800/60 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-sm font-bold text-white shadow-md">
              V
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">Vikram</p>
              <p className="text-[10px] text-cyan-400 font-medium truncate">Level 3 • 480 XP</p>
            </div>
            <Settings className="w-4 h-4 text-slate-500 hover:text-slate-300" />
          </Link>
        </div>
      </aside>
    </>
  );
};
