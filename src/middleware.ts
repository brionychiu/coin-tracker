import { type NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('authToken')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// 僅保護 /dashboard 下的路由
export const config = {
  matcher: ['/dashboard/:path*'],
};
