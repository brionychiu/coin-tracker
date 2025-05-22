import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { adminAuth } from '@/lib/firebaseAdmin';

export async function POST(req: Request) {
  const body = await req.json();
  const { idToken } = body;

  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const cookieStore = await cookies();
    cookieStore.set('authToken', idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 天
    });

    return NextResponse.json({ uid });
  } catch (error) {
    console.error('驗證失敗', error);
    return NextResponse.json({ error: '無效的 token' }, { status: 401 });
  }
}

export async function DELETE() {
  (await cookies()).delete('authToken');
  return NextResponse.json({ message: 'Token removed' });
}
