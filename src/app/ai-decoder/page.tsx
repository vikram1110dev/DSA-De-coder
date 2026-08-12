'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { AIDecoderStudio } from '@/components/ai/AIDecoderStudio';

function AIDecoderContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  return (
    <div className="space-y-6">
      <AIDecoderStudio initialQuery={initialQuery} />
    </div>
  );
}

export default function AIDecoderPage() {
  return (
    <AppLayout>
      <Suspense fallback={<div className="p-8 text-center text-slate-500 text-xs">Loading AI Studio...</div>}>
        <AIDecoderContent />
      </Suspense>
    </AppLayout>
  );
}
