import type { Task, DisplayStatus } from '@/types';

const APP_TIMEZONE = process.env.APP_TIMEZONE || 'Asia/Jakarta';

/**
 * Get current date/time in the application timezone (Asia/Jakarta)
 */
export function getNow(): Date {
  return new Date();
}

/**
 * Get today's date string (YYYY-MM-DD) in the application timezone
 */
export function getTodayInTimezone(timezone = APP_TIMEZONE): string {
  const now = new Date();
  return new Intl.DateTimeFormat('en-CA', { // en-CA gives YYYY-MM-DD
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

/**
 * Check if a task is overdue using the application timezone
 */
export function isTaskOverdue(task: Pick<Task, 'status' | 'due_date' | 'due_time'>): boolean {
  if (task.status === 'completed') return false;

  const now = new Date();
  const todayStr = getTodayInTimezone();

  if (task.due_time) {
    // Compare datetime
    const dueDateTimeStr = `${task.due_date}T${task.due_time}:00`;
    // Parse as local Jakarta time
    const dueDate = new Date(
      new Intl.DateTimeFormat('en-US', {
        timeZone: 'UTC',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(
        (() => {
          // Parse the due_date + due_time as Jakarta time and convert to UTC
          const [year, month, day] = task.due_date.split('-').map(Number);
          const [hour, minute] = task.due_time!.split(':').map(Number);
          // Create date in Jakarta timezone
          const jakartaOffset = 7 * 60; // +07:00
          const utcMs = Date.UTC(year, month - 1, day, hour, minute) - jakartaOffset * 60 * 1000;
          return new Date(utcMs);
        })()
      )
    );
    // Simpler approach: just compare the due date+time as Jakarta strings
    const nowStr = new Intl.DateTimeFormat('en-CA', {
      timeZone: APP_TIMEZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(now).replace(', ', 'T');

    const dueStr = `${task.due_date}T${task.due_time}`;
    return dueStr < nowStr;
  } else {
    // Compare date only
    return task.due_date < todayStr;
  }
}

/**
 * Calculate display_status for a task
 */
export function getDisplayStatus(task: Pick<Task, 'status' | 'due_date' | 'due_time'>): DisplayStatus {
  if (task.status === 'completed') return 'completed';
  if (isTaskOverdue(task)) return 'overdue';
  return task.status;
}

/**
 * Calculate progress for a task
 */
export function getProgress(task: Pick<Task, 'status'>): number {
  if (task.status === 'completed') return 100;
  if (task.status === 'todo') return 0;
  return 0; // in_progress uses stored progress (defaulting to 0 when none stored)
}

/**
 * Format a date string for display
 */
export function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format time string for display
 */
export function formatTime(timeStr: string): string {
  const [hour, minute] = timeStr.split(':').map(Number);
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
}

/**
 * Get relative date description
 */
export function getRelativeDate(dateStr: string): string {
  const today = getTodayInTimezone();
  if (dateStr === today) return 'Today';

  const tomorrow = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: APP_TIMEZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(d);
  })();

  if (dateStr === tomorrow) return 'Tomorrow';
  return formatDate(dateStr);
}

/**
 * Check if a date is today in the app timezone
 */
export function isToday(dateStr: string): boolean {
  return dateStr === getTodayInTimezone();
}

/**
 * Get start of month in the app timezone
 */
export function getStartOfMonthInTimezone(timezone = APP_TIMEZONE): string {
  const now = new Date();
  const year = new Intl.DateTimeFormat('en-US', { timeZone: timezone, year: 'numeric' }).format(now);
  const month = new Intl.DateTimeFormat('en-US', { timeZone: timezone, month: '2-digit' }).format(now);
  return `${year}-${month}-01`;
}
