import { z } from 'zod'

/**
 * Authentication validation schemas using Zod
 * 
 * Provides comprehensive validation for all authentication-related data:
 * - User registration and profile data
 * - Session management
 * - Preference updates
 * - Password requirements
 * - Email validation
 */

// Base validation schemas
export const emailSchema = z
  .string()
  .email('Please enter a valid email address')
  .min(1, 'Email is required')
  .max(255, 'Email must be less than 255 characters')

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .max(128, 'Password must be less than 128 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain at least one lowercase letter, one uppercase letter, and one number'
  )

export const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(100, 'Name must be less than 100 characters')
  .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes')

export const displayNameSchema = z
  .string()
  .min(1, 'Display name is required')
  .max(50, 'Display name must be less than 50 characters')
  .regex(/^[a-zA-Z0-9\s._-]+$/, 'Display name can only contain letters, numbers, spaces, dots, underscores, and hyphens')

// User registration schema
export const userRegistrationSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: nameSchema,
  lastName: nameSchema,
  acceptTerms: z
    .boolean()
    .refine(val => val === true, 'You must accept the terms and conditions'),
  marketingEmails: z.boolean().optional().default(false),
})

export type UserRegistration = z.infer<typeof userRegistrationSchema>

// User sign-in schema
export const userSignInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional().default(false),
})

export type UserSignIn = z.infer<typeof userSignInSchema>

// Password reset request schema
export const passwordResetRequestSchema = z.object({
  email: emailSchema,
})

export type PasswordResetRequest = z.infer<typeof passwordResetRequestSchema>

// Password reset confirmation schema
export const passwordResetSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Password confirmation is required'),
}).refine(
  data => data.password === data.confirmPassword,
  {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  }
)

export type PasswordReset = z.infer<typeof passwordResetSchema>

// User profile update schema
export const userProfileUpdateSchema = z.object({
  firstName: nameSchema.optional(),
  lastName: nameSchema.optional(),
  displayName: displayNameSchema.optional(),
  profilePicture: z.string().url('Profile picture must be a valid URL').optional(),
})

export type UserProfileUpdate = z.infer<typeof userProfileUpdateSchema>

// User preferences schema
export const userPreferencesSchema = z.object({
  timezone: z
    .string()
    .min(1, 'Timezone is required')
    .max(50, 'Timezone must be less than 50 characters')
    .regex(/^[A-Za-z_]+\/[A-Za-z_]+$/, 'Invalid timezone format'),
  language: z
    .string()
    .length(2, 'Language must be a 2-character code')
    .regex(/^[a-z]{2}$/, 'Language must be lowercase'),
  theme: z
    .enum(['light', 'dark', 'auto'])
    .default('light'),
  dashboardLayout: z.record(z.string(), z.any()).optional(),
  notificationSettings: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(true),
    marketing: z.boolean().default(false),
    security: z.boolean().default(true),
  }).optional(),
})

export type UserPreferences = z.infer<typeof userPreferencesSchema>

// Session management schemas
export const sessionCreateSchema = z.object({
  userAgent: z.string().max(500, 'User agent must be less than 500 characters').optional(),
  ipAddress: z.string().optional(),
  expiresIn: z
    .number()
    .int('Expiration must be an integer')
    .min(1, 'Expiration must be at least 1 second')
    .max(86400 * 30, 'Expiration cannot be more than 30 days'), // 30 days in seconds
})

export type SessionCreate = z.infer<typeof sessionCreateSchema>

export const sessionUpdateSchema = z.object({
  userAgent: z.string().max(500, 'User agent must be less than 500 characters').optional(),
  ipAddress: z.string().optional(),
})

export type SessionUpdate = z.infer<typeof sessionUpdateSchema>

// API request schemas
export const paginationSchema = z.object({
  page: z
    .number()
    .int('Page must be an integer')
    .min(1, 'Page must be at least 1')
    .default(1),
  limit: z
    .number()
    .int('Limit must be an integer')
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot be more than 100')
    .default(20),
})

export type Pagination = z.infer<typeof paginationSchema>

export const sortSchema = z.object({
  field: z.string().min(1, 'Sort field is required'),
  direction: z.enum(['asc', 'desc']).default('asc'),
})

export type Sort = z.infer<typeof sortSchema>

// Query schemas for API endpoints
export const userQuerySchema = paginationSchema.extend({
  search: z.string().max(255, 'Search term must be less than 255 characters').optional(),
  sort: sortSchema.optional(),
  active: z.boolean().optional(),
})

export type UserQuery = z.infer<typeof userQuerySchema>

export const sessionQuerySchema = paginationSchema.extend({
  userId: z.string().uuid('Invalid user ID format').optional(),
  active: z.boolean().optional(),
  sort: sortSchema.optional(),
})

export type SessionQuery = z.infer<typeof sessionQuerySchema>

// Email verification schema
export const emailVerificationSchema = z.object({
  token: z.string().min(1, 'Verification token is required'),
})

export type EmailVerification = z.infer<typeof emailVerificationSchema>

// Two-factor authentication schemas
export const twoFactorSetupSchema = z.object({
  secret: z.string().min(1, 'Secret is required'),
  code: z
    .string()
    .length(6, 'Verification code must be 6 digits')
    .regex(/^\d{6}$/, 'Verification code must contain only digits'),
})

export type TwoFactorSetup = z.infer<typeof twoFactorSetupSchema>

export const twoFactorVerifySchema = z.object({
  code: z
    .string()
    .length(6, 'Verification code must be 6 digits')
    .regex(/^\d{6}$/, 'Verification code must contain only digits'),
})

export type TwoFactorVerify = z.infer<typeof twoFactorVerifySchema>

// Account security schemas
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
  confirmPassword: z.string().min(1, 'Password confirmation is required'),
}).refine(
  data => data.newPassword === data.confirmPassword,
  {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  }
).refine(
  data => data.currentPassword !== data.newPassword,
  {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  }
)

export type ChangePassword = z.infer<typeof changePasswordSchema>

// Account deletion schema
export const accountDeletionSchema = z.object({
  password: z.string().min(1, 'Password is required to delete account'),
  confirmation: z
    .string()
    .refine(val => val === 'DELETE', 'You must type DELETE to confirm account deletion'),
})

export type AccountDeletion = z.infer<typeof accountDeletionSchema>

// Utility functions for validation
export function validateEmail(email: string): { valid: boolean; error?: string } {
  try {
    emailSchema.parse(email)
    return { valid: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.issues[0]?.message }
    }
    return { valid: false, error: 'Invalid email format' }
  }
}

export function validatePassword(password: string): { valid: boolean; error?: string } {
  try {
    passwordSchema.parse(password)
    return { valid: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.issues[0]?.message }
    }
    return { valid: false, error: 'Invalid password format' }
  }
}

export function getPasswordStrength(password: string): {
  score: number
  feedback: string[]
} {
  const feedback: string[] = []
  let score = 0

  // Length check
  if (password.length >= 8) score += 1
  else feedback.push('Use at least 8 characters')

  if (password.length >= 12) score += 1
  else if (password.length >= 8) feedback.push('Consider using 12+ characters for better security')

  // Character diversity
  if (/[a-z]/.test(password)) score += 1
  else feedback.push('Include lowercase letters')

  if (/[A-Z]/.test(password)) score += 1
  else feedback.push('Include uppercase letters')

  if (/\d/.test(password)) score += 1
  else feedback.push('Include numbers')

  if (/[^a-zA-Z\d]/.test(password)) score += 1
  else feedback.push('Include special characters')

  // Common patterns (reduce score)
  if (/(.)\1{2,}/.test(password)) {
    score = Math.max(0, score - 1)
    feedback.push('Avoid repeating characters')
  }

  if (/123|abc|qwe/i.test(password)) {
    score = Math.max(0, score - 1)
    feedback.push('Avoid common sequences')
  }

  return { score: Math.min(5, score), feedback }
}