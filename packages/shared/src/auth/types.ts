export interface User {
  id: string;
  email: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
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