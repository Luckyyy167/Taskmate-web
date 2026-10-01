'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useFetchTasks } from '@/lib/hooks/useFetchTasks';
import { TaskList } from '@/components/tasks/TaskList';

function TodayContent() {
  const searchParams = useSearchParams();
  const base = `view=today&${searchParams.toString()}`;
  const { tasks, meta, loading, error, refresh } = useFetchTasks({ queryString: base });

  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div>
      <div className="page-header">
        <h1 className="page-greeting">Today Tasks 📅</h1>
        <p className="page-subtitle">{todayStr}</p>
      </div>

      {/* Today's quick stats */}
      {tasks && (
        <div className="card" style={{ marginBottom: '20px', background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)', border: '1px solid var(--color-primary-100)' }}>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-primary-600)' }}>{tasks.length}</div>
              <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Total Today</div>
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-success)' }}>
                {tasks.filter(t => t.status === 'completed').length}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Completed</div>
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-danger)' }}>
                {tasks.filter(t => t.display_status === 'overdue').length}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Overdue</div>
            </div>
          </div>
        </div>
      )}

      <TaskList
        tasks={tasks}
        meta={meta}
        loading={loading}
        error={error}
        onRefresh={refresh}
        showSearch
        showFilters
        showCreate
        emptyTitle="No tasks for today"
        emptyDescription="You have a free day! Or add tasks that are due today."
      />
    </div>
  );
}

export default function TodayPage() {
  return <Suspense><TodayContent /></Suspense>;
}
