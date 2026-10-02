'use client';

import { useState } from 'react';
import { Check, AlertCircle, Pencil, Trash2, RotateCcw, Link as LinkIcon } from 'lucide-react';
import type { Task } from '@/types';
import { formatDate, formatTime, getRelativeDate } from '@/lib/date-helpers';
import Link from 'next/link';

const CATEGORY_LABELS: Record<string, string> = {
  college: 'College',
  assignment: 'Assignment',
  personal: 'Personal',
  project: 'Project',
  exam: 'Exam',
};

const PRIORITY_LABELS: Record<string, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

const STATUS_LABELS: Record<string, string> = {
  todo: 'Todo',
  in_progress: 'In Progress',
  completed: 'Completed',
  overdue: 'Overdue',
};

interface TaskCardProps {
  task: Task;
  onComplete?: (task: Task) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  completing?: boolean;
}

export function TaskCard({ task, onComplete, onEdit, onDelete, completing }: TaskCardProps) {
  const displayStatus = task.display_status || task.status;
  const isOverdue = displayStatus === 'overdue';
  const isCompleted = task.status === 'completed';

  return (
    <article
      className={`task-card${isOverdue ? ' overdue' : ''}${isCompleted ? ' completed' : ''}`}
      aria-label={`Task: ${task.title}`}
    >
      {/* Checkbox */}
      {onComplete && (
        <button
          className={`task-checkbox${isCompleted ? ' checked' : ''}`}
          onClick={() => onComplete(task)}
          disabled={completing}
          aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
          title={isCompleted ? 'Reopen task' : 'Complete task'}
        >
          {isCompleted && <Check size={12} color="white" strokeWidth={3} />}
        </button>
      )}

      {/* Body */}
      <div className="task-body">
        <Link href={`/tasks/${task.id}`} className="task-title" style={{ display: 'block', color: 'var(--color-text-primary)' }}>
          <h3
            className={`task-title${isCompleted ? ' completed' : ''}`}
            style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px', display: 'block' }}
          >
            {task.title}
          </h3>
        </Link>

        {task.description && (
          <p className="task-description">{task.description}</p>
        )}

        {task.reference_url && (
          <div style={{ marginBottom: '8px' }}>
            <a
              href={task.reference_url}
              target="_blank"
              rel="noopener noreferrer"
              className="task-reference-link"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--color-primary)', background: 'var(--color-primary-soft, #e0e7ff)', padding: '4px 8px', borderRadius: '6px', textDecoration: 'none', fontWeight: 600 }}
              onClick={(e) => e.stopPropagation()}
            >
              <LinkIcon size={12} />
              Open Attachment
            </a>
          </div>
        )}

        <div className="task-meta">
          {/* Due date */}
          <span className={`task-meta-item${isOverdue ? ' overdue' : ''}`} style={isOverdue ? { color: 'var(--color-danger)' } : {}}>
            {isOverdue && <AlertCircle size={12} />}
            📅 {getRelativeDate(task.due_date)}
            {task.due_time && ` · ${formatTime(task.due_time)}`}
          </span>

          {/* Category */}
          <span className={`badge badge-${task.category}`}>
            {CATEGORY_LABELS[task.category] || task.category}
          </span>

          {/* Priority */}
          <span className={`badge badge-${task.priority}`}>
            {PRIORITY_LABELS[task.priority] || task.priority}
          </span>

          {/* Status */}
          <span className={`badge badge-${displayStatus.replace('_', '-')}`}>
            {STATUS_LABELS[displayStatus] || displayStatus}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="task-actions" role="group" aria-label="Task actions">
        {isCompleted && onComplete ? (
          <button
            className="btn-icon"
            onClick={() => onComplete(task)}
            aria-label="Reopen task"
            title="Reopen"
            disabled={completing}
            style={{ color: 'var(--color-text-muted)' }}
          >
            <RotateCcw size={15} />
          </button>
        ) : null}
        {onEdit && (
          <button
            className="btn-icon"
            onClick={() => onEdit(task)}
            aria-label="Edit task"
            title="Edit"
          >
            <Pencil size={15} />
          </button>
        )}
        {onDelete && (
          <button
            className="btn-icon"
            onClick={() => onDelete(task)}
            aria-label="Delete task"
            title="Delete"
            style={{ color: 'var(--color-danger)' }}
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>
    </article>
  );
}

export function TaskCardSkeleton() {
  return (
    <div className="skeleton-card">
      <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
        <div className="skeleton" style={{ width: '20px', height: '20px', borderRadius: '6px', flexShrink: 0 }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div className="skeleton" style={{ height: '16px', width: '60%', borderRadius: '6px' }} />
          <div className="skeleton" style={{ height: '12px', width: '40%', borderRadius: '6px' }} />
          <div style={{ display: 'flex', gap: '8px' }}>
            <div className="skeleton" style={{ height: '20px', width: '80px', borderRadius: '9999px' }} />
            <div className="skeleton" style={{ height: '20px', width: '60px', borderRadius: '9999px' }} />
            <div className="skeleton" style={{ height: '20px', width: '70px', borderRadius: '9999px' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
