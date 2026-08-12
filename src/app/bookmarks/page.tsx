'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { BookmarkItem } from '@/types';
import { storageService } from '@/lib/storage';
import { Bookmark, Trash2, ArrowRight } from 'lucide-react';

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
      <div className="space-y-5">
        {bookmarks.length === 0 ? (
          <div className="surface p-12 text-center space-y-3">
            <div className="w-10 h-10 rounded-xl bg-bg-inset text-text-disabled flex items-center justify-center mx-auto">
              <Bookmark className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-text-secondary">No bookmarks yet</h3>
            <p className="text-xxs text-text-muted max-w-sm mx-auto">
              Click the bookmark icon on any problem or lesson to save it for quick revision.
            </p>
            <Link href="/practice" className="btn-primary inline-flex mt-2">
              Explore Problems <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {bookmarks.map((bm) => (
              <div key={bm.id} className="surface-interactive flex items-center justify-between gap-4 p-4 group">
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="badge badge-cyan capitalize">{bm.itemType}</span>
                    <span className="text-xxs text-text-disabled">{bm.createdAt}</span>
                  </div>
                  <h3 className="text-xs font-semibold text-text-primary group-hover:text-accent transition-colors truncate">
                    {bm.title}
                  </h3>
                  <p className="text-xxs text-text-muted truncate">{bm.subtitle}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Link
                    href={bm.itemType === 'problem' ? `/practice/${bm.itemId}` : bm.itemType === 'topic' ? `/learn/${bm.itemId}` : '/ai-decoder'}
                    className="btn-ghost p-2"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <button onClick={() => handleRemove(bm)} className="btn-ghost p-2 text-text-muted hover:text-accent-rose">
                    <Trash2 className="w-3.5 h-3.5" />
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
