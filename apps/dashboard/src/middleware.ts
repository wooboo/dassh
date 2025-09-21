import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import type { NextRequest } from "next/server";

/**
 * Next.js middleware for protecting dashboard routes with Kinde authentication
 * 
 * This middleware ensures that:
 * 1. Users are authenticated before accessing dashboard routes
 * 2. Unauthenticated users are redirected to the login page
 * 3. After login, users are redirected back to their original destination
 * 4. Dashboard routes are specifically protected and require authentication
 */

export default function middleware(req: NextRequest) {
  // Check if this is a dashboard route
  const isDashboardRoute = req.nextUrl.pathname.startsWith('/dashboard');
  
  if (isDashboardRoute) {
    // For dashboard routes, enforce strict authentication
    return withAuth(req, {
      // Return to the original dashboard page after successful authentication
      isReturnToCurrentPage: true,
      
      // Custom login page (optional - Kinde will use their hosted page by default)
      // loginPage: "/auth/login",
      
      // No public paths for dashboard routes - all require authentication
      publicPaths: [],
      
      // Custom authorization logic - could add role-based access here
      isAuthorized: () => {
        // For now, any authenticated user can access dashboard
        // In the future, you could add role checks here:
        // return token.permissions?.includes("dashboard:access") ?? false;
        return true;
      },
    });
  }
  
  // For non-dashboard routes, use more permissive settings
  return withAuth(req, {
    isReturnToCurrentPage: true,
    
    // Public paths that don't require authentication
    publicPaths: [
      "/", // Main page
      "/public", // Public assets
      "/api/health", // Health check endpoint
      "/api/webhooks", // Webhook endpoints (should have their own auth)
    ],
  });
}

/**
 * Middleware configuration
 * 
 * This matcher ensures the middleware runs on routes that need authentication:
 * - All dashboard routes (strict authentication required)
 * - Other application routes (with public path exceptions)
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes - handled by their own auth, except dashboard APIs)
     * - _next/static (static files)
     * - _next/image (image optimization files) 
     * - favicon.ico (favicon file)
     * - public folder files
     * - file extensions (css, js, png, jpg, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public|.*\\.(?:css|js|png|jpg|jpeg|gif|svg|webp|ico|woff|woff2)$).*)',
    
    // Specifically include all dashboard routes for strict protection
    '/dashboard/:path*',
    
    // Include dashboard API routes for authentication
    '/api/user/:path*',
    '/api/auth/status',
  ],
};