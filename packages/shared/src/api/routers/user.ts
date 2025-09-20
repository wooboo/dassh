import { z } from 'zod';
import { eq, and, desc } from 'drizzle-orm';
import { protectedProcedure } from '../orpc';
import { users, userProfiles, userSessions } from '../../database';

/**
 * User profile update schema
 */
const updateProfileSchema = z.object({
  user: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    preferences: z.any().optional(),
  }).optional(),
  profile: z.object({
    displayName: z.string().optional(),
    timezone: z.string().optional(),
    language: z.string().optional(),
    theme: z.string().optional(),
    dashboardLayout: z.any().optional(),
    notificationSettings: z.any().optional(),
  }).optional(),
});

/**
 * User procedures with profile and session management
 */
export const userProcedures = {
  /**
   * Get user profile information
   */
  getProfile: protectedProcedure
    .route({ method: 'GET', path: '/user/profile' })
    .handler(async ({ context }) => {
      const { db, user } = context;

      // Find user in database
      const userResult = await db
        .select()
        .from(users)
        .where(eq(users.kindeId, user.id))
        .limit(1);

      if (userResult.length === 0) {
        throw new Error('User profile not found');
      }

      const dbUser = userResult[0]!;

      // Get user profile data
      const profileResult = await db
        .select()
        .from(userProfiles)
        .where(eq(userProfiles.userId, dbUser.id))
        .limit(1);

      const profileData = profileResult.length > 0 ? profileResult[0] : null;

      return {
        user: {
          id: dbUser.id,
          email: dbUser.email,
          firstName: dbUser.firstName,
          lastName: dbUser.lastName,
          profilePicture: dbUser.profilePicture,
          createdAt: dbUser.createdAt,
          updatedAt: dbUser.updatedAt,
          lastLoginAt: dbUser.lastLoginAt,
          isActive: dbUser.isActive,
          preferences: dbUser.preferences,
        },
        profile: profileData ? {
          id: profileData.id,
          displayName: profileData.displayName,
          timezone: profileData.timezone,
          language: profileData.language,
          theme: profileData.theme,
          dashboardLayout: profileData.dashboardLayout,
          notificationSettings: profileData.notificationSettings,
          createdAt: profileData.createdAt,
          updatedAt: profileData.updatedAt,
        } : null,
      };
    }),

  /**
   * Update user profile information
   */
  updateProfile: protectedProcedure
    .route({ method: 'PUT', path: '/user/profile' })
    .input(updateProfileSchema)
    .handler(async ({ context, input }) => {
      const { db, user } = context;
      const { user: userUpdates, profile: profileUpdates } = input;

      // Find user in database
      const existingUserResult = await db
        .select()
        .from(users)
        .where(eq(users.kindeId, user.id))
        .limit(1);

      if (existingUserResult.length === 0) {
        throw new Error('User not found');
      }

      const existingUser = existingUserResult[0]!;
      const userId = existingUser.id;

      // Update user table if user updates provided
      if (userUpdates) {
        const allowedUserFields = ['firstName', 'lastName', 'preferences'];
        const filteredUserUpdates = Object.fromEntries(
          Object.entries(userUpdates).filter(([key]) => 
            allowedUserFields.includes(key) && userUpdates[key as keyof typeof userUpdates] !== undefined
          )
        );

        if (Object.keys(filteredUserUpdates).length > 0) {
          await db
            .update(users)
            .set({
              ...filteredUserUpdates,
              updatedAt: new Date(),
            })
            .where(eq(users.id, userId));
        }
      }

      // Update or create user profile if profile updates provided
      if (profileUpdates) {
        const allowedProfileFields = [
          'displayName',
          'timezone',
          'language',
          'theme',
          'dashboardLayout',
          'notificationSettings',
        ];
        
        const filteredProfileUpdates = Object.fromEntries(
          Object.entries(profileUpdates).filter(([key]) => 
            allowedProfileFields.includes(key) && profileUpdates[key as keyof typeof profileUpdates] !== undefined
          )
        );

        if (Object.keys(filteredProfileUpdates).length > 0) {
          // Check if profile exists
          const existingProfileResult = await db
            .select()
            .from(userProfiles)
            .where(eq(userProfiles.userId, userId))
            .limit(1);

          if (existingProfileResult.length > 0) {
            // Update existing profile
            await db
              .update(userProfiles)
              .set({
                ...filteredProfileUpdates,
                updatedAt: new Date(),
              })
              .where(eq(userProfiles.userId, userId));
          } else {
            // Create new profile
            await db
              .insert(userProfiles)
              .values({
                userId,
                ...filteredProfileUpdates,
                createdAt: new Date(),
                updatedAt: new Date(),
              });
          }
        }
      }

      // Return updated profile data (reuse getProfile logic)
      return await context.db
        .select()
        .from(users)
        .where(eq(users.kindeId, user.id))
        .limit(1)
        .then(async (userResult) => {
          if (userResult.length === 0) {
            throw new Error('User not found');
          }

          const dbUser = userResult[0]!;
          const profileResult = await db
            .select()
            .from(userProfiles)
            .where(eq(userProfiles.userId, dbUser.id))
            .limit(1);

          const profileData = profileResult.length > 0 ? profileResult[0] : null;

          return {
            user: {
              id: dbUser.id,
              email: dbUser.email,
              firstName: dbUser.firstName,
              lastName: dbUser.lastName,
              profilePicture: dbUser.profilePicture,
              createdAt: dbUser.createdAt,
              updatedAt: dbUser.updatedAt,
              lastLoginAt: dbUser.lastLoginAt,
              isActive: dbUser.isActive,
              preferences: dbUser.preferences,
            },
            profile: profileData ? {
              id: profileData.id,
              displayName: profileData.displayName,
              timezone: profileData.timezone,
              language: profileData.language,
              theme: profileData.theme,
              dashboardLayout: profileData.dashboardLayout,
              notificationSettings: profileData.notificationSettings,
              createdAt: profileData.createdAt,
              updatedAt: profileData.updatedAt,
            } : null,
          };
        });
    }),

  /**
   * Get user's active sessions
   */
  getSessions: protectedProcedure
    .route({ method: 'GET', path: '/user/sessions' })
    .handler(async ({ context }) => {
      const { db, user } = context;

      // Find user in database
      const userResult = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.kindeId, user.id))
        .limit(1);

      if (userResult.length === 0) {
        throw new Error('User not found');
      }

      const dbUser = userResult[0]!;

      // Get user sessions
      const sessions = await db
        .select({
          id: userSessions.id,
          kindeSessionId: userSessions.kindeSessionId,
          userAgent: userSessions.userAgent,
          ipAddress: userSessions.ipAddress,
          createdAt: userSessions.createdAt,
          lastActivityAt: userSessions.lastActivityAt,
          expiresAt: userSessions.expiresAt,
          isActive: userSessions.isActive,
        })
        .from(userSessions)
        .where(
          and(
            eq(userSessions.userId, dbUser.id),
            eq(userSessions.isActive, true)
          )
        )
        .orderBy(desc(userSessions.lastActivityAt));

      return {
        sessions: sessions.map(session => ({
          id: session.id,
          userAgent: session.userAgent,
          ipAddress: session.ipAddress,
          createdAt: session.createdAt,
          lastActivityAt: session.lastActivityAt,
          expiresAt: session.expiresAt,
          isActive: session.isActive,
          isCurrent: session.kindeSessionId === user.id, // Basic check
        })),
      };
    }),

  /**
   * Terminate a specific session
   */
  terminateSession: protectedProcedure
    .route({ method: 'DELETE', path: '/user/sessions/{sessionId}' })
    .input(z.object({
      sessionId: z.string(),
    }))
    .handler(async ({ context, input }) => {
      const { db, user } = context;
      const { sessionId } = input;

      // Find user in database
      const userResult = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.kindeId, user.id))
        .limit(1);

      if (userResult.length === 0) {
        throw new Error('User not found');
      }

      const dbUser = userResult[0]!;

      // Terminate the session
      await db
        .update(userSessions)
        .set({
          isActive: false,
        })
        .where(
          and(
            eq(userSessions.id, sessionId),
            eq(userSessions.userId, dbUser.id)
          )
        );

      return { success: true };
    }),
};