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
    <div className="flex flex-col h-[78vh] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-slate-800 bg-slate-950/70 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-cyan-500/20">
            <Bot className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>DSA Mentor AI</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </h3>
            <p className="text-[11px] text-slate-400">
              Personalized algorithm mentor & tutor
            </p>
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
            {(['beginner', 'standard', 'deep-dive', 'interview'] as AIMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={clsx(
                  'px-2.5 py-1 text-[11px] font-bold rounded-lg capitalize transition-colors',
                  mode === m
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                )}
              >
                {m === 'deep-dive' ? 'Deep Dive' : m}
              </button>
            ))}
          </div>

          <button
            onClick={handleClear}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl transition-colors"
            title="Reset Chat"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar bg-slate-950/40">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={clsx(
              'flex gap-3 max-w-3xl',
              msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            )}
          >
            <div
              className={clsx(
                'w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold shadow-md',
                msg.role === 'user'
                  ? 'bg-cyan-500 text-slate-950'
                  : 'bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white'
              )}
            >
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={clsx(
                'p-4 rounded-3xl text-xs leading-relaxed shadow-md',
                msg.role === 'user'
                  ? 'bg-cyan-600 text-white rounded-tr-none'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none space-y-2'
              )}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>
              <div
                className={clsx(
                  'text-[10px] pt-1 text-right',
                  msg.role === 'user' ? 'text-cyan-200' : 'text-slate-500'
                )}
              >
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 mr-auto">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-md">
              <Bot className="w-4 h-4 animate-spin-slow" />
            </div>
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl rounded-tl-none text-xs text-slate-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
              <span>Mentor is thinking...</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Suggested Prompt Quick Chips */}
      <div className="px-6 py-2 bg-slate-950/80 border-t border-slate-800 flex items-center gap-2 overflow-x-auto text-[11px] custom-scrollbar">
        <span className="text-slate-500 font-semibold shrink-0">Suggestions:</span>
        {[
          'Explain recursion with a simple analogy',
          'Why does binary search require sorted data?',
          'Give me a progressive hint for 3Sum',
          'How does sliding window achieve O(N)?'
        ].map((chip) => (
          <button
            key={chip}
            onClick={() => handleSend(chip)}
            className="px-3 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-cyan-300 rounded-xl whitespace-nowrap transition-colors"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input Composer */}
      <div className="p-4 bg-slate-950 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your DSA mentor anything... (e.g. 'Explain recursion trees', 'Debug my loop')"
            className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-5 py-3 rounded-2xl font-bold text-xs bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 hover:opacity-95 disabled:opacity-40 transition-all shadow-md shadow-cyan-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
