'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { NoteItem } from '@/types';
import { storageService } from '@/lib/storage';
import { Plus, Trash2, Edit3, Save } from 'lucide-react';
import { DSA_TOPICS } from '@/data/topics';
import { clsx } from 'clsx';

export default function NotesPage() {
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [activeNote, setActiveNote] = useState<NoteItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [topicId, setTopicId] = useState('big-o-complexity');
  const [content, setContent] = useState('');

  useEffect(() => {
    const loaded = storageService.getNotes();
    if (loaded.length === 0) {
      const initial: NoteItem = {
        id: 'note_binary_search', topicId: 'binary-search-algorithm', topicTitle: 'Binary Search',
        title: 'Binary Search Invariant Rules',
        content: `### Important Invariants:\n1. **Midpoint Overflow Protection**: Always use \`mid = low + (high - low) / 2\`.\n2. **Loop Boundary**: \`while (low <= high)\` handles single-element arrays.\n3. **Sorted Requirement**: Array MUST be sorted monotonically.`,
        updatedAt: 'Today'
      };
      storageService.saveNote(initial);
      setNotes([initial]);
      setActiveNote(initial);
    } else {
      setNotes(loaded);
      setActiveNote(loaded[0]);
    }
  }, []);

  const handleSelectNote = (n: NoteItem) => { setActiveNote(n); setIsEditing(false); };

  const handleCreateNew = () => {
    setTitle('New Note');
    setTopicId(DSA_TOPICS[0].id);
    setContent('Write your algorithm notes here...');
    setIsEditing(true);
    setActiveNote(null);
  };

  const handleSave = () => {
    if (!title.trim()) return;
    const selectedTopic = DSA_TOPICS.find((t) => t.id === topicId) || DSA_TOPICS[0];
    const noteToSave: NoteItem = {
      id: activeNote ? activeNote.id : `note_${Date.now()}`,
      topicId, topicTitle: selectedTopic.title, title, content, updatedAt: 'Just now'
    };
    const updated = storageService.saveNote(noteToSave);
    setNotes([...updated]);
    setActiveNote(noteToSave);
    setIsEditing(false);
  };

  const handleDelete = (id: string) => {
    const updated = storageService.deleteNote(id);
    setNotes([...updated]);
    setActiveNote(updated.length > 0 ? updated[0] : null);
    setIsEditing(false);
  };

  return (
    <AppLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-xxs font-medium text-text-muted">{notes.length} notes</span>
          <button onClick={handleCreateNew} className="btn-primary">
            <Plus className="w-3.5 h-3.5" /> New Note
          </button>
        </div>

        {/* Master-Detail */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Sidebar */}
          <div className="surface p-3 space-y-1.5 max-h-[560px] overflow-y-auto">
            {notes.map((n) => (
              <button
                key={n.id}
                onClick={() => handleSelectNote(n)}
                className={clsx(
                  'w-full text-left px-3 py-2.5 rounded-lg transition-all space-y-0.5',
                  activeNote?.id === n.id && !isEditing
                    ? 'bg-accent-muted text-accent'
                    : 'text-text-secondary hover:bg-white/[0.04]'
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold truncate">{n.title}</span>
                  <span className="text-xxs text-text-disabled">{n.updatedAt}</span>
                </div>
                <div className="text-xxs text-accent font-medium">{n.topicTitle}</div>
              </button>
            ))}
          </div>

          {/* Editor/Viewer */}
          <div className="md:col-span-2 surface p-5 max-h-[560px] overflow-y-auto flex flex-col">
            {isEditing ? (
              <div className="space-y-3 flex-1 flex flex-col">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                    placeholder="Note Title..."
                    className="surface-inset px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-accent rounded-lg"
                  />
                  <select
                    value={topicId} onChange={(e) => setTopicId(e.target.value)}
                    className="surface-inset px-3 py-2 text-xs text-text-secondary focus:outline-none focus:ring-1 focus:ring-accent rounded-lg"
                  >
                    {DSA_TOPICS.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
                  </select>
                </div>
                <textarea
                  value={content} onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your notes..."
                  className="w-full flex-1 min-h-[300px] surface-inset p-3 font-mono text-xs text-text-secondary focus:outline-none focus:ring-1 focus:ring-accent leading-relaxed resize-none rounded-lg"
                />
                <div className="flex justify-end gap-2 pt-2 border-t border-border-subtle">
                  <button onClick={() => setIsEditing(false)} className="btn-ghost">Cancel</button>
                  <button onClick={handleSave} className="btn-primary">
                    <Save className="w-3.5 h-3.5" /> Save
                  </button>
                </div>
              </div>
            ) : activeNote ? (
              <div className="space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                    <div>
                      <h2 className="text-sm font-bold text-text-primary">{activeNote.title}</h2>
                      <span className="text-xxs font-medium text-accent">{activeNote.topicTitle}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => { setTitle(activeNote.title); setTopicId(activeNote.topicId); setContent(activeNote.content); setIsEditing(true); }}
                        className="btn-ghost p-2" title="Edit"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(activeNote.id)} className="btn-ghost p-2 hover:text-accent-rose" title="Delete">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="font-mono text-xs text-text-secondary whitespace-pre-wrap leading-relaxed">
                    {activeNote.content}
                  </div>
                </div>
                <div className="text-xxs text-text-disabled pt-3 border-t border-border-subtle">
                  Last updated: {activeNote.updatedAt}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-text-muted text-xs">
                Select or create a note.
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
