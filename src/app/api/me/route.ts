import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { findUserById, updateUserName } from '@/server/user-repository';
import { updateProfileSchema } from '@/lib/schemas';
import { zodToApiDetails } from '@/lib/zod-helpers';
import { ApiErrors, successResponse } from '@/lib/api-response';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json(ApiErrors.UNAUTHORIZED(), { status: 401 });

    const user = await findUserById(session.userId);
    if (!user) return NextResponse.json(ApiErrors.NOT_FOUND('User'), { status: 404 });

    return NextResponse.json(successResponse({ user }));
  } catch (error) {
    console.error('[GET /api/me]', error);
    return NextResponse.json(ApiErrors.SERVER_ERROR(), { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json(ApiErrors.UNAUTHORIZED(), { status: 401 });

    const body = await request.json();
    const parsed = updateProfileSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(ApiErrors.VALIDATION_ERROR(zodToApiDetails(parsed.error)), { status: 400 });
    }

    const user = await updateUserName(session.userId, parsed.data.name);
    if (!user) return NextResponse.json(ApiErrors.NOT_FOUND('User'), { status: 404 });

    return NextResponse.json(successResponse({ user }));
  } catch (error) {
    console.error('[PATCH /api/me]', error);
    return NextResponse.json(ApiErrors.SERVER_ERROR(), { status: 500 });
  }
}
