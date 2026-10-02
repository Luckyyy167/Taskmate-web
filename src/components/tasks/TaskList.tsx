'use client';

import { useState, useCallback } from 'react';
import { Plus, Search } from 'lucide-react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { NotificationBell } from '@/components/layout/NotificationBell';
import { TaskCard, TaskCardSkeleton } from './TaskCard';
import { TaskModal } from './TaskModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import type { Task, TaskListResult } from '@/types';

interface TaskListProps {
  tasks: Task[] | null;
  loading?: boolean;
  error?: string;
  meta?: TaskListResult['meta'];
  onRefresh: () => void;
  showSearch?: boolean;
  showFilters?: boolean;
  showCreate?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  defaultCategory?: string;
}

export function TaskList({
  tasks,
  loading,
  error,
  meta,
  onRefresh,
  showSearch = true,
  showFilters = true,
  showCreate = true,
  emptyTitle = 'No tasks found',
  emptyDescription = 'Create your first task to get started.',
  defaultCategory,
}: TaskListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [createOpen, setCreateOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [deleteTask, setDeleteTask] = useState<Task | null>(null);
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const updateParam = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    if (key !== 'page') params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  }, [pathname, router, searchParams]);

  const handleComplete = async (task: Task) => {
    setCompletingId(task.id);
    try {
      await fetch(`/api/tasks/${task.id}/complete`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: task.status !== 'completed' }),
      });
      onRefresh();
    } finally {
      setCompletingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTask) return;
    setDeletingId(deleteTask.id);
    try {
      await fetch(`/api/tasks/${deleteTask.id}`, { method: 'DELETE' });
      setDeleteTask(null);
      onRefresh();
    } finally {
      setDeletingId(null);
    }
  };

  const currentPage = parseInt(searchParams.get('page') || '1');
  const totalPages = meta?.total_pages || 1;

  return (
    <div>
      {/* Filter Toolbar */}
      {(showSearch || showFilters || showCreate) && (
        <div className="filter-toolbar">
          {showSearch && (
            <div className="search-input-wrapper">
              <Search size={15} className="search-input-icon" aria-hidden="true" />
              <input
                type="search"
                className="search-input"
                placeholder="Search tasks..."
                defaultValue={searchParams.get('q') || ''}
                onChange={(e) => updateParam('q', e.target.value)}
                aria-label="Search tasks"
                id="task-search"
              />
            </div>
          )}

          {showFilters && (
            <>
              <select
                className="filter-select"
                value={searchParams.get('status') || ''}
                onChange={(e) => updateParam('status', e.target.value)}
                aria-label="Filter by status"
              >
                <option value="">All Status</option>
                <option value="todo">Todo</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
              </select>

              <select
                className="filter-select"
                value={searchParams.get('priority') || ''}
                onChange={(e) => updateParam('priority', e.target.value)}
                aria-label="Filter by priority"
              >
                <option value="">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              <select
                className="filter-select"
                value={searchParams.get('category') || ''}
                onChange={(e) => updateParam('category', e.target.value)}
                aria-label="Filter by category"
              >
                <option value="">All Categories</option>
                <option value="college">College</option>
                <option value="assignment">Assignment</option>
                <option value="personal">Personal</option>
                <option value="project">Project</option>
                <option value="exam">Exam</option>
              </select>

              <select
                className="filter-select"
                value={`${searchParams.get('sort') || 'due_date'}-${searchParams.get('order') || 'asc'}`}
                onChange={(e) => {
                  const [sort, order] = e.target.value.split('-');
                  const params = new URLSearchParams(searchParams.toString());
                  params.set('sort', sort);
                  params.set('order', order);
                  router.push(`${pathname}?${params.toString()}`);
                }}
                aria-label="Sort tasks"
              >
                <option value="due_date-asc">Due Date ↑</option>
                <option value="due_date-desc">Due Date ↓</option>
                <option value="priority-desc">Priority (High first)</option>
                <option value="priority-asc">Priority (Low first)</option>
                <option value="created_at-desc">Newest first</option>
                <option value="created_at-asc">Oldest first</option>
                <option value="status-asc">Status</option>
              </select>
            </>
          )}

          {showCreate && (
            <div className="header-actions" style={{ marginLeft: 'auto' }}>
              <NotificationBell />
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setCreateOpen(true)}
                id="create-task-btn"
              >
                <Plus size={16} /> Add Task
              </button>
            </div>
          )}
        </div>
      )}

      {/* Task list */}
      {loading ? (
        <div className="task-list">
          {[1, 2, 3, 4].map(i => <TaskCardSkeleton key={i} />)}
        </div>
      ) : error ? (
        <div className="empty-state">
          <div className="empty-state-icon" style={{ background: 'var(--color-danger-bg)', color: 'var(--color-danger)' }}>
            <span style={{ fontSize: '28px' }}>⚠️</span>
          </div>
          <h3 className="empty-state-title">Something went wrong</h3>
          <p className="empty-state-description">{error}</p>
          <button className="btn btn-primary" onClick={onRefresh}>Try Again</button>
        </div>
      ) : !tasks || tasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <span style={{ fontSize: '32px' }}>📋</span>
          </div>
          <h3 className="empty-state-title">{emptyTitle}</h3>
          <p className="empty-state-description">{emptyDescription}</p>
          {showCreate && (
            <button className="btn btn-primary" onClick={() => setCreateOpen(true)}>
              <Plus size={16} /> Create Your First Task
            </button>
          )}
        </div>
      ) : (
        <>
          {meta && (
            <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
              {meta.total} task{meta.total !== 1 ? 's' : ''}
            </div>
          )}
          <div className="task-list" role="list">
            {tasks.map(task => (
              <div key={task.id} role="listitem">
                <TaskCard
                  task={task}
                  onComplete={handleComplete}
                  onEdit={setEditTask}
                  onDelete={setDeleteTask}
                  completing={completingId === task.id}
                />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {meta && meta.total_pages > 1 && (
            <div className="pagination">
              <span className="pagination-info">
                Showing {(meta.page - 1) * meta.limit + 1}–{Math.min(meta.page * meta.limit, meta.total)} of {meta.total}
              </span>
              <div className="pagination-controls">
                <button
                  className="pagination-btn"
                  onClick={() => updateParam('page', String(currentPage - 1))}
                  disabled={currentPage <= 1}
                  aria-label="Previous page"
                >
                  ‹
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      className={`pagination-btn${currentPage === page ? ' active' : ''}`}
                      onClick={() => updateParam('page', String(page))}
                      aria-label={`Page ${page}`}
                      aria-current={currentPage === page ? 'page' : undefined}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  className="pagination-btn"
                  onClick={() => updateParam('page', String(currentPage + 1))}
                  disabled={currentPage >= totalPages}
                  aria-label="Next page"
                >
                  ›
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      {createOpen && (
        <TaskModal
          mode="create"
          defaultCategory={defaultCategory}
          onClose={() => setCreateOpen(false)}
          onSuccess={() => { setCreateOpen(false); onRefresh(); }}
        />
      )}

      {editTask && (
        <TaskModal
          mode="edit"
          task={editTask}
          onClose={() => setEditTask(null)}
          onSuccess={() => { setEditTask(null); onRefresh(); }}
        />
      )}

      {deleteTask && (
        <DeleteConfirmModal
          taskTitle={deleteTask.title}
          onCancel={() => setDeleteTask(null)}
          onConfirm={handleDelete}
          loading={deletingId === deleteTask.id}
        />
      )}
    </div>
  );
}
