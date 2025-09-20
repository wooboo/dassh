// Import using type-only imports for server components to avoid module resolution issues
import type { 
  getKindeServerSession as GetKindeServerSession, 
  LoginLink as KindeLoginLink, 
  LogoutLink as KindeLogoutLink, 
  RegisterLink as KindeRegisterLink 
} from "@kinde-oss/kinde-auth-nextjs/server";
import type { User, AuthSession } from "./types";

// Dynamic imports to handle server-only modules
async function getKindeServerSession() {
  const kindeModule = await import("@kinde-oss/kinde-auth-nextjs/server");
  return kindeModule.getKindeServerSession();
}

export class KindeAuthService {
  static async getUser(): Promise<User | null> {
    try {
      const { getUser } = await getKindeServerSession();
      const user = await getUser();
      
      if (!user) return null;
      
      return {
        id: user.id,
        kindeId: user.id,
        email: user.email || "",
        firstName: user.given_name || undefined,
        lastName: user.family_name || undefined,
        profilePicture: user.picture || undefined,
        isActive: true,
        preferences: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } catch (error) {
      console.error("Failed to get user:", error);
      return null;
    }
  }

  static async getSession(): Promise<AuthSession | null> {
    try {
      const { getAccessToken, getUser } = await getKindeServerSession();
      const user = await this.getUser();
      const accessToken = await getAccessToken();
      
      if (!user || !accessToken) return null;
      
      return {
        user,
        accessToken: (accessToken as any).access_token || "",
        expiresAt: Date.now() + (((accessToken as any).expires_in || 3600) * 1000),
      };
    } catch (error) {
      console.error("Failed to get session:", error);
      return null;
    }
  }

  static async isAuthenticated(): Promise<boolean> {
    try {
      const { isAuthenticated } = await getKindeServerSession();
      const result = await isAuthenticated();
      return result ?? false;
    } catch (error) {
      console.error("Failed to check authentication:", error);
      return false;
    }
  }

  static async getWebSocketToken(userId: string): Promise<string | null> {
    try {
      const session = await this.getSession();
      if (!session || session.user.id !== userId) {
        return null;
      }
      
      // Generate WebSocket token with user ID and expiration
      const payload = {
        userId,
        expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
      };
      
      // In a real implementation, you'd use a proper JWT library
      // For now, return a simple base64 encoded token
      return Buffer.from(JSON.stringify(payload)).toString('base64');
    } catch (error) {
      console.error("Failed to generate WebSocket token:", error);
      return null;
    }
  }
}

// Export auth components for client use (with dynamic imports)
export async function getAuthComponents() {
  const kindeModule = await import("@kinde-oss/kinde-auth-nextjs/server");
  return {
    LoginLink: kindeModule.LoginLink,
    LogoutLink: kindeModule.LogoutLink,
    RegisterLink: kindeModule.RegisterLink,
  };
}