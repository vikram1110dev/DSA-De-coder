'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ReminderManager } from '@/components/reminders/ReminderManager';

export default function RemindersPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <ReminderManager />
      </div>
    </AppLayout>
  );
}
