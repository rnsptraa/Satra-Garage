import { NextResponse, type NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const secretKey = process.env.JWT_SECRET
const key = new TextEncoder().encode(secretKey)

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value
  
  // Public routes that don't require authentication
  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register')
  
  if (isAuthRoute) {
    if (session) {
      try {
        await jwtVerify(session, key, { algorithms: ['HS256'] })
        return NextResponse.redirect(new URL('/', request.url))
      } catch (e) {
        // invalid session, allow them to view login
      }
    }
    return NextResponse.next()
  }

  // Protected routes
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    const { payload } = await jwtVerify(session, key, { algorithms: ['HS256'] })
    
    // Authorization logic
    const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
    const isSuperAdminRoute = request.nextUrl.pathname.startsWith('/admin/super-admin')
    
    if (isAdminRoute && !['ADMIN', 'SUPER_ADMIN'].includes(payload.role as string)) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    
    if (isSuperAdminRoute && payload.role !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }

    // Refresh session (optional, simplified here)
    const res = NextResponse.next()
    return res
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
