import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getTaskSummary } from '@/server/task-repository';
import { ApiErrors, successResponse } from '@/lib/api-response';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json(ApiErrors.UNAUTHORIZED(), { status: 401 });

    const summary = await getTaskSummary(session.userId);
    return NextResponse.json(successResponse(summary));
  } catch (error) {
    console.error('[GET /api/tasks/summary]', error);
    return NextResponse.json(ApiErrors.SERVER_ERROR(), { status: 500 });
  }
}
