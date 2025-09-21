import { handleAuth } from "@kinde-oss/kinde-auth-nextjs/server";

/**
 * Kinde Authentication API Route Handler
 * 
 * This dynamic route handles all Kinde authentication endpoints:
 * - /api/auth/login - Initiates login flow
 * - /api/auth/register - Initiates registration flow
 * - /api/auth/logout - Handles logout
 * - /api/auth/callback - Handles OAuth callback
 * - /api/auth/refresh - Refreshes tokens
 * 
 * The handleAuth function from Kinde automatically sets up all these endpoints
 * and handles the OAuth 2.0 flow with proper security measures.
 */

export const GET = handleAuth();