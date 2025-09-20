import { KindeAuthService } from "./kinde";
import type { AuthRequest, AuthResponse } from "./types";

// Verify JWT token (for WebSocket authentication)
export const verifyToken = async (token: string) => {
  try {
    // This would use Kinde's token verification
    // For now, return a mock payload structure
    return { sub: "user_id_from_token" };
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
};

// Generic auth check function that can be used in any environment
export async function checkAuthentication(): Promise<boolean> {
  try {
    return await KindeAuthService.isAuthenticated();
  } catch (error) {
    console.error("Authentication check failed:", error);
    return false;
  }
}

export async function validateAuth(request: AuthRequest): Promise<AuthResponse> {
  const { pathname } = request;
  
  // Skip auth check for public routes
  const publicRoutes = ["/", "/api/auth", "/api/webhooks"];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  if (isPublicRoute) {
    return { type: "next" };
  }
  
  // Check if user is authenticated
  const isAuthenticated = await checkAuthentication();
  
  if (!isAuthenticated) {
    // Return redirect information
    const loginUrl = new URL("/api/auth/login", request.url);
    loginUrl.searchParams.set("post_login_redirect_url", pathname);
    return { 
      type: "redirect", 
      redirectUrl: loginUrl.toString() 
    };
  }
  
  return { type: "next" };
}

export async function validateApiAuth(): Promise<AuthResponse> {
  const isAuthenticated = await checkAuthentication();
  
  if (!isAuthenticated) {
    return {
      type: "unauthorized",
      status: 401,
      error: "Unauthorized"
    };
  }
  
  return { type: "next" };
}