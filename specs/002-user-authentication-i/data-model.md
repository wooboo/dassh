# Data Model: User Authentication System

**Feature**: User Authentication System  
**Date**: September 20, 2025  
**Database**: PostgreSQL with Drizzle ORM

## Overview
Data model for user authentication system integrating with Kinde authentication service. The model extends Kinde's user data with application-specific information and session tracking.

## Entities

### User
**Purpose**: Represents an authenticated user with extended profile information beyond Kinde's basic user data.

**Fields**:
- `id` (UUID, Primary Key): Unique identifier matching Kinde user ID
- `kindeId` (String, Unique, Not Null): Kinde user identifier for API integration
- `email` (String, Unique, Not Null): User email address from Kinde
- `firstName` (String, Nullable): User first name from Kinde profile
- `lastName` (String, Nullable): User last name from Kinde profile
- `profilePicture` (String, Nullable): URL to user profile picture from Kinde
- `createdAt` (Timestamp, Not Null): Account creation timestamp
- `updatedAt` (Timestamp, Not Null): Last profile update timestamp
- `lastLoginAt` (Timestamp, Nullable): Last successful login timestamp
- `isActive` (Boolean, Default: true): Account status flag
- `preferences` (JSONB, Default: {}): User dashboard preferences and settings

**Relationships**:
- One-to-Many: User → UserSessions
- One-to-One: User → UserProfile (optional extended profile)

**Validation Rules**:
- Email must be valid email format
- kindeId must be unique across all users
- firstName and lastName must be 1-100 characters if provided
- profilePicture must be valid URL if provided

**State Transitions**:
- New User: isActive = true, preferences = {}, lastLoginAt = null
- Login: lastLoginAt updated, preferences preserved
- Deactivation: isActive = false, sessions invalidated
- Reactivation: isActive = true, new session required

### UserSession
**Purpose**: Tracks active authentication sessions for security monitoring and session management.

**Fields**:
- `id` (UUID, Primary Key): Unique session identifier
- `userId` (UUID, Foreign Key → User.id): Reference to authenticated user
- `kindeSessionId` (String, Nullable): Kinde session identifier if available
- `userAgent` (String, Nullable): Browser/client user agent string
- `ipAddress` (String, Nullable): Client IP address for security tracking
- `createdAt` (Timestamp, Not Null): Session creation timestamp
- `lastActivityAt` (Timestamp, Not Null): Last activity timestamp
- `expiresAt` (Timestamp, Not Null): Session expiration timestamp
- `isActive` (Boolean, Default: true): Session validity flag

**Relationships**:
- Many-to-One: UserSession → User

**Validation Rules**:
- userId must reference existing user
- expiresAt must be future timestamp
- ipAddress must be valid IPv4 or IPv6 if provided
- userAgent maximum 500 characters

**State Transitions**:
- New Session: isActive = true, lastActivityAt = createdAt
- Activity Update: lastActivityAt updated, expiresAt may extend
- Expiration: isActive = false when expiresAt passed
- Manual Logout: isActive = false, expiresAt = current time

### UserProfile
**Purpose**: Extended user profile information for dashboard customization and user preferences.

**Fields**:
- `id` (UUID, Primary Key): Unique profile identifier
- `userId` (UUID, Foreign Key → User.id, Unique): Reference to user (one-to-one)
- `displayName` (String, Nullable): Custom display name for dashboard
- `timezone` (String, Default: 'UTC'): User timezone preference
- `language` (String, Default: 'en'): User language preference
- `theme` (String, Default: 'light'): Dashboard theme preference ('light'|'dark'|'auto')
- `dashboardLayout` (JSONB, Default: {}): Dashboard widget layout configuration
- `notificationSettings` (JSONB, Default: {}): User notification preferences
- `createdAt` (Timestamp, Not Null): Profile creation timestamp
- `updatedAt` (Timestamp, Not Null): Last profile update timestamp

**Relationships**:
- One-to-One: UserProfile → User

**Validation Rules**:
- userId must reference existing user and be unique
- displayName must be 1-50 characters if provided
- timezone must be valid IANA timezone string
- language must be valid ISO 639-1 language code
- theme must be 'light', 'dark', or 'auto'

**State Transitions**:
- Profile Creation: Default values applied, linked to user
- Settings Update: updatedAt timestamp updated, preferences saved
- Theme Change: theme updated, dashboard re-rendered
- Layout Change: dashboardLayout updated with widget positions

## Database Schema (Drizzle ORM)

```typescript
// Schema definition for Drizzle ORM
import { pgTable, uuid, varchar, timestamp, boolean, jsonb, text, inet } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  kindeId: varchar('kinde_id', { length: 255 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  profilePicture: text('profile_picture'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  lastLoginAt: timestamp('last_login_at'),
  isActive: boolean('is_active').notNull().default(true),
  preferences: jsonb('preferences').notNull().default({}),
});

export const userSessions = pgTable('user_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  kindeSessionId: varchar('kinde_session_id', { length: 255 }),
  userAgent: varchar('user_agent', { length: 500 }),
  ipAddress: inet('ip_address'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  lastActivityAt: timestamp('last_activity_at').notNull().defaultNow(),
  expiresAt: timestamp('expires_at').notNull(),
  isActive: boolean('is_active').notNull().default(true),
});

export const userProfiles = pgTable('user_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  displayName: varchar('display_name', { length: 50 }),
  timezone: varchar('timezone', { length: 50 }).notNull().default('UTC'),
  language: varchar('language', { length: 2 }).notNull().default('en'),
  theme: varchar('theme', { length: 10 }).notNull().default('light'),
  dashboardLayout: jsonb('dashboard_layout').notNull().default({}),
  notificationSettings: jsonb('notification_settings').notNull().default({}),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  sessions: many(userSessions),
  profile: one(userProfiles, { fields: [users.id], references: [userProfiles.userId] }),
}));

export const userSessionsRelations = relations(userSessions, ({ one }) => ({
  user: one(users, { fields: [userSessions.userId], references: [users.id] }),
}));

export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  user: one(users, { fields: [userProfiles.userId], references: [users.id] }),
}));
```

## Indexes

**Performance Optimization**:
- `idx_users_kinde_id`: Unique index on users.kindeId for fast Kinde lookups
- `idx_users_email`: Unique index on users.email for authentication queries
- `idx_user_sessions_user_id`: Index on userSessions.userId for session queries
- `idx_user_sessions_active`: Composite index on (userId, isActive) for active session lookups
- `idx_user_sessions_expires_at`: Index on userSessions.expiresAt for cleanup queries
- `idx_user_profiles_user_id`: Unique index on userProfiles.userId for profile lookups

**Security Indexes**:
- `idx_user_sessions_ip_address`: Index on userSessions.ipAddress for security monitoring
- `idx_users_last_login`: Index on users.lastLoginAt for activity analysis

## Migration Strategy

**Initial Migration**: Create all tables with indexes and foreign key constraints
**Data Seeding**: No initial data required - users created through Kinde authentication
**Rollback Plan**: Drop tables in reverse dependency order (profiles → sessions → users)

**Future Considerations**:
- User data export/import capabilities
- Session table partitioning by date for large-scale deployments
- Audit log table for user activity tracking
- Integration with Kinde webhooks for user data synchronization

## Data Access Patterns

**Authentication Queries**:
- Find user by Kinde ID: Single query with kindeId index
- Validate active session: Join user and session tables with active flags
- Update last login: Single user update with timestamp

**Profile Management**:
- Load user profile: Join user and profile tables
- Update preferences: Single profile update with JSON merge
- Dashboard layout: JSON field query and update

**Session Management**:
- Create new session: Insert with expiration calculation
- Cleanup expired sessions: Bulk update based on expiresAt
- Track user activity: Update lastActivityAt on user actions

This data model provides comprehensive user management while integrating seamlessly with Kinde authentication service and supporting the constitutional requirements for PostgreSQL and Drizzle ORM.