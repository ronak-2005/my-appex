import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  console.log('🔐 Checking auth for:', pathname, '| Token exists:', !!token);

  // Define public routes
  const isLoginPage = pathname.startsWith('/login');
  const isRegisterPage = pathname.startsWith('/register');
  const isIntroPage = pathname.startsWith('/intro');

  // ⛔ If logged in, block access to /login or /register
  if (token && (isLoginPage || isRegisterPage)) {
    console.log('⚠️ Already logged in, redirecting away from auth pages');
    return NextResponse.redirect(new URL('/start', request.url));
  }

  // ✅ Allow public routes without auth
  if (isLoginPage || isRegisterPage || isIntroPage) {
    return NextResponse.next();
  }

  // 🔐 For protected routes, check token
  if (!token) {
    console.log('❌ No token found, redirecting to login');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  console.log('✅ Token found, allowing access to:', pathname);
  return NextResponse.next();
}

// ✅ Apply to all routes (excluding static files)
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
