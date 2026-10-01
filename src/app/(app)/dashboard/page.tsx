'use client';

import { useEffect, useState } from 'react';
import { Plus, TrendingUp, CheckCircle, Clock, AlertTriangle, Calendar } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { TaskCard, TaskCardSkeleton } from '@/components/tasks/TaskCard';
import { TaskModal } from '@/components/tasks/TaskModal';
import { DeleteConfirmModal } from '@/components/tasks/DeleteConfirmModal';
import type { Task, TaskSummary } from '@/types';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

function SummaryCardSkeleton() {
  return (
    <div className="summary-card">
      <div className="skeleton" style={{ width: '40px', height: '40px', borderRadius: '10px', marginBottom: '12px' }} />
      <div className="skeleton" style={{ width: '60px', height: '28px', borderRadius: '6px', marginBottom: '6px' }} />
      <div className="skeleton" style={{ width: '80px', height: '14px', borderRadius: '6px' }} />
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<TaskSummary | null>(null);
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [deleteTask, setDeleteTask] = useState<Task | null>(null);
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function fetchSummary() {
    try {
      const res = await fetch('/api/tasks/summary');
      if (res.ok) setSummary((await res.json()).data);
    } finally {
      setLoadingSummary(false);
    }
  }

  async function fetchTasks() {
    try {
      const res = await fetch('/api/tasks?sort=priority&order=desc&limit=8');
      if (res.ok) setTasks((await res.json()).data);
    } finally {
      setLoadingTasks(false);
    }
  }

  useEffect(() => {
    fetchSummary();
    fetchTasks();
  }, []);

  const handleRefresh = () => { fetchSummary(); fetchTasks(); };

  const handleComplete = async (task: Task) => {
    setCompletingId(task.id);
    try {
      await fetch(`/api/tasks/${task.id}/complete`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: task.status !== 'completed' }),
      });
      handleRefresh();
    } finally { setCompletingId(null); }
  };

  const handleDelete = async () => {
    if (!deleteTask) return;
    setDeletingId(deleteTask.id);
    try {
      await fetch(`/api/tasks/${deleteTask.id}`, { method: 'DELETE' });
      setDeleteTask(null);
      handleRefresh();
    } finally { setDeletingId(null); }
  };

  const todayProgress = summary && summary.today > 0
    ? Math.round((summary.completed / summary.today) * 100)
    : 0;

  const todayTotal = summary?.today || 0;
  const todayCompleted = summary
    ? Math.min(summary.completed, todayTotal)
    : 0;

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-greeting">
              {getGreeting()}, {user?.name?.split(' ')[0] || 'Student'} 👋
            </h1>
            <p className="page-subtitle">Here&apos;s what&apos;s happening with your academic tasks today.</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setCreateOpen(true)}
            id="dashboard-create-task-btn"
          >
            <Plus size={18} /> Add Task
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-grid">
        {loadingSummary ? (
          [1,2,3,4].map(i => <SummaryCardSkeleton key={i} />)
        ) : (
          <>
            <div className="summary-card">
              <div className="summary-card-icon primary"><TrendingUp size={20} /></div>
              <div className="summary-card-value">{summary?.total ?? 0}</div>
              <div className="summary-card-label">Total Tasks</div>
            </div>
            <div className="summary-card">
              <div className="summary-card-icon success"><CheckCircle size={20} /></div>
              <div className="summary-card-value">{summary?.completed ?? 0}</div>
              <div className="summary-card-label">Completed</div>
            </div>
            <div className="summary-card">
              <div className="summary-card-icon warning"><Clock size={20} /></div>
              <div className="summary-card-value">{summary?.in_progress ?? 0}</div>
              <div className="summary-card-label">In Progress</div>
            </div>
            <div className="summary-card">
              <div className="summary-card-icon danger"><AlertTriangle size={20} /></div>
              <div className="summary-card-value">{summary?.overdue ?? 0}</div>
              <div className="summary-card-label">Overdue</div>
            </div>
          </>
        )}
      </div>

      {/* Today's Progress */}
      {!loadingSummary && (
        <div className="today-progress-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', position: 'relative', zIndex: 1 }}>
            <div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', fontWeight: 600, marginBottom: '4px' }}>
                <Calendar size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                Today&apos;s Progress
              </div>
              <div className="today-progress-percentage">
                {todayTotal === 0 ? '—' : `${todayProgress}%`}
              </div>
            </div>
            <div style={{ textAlign: 'right', position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: '24px', fontWeight: 800, color: 'white' }}>{todayCompleted}/{todayTotal}</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)' }}>tasks completed today</div>
            </div>
          </div>
          <div
            className="today-progress-bar"
            role="progressbar"
            aria-valuenow={todayProgress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Today's progress: ${todayProgress}%`}
            style={{ position: 'relative', zIndex: 1 }}
          >
            <div className="today-progress-bar-fill" style={{ width: `${todayTotal === 0 ? 0 : todayProgress}%` }} />
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', position: 'relative', zIndex: 1 }}>
            {summary?.completed_this_month ?? 0} tasks completed this month 🎉
          </div>
        </div>
      )}

      {/* Priority Task List */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Priority Tasks</h2>
          <a href="/tasks" className="btn btn-sm btn-secondary">View All</a>
        </div>

        {loadingTasks ? (
          <div className="task-list">
            {[1,2,3].map(i => <TaskCardSkeleton key={i} />)}
          </div>
        ) : !tasks || tasks.length === 0 ? (
          <div className="empty-state" style={{ padding: '40px 24px' }}>
            <div className="empty-state-icon">
              <span style={{ fontSize: '32px' }}>🎉</span>
            </div>
            <h3 className="empty-state-title">All caught up!</h3>
            <p className="empty-state-description">No pending tasks. Create a new task to get started.</p>
            <button className="btn btn-primary" onClick={() => setCreateOpen(true)}>
              <Plus size={16} /> Add Task
            </button>
          </div>
        ) : (
          <div className="task-list">
            {tasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={handleComplete}
                onEdit={setEditTask}
                onDelete={setDeleteTask}
                completing={completingId === task.id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {createOpen && (
        <TaskModal mode="create" onClose={() => setCreateOpen(false)} onSuccess={() => { setCreateOpen(false); handleRefresh(); }} />
      )}
      {editTask && (
        <TaskModal mode="edit" task={editTask} onClose={() => setEditTask(null)} onSuccess={() => { setEditTask(null); handleRefresh(); }} />
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
