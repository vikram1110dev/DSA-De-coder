'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { BookmarkItem } from '@/types';
import { storageService } from '@/lib/storage';
import { Bookmark, Trash2, ArrowRight, BookOpen, Code2, Cpu } from 'lucide-react';

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);

  useEffect(() => {
    setBookmarks(storageService.getBookmarks());
  }, []);

  const handleRemove = (item: BookmarkItem) => {
    const updated = storageService.toggleBookmark(item);
    setBookmarks([...updated]);
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/30 border border-cyan-500/20 rounded-3xl shadow-xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
            <Bookmark className="w-4 h-4" />
            <span>Saved Questions & Concepts</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            Saved Bookmarks
          </h1>
          <p className="text-xs text-slate-400 max-w-xl">
            Quickly revisit important algorithm lessons, practice problems, and AI logic breakdowns.
          </p>
        </div>

        {/* Bookmarks List */}
        {bookmarks.length === 0 ? (
          <div className="p-12 bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
              <Bookmark className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-300">No bookmarks yet.</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Click the bookmark icon on any problem or lesson page to save it for quick revision.
            </p>
            <Link
              href="/practice"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-950 bg-cyan-400 rounded-xl hover:bg-cyan-300 transition-colors mt-2"
            >
              <span>Explore Practice Problems</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookmarks.map((bm) => (
              <div
                key={bm.id}
                className="p-5 bg-slate-900 border border-slate-800 hover:border-cyan-500/30 rounded-3xl flex items-center justify-between gap-4 transition-all shadow-md group"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.2 rounded-full font-bold bg-slate-950 text-cyan-400 capitalize border border-slate-800">
                      {bm.itemType}
                    </span>
                    <span className="text-[10px] text-slate-500">{bm.createdAt}</span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                    {bm.title}
                  </h3>
                  <p className="text-xs text-slate-400 truncate">{bm.subtitle}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={
                      bm.itemType === 'problem'
                        ? `/practice/${bm.itemId}`
                        : bm.itemType === 'topic'
                        ? `/learn/${bm.itemId}`
                        : '/ai-decoder'
                    }
                    className="p-2 bg-slate-800 hover:bg-cyan-500 text-slate-400 hover:text-slate-950 rounded-xl transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={() => handleRemove(bm)}
                    className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
