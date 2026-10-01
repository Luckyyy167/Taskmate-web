import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { loginSchema } from '@/lib/schemas';
import { zodToApiDetails } from '@/lib/zod-helpers';
import { createSessionToken, setSessionCookie } from '@/lib/auth';
import { findUserByEmailWithPassword } from '@/server/user-repository';
import { ApiErrors, successResponse } from '@/lib/api-response';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(ApiErrors.VALIDATION_ERROR(zodToApiDetails(parsed.error)), { status: 400 });
    }

    const { email, password } = parsed.data;

    const user = await findUserByEmailWithPassword(email);
    if (!user) {
      return NextResponse.json(ApiErrors.INVALID_CREDENTIALS(), { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return NextResponse.json(ApiErrors.INVALID_CREDENTIALS(), { status: 401 });
    }

    const token = await createSessionToken({ userId: user.id, email: user.email, name: user.name });
    await setSessionCookie(token);

    return NextResponse.json(successResponse({
      user: { id: user.id, name: user.name, email: user.email },
    }));
  } catch (error) {
    console.error('[login]', error);
    return NextResponse.json(ApiErrors.SERVER_ERROR(), { status: 500 });
  }
}
