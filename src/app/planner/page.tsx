'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { StudyPlannerView } from '@/components/planner/StudyPlannerView';

export default function PlannerPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <StudyPlannerView />
      </div>
    </AppLayout>
  );
}
