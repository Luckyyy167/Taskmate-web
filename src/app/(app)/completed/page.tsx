'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Trophy } from 'lucide-react';
import { useFetchTasks } from '@/lib/hooks/useFetchTasks';
import { TaskList } from '@/components/tasks/TaskList';

function CompletedContent() {
  const searchParams = useSearchParams();
  const base = `view=completed&sort=completed_at&order=desc&${searchParams.toString()}`;
  const { tasks, meta, loading, error, refresh } = useFetchTasks({ queryString: base });
  const [monthCount, setMonthCount] = useState<number>(0);

  useEffect(() => {
    fetch('/api/tasks/summary').then(r => r.json()).then(json => {
      setMonthCount(json.data?.completed_this_month ?? 0);
    }).catch(() => {});
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-greeting">Completed Tasks ✅</h1>
        <p className="page-subtitle">History of all your finished academic work.</p>
      </div>

      {/* Achievement banner */}
      {monthCount > 0 && (
        <div className="card" style={{ marginBottom: '20px', background: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)', border: '1px solid #A7F3D0', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '44px', height: '44px', background: 'var(--color-success)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Trophy size={22} color="white" />
          </div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-success)' }}>
              You completed {monthCount} task{monthCount !== 1 ? 's' : ''} this month! 🎉
            </div>
            <div style={{ fontSize: '13px', color: '#065F46' }}>Keep up the great work on your academic goals.</div>
          </div>
        </div>
      )}

      <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: 'var(--color-text-primary)' }}>
        Finished Tasks History
      </h2>

      <TaskList
        tasks={tasks}
        meta={meta}
        loading={loading}
        error={error}
        onRefresh={refresh}
        showSearch
        showFilters={false}
        showCreate={false}
        emptyTitle="No completed tasks yet"
        emptyDescription="Complete your first task to see it here. You're making progress!"
      />
    </div>
  );
}

export default function CompletedPage() {
  return <Suspense><CompletedContent /></Suspense>;
}
