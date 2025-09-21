export interface User {
  id: string;
  kindeId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  isActive: boolean;
  preferences: Record<string, any>;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSession {
  id: string;
  userId: string;
  kindeSessionId?: string;
  userAgent?: string;
  ipAddress?: string;
  createdAt: Date;
  lastActivityAt: Date;
  expiresAt: Date;
  isActive: boolean;
}

export interface UserProfile {
  id: string;
  userId: string;
  displayName?: string;
  timezone: string;
  language: string;
  theme: 'light' | 'dark' | 'auto';
  dashboardLayout: Record<string, any>;
  notificationSettings: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthSession {
  user: User;
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
}

export interface AuthConfig {
  clientId: string;
  clientSecret: string;
  issuerUrl: string;
  siteUrl: string;
  postLoginRedirectUrl: string;
  postLogoutRedirectUrl: string;
}

export interface WebSocketAuth {
  userId: string;
  token: string;
  expiresAt: number;
}

// API Response types
export interface AuthStatusResponse {
  isAuthenticated: boolean;
  user?: Pick<User, 'id' | 'email' | 'firstName' | 'lastName' | 'profilePicture'>;
}

export interface ProfileResponse {
  user: User;
  profile?: UserProfile;
}

export interface SessionsResponse {
  sessions: Array<UserSession & { isCurrent: boolean }>;
}

// Error types
export interface AuthError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// Middleware types
export interface AuthRequest {
  url: string;
  pathname: string;
}

export interface AuthResponse {
  type: "next" | "redirect" | "unauthorized";
  redirectUrl?: string;
  status?: number;
  error?: string;
}