import { z } from 'zod';

// Auth schemas
export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be at most 100 characters').trim(),
  email: z.string().email('Invalid email address').max(255, 'Email must be at most 255 characters').toLowerCase(),
  password: z.string().min(8, 'Password must be at least 8 characters').max(100, 'Password too long'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});

export const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be at most 100 characters').trim(),
});

// Task schemas
const priorityEnum = z.enum(['low', 'medium', 'high']);
const categoryEnum = z.enum(['college', 'assignment', 'personal', 'project', 'exam']);
const statusEnum = z.enum(['todo', 'in_progress', 'completed']);

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be at most 100 characters').trim(),
  description: z.string().max(500, 'Description must be at most 500 characters').optional().or(z.literal('')),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  due_time: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:MM)').optional().or(z.literal('')),
  priority: priorityEnum.default('medium'),
  category: categoryEnum,
  status: statusEnum.default('todo'),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be at most 100 characters').trim().optional(),
  description: z.string().max(500, 'Description must be at most 500 characters').optional().or(z.literal('')),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)').optional(),
  due_time: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:MM)').optional().or(z.literal('')),
  priority: priorityEnum.optional(),
  category: categoryEnum.optional(),
  status: statusEnum.optional(),
});

export const completeTaskSchema = z.object({
  completed: z.boolean(),
});

// Query/filter schemas
export const taskQuerySchema = z.object({
  view: z.enum(['all', 'active', 'today', 'upcoming', 'completed']).optional(),
  q: z.string().max(200).optional(),
  status: z.enum(['todo', 'in_progress', 'completed', 'overdue']).optional(),
  priority: priorityEnum.optional(),
  category: categoryEnum.optional(),
  sort: z.enum(['due_date', 'priority', 'created_at', 'status', 'completed_at']).optional(),
  order: z.enum(['asc', 'desc']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskQueryInput = z.infer<typeof taskQuerySchema>;
