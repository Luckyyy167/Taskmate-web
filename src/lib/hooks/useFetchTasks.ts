'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Task, TaskListResult } from '@/types';

interface UseFetchTasksOptions {
  queryString?: string;
}

interface UseFetchTasksResult {
  tasks: Task[] | null;
  meta: TaskListResult['meta'] | undefined;
  loading: boolean;
  error: string;
  refresh: () => void;
}

export function useFetchTasks({ queryString = '' }: UseFetchTasksOptions = {}): UseFetchTasksResult {
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [meta, setMeta] = useState<TaskListResult['meta'] | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => setRefreshKey(k => k + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');

    async function fetch_() {
      try {
        const url = `/api/tasks${queryString ? `?${queryString}` : ''}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch tasks');
        const json = await res.json();
        if (!cancelled) {
          setTasks(json.data || []);
          setMeta(json.meta);
        }
      } catch (err) {
        if (!cancelled) setError('Failed to load tasks. Please try again.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetch_();
    return () => { cancelled = true; };
  }, [queryString, refreshKey]);

  return { tasks, meta, loading, error, refresh };
}
