import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

/**
 * GET /api/auth/status
 * 
 * Returns the current authentication status and user information
 * Used by frontend components to check authentication state
 */
export async function GET(request: NextRequest) {
  try {
    const { getUser, isAuthenticated } = getKindeServerSession();
    
    // Check if user is authenticated
    const authenticated = await isAuthenticated();
    
    if (!authenticated) {
      return NextResponse.json({
        isAuthenticated: false,
        user: null,
      });
    }
    
    // Get user information
    const user = await getUser();
    
    if (!user) {
      return NextResponse.json({
        isAuthenticated: false,
        user: null,
      });
    }
    
    // Return sanitized user information
    return NextResponse.json({
      isAuthenticated: true,
      user: {
        id: user.id,
        email: user.email,
        given_name: user.given_name,
        family_name: user.family_name,
        picture: user.picture,
      },
    });
    
  } catch (error) {
    console.error('Error checking authentication status:', error);
    
    return NextResponse.json(
      {
        isAuthenticated: false,
        user: null,
        error: 'Failed to check authentication status',
      },
      { status: 500 }
    );
  }
}