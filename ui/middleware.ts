import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const config = {
  matcher: ['/', '/login', '/home', '/home/:path*', '/settings', '/room/:slug*'],
}

export function middleware(req: NextRequest) {
  const token = req.cookies.get('access_token')?.value

  // Public pages — redirect to /home if already authenticated
  if (req.nextUrl.pathname === '/' || req.nextUrl.pathname === '/login') {
    if (token) {
      const url = req.nextUrl.clone()
      url.pathname = '/home'
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  // Protected pages — redirect to /login if not authenticated
  if (!token) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}
