import prisma from '@/lib/db';
import { getDisplayStatus, getProgress, getTodayInTimezone, getStartOfMonthInTimezone } from '@/lib/date-helpers';
import { getPaginationOffset, buildPaginationMeta } from '@/lib/pagination';
import type { Task, TaskSummary, CategorySummary, NotificationItem, TaskListResult } from '@/types';
import type { TaskQueryInput } from '@/lib/schemas';
import { Prisma } from '@prisma/client';

// Convert from DB enum to lowercase format used in app
function enrichTask(row: any): Task {
  const dbTask = {
    id: row.id,
    user_id: row.userId,
    title: row.title,
    description: row.description,
    due_date: row.dueDate instanceof Date ? row.dueDate.toISOString().split('T')[0] : row.dueDate,
    due_time: row.dueTime,
    priority: row.priority.toLowerCase(),
    category: row.category.toLowerCase(),
    status: row.status.toLowerCase(),
    completed_at: row.completedAt,
    created_at: row.createdAt,
    updated_at: row.updatedAt,
  };
  return {
    ...dbTask,
    display_status: getDisplayStatus(dbTask as any),
    progress: getProgress(dbTask as any),
  } as unknown as Task;
}

export async function getTaskById(id: string, userId: string): Promise<Task | null> {
  const row = await prisma.task.findFirst({ where: { id, userId } });
  return row ? enrichTask(row) : null;
}

export async function listTasks(userId: string, queryParams: TaskQueryInput): Promise<TaskListResult> {
  const { view, q, status, priority, category, sort = 'due_date', order = 'asc', page = 1, limit = 10 } = queryParams;
  const today = getTodayInTimezone();
  const todayDate = new Date(today);

  let where: Prisma.TaskWhereInput = { userId };

  if (view === 'today') {
    where.dueDate = todayDate;
  } else if (view === 'upcoming') {
    where.dueDate = { gt: todayDate };
    where.status = { not: 'COMPLETED' };
  } else if (view === 'completed') {
    where.status = 'COMPLETED';
  } else if (view === 'active') {
    where.status = { not: 'COMPLETED' };
  }

  if (q) {
    where.OR = [
      { title: { contains: q } },
      { description: { contains: q } }
    ];
  }

  if (status === 'overdue') {
    where.status = { not: 'COMPLETED' };
    where.dueDate = { lt: todayDate };
  } else if (status) {
    where.status = status.toUpperCase() as any;
  }

  if (priority) {
    where.priority = priority.toUpperCase() as any;
  }

  if (category) {
    where.category = category.toUpperCase() as any;
  }

  let orderBy: Prisma.TaskOrderByWithRelationInput = {};
  const dir = order.toLowerCase() as 'asc' | 'desc';
  
  switch (sort) {
    case 'created_at':
      orderBy = { createdAt: dir };
      break;
    case 'status':
      orderBy = { status: dir };
      break;
    case 'completed_at':
      orderBy = { completedAt: dir };
      break;
    default:
      orderBy = { dueDate: dir };
  }

  const offset = getPaginationOffset(page, limit);
  
  const [total, rows] = await Promise.all([
    prisma.task.count({ where }),
    prisma.task.findMany({
      where,
      orderBy,
      take: limit,
      skip: offset,
    })
  ]);

  return {
    data: rows.map(enrichTask),
    meta: buildPaginationMeta(total, page, limit),
  };
}

export async function createTask(userId: string, input: any): Promise<Task> {
  const row = await prisma.task.create({
    data: {
      userId,
      title: input.title.trim(),
      description: input.description?.trim() || null,
      dueDate: new Date(input.due_date),
      dueTime: input.due_time || null,
      priority: input.priority.toUpperCase(),
      category: input.category.toUpperCase(),
      status: input.status.toUpperCase(),
    }
  });
  return enrichTask(row);
}

export async function updateTask(id: string, userId: string, input: any): Promise<Task | null> {
  const data: any = {};
  if (input.title !== undefined) data.title = input.title.trim();
  if (input.description !== undefined) data.description = input.description?.trim() || null;
  if (input.due_date !== undefined) data.dueDate = new Date(input.due_date);
  if (input.due_time !== undefined) data.dueTime = input.due_time || null;
  if (input.priority !== undefined) data.priority = input.priority.toUpperCase();
  if (input.category !== undefined) data.category = input.category.toUpperCase();
  if (input.status !== undefined) {
    data.status = input.status.toUpperCase();
    data.completedAt = input.status === 'completed' ? new Date() : null;
  }

  if (Object.keys(data).length === 0) return getTaskById(id, userId);

  try {
    const row = await prisma.task.update({
      where: { id, userId },
      data,
    });
    return enrichTask(row);
  } catch {
    return null;
  }
}

export async function deleteTask(id: string, userId: string): Promise<boolean> {
  try {
    await prisma.task.delete({ where: { id, userId } });
    return true;
  } catch {
    return false;
  }
}

export async function completeTask(id: string, userId: string, completed: boolean): Promise<Task | null> {
  try {
    const row = await prisma.task.update({
      where: { id, userId },
      data: {
        status: completed ? 'COMPLETED' : 'TODO',
        completedAt: completed ? new Date() : null,
      },
    });
    return enrichTask(row);
  } catch {
    return null;
  }
}

export async function checkDuplicateTask(userId: string, title: string, dueDate: string, excludeId?: string): Promise<boolean> {
  const where: any = {
    userId,
    title: { equals: title.trim() },
    dueDate: new Date(dueDate),
  };
  if (excludeId) {
    where.id = { not: excludeId };
  }
  const count = await prisma.task.count({ where });
  return count > 0;
}

export async function getTaskSummary(userId: string): Promise<TaskSummary> {
  const todayDate = new Date(getTodayInTimezone());
  const monthStartDate = new Date(getStartOfMonthInTimezone());

  const allTasks = await prisma.task.findMany({ where: { userId } });
  
  let completed = 0, in_progress = 0, todo = 0, overdue = 0, todayCount = 0, completed_this_month = 0;
  
  for (const t of allTasks) {
    if (t.status === 'COMPLETED') completed++;
    if (t.status === 'IN_PROGRESS') in_progress++;
    if (t.status === 'TODO') todo++;
    if (t.status !== 'COMPLETED' && t.dueDate < todayDate) overdue++;
    if (t.dueDate.getTime() === todayDate.getTime()) todayCount++;
    if (t.status === 'COMPLETED' && t.completedAt && t.completedAt >= monthStartDate) completed_this_month++;
  }

  return {
    total: allTasks.length,
    completed,
    in_progress,
    todo,
    overdue,
    today: todayCount,
    completed_this_month,
  };
}

export async function getCategorySummary(userId: string): Promise<CategorySummary[]> {
  const categories = ['college', 'assignment', 'personal', 'project', 'exam'];
  const allTasks = await prisma.task.findMany({ where: { userId } });

  return categories.map(cat => {
    const catTasks = allTasks.filter(t => t.category.toLowerCase() === cat);
    return {
      category: cat as CategorySummary['category'],
      total: catTasks.length,
      completed: catTasks.filter(t => t.status === 'COMPLETED').length,
    };
  });
}

export async function getNotifications(userId: string): Promise<{ count: number; items: NotificationItem[] }> {
  const todayDate = new Date(getTodayInTimezone());
  
  const rows = await prisma.task.findMany({
    where: {
      userId,
      status: { not: 'COMPLETED' },
      dueDate: { lte: todayDate }
    },
    orderBy: { dueDate: 'asc' }
  });

  const items: NotificationItem[] = rows.map(row => ({
    id: `notif-${row.id}`,
    type: row.dueDate < todayDate ? 'overdue' : 'due_today',
    task_id: row.id,
    task_title: row.title,
    due_date: row.dueDate.toISOString().split('T')[0],
    due_time: row.dueTime,
  }));

  return { count: items.length, items };
}
