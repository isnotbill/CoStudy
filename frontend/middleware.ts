import { NextResponse } from "next/server";
import type { NextRequest } from "next/server"
import { verifyJwt } from './lib/jwt'

// export const config = {
//   matcher: ['/login']
// }

export function middleware(req: NextRequest){
  return NextResponse.redirect(new URL('/', req.url))

  // console.log('[MW] middleware fired for:', req.nextUrl.pathname)
  
  // // if (['/login'].includes(req.nextUrl.pathname)){
  // //   return NextResponse.next()
  // // }

  // //const token = req.cookies.get('token')?.value

  // if (true) {
  //   const url = req.nextUrl.clone()
  //   url.pathname = '/login'
  //   url.searchParams.set('from', req.nextUrl.pathname)
  //   return NextResponse.redirect(url)
  // } 


  // try {
  //   verifyJwt(token)
  //   return NextResponse.next()
  // } catch {
  //   const url = req.nextUrl.clone()
  //   url.pathname='/login'
  //   const res = NextResponse.redirect(url)
  //   res.cookies.delete('token')
  //   return res
  // }
}

export const config = {
  matcher: '/login'
}
