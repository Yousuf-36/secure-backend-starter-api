import { NextRequest, NextResponse } from 'next/server'

const PROTECTED_PATHS = ['/dashboard']
const AUTH_PATHS = ['/login', '/register']

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Check if the path is protected
    const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p))
    const isAuthPath = AUTH_PATHS.some((p) => pathname.startsWith(p))

    // We check for a refresh_token cookie (HttpOnly, set by backend on login).
    // This is the only token surface available to middleware since access token 
    // is in-memory only. Presence of refresh_token = logged in session.
    const hasSession = request.cookies.has('refresh_token')

    if (isProtected && !hasSession) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('from', pathname)
        return NextResponse.redirect(loginUrl)
    }

    // Redirect already-authenticated users away from auth pages
    if (isAuthPath && hasSession) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/dashboard/:path*', '/login', '/register'],
}
