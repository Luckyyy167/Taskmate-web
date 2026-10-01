'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Pencil, Trash2, CheckCircle2, RotateCcw, AlertCircle, Loader2, Calendar, Clock } from 'lucide-react';
import { TaskModal } from '@/components/tasks/TaskModal';
import { DeleteConfirmModal } from '@/components/tasks/DeleteConfirmModal';
import type { Task } from '@/types';
import { formatDate, formatTime } from '@/lib/date-helpers';

const CATEGORY_LABELS: Record<string, string> = {
  college: '🏫 College', assignment: '📝 Assignment', personal: '👤 Personal',
  project: '💼 Project', exam: '📚 Exam',
};

const STATUS_LABELS: Record<string, string> = {
  todo: 'Todo', in_progress: 'In Progress', completed: 'Completed', overdue: 'Overdue',
};

export default function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [id, setId] = useState<string>('');

  useEffect(() => {
    params.then(p => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;
    async function fetchTask() {
      try {
        const res = await fetch(`/api/tasks/${id}`);
        if (res.status === 404) { setNotFound(true); return; }
        if (res.ok) {
          const json = await res.json();
          setTask(json.data?.data || json.data);
        }
      } finally { setLoading(false); }
    }
    fetchTask();
  }, [id]);

  const handleComplete = async () => {
    if (!task) return;
    setCompleting(true);
    try {
      const res = await fetch(`/api/tasks/${task.id}/complete`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: task.status !== 'completed' }),
      });
      if (res.ok) {
        const json = await res.json();
        setTask(json.data?.data || json.data);
      }
    } finally { setCompleting(false); }
  };

  const handleDelete = async () => {
    if (!task) return;
    setDeleting(true);
    try {
      await fetch(`/api/tasks/${task.id}`, { method: 'DELETE' });
      router.push('/tasks');
    } finally { setDeleting(false); }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40vh' }}>
      <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--color-primary-600)' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (notFound || !task) return (
    <div className="empty-state">
      <div className="empty-state-icon" style={{ background: 'var(--color-danger-bg)', color: 'var(--color-danger)' }}>
        <AlertCircle size={32} />
      </div>
      <h1 className="empty-state-title">Task not found</h1>
      <p className="empty-state-description">This task doesn&apos;t exist or you don&apos;t have access to it.</p>
      <button className="btn btn-primary" onClick={() => router.push('/tasks')}>Back to Tasks</button>
    </div>
  );

  const displayStatus = task.display_status || task.status;
  const isOverdue = displayStatus === 'overdue';
  const isCompleted = task.status === 'completed';

  return (
    <div style={{ maxWidth: '720px' }}>
      {/* Back button */}
      <button className="btn btn-ghost btn-sm" onClick={() => router.back()} style={{ marginBottom: '20px', gap: '6px' }}>
        <ArrowLeft size={16} /> Back
      </button>

      {/* Header */}
      <div className="card" style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: '12px', lineHeight: 1.3, textDecoration: isCompleted ? 'line-through' : 'none' }}>
              {task.title}
            </h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
              <span className={`badge badge-${displayStatus.replace('_', '-')}`}>{STATUS_LABELS[displayStatus]}</span>
              <span className={`badge badge-${task.priority}`}>{task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority</span>
              <span className={`badge badge-${task.category}`}>{CATEGORY_LABELS[task.category] || task.category}</span>
            </div>
            {task.description && (
              <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>{task.description}</p>
            )}
          </div>
          <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setEditOpen(true)}>
              <Pencil size={14} /> Edit
            </button>
            <button className="btn btn-secondary btn-sm" style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }} onClick={() => setDeleteOpen(true)}>
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>

        {/* Complete button */}
        <div style={{ borderTop: '1px solid var(--color-border-soft)', paddingTop: '16px', marginTop: '4px' }}>
          <button
            className={`btn ${isCompleted ? 'btn-secondary' : 'btn-success'}`}
            onClick={handleComplete}
            disabled={completing}
            id="task-complete-btn"
          >
            {completing ? (
              <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Updating...</>
            ) : isCompleted ? (
              <><RotateCcw size={16} /> Reopen Task</>
            ) : (
              <><CheckCircle2 size={16} /> Mark as Complete</>
            )}
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="card">
        <h2 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px', color: 'var(--color-text-primary)' }}>Task Details</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Due Date</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 600, color: isOverdue ? 'var(--color-danger)' : 'var(--color-text-primary)' }}>
              {isOverdue && <AlertCircle size={14} />}
              <Calendar size={14} />
              {formatDate(task.due_date)}
            </div>
          </div>
          {task.due_time && (
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Due Time</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 600 }}>
                <Clock size={14} /> {formatTime(task.due_time)}
              </div>
            </div>
          )}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Created</div>
            <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
              {new Date(task.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
          {task.completed_at && (
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Completed</div>
              <div style={{ fontSize: '14px', color: 'var(--color-success)', fontWeight: 600 }}>
                ✓ {new Date(task.completed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          )}
        </div>

        {/* Progress */}
        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--color-border-soft)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Progress</span>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-primary-600)' }}>{task.progress ?? 0}%</span>
          </div>
          <div className="progress-bar-container" role="progressbar" aria-valuenow={task.progress ?? 0} aria-valuemin={0} aria-valuemax={100}>
            <div className={`progress-bar-fill${isOverdue ? ' danger' : isCompleted ? ' success' : ''}`} style={{ width: `${task.progress ?? 0}%` }} />
          </div>
        </div>
      </div>

      {/* Modals */}
      {editOpen && (
        <TaskModal mode="edit" task={task} onClose={() => setEditOpen(false)} onSuccess={() => {
          setEditOpen(false);
          fetch(`/api/tasks/${task.id}`).then(r => r.json()).then(json => setTask(json.data?.data || json.data));
        }} />
      )}
      {deleteOpen && (
        <DeleteConfirmModal taskTitle={task.title} onCancel={() => setDeleteOpen(false)} onConfirm={handleDelete} loading={deleting} />
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
