'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AIMode, DSALevel } from '@/types';
import {
  MessageSquareCode,
  Send,
  Sparkles,
  Bot,
  User,
  Lightbulb,
  GraduationCap,
  Briefcase,
  Terminal,
  RotateCcw
} from 'lucide-react';
import { clsx } from 'clsx';
import { storageService } from '@/lib/storage';

interface ChatMsg {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const AIMentorChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello Vikram! 👋 I'm your **AI DSA Mentor** powered by Google Gemini.\n\nI can help you:\n- 🧠 **Explain concepts intuitively** with real-world analogies\n- 💡 **Give progressive hints** without spoiling solutions\n- ⚡ **Analyze time and space complexity** step by step\n- 🔄 **Convert code** between JavaScript, Python, Java, and C++\n\nWhat would you like to explore today?`,
      timestamp: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<AIMode>('standard');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim()) return;

    const userMsg: ChatMsg = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
          context: {
            topic: 'DSA Overview',
            level: 'beginner',
            language: 'javascript',
            mode
          }
        })
      });

      const data = await res.json();
      const botMsg: ChatMsg = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'I processed your query. Let me know if you need deeper clarity!',
        timestamp: 'Just now'
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([messages[0]]);
  };

  return (
    <div className="flex flex-col h-[78vh] surface border border-border-default rounded-3xl overflow-hidden shadow-2xl">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-border-default bg-bg-surface/70 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-accent to-accent-violet flex items-center justify-center text-white font-black shadow-lg shadow-accent/20">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
              DSA Mentor AI
              <span className="w-2 h-2 rounded-full bg-state-success animate-pulse" />
            </h2>
            <p className="text-[11px] text-text-secondary">Personalized algorithm mentor & tutor</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-bg-inset p-1 rounded-xl border border-border-default">
            {(['beginner', 'standard', 'deep-dive', 'interview'] as AIMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={clsx(
                  'px-2.5 py-1 text-[11px] font-bold rounded-lg capitalize transition-colors',
                  mode === m
                    ? 'bg-accent text-white shadow-sm'
                    : 'text-text-muted hover:text-text-primary'
                )}
              >
                {m === 'deep-dive' ? 'Deep Dive' : m}
              </button>
            ))}
          </div>

          <button
            onClick={handleClear}
            className="p-2 text-text-muted hover:text-text-primary bg-bg-inset hover:bg-bg-secondary rounded-xl transition-colors border border-border-default"
            title="Reset Conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-bg-surface relative">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={clsx(
              'flex gap-4 max-w-[85%] animate-in slide-in-from-bottom-2',
              msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
            )}
          >
            <div
              className={clsx(
                'flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center shadow-md',
                msg.role === 'user'
                  ? 'bg-accent text-white'
                  : 'bg-accent/20 border border-accent/30 text-accent'
              )}
            >
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={clsx(
                'px-5 py-4 rounded-2xl text-[13px] leading-relaxed relative group',
                msg.role === 'user'
                  ? 'bg-accent text-white rounded-tr-none'
                  : 'surface border border-border-default text-text-primary rounded-tl-none shadow-sm'
              )}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>
              <div
                className={clsx(
                  'text-[9px] mt-2 font-medium opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-5',
                  msg.role === 'user' ? 'right-1 text-text-muted' : 'left-1 text-text-muted'
                )}
              >
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-4 max-w-[80%] animate-in fade-in">
            <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-accent/20 border border-accent/30 text-accent flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="px-5 py-4 rounded-2xl bg-bg-inset border border-border-default text-text-primary rounded-tl-none flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce delay-75" />
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce delay-150" />
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      <div className="p-4 border-t border-border-default bg-bg-surface z-10">
        <div className="flex gap-2 overflow-x-auto pb-3 custom-scrollbar">
          <span className="text-[10px] font-bold text-text-secondary px-2 py-1 uppercase tracking-wider">
            Suggestions:
          </span>
          {[
            'Explain recursion with a simple analogy',
            'Why does binary search require sorted data?',
            'Give me a progressive hint for 3Sum',
            'How does sliding window achieve O(N)?'
          ].map((suggestion, i) => (
            <button
              key={i}
              onClick={() => handleSend(suggestion)}
              className="text-[11px] whitespace-nowrap px-3 py-1.5 rounded-full bg-bg-inset border border-border-default text-text-muted hover:text-text-primary hover:border-accent/40 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative flex items-end gap-2"
        >
          <div className="flex-1 relative bg-bg-inset border border-border-default focus-within:border-accent rounded-2xl transition-colors">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask your DSA mentor anything... (e.g. 'Explain recursion trees', 'Debug my loop')"
              className="w-full bg-transparent p-4 text-xs text-text-primary placeholder:text-text-muted focus:outline-none resize-none custom-scrollbar"
              rows={1}
              style={{ minHeight: '52px', maxHeight: '120px' }}
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="w-[52px] h-[52px] flex-shrink-0 flex items-center justify-center rounded-2xl bg-accent hover:bg-accent-muted disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all shadow-md"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
