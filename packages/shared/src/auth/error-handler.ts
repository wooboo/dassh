/**
 * Authentication error handling utilities
 * 
 * Provides centralized error handling for authentication flows:
 * - Kinde authentication errors
 * - Database connection errors
 * - Session management errors
 * - Validation errors
 * - Network and timeout errors
 */

export interface AuthError {
  code: string
  message: string
  details?: any
  timestamp: Date
  recoverable: boolean
}

export type AuthErrorCode = 
  | 'KINDE_AUTH_ERROR'
  | 'KINDE_TOKEN_EXPIRED'
  | 'KINDE_INVALID_TOKEN'
  | 'KINDE_USER_NOT_FOUND'
  | 'KINDE_PERMISSION_DENIED'
  | 'DATABASE_CONNECTION_ERROR'
  | 'DATABASE_QUERY_ERROR'
  | 'SESSION_EXPIRED'
  | 'SESSION_INVALID'
  | 'SESSION_NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'NETWORK_ERROR'
  | 'TIMEOUT_ERROR'
  | 'RATE_LIMITED'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'INTERNAL_ERROR'
  | 'UNKNOWN_ERROR'

/**
 * Core error handling class for authentication
 */
export class AuthErrorHandler {
  private static readonly ERROR_MESSAGES: Record<AuthErrorCode, string> = {
    KINDE_AUTH_ERROR: 'Authentication service error. Please try again.',
    KINDE_TOKEN_EXPIRED: 'Your session has expired. Please sign in again.',
    KINDE_INVALID_TOKEN: 'Invalid authentication token. Please sign in again.',
    KINDE_USER_NOT_FOUND: 'User account not found. Please check your credentials.',
    KINDE_PERMISSION_DENIED: 'You do not have permission to access this resource.',
    DATABASE_CONNECTION_ERROR: 'Database connection error. Please try again later.',
    DATABASE_QUERY_ERROR: 'Database operation failed. Please try again.',
    SESSION_EXPIRED: 'Your session has expired. Please sign in again.',
    SESSION_INVALID: 'Invalid session. Please sign in again.',
    SESSION_NOT_FOUND: 'Session not found. Please sign in again.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    NETWORK_ERROR: 'Network connection error. Please check your internet connection.',
    TIMEOUT_ERROR: 'Request timed out. Please try again.',
    RATE_LIMITED: 'Too many requests. Please wait a moment and try again.',
    UNAUTHORIZED: 'Authentication required. Please sign in to continue.',
    FORBIDDEN: 'Access denied. You do not have permission to perform this action.',
    INTERNAL_ERROR: 'An internal error occurred. Please try again later.',
    UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
  }

  /**
   * Create an AuthError from various error types
   */
  static createError(
    code: AuthErrorCode,
    originalError?: any,
    customMessage?: string
  ): AuthError {
    const message = customMessage || this.ERROR_MESSAGES[code]
    const recoverable = this.isRecoverable(code)

    return {
      code,
      message,
      details: originalError ? this.sanitizeErrorDetails(originalError) : undefined,
      timestamp: new Date(),
      recoverable,
    }
  }

  /**
   * Handle Kinde authentication errors
   */
  static handleKindeError(error: any): AuthError {
    const errorString = error?.message || error?.toString() || ''

    if (errorString.includes('token') && errorString.includes('expired')) {
      return this.createError('KINDE_TOKEN_EXPIRED', error)
    }

    if (errorString.includes('token') && errorString.includes('invalid')) {
      return this.createError('KINDE_INVALID_TOKEN', error)
    }

    if (errorString.includes('user') && errorString.includes('not found')) {
      return this.createError('KINDE_USER_NOT_FOUND', error)
    }

    if (errorString.includes('permission') || errorString.includes('forbidden')) {
      return this.createError('KINDE_PERMISSION_DENIED', error)
    }

    return this.createError('KINDE_AUTH_ERROR', error)
  }

  /**
   * Handle database errors
   */
  static handleDatabaseError(error: any): AuthError {
    const errorString = error?.message || error?.toString() || ''

    if (errorString.includes('connection') || errorString.includes('connect')) {
      return this.createError('DATABASE_CONNECTION_ERROR', error)
    }

    return this.createError('DATABASE_QUERY_ERROR', error)
  }

  /**
   * Handle session errors
   */
  static handleSessionError(error: any): AuthError {
    const errorString = error?.message || error?.toString() || ''

    if (errorString.includes('expired')) {
      return this.createError('SESSION_EXPIRED', error)
    }

    if (errorString.includes('invalid')) {
      return this.createError('SESSION_INVALID', error)
    }

    if (errorString.includes('not found')) {
      return this.createError('SESSION_NOT_FOUND', error)
    }

    return this.createError('INTERNAL_ERROR', error)
  }

  /**
   * Handle validation errors
   */
  static handleValidationError(error: any, customMessage?: string): AuthError {
    return this.createError('VALIDATION_ERROR', error, customMessage)
  }

  /**
   * Handle network errors
   */
  static handleNetworkError(error: any): AuthError {
    const errorString = error?.message || error?.toString() || ''

    if (errorString.includes('timeout') || error?.code === 'TIMEOUT') {
      return this.createError('TIMEOUT_ERROR', error)
    }

    if (errorString.includes('rate') || error?.status === 429) {
      return this.createError('RATE_LIMITED', error)
    }

    if (error?.status === 401) {
      return this.createError('UNAUTHORIZED', error)
    }

    if (error?.status === 403) {
      return this.createError('FORBIDDEN', error)
    }

    return this.createError('NETWORK_ERROR', error)
  }

  /**
   * Generic error handler that tries to categorize unknown errors
   */
  static handleGenericError(error: any): AuthError {
    if (!error) {
      return this.createError('UNKNOWN_ERROR')
    }

    // Check if it's a Kinde error
    if (error?.name?.includes('Kinde') || error?.source?.includes('kinde')) {
      return this.handleKindeError(error)
    }

    // Check if it's a database error
    if (error?.name?.includes('Database') || error?.code?.startsWith('PG')) {
      return this.handleDatabaseError(error)
    }

    // Check if it's a network error
    if (error?.status || error?.code?.includes('NETWORK')) {
      return this.handleNetworkError(error)
    }

    // Check if it's a validation error
    if (error?.name === 'ValidationError' || error?.name === 'ZodError') {
      return this.handleValidationError(error)
    }

    return this.createError('INTERNAL_ERROR', error)
  }

  /**
   * Determine if an error is recoverable (user can retry)
   */
  private static isRecoverable(code: AuthErrorCode): boolean {
    const recoverableErrors: AuthErrorCode[] = [
      'NETWORK_ERROR',
      'TIMEOUT_ERROR',
      'DATABASE_CONNECTION_ERROR',
      'INTERNAL_ERROR',
      'RATE_LIMITED',
    ]

    return recoverableErrors.includes(code)
  }

  /**
   * Sanitize error details to remove sensitive information
   */
  private static sanitizeErrorDetails(error: any): any {
    if (!error) return undefined

    const sanitized: any = {}

    // Include safe properties
    if (error.message) sanitized.message = error.message
    if (error.name) sanitized.name = error.name
    if (error.code) sanitized.code = error.code
    if (error.status) sanitized.status = error.status

    // Remove sensitive information
    const sensitiveKeys = [
      'password',
      'token',
      'secret',
      'key',
      'authorization',
      'cookie',
      'session',
    ]

    // If error has a toJSON method, use it but filter sensitive data
    if (typeof error.toJSON === 'function') {
      const json = error.toJSON()
      Object.keys(json).forEach(key => {
        const lowerKey = key.toLowerCase()
        if (!sensitiveKeys.some(sensitive => lowerKey.includes(sensitive))) {
          sanitized[key] = json[key]
        }
      })
    }

    return sanitized
  }

  /**
   * Convert AuthError to user-friendly message
   */
  static toUserMessage(error: AuthError): string {
    return error.message
  }

  /**
   * Convert AuthError to developer-friendly message (includes details)
   */
  static toDeveloperMessage(error: AuthError): string {
    let message = `[${error.code}] ${error.message}`
    
    if (error.details) {
      message += `\nDetails: ${JSON.stringify(error.details, null, 2)}`
    }
    
    return message
  }

  /**
   * Check if error should trigger a sign-in redirect
   */
  static shouldRedirectToSignIn(error: AuthError): boolean {
    const redirectCodes: AuthErrorCode[] = [
      'KINDE_TOKEN_EXPIRED',
      'KINDE_INVALID_TOKEN',
      'SESSION_EXPIRED',
      'SESSION_INVALID',
      'SESSION_NOT_FOUND',
      'UNAUTHORIZED',
    ]

    return redirectCodes.includes(error.code as AuthErrorCode)
  }

  /**
   * Check if error should be retried automatically
   */
  static shouldRetry(error: AuthError, retryCount: number = 0): boolean {
    const maxRetries = 3
    const retryableCodes: AuthErrorCode[] = [
      'NETWORK_ERROR',
      'TIMEOUT_ERROR',
      'DATABASE_CONNECTION_ERROR',
    ]

    return (
      retryCount < maxRetries &&
      error.recoverable &&
      retryableCodes.includes(error.code as AuthErrorCode)
    )
  }

  /**
   * Get retry delay in milliseconds (exponential backoff)
   */
  static getRetryDelay(retryCount: number): number {
    return Math.min(1000 * Math.pow(2, retryCount), 10000) // Max 10 seconds
  }
}

/**
 * Convenience functions for common error scenarios
 */
export const handleAuthError = AuthErrorHandler.handleGenericError
export const createAuthError = AuthErrorHandler.createError
export const isRecoverableError = (error: AuthError) => error.recoverable
export const shouldRedirectToSignIn = AuthErrorHandler.shouldRedirectToSignIn

/**
 * Error boundary helper for React components
 */
export function getErrorBoundaryFallback(error: AuthError) {
  return {
    title: 'Authentication Error',
    message: AuthErrorHandler.toUserMessage(error),
    canRetry: error.recoverable,
    shouldSignIn: AuthErrorHandler.shouldRedirectToSignIn(error),
  }
}

/**
 * Logging helper for errors (development mode)
 */
export function logAuthError(error: AuthError, context?: string) {
  const isDevelopment = process.env.NODE_ENV === 'development'
  
  if (isDevelopment) {
    console.group(`🔒 Auth Error${context ? ` (${context})` : ''}`)
    console.error('Message:', error.message)
    console.error('Code:', error.code)
    console.error('Recoverable:', error.recoverable)
    console.error('Timestamp:', error.timestamp.toISOString())
    if (error.details) {
      console.error('Details:', error.details)
    }
    console.groupEnd()
  }
}