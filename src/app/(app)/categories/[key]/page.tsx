'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFetchTasks } from '@/lib/hooks/useFetchTasks';
import { TaskList } from '@/components/tasks/TaskList';

const VALID_CATEGORIES = ['college', 'assignment', 'personal', 'project', 'exam'];
const CATEGORY_LABELS: Record<string, { label: string; icon: string }> = {
  college:    { label: 'College',    icon: '🏫' },
  assignment: { label: 'Assignment', icon: '📝' },
  personal:   { label: 'Personal',   icon: '👤' },
  project:    { label: 'Project',    icon: '💼' },
  exam:       { label: 'Exam',       icon: '📚' },
};

function CategoryDetailContent({ categoryKey }: { categoryKey: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryString = `category=${categoryKey}&${searchParams.toString()}`;
  const { tasks, meta, loading, error, refresh } = useFetchTasks({ queryString });

  useEffect(() => {
    if (!VALID_CATEGORIES.includes(categoryKey)) {
      router.push('/categories');
    }
  }, [categoryKey, router]);

  if (!VALID_CATEGORIES.includes(categoryKey)) return null;

  const config = CATEGORY_LABELS[categoryKey];

  return (
    <div>
      <div className="page-header">
        <button className="btn btn-ghost btn-sm" onClick={() => router.push('/categories')} style={{ marginBottom: '8px', gap: '6px' }}>
          ← Back to Categories
        </button>
        <h1 className="page-greeting">{config.icon} {config.label} Tasks</h1>
        <p className="page-subtitle">All tasks in the {config.label} category.</p>
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
        defaultCategory={categoryKey}
        emptyTitle={`No ${config.label} tasks`}
        emptyDescription={`You haven't created any ${config.label.toLowerCase()} tasks yet.`}
      />
    </div>
  );
}

export default function CategoryDetailPage({ params }: { params: { key: string } }) {
  return (
    <Suspense>
      <CategoryDetailContent categoryKey={params.key} />
    </Suspense>
  );
}
