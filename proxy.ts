// proxy.ts  (Next.js 15+) — rename to middleware.ts for Next.js ≤15
// ─────────────────────────────────────────────────────────────
// Middleware runs on EVERY request before it hits your pages.
// It's the fastest place to check auth + roles because it
// intercepts the request at the edge, before any page code runs.
//
// WHAT THIS DOES:
// 1. Protects /dashboard → must be logged in
// 2. Protects /admin     → must be logged in AND have role 'admin'
// 3. Everything else     → public
//
// NOTE: The webhook route (/api/webhooks/clerk) must be PUBLIC.
// Clerk can't authenticate itself as a Clerk user!
// ─────────────────────────────────────────────────────────────

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Define which routes need protection
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/admin(.*)'])
const isAdminRoute      = createRouteMatcher(['/admin(.*)'])

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth()

  // ── Rule 1: Must be logged in to access /dashboard or /admin ──
  if (isProtectedRoute(req) && !userId) {
    // Redirect to Clerk's sign-in page
    const signInUrl = new URL('/sign-in', req.url)
    signInUrl.searchParams.set('redirect_url', req.url)  // return here after login
    return NextResponse.redirect(signInUrl)
  }

  // ── Rule 2: Must be admin to access /admin ─────────────────
  if (isAdminRoute(req)) {
    const role = sessionClaims?.metadata?.role

    if (role !== 'admin') {
      // Not an admin → redirect to dashboard with an error message
      const dashboardUrl = new URL('/dashboard', req.url)
      dashboardUrl.searchParams.set('error', 'unauthorized')
      return NextResponse.redirect(dashboardUrl)
    }
  }

  // All checks passed — continue to the actual page
})

export const config = {
  matcher: [
    // Run middleware on all routes EXCEPT Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}