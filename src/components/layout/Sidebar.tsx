'use client';

import React, { useState, useEffect } from 'react';
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
  Flame,
  PanelLeftClose,
  PanelLeft,
  X
} from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  streakCount?: number;
}

interface NavSection {
  label: string;
  items: { name: string; href: string; icon: any }[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    label: 'LEARN',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Roadmap', href: '/roadmap', icon: Milestone },
      { name: 'Learn DSA', href: '/learn', icon: BookOpen },
      { name: 'Visualizer', href: '/visualizer', icon: Eye },
    ],
  },
  {
    label: 'PRACTICE',
    items: [
      { name: 'Problems', href: '/practice', icon: Code2 },
      { name: 'AI De-coder', href: '/ai-decoder', icon: Cpu },
      { name: 'AI Chat', href: '/ai-chat', icon: MessageSquareCode },
    ],
  },
  {
    label: 'PLAN',
    items: [
      { name: 'Study Planner', href: '/planner', icon: CalendarDays },
      { name: 'Reminders', href: '/reminders', icon: Bell },
    ],
  },
  {
    label: 'PROGRESS',
    items: [
      { name: 'Progress', href: '/progress', icon: Activity },
      { name: 'Achievements', href: '/achievements', icon: Award },
    ],
  },
  {
    label: 'PERSONAL',
    items: [
      { name: 'Bookmarks', href: '/bookmarks', icon: Bookmark },
      { name: 'Notes', href: '/notes', icon: StickyNote },
    ],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen = false,
  onClose,
  isCollapsed = false,
  onToggleCollapse,
  streakCount = 12,
}) => {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={clsx(
          'fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-bg-secondary transition-all duration-200 ease-out',
          'border-r border-border-default',
          // Desktop: show based on collapse state
          'lg:translate-x-0',
          isCollapsed ? 'lg:w-sidebar-collapsed' : 'lg:w-sidebar',
          // Mobile: slide in/out, always full width
          isOpen ? 'translate-x-0 w-sidebar' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Brand header */}
        <div className="flex items-center h-14 px-3 border-b border-border-subtle shrink-0">
          <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0 group">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0 group-hover:shadow-glow-cyan transition-shadow">
              <Sparkles className="w-4 h-4 text-bg-primary" />
            </div>
            {!isCollapsed && (
              <span className="text-sm font-bold text-text-primary tracking-tight truncate">
                DSA <span className="text-accent">De-coder</span>
              </span>
            )}
          </Link>

          {/* Close on mobile */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 text-text-muted hover:text-text-primary rounded-md lg:hidden ml-auto"
              aria-label="Close navigation"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation sections */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-5" style={{ scrollbarWidth: 'thin' }}>
          {NAV_SECTIONS.map((section) => (
            <div key={section.label}>
              {/* Section label */}
              {!isCollapsed && (
                <div className="px-2 mb-1.5 text-xxs font-semibold text-text-muted tracking-widest uppercase">
                  {section.label}
                </div>
              )}
              {isCollapsed && (
                <div className="w-full h-px bg-border-subtle my-2" />
              )}

              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      title={isCollapsed ? item.name : undefined}
                      className={clsx(
                        'flex items-center gap-2.5 rounded-lg transition-colors relative group',
                        isCollapsed ? 'justify-center p-2.5' : 'px-2.5 py-2',
                        isActive
                          ? 'bg-accent-muted text-accent'
                          : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.04]'
                      )}
                    >
                      <Icon
                        className={clsx(
                          'w-4 h-4 shrink-0',
                          isActive ? 'text-accent' : 'text-text-muted group-hover:text-text-secondary'
                        )}
                      />
                      {!isCollapsed && (
                        <span className="text-xs font-medium truncate">{item.name}</span>
                      )}

                      {/* Active indicator */}
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-accent rounded-r" />
                      )}

                      {/* Collapsed tooltip */}
                      {isCollapsed && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-bg-elevated border border-border-default rounded-md text-xs font-medium text-text-primary whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-elevation-2">
                          {item.name}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom section: collapse toggle + settings */}
        <div className="border-t border-border-subtle p-2 space-y-1 shrink-0">
          {/* Settings */}
          <Link
            href="/settings"
            className={clsx(
              'flex items-center gap-2.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/[0.04] transition-colors',
              isCollapsed ? 'justify-center p-2.5' : 'px-2.5 py-2'
            )}
          >
            <Settings className="w-4 h-4 text-text-muted shrink-0" />
            {!isCollapsed && <span className="text-xs font-medium">Settings</span>}
          </Link>

          {/* Collapse toggle (desktop only) */}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className={clsx(
                'hidden lg:flex items-center gap-2.5 w-full rounded-lg text-text-muted hover:text-text-secondary hover:bg-white/[0.04] transition-colors',
                isCollapsed ? 'justify-center p-2.5' : 'px-2.5 py-2'
              )}
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? (
                <PanelLeft className="w-4 h-4" />
              ) : (
                <>
                  <PanelLeftClose className="w-4 h-4" />
                  <span className="text-xs font-medium">Collapse</span>
                </>
              )}
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
