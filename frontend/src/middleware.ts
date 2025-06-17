import { NextResponse } from "next/server";
import type { NextRequest } from "next/server"

export const config = {
  matcher: '/:path*',  
}

export function middleware(req: NextRequest){

  const { pathname } = req.nextUrl

    if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/images') 
  ) {
    return NextResponse.next()
  }

  //console.log('[MW] middleware fired for:', req.nextUrl.pathname)
  
  if (['/login', '/'].includes(req.nextUrl.pathname)){
    return NextResponse.next()
  }

  const token = req.cookies.get('access_token')?.value
  
  if (!token){
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  } else {
    return NextResponse.next()
  }
}
