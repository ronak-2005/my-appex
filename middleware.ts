// /middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

const PUBLIC_ROUTES = ['/', '/login']
const SECRET = 'your_secret_key_here' // Should match Flask

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (PUBLIC_ROUTES.includes(pathname)) return NextResponse.next()

  const token = request.cookies.get('token')?.value
  if (!token) return NextResponse.redirect(new URL('/login', request.url))

  try {
    jwt.verify(token, SECRET)
    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
