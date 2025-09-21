/**
 * Authentication configuration and environment variable validation
 */

// Environment variable validation
export interface AuthConfig {
  kindeClientId: string;
  kindeClientSecret: string;
  kindeIssuerUrl: string;
  kindeSiteUrl: string;
  kindePostLogoutRedirectUrl: string;
  kindePostLoginRedirectUrl: string;
  databaseUrl: string;
  jwtSecret: string;
  nodeEnv: string;
}

// Validate and load environment variables
export function loadAuthConfig(): AuthConfig {
  const requiredVars = {
    kindeClientId: process.env.KINDE_CLIENT_ID,
    kindeClientSecret: process.env.KINDE_CLIENT_SECRET,
    kindeIssuerUrl: process.env.KINDE_ISSUER_URL,
    kindeSiteUrl: process.env.KINDE_SITE_URL,
    kindePostLogoutRedirectUrl: process.env.KINDE_POST_LOGOUT_REDIRECT_URL,
    kindePostLoginRedirectUrl: process.env.KINDE_POST_LOGIN_REDIRECT_URL,
    databaseUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET || 'default-secret-for-development',
    nodeEnv: process.env.NODE_ENV || 'development',
  };

  // Check for missing required variables
  const missingVars: string[] = [];
  Object.entries(requiredVars).forEach(([key, value]) => {
    if (!value && key !== 'jwtSecret' && key !== 'nodeEnv') {
      missingVars.push(key.replace(/([A-Z])/g, '_$1').toUpperCase());
    }
  });

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}\n` +
      'Please check your .env.local file and ensure all Kinde configuration variables are set.'
    );
  }

  return requiredVars as AuthConfig;
}

// Default configuration
export const authConfig = loadAuthConfig();

// Validation helpers
export function validateUrl(url: string, name: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    console.error(`Invalid URL for ${name}: ${url}`);
    return false;
  }
}

export function validateEnvironment(): boolean {
  try {
    const config = loadAuthConfig();
    
    // Validate URLs
    const urlValidations = [
      validateUrl(config.kindeIssuerUrl, 'KINDE_ISSUER_URL'),
      validateUrl(config.kindeSiteUrl, 'KINDE_SITE_URL'),
      validateUrl(config.kindePostLogoutRedirectUrl, 'KINDE_POST_LOGOUT_REDIRECT_URL'),
      validateUrl(config.kindePostLoginRedirectUrl, 'KINDE_POST_LOGIN_REDIRECT_URL'),
      validateUrl(config.databaseUrl, 'DATABASE_URL'),
    ];

    return urlValidations.every(valid => valid);
  } catch (error) {
    console.error('Environment validation failed:', error);
    return false;
  }
}

// Session configuration
export const sessionConfig = {
  maxAge: 24 * 60 * 60, // 24 hours in seconds
  renewThreshold: 5 * 60, // Renew if less than 5 minutes remaining
  cleanupInterval: 60 * 60, // Clean up expired sessions every hour
};

// Security configuration
export const securityConfig = {
  bcryptRounds: 12,
  tokenExpiry: '1h',
  refreshTokenExpiry: '7d',
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60, // 15 minutes in seconds
};

// Development helpers
export const isDevelopment = authConfig.nodeEnv === 'development';
export const isProduction = authConfig.nodeEnv === 'production';

export default authConfig;