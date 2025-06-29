import { NextResponse } from "next/server";
import type { NextRequest } from "next/server"

// Make sure to add ALL valid paths
export const config = {
  matcher: [
    '/',
    '/login',
    '/about',
    '/home',
    '/settings',
    '/room/:slug'


  ]  
}

export function middleware(req: NextRequest){

  const { pathname } = req.nextUrl

  //console.log('[MW] middleware fired for:', req.nextUrl.pathname)
  const token = req.cookies.get('access_token')?.value

  //If already contains a JWT token, then auto log in, otherwise let them access the preregistration pages
  if (['/login', '/', '/about'].includes(req.nextUrl.pathname)){
    if (token)
    {
      const url = req.nextUrl.clone()
      url.pathname = '/home'
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  if (!token){
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  } else {
    return NextResponse.next()
  }
}
