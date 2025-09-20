import { 
  getKindeServerSession, 
  LoginLink, 
  LogoutLink, 
  RegisterLink 
} from "@kinde-oss/kinde-auth-nextjs/server";
import type { User, AuthSession } from "./types";

export class KindeAuthService {
  static async getUser(): Promise<User | null> {
    try {
      const { getUser } = getKindeServerSession();
      const user = await getUser();
      
      if (!user) return null;
      
      return {
        id: user.id,
        email: user.email || "",
        given_name: user.given_name || undefined,
        family_name: user.family_name || undefined,
        picture: user.picture || undefined,
      };
    } catch (error) {
      console.error("Failed to get user:", error);
      return null;
    }
  }

  static async getSession(): Promise<AuthSession | null> {
    try {
      const { getAccessToken, getUser } = getKindeServerSession();
      const user = await this.getUser();
      const accessToken = await getAccessToken();
      
      if (!user || !accessToken) return null;
      
      return {
        user,
        accessToken: accessToken.access_token,
        expiresAt: Date.now() + (accessToken.expires_in * 1000),
      };
    } catch (error) {
      console.error("Failed to get session:", error);
      return null;
    }
  }

  static async isAuthenticated(): Promise<boolean> {
    try {
      const { isAuthenticated } = getKindeServerSession();
      return await isAuthenticated();
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

// Export auth components for client use
export { LoginLink, LogoutLink, RegisterLink };