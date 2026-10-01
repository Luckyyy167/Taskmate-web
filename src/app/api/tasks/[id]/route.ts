import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getTaskById, updateTask, deleteTask } from '@/server/task-repository';
import { updateTaskSchema } from '@/lib/schemas';
import { zodToApiDetails } from '@/lib/zod-helpers';
import { ApiErrors, successResponse } from '@/lib/api-response';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json(ApiErrors.UNAUTHORIZED(), { status: 401 });

    const { id } = await params;
    const task = await getTaskById(id, session.userId);
    if (!task) return NextResponse.json(ApiErrors.NOT_FOUND('Task'), { status: 404 });

    return NextResponse.json(successResponse({ data: task }));
  } catch (error) {
    console.error('[GET /api/tasks/:id]', error);
    return NextResponse.json(ApiErrors.SERVER_ERROR(), { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json(ApiErrors.UNAUTHORIZED(), { status: 401 });

    const { id } = await params;
    const body = await request.json();
    const parsed = updateTaskSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(ApiErrors.VALIDATION_ERROR(zodToApiDetails(parsed.error)), { status: 400 });
    }

    const task = await updateTask(id, session.userId, {
      ...parsed.data,
      description: parsed.data.description || null,
      due_time: parsed.data.due_time || null,
    });

    if (!task) return NextResponse.json(ApiErrors.NOT_FOUND('Task'), { status: 404 });

    return NextResponse.json(successResponse({ data: task }));
  } catch (error) {
    console.error('[PUT /api/tasks/:id]', error);
    return NextResponse.json(ApiErrors.SERVER_ERROR(), { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json(ApiErrors.UNAUTHORIZED(), { status: 401 });

    const { id } = await params;
    const deleted = await deleteTask(id, session.userId);
    if (!deleted) return NextResponse.json(ApiErrors.NOT_FOUND('Task'), { status: 404 });

    return NextResponse.json(successResponse({ message: 'Task deleted successfully.' }));
  } catch (error) {
    console.error('[DELETE /api/tasks/:id]', error);
    return NextResponse.json(ApiErrors.SERVER_ERROR(), { status: 500 });
  }
}
