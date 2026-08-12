'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { AIMentorChat } from '@/components/ai/AIMentorChat';
import { AICodeExplainer } from '@/components/ai/AICodeExplainer';

export default function AIChatPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <AIMentorChat />
        <div className="pt-6 border-t border-slate-800">
          <AICodeExplainer />
        </div>
      </div>
    </AppLayout>
  );
}
