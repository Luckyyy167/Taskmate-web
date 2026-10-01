// Shared types for TaskMate application

export type Priority = 'low' | 'medium' | 'high';
export type Category = 'college' | 'assignment' | 'personal' | 'project' | 'exam';
export type TaskStatus = 'todo' | 'in_progress' | 'completed';
export type DisplayStatus = 'todo' | 'in_progress' | 'completed' | 'overdue';

export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  due_date: string; // ISO date string YYYY-MM-DD
  due_time: string | null; // HH:MM
  priority: Priority;
  category: Category;
  status: TaskStatus;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  // Computed fields
  display_status?: DisplayStatus;
  progress?: number;
}

export interface TaskSummary {
  total: number;
  completed: number;
  in_progress: number;
  todo: number;
  overdue: number;
  today: number;
  completed_this_month: number;
}

export interface CategorySummary {
  category: Category;
  total: number;
  completed: number;
}

export interface NotificationItem {
  id: string;
  type: 'overdue' | 'due_today';
  task_id: string;
  task_title: string;
  due_date: string;
  due_time: string | null;
}

export interface NotificationResult {
  count: number;
  items: NotificationItem[];
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface TaskListResult {
  data: Task[];
  meta: PaginationMeta;
}

// API Response types
export interface ApiSuccess<T> {
  data: T;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Array<{ field: string; message: string }>;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// Filter/Query types
export type TaskView = 'all' | 'active' | 'today' | 'upcoming' | 'completed';
export type SortField = 'due_date' | 'priority' | 'created_at' | 'status' | 'completed_at';
export type SortOrder = 'asc' | 'desc';

export interface TaskQuery {
  view?: TaskView;
  q?: string;
  status?: TaskStatus | 'overdue';
  priority?: Priority;
  category?: Category;
  sort?: SortField;
  order?: SortOrder;
  page?: number;
  limit?: number;
}
