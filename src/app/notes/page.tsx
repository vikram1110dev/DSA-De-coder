'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { NoteItem } from '@/types';
import { storageService } from '@/lib/storage';
import { StickyNote, Plus, Trash2, Edit3, Save, Sparkles } from 'lucide-react';
import { DSA_TOPICS } from '@/data/topics';

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
      // Seed initial note
      const initial: NoteItem = {
        id: 'note_binary_search',
        topicId: 'binary-search-algorithm',
        topicTitle: 'Binary Search',
        title: 'Binary Search Invariant Rules',
        content: `### Important Invariants:
1. **Midpoint Overflow Protection**: Always use \`mid = low + (high - low) / 2\` instead of \`(low + high) / 2\`.
2. **Loop Boundary**: \`while (low <= high)\` handles single-element arrays correctly.
3. **Sorted Requirement**: Array MUST be sorted monotonically, or predicate must have FFF...TTT structure.`,
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

  const handleSelectNote = (n: NoteItem) => {
    setActiveNote(n);
    setIsEditing(false);
  };

  const handleCreateNew = () => {
    setTitle('New Note');
    setTopicId(DSA_TOPICS[0].id);
    setContent('Write your algorithm notes, tricky edge cases, and patterns here...');
    setIsEditing(true);
    setActiveNote(null);
  };

  const handleSave = () => {
    if (!title.trim()) return;
    const selectedTopic = DSA_TOPICS.find((t) => t.id === topicId) || DSA_TOPICS[0];

    const noteToSave: NoteItem = {
      id: activeNote ? activeNote.id : `note_${Date.now()}`,
      topicId,
      topicTitle: selectedTopic.title,
      title,
      content,
      updatedAt: 'Just now'
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
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-6 sm:p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
              <StickyNote className="w-4 h-4" />
              <span>Personal Study Notebook</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              DSA Topic Notes & Cheat Sheets
            </h1>
            <p className="text-xs text-slate-400">
              Record key invariants, base cases, and interview reminders per topic.
            </p>
          </div>

          <button
            onClick={handleCreateNew}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-all shadow-md shadow-cyan-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Note</span>
          </button>
        </div>

        {/* Notebook Master-Detail Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Notes Sidebar List */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl space-y-2 h-[560px] overflow-y-auto custom-scrollbar">
            {notes.map((n) => (
              <button
                key={n.id}
                onClick={() => handleSelectNote(n)}
                className={`w-full text-left p-3.5 rounded-2xl transition-all space-y-1 ${
                  activeNote?.id === n.id && !isEditing
                    ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-200'
                    : 'bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white truncate">{n.title}</span>
                  <span className="text-[10px] text-slate-500">{n.updatedAt}</span>
                </div>
                <div className="text-[11px] text-cyan-400 font-semibold">{n.topicTitle}</div>
              </button>
            ))}
          </div>

          {/* Note Editor / Viewer Pane */}
          <div className="md:col-span-2 p-6 bg-slate-950 border border-slate-800 rounded-3xl space-y-4 shadow-2xl h-[560px] flex flex-col justify-between overflow-y-auto custom-scrollbar">
            {isEditing ? (
              <div className="space-y-4 flex-1 flex flex-col">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Note Title..."
                    className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                  <select
                    value={topicId}
                    onChange={(e) => setTopicId(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
                  >
                    {DSA_TOPICS.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title}
                      </option>
                    ))}
                  </select>
                </div>

                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your markdown algorithm notes here..."
                  className="w-full flex-1 min-h-[300px] bg-slate-900 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-slate-200 focus:outline-none focus:border-cyan-500 leading-relaxed resize-none"
                />

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-slate-950 bg-cyan-400 rounded-xl hover:bg-cyan-300"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Note</span>
                  </button>
                </div>
              </div>
            ) : activeNote ? (
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h2 className="text-lg font-bold text-white">{activeNote.title}</h2>
                      <span className="text-xs font-semibold text-cyan-400">
                        Topic: {activeNote.topicTitle}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setTitle(activeNote.title);
                          setTopicId(activeNote.topicId);
                          setContent(activeNote.content);
                          setIsEditing(true);
                        }}
                        className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl transition-colors"
                        title="Edit Note"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(activeNote.id)}
                        className="p-2 bg-slate-900 hover:bg-rose-950/40 text-slate-500 hover:text-rose-400 rounded-xl transition-colors"
                        title="Delete Note"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {activeNote.content}
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 pt-4 border-t border-slate-900">
                  Last updated: {activeNote.updatedAt}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-xs">
                Select or create a note to begin.
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
