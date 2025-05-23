import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { getVisibleAccounts } from '@/lib/api-server/account';
import { adminAuth } from '@/lib/firebaseAdmin';

export async function GET() {
  const token = (await cookies()).get('authToken')?.value;

  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized (no token)' },
      { status: 401 },
    );
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;

    const accounts = await getVisibleAccounts(uid);
    return NextResponse.json(accounts);
  } catch (error) {
    console.error('Token 驗證失敗:', error);
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 403 },
    );
  }
}
