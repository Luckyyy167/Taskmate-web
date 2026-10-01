'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useFetchTasks } from '@/lib/hooks/useFetchTasks';
import { TaskList } from '@/components/tasks/TaskList';

function UpcomingContent() {
  const searchParams = useSearchParams();
  const base = `view=upcoming&${searchParams.toString()}`;
  const { tasks, meta, loading, error, refresh } = useFetchTasks({ queryString: base });

  return (
    <div>
      <div className="page-header">
        <h1 className="page-greeting">Upcoming Tasks 🗓️</h1>
        <p className="page-subtitle">Tasks due in the future — plan ahead and stay prepared.</p>
      </div>
      <TaskList
        tasks={tasks}
        meta={meta}
        loading={loading}
        error={error}
        onRefresh={refresh}
        showSearch
        showFilters
        showCreate
        emptyTitle="No upcoming tasks"
        emptyDescription="Start planning your academic responsibilities."
      />
    </div>
  );
}

export default function UpcomingPage() {
  return <Suspense><UpcomingContent /></Suspense>;
}
