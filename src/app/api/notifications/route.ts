import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getNotifications } from '@/server/task-repository';
import { ApiErrors, successResponse } from '@/lib/api-response';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json(ApiErrors.UNAUTHORIZED(), { status: 401 });

    const result = await getNotifications(session.userId);
    return NextResponse.json(successResponse(result));
  } catch (error) {
    console.error('[GET /api/notifications]', error);
    return NextResponse.json(ApiErrors.SERVER_ERROR(), { status: 500 });
  }
}
