import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getCategorySummary } from '@/server/task-repository';
import { ApiErrors, successResponse } from '@/lib/api-response';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json(ApiErrors.UNAUTHORIZED(), { status: 401 });

    const categories = await getCategorySummary(session.userId);
    return NextResponse.json(successResponse({ data: categories }));
  } catch (error) {
    console.error('[GET /api/categories]', error);
    return NextResponse.json(ApiErrors.SERVER_ERROR(), { status: 500 });
  }
}
