import { NextRequest, NextResponse } from "next/server";
import { KindeAuthService } from "./kinde";

// Verify JWT token (for WebSocket authentication)
export const verifyToken = async (token: string) => {
  try {
    const authService = new KindeAuthService();
    // This would use Kinde's token verification
    // For now, return a mock payload structure
    return { sub: "user_id_from_token" };
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
};

export async function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip auth check for public routes
  const publicRoutes = ["/", "/api/auth", "/api/webhooks"];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  if (isPublicRoute) {
    return NextResponse.next();
  }
  
  // Check if user is authenticated
  const isAuthenticated = await KindeAuthService.isAuthenticated();
  
  if (!isAuthenticated) {
    // Redirect to login
    const loginUrl = new URL("/api/auth/login", request.url);
    loginUrl.searchParams.set("post_login_redirect_url", pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  return NextResponse.next();
}

export function withAuth(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const isAuthenticated = await KindeAuthService.isAuthenticated();
    
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    return handler(req);
  };
}