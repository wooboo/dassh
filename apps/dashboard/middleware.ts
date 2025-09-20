import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import { NextRequest } from "next/server";

/**
 * Next.js middleware for protecting dashboard routes with Kinde authentication
 * 
 * This middleware ensures that:
 * 1. Users are authenticated before accessing dashboard routes
 * 2. Unauthenticated users are redirected to the login page
 * 3. After login, users are redirected back to their original destination
 */

export default function middleware(req: NextRequest) {
  return withAuth(req, {
    // Return to the original page after successful authentication
    isReturnToCurrentPage: true,
    
    // Custom login page (optional - Kinde will use their hosted page by default)
    // loginPage: "/auth/login",
    
    // Public paths that don't require authentication
    publicPaths: [
      "/", // Main page
      "/public", // Public assets
      "/api/health", // Health check endpoint
      "/api/webhooks", // Webhook endpoints (should have their own auth)
    ],
    
    // Optional: Custom authorization logic
    // isAuthorized: ({ token }) => {
    //   // Add custom permission checks here if needed
    //   // For example, check if user has specific permissions
    //   // return token.permissions?.includes("dashboard:access") ?? true;
    //   return true;
    // },
  });
}

/**
 * Middleware configuration
 * 
 * This matcher ensures the middleware runs on all routes except:
 * - Next.js internal routes (_next/)
 * - Static files (images, css, js, etc.)
 * - API routes (handled separately)
 * - Favicon
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes - handled by their own auth)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     * - file extensions (css, js, png, jpg, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public|.*\\.(?:css|js|png|jpg|jpeg|gif|svg|webp|ico|woff|woff2)$).*)',
    
    // Specifically protect dashboard routes
    '/dashboard/:path*',
  ],
};