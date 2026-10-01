'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useFetchTasks } from '@/lib/hooks/useFetchTasks';
import { TaskList } from '@/components/tasks/TaskList';

function TasksContent() {
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  const { tasks, meta, loading, error, refresh } = useFetchTasks({ queryString });

  return (
    <div>
      <div className="page-header">
        <h1 className="page-greeting">All Academic Tasks</h1>
        <p className="page-subtitle">Manage and track all your academic responsibilities.</p>
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
        emptyTitle="No tasks yet"
        emptyDescription="Start by creating your first academic task."
      />
    </div>
  );
}

export default function TasksPage() {
  return (
    <Suspense>
      <TasksContent />
    </Suspense>
  );
}
