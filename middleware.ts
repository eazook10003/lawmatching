import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // Not logged in — redirect to login
  if (!user) {
    if (path === '/login' || path === '/signup' || path === '/') return response
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Already logged in — redirect away from home, login, signup
  if (path === '/' || path === '/login' || path === '/signup') {
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()
    if (profile?.role === 'lawyer') {
      return NextResponse.redirect(new URL('/lawyer-dashboard', request.url))
    }
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Get role from our users table
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  const role = profile?.role

  // Redirect based on role
  if (path.startsWith('/dashboard') && role !== 'client') {
    return NextResponse.redirect(new URL('/cases', request.url))
  }

  if (path === '/cases' && role !== 'lawyer') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (path === '/cases/new' && role !== 'client') {
    return NextResponse.redirect(new URL('/cases', request.url))
  }

  if (path.startsWith('/lawyer-dashboard') && role !== 'lawyer') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: ['/', '/login', '/signup', '/dashboard/:path*', '/cases/:path*', '/chat/:path*', '/lawyer-dashboard/:path*'],
}
