import { NextResponse } from 'next/server';
import { deleteSessionCookie } from '@/lib/auth';
import { successResponse } from '@/lib/api-response';

export async function POST() {
  try {
    await deleteSessionCookie();
    return NextResponse.json(successResponse({ message: 'Logged out successfully.' }));
  } catch (error) {
    console.error('[logout]', error);
    return NextResponse.json(successResponse({ message: 'Logged out.' }));
  }
}
