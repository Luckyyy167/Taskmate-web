import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { createTask, listTasks, checkDuplicateTask } from '@/server/task-repository';
import { createTaskSchema, taskQuerySchema } from '@/lib/schemas';
import { zodToApiDetails } from '@/lib/zod-helpers';
import { ApiErrors, successResponse } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json(ApiErrors.UNAUTHORIZED(), { status: 401 });

    const { searchParams } = new URL(request.url);
    const rawQuery = Object.fromEntries(searchParams.entries());
    const parsed = taskQuerySchema.safeParse(rawQuery);

    if (!parsed.success) {
      return NextResponse.json(ApiErrors.VALIDATION_ERROR(zodToApiDetails(parsed.error)), { status: 400 });
    }

    const result = await listTasks(session.userId, parsed.data);
    return NextResponse.json(result);
  } catch (error) {
    console.error('[GET /api/tasks]', error);
    return NextResponse.json(ApiErrors.SERVER_ERROR(), { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json(ApiErrors.UNAUTHORIZED(), { status: 401 });

    const body = await request.json();
    const parsed = createTaskSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(ApiErrors.VALIDATION_ERROR(zodToApiDetails(parsed.error)), { status: 400 });
    }

    const input = parsed.data;

    const isDuplicate = await checkDuplicateTask(session.userId, input.title, input.due_date);
    if (isDuplicate) {
      return NextResponse.json(ApiErrors.DUPLICATE_TASK(), { status: 409 });
    }

    const task = await createTask(session.userId, {
      ...input,
      description: input.description || null,
      due_time: input.due_time || null,
    });

    return NextResponse.json(successResponse({ data: task }), { status: 201 });
  } catch (error) {
    console.error('[POST /api/tasks]', error);
    return NextResponse.json(ApiErrors.SERVER_ERROR(), { status: 500 });
  }
}
