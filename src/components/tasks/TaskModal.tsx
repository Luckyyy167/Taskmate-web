'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Loader2, AlertCircle } from 'lucide-react';
import type { Task } from '@/types';

interface TaskModalProps {
  mode: 'create' | 'edit';
  task?: Task;
  onClose: () => void;
  onSuccess: () => void;
  defaultCategory?: string;
}

const CATEGORIES = [
  { value: 'college', label: 'College' },
  { value: 'assignment', label: 'Assignment' },
  { value: 'personal', label: 'Personal' },
  { value: 'project', label: 'Project' },
  { value: 'exam', label: 'Exam' },
];

const PRIORITIES = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const STATUSES = [
  { value: 'todo', label: 'Todo' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

type FormErrors = Record<string, string>;

export function TaskModal({ mode, task, onClose, onSuccess, defaultCategory }: TaskModalProps) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState('');
  const titleRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: task?.title || '',
    description: task?.description || '',
    due_date: task?.due_date || '',
    due_time: task?.due_time || '',
    priority: task?.priority || 'medium',
    category: task?.category || defaultCategory || 'assignment',
    status: task?.status || 'todo',
  });

  // Focus trap and initial focus
  useEffect(() => {
    titleRef.current?.focus();
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
  };

  const validate = () => {
    const errs: FormErrors = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (form.title.length > 100) errs.title = 'Title must be at most 100 characters';
    if (!form.due_date) errs.due_date = 'Due date is required';
    if (!form.category) errs.category = 'Category is required';
    if (form.description && form.description.length > 500) errs.description = 'Max 500 characters';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    setServerError('');

    try {
      const url = mode === 'create' ? '/api/tasks' : `/api/tasks/${task!.id}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const payload = {
        ...form,
        description: form.description || null,
        due_time: form.due_time || null,
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        if (json.error?.code === 'DUPLICATE_TASK') {
          setServerError('A task with the same title and due date already exists.');
        } else if (json.error?.details) {
          const fieldErrors: FormErrors = {};
          json.error.details.forEach((d: { field: string; message: string }) => {
            fieldErrors[d.field] = d.message;
          });
          setErrors(fieldErrors);
        } else {
          setServerError(json.error?.message || 'Something went wrong. Please try again.');
        }
        return;
      }

      onSuccess();
    } catch {
      setServerError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal">
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title" id="modal-title">
            {mode === 'create' ? 'Create New Academic Task' : 'Edit Task'}
          </h2>
          <button className="btn-icon" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body">
            {serverError && (
              <div className="auth-error-banner" role="alert">
                <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
                {serverError}
              </div>
            )}

            {/* Title */}
            <div className="form-group">
              <label htmlFor="task-title" className="form-label required">Task Title</label>
              <input
                ref={titleRef}
                id="task-title"
                name="title"
                type="text"
                className={`form-input${errors.title ? ' error' : ''}`}
                placeholder="e.g., Submit Database Management Report"
                value={form.title}
                onChange={handleChange}
                maxLength={100}
                aria-required="true"
                aria-invalid={!!errors.title}
                aria-describedby={errors.title ? 'title-error' : undefined}
              />
              {errors.title && (
                <span id="title-error" className="form-error" role="alert">
                  <AlertCircle size={12} /> {errors.title}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="task-description" className="form-label">Description</label>
              <textarea
                id="task-description"
                name="description"
                className={`form-textarea${errors.description ? ' error' : ''}`}
                placeholder="Add details about this task..."
                value={form.description}
                onChange={handleChange}
                maxLength={500}
                aria-describedby={errors.description ? 'desc-error' : undefined}
              />
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', textAlign: 'right' }}>
                {(form.description || '').length}/500
              </span>
              {errors.description && (
                <span id="desc-error" className="form-error" role="alert">
                  <AlertCircle size={12} /> {errors.description}
                </span>
              )}
            </div>

            {/* Reference URL */}
            <div className="form-group">
              <label htmlFor="task-reference-url" className="form-label">Reference Link / Attachment</label>
              <input
                id="task-reference-url"
                name="reference_url"
                type="url"
                className={`form-input${errors.reference_url ? ' error' : ''}`}
                placeholder="e.g., https://docs.google.com/..."
                value={form.reference_url}
                onChange={handleChange}
                maxLength={1000}
                aria-invalid={!!errors.reference_url}
                aria-describedby={errors.reference_url ? 'url-error' : undefined}
              />
              {errors.reference_url && (
                <span id="url-error" className="form-error" role="alert">
                  <AlertCircle size={12} /> {errors.reference_url}
                </span>
              )}
            </div>

            {/* Category + Priority */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="task-category" className="form-label required">Category</label>
                <select
                  id="task-category"
                  name="category"
                  className={`form-select${errors.category ? ' error' : ''}`}
                  value={form.category}
                  onChange={handleChange}
                  aria-required="true"
                >
                  {CATEGORIES.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="task-priority" className="form-label">Priority</label>
                <select
                  id="task-priority"
                  name="priority"
                  className="form-select"
                  value={form.priority}
                  onChange={handleChange}
                >
                  {PRIORITIES.map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Due Date + Time */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="task-due-date" className="form-label required">Due Date</label>
                <input
                  id="task-due-date"
                  name="due_date"
                  type="date"
                  className={`form-input${errors.due_date ? ' error' : ''}`}
                  value={form.due_date}
                  onChange={handleChange}
                  aria-required="true"
                  aria-invalid={!!errors.due_date}
                  aria-describedby={errors.due_date ? 'date-error' : undefined}
                />
                {errors.due_date && (
                  <span id="date-error" className="form-error" role="alert">
                    <AlertCircle size={12} /> {errors.due_date}
                  </span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="task-due-time" className="form-label">Due Time</label>
                <input
                  id="task-due-time"
                  name="due_time"
                  type="time"
                  className="form-input"
                  value={form.due_time}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Status (edit mode only) */}
            {mode === 'edit' && (
              <div className="form-group">
                <label htmlFor="task-status" className="form-label">Status</label>
                <select
                  id="task-status"
                  name="status"
                  className="form-select"
                  value={form.status}
                  onChange={handleChange}
                >
                  {STATUSES.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Saving...</>
              ) : (
                mode === 'create' ? 'Create Task' : 'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
