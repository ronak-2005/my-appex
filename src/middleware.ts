// src/middleware.ts - Complete authentication middleware
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  console.log('🛡️ Middleware checking:', pathname)
  
  // Define public paths that don't need authentication
  const PUBLIC_PATHS = ['/', '/login', '/register', '/intro']
  
  // Skip middleware for Next.js internal routes and static assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    PUBLIC_PATHS.includes(pathname)
  ) {
    console.log('⏭️ Skipping auth check for:', pathname)
    return NextResponse.next()
  }
  
  // Check for authentication token
  const token = request.cookies.get('token')?.value
  console.log('🔐 Checking auth for:', pathname, '| Token exists:', !!token)
  
  if (!token) {
    console.log('❌ No token found, redirecting to login')
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }
  
  console.log('✅ Token found, allowing access to:', pathname)
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
