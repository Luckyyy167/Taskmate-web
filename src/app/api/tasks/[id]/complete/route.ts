import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { completeTask } from '@/server/task-repository';
import { completeTaskSchema } from '@/lib/schemas';
import { zodToApiDetails } from '@/lib/zod-helpers';
import { ApiErrors, successResponse } from '@/lib/api-response';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json(ApiErrors.UNAUTHORIZED(), { status: 401 });

    const { id } = await params;
    const body = await request.json();
    const parsed = completeTaskSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(ApiErrors.VALIDATION_ERROR(zodToApiDetails(parsed.error)), { status: 400 });
    }

    const task = await completeTask(id, session.userId, parsed.data.completed);
    if (!task) return NextResponse.json(ApiErrors.NOT_FOUND('Task'), { status: 404 });

    return NextResponse.json(successResponse({ data: task }));
  } catch (error) {
    console.error('[PATCH /api/tasks/:id/complete]', error);
    return NextResponse.json(ApiErrors.SERVER_ERROR(), { status: 500 });
  }
}
