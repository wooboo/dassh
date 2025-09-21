export interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  loadingFallback?: React.ReactNode
  requireAuth?: boolean
  redirectOnAuth?: boolean
  allowedRoles?: string[]
  allowedPermissions?: string[]
}

/**
 * AuthGuard configuration and utility types
 * 
 * This file provides types and utilities for authentication guards.
 * The actual React components should be implemented in packages/ui
 * due to React dependencies.
 */

export interface AuthState {
  isAuthenticated: boolean | null
  isLoading: boolean | null
  user: any
  permissions?: { permissions: string[] }
}

export interface AuthGuardConfig {
  requireAuth?: boolean
  redirectOnAuth?: boolean
  allowedRoles?: string[]
  allowedPermissions?: string[]
}

/**
 * Utility function to check if user has required roles
 */
export function hasRequiredRole(userRoles: string[], allowedRoles: string[]): boolean {
  if (allowedRoles.length === 0) return true
  return allowedRoles.some(role => userRoles.includes(role))
}

/**
 * Utility function to check if user has required permissions
 */
export function hasRequiredPermission(userPermissions: string[], allowedPermissions: string[]): boolean {
  if (allowedPermissions.length === 0) return true
  return allowedPermissions.some(permission => userPermissions.includes(permission))
}

/**
 * Utility function to determine auth guard action
 */
export function getAuthGuardAction(
  authState: AuthState,
  config: AuthGuardConfig
): 'loading' | 'allow' | 'deny-auth' | 'deny-guest' | 'deny-role' | 'deny-permission' {
  const { isAuthenticated, isLoading } = authState
  const { requireAuth = true, redirectOnAuth = false } = config

  if (isLoading) {
    return 'loading'
  }

  // Handle redirect on auth case (deny when authenticated)
  if (redirectOnAuth && isAuthenticated) {
    return 'deny-guest'
  }

  // Handle require auth case (deny when not authenticated)
  if (requireAuth && !isAuthenticated) {
    return 'deny-auth'
  }

  // TODO: Add role and permission checks when we have proper type definitions
  // This would require the actual user data structure from Kinde

  return 'allow'
}