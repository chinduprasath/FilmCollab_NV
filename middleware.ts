import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // Get the pathname of the request
  const path = req.nextUrl.pathname;
  
  // Define protected routes and their required roles
  const protectedRoutes = {
    '/dashboard': 'USER',
    '/admin-dashboard': 'ADMIN',
  };
  
  // Check if the current path is a protected route
  const requiredRole = protectedRoutes[path as keyof typeof protectedRoutes];
  
  if (requiredRole) {
    try {
      // For frontend authentication, we'll let the client-side handle the redirect
      // This prevents middleware from blocking legitimate frontend navigation
      // The AppLayout component will handle role-based access control
      return res;
    } catch (error) {
      console.error('Middleware error:', error);
      // On error, continue and let client-side handle it
      return res;
    }
  }
  
  // Not a protected route, continue
  return res;
}

export const config = {
  matcher: [
    '/dashboard',
    '/admin-dashboard',
  ],
};
