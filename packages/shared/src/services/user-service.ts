import { eq, and } from 'drizzle-orm';
import { db } from '../database/connection';
import { users, userProfiles, type User, type UserProfile, type NewUser, type NewUserProfile } from '../database/schema';

/**
 * Kinde user type - this is what we get from Kinde authentication
 */
interface KindeUser {
  id: string;
  email: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
}

/**
 * User service layer for database operations
 * Provides clean abstraction for user-related database queries
 */
export class UserService {
  /**
   * Find user by Kinde ID
   */
  static async findByKindeId(kindeId: string): Promise<User | null> {
    try {
      const result = await db
        .select()
        .from(users)
        .where(eq(users.kindeId, kindeId))
        .limit(1);

      return result.length > 0 ? result[0]! : null;
    } catch (error) {
      console.error('Failed to find user by Kinde ID:', error);
      throw new Error('Database error while finding user');
    }
  }

  /**
   * Find user by email
   */
  static async findByEmail(email: string): Promise<User | null> {
    try {
      const result = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      return result.length > 0 ? result[0]! : null;
    } catch (error) {
      console.error('Failed to find user by email:', error);
      throw new Error('Database error while finding user');
    }
  }

  /**
   * Create a new user from Kinde user data
   */
  static async createUser(kindeUser: KindeUser): Promise<User> {
    try {
      const newUser: NewUser = {
        kindeId: kindeUser.id,
        email: kindeUser.email,
        firstName: kindeUser.given_name || null,
        lastName: kindeUser.family_name || null,
        profilePicture: kindeUser.picture || null,
        lastLoginAt: new Date(),
        isActive: true,
        preferences: {},
      };

      const result = await db
        .insert(users)
        .values(newUser)
        .returning();

      return result[0]!;
    } catch (error) {
      console.error('Failed to create user:', error);
      throw new Error('Database error while creating user');
    }
  }

  /**
   * Update user information
   */
  static async updateUser(
    userId: string, 
    updates: Partial<Pick<User, 'firstName' | 'lastName' | 'profilePicture' | 'preferences' | 'lastLoginAt'>>
  ): Promise<User> {
    try {
      const result = await db
        .update(users)
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId))
        .returning();

      if (result.length === 0) {
        throw new Error('User not found');
      }

      return result[0]!;
    } catch (error) {
      console.error('Failed to update user:', error);
      throw new Error('Database error while updating user');
    }
  }

  /**
   * Update user's last login timestamp
   */
  static async updateLastLogin(userId: string): Promise<void> {
    try {
      await db
        .update(users)
        .set({
          lastLoginAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));
    } catch (error) {
      console.error('Failed to update last login:', error);
      throw new Error('Database error while updating last login');
    }
  }

  /**
   * Deactivate user account
   */
  static async deactivateUser(userId: string): Promise<void> {
    try {
      await db
        .update(users)
        .set({
          isActive: false,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));
    } catch (error) {
      console.error('Failed to deactivate user:', error);
      throw new Error('Database error while deactivating user');
    }
  }

  /**
   * Get user with profile information
   */
  static async getUserWithProfile(kindeId: string): Promise<{
    user: User;
    profile: UserProfile | null;
  } | null> {
    try {
      // Get user
      const user = await this.findByKindeId(kindeId);
      if (!user) {
        return null;
      }

      // Get profile
      const profileResult = await db
        .select()
        .from(userProfiles)
        .where(eq(userProfiles.userId, user.id))
        .limit(1);

      const profile = profileResult.length > 0 ? profileResult[0]! : null;

      return { user, profile };
    } catch (error) {
      console.error('Failed to get user with profile:', error);
      throw new Error('Database error while getting user with profile');
    }
  }

  /**
   * Find or create user from Kinde authentication
   * This is typically called during the authentication flow
   */
  static async findOrCreateFromKinde(kindeUser: KindeUser): Promise<User> {
    try {
      // Try to find existing user
      let user = await this.findByKindeId(kindeUser.id);
      
      if (!user) {
        // Create new user if not found
        user = await this.createUser(kindeUser);
      } else {
        // Update last login and any changed profile info from Kinde
        const updates: Partial<User> = {
          lastLoginAt: new Date(),
        };

        // Update profile fields if they've changed in Kinde
        if (kindeUser.email !== user.email) {
          updates.email = kindeUser.email;
        }
        if (kindeUser.given_name && kindeUser.given_name !== user.firstName) {
          updates.firstName = kindeUser.given_name;
        }
        if (kindeUser.family_name && kindeUser.family_name !== user.lastName) {
          updates.lastName = kindeUser.family_name;
        }
        if (kindeUser.picture && kindeUser.picture !== user.profilePicture) {
          updates.profilePicture = kindeUser.picture;
        }

        // Only update if there are changes
        if (Object.keys(updates).length > 1) { // More than just lastLoginAt
          user = await this.updateUser(user.id, updates);
        } else {
          await this.updateLastLogin(user.id);
        }
      }

      return user;
    } catch (error) {
      console.error('Failed to find or create user from Kinde:', error);
      throw new Error('Database error during user authentication');
    }
  }

  /**
   * Get user's preferences
   */
  static async getUserPreferences(userId: string): Promise<Record<string, unknown>> {
    try {
      const result = await db
        .select({ preferences: users.preferences })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      return result.length > 0 ? (result[0]!.preferences as Record<string, unknown>) : {};
    } catch (error) {
      console.error('Failed to get user preferences:', error);
      throw new Error('Database error while getting user preferences');
    }
  }

  /**
   * Update user's preferences
   */
  static async updateUserPreferences(
    userId: string, 
    preferences: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    try {
      const result = await db
        .update(users)
        .set({
          preferences: preferences as any,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId))
        .returning({ preferences: users.preferences });

      if (result.length === 0) {
        throw new Error('User not found');
      }

      return result[0]!.preferences as Record<string, unknown>;
    } catch (error) {
      console.error('Failed to update user preferences:', error);
      throw new Error('Database error while updating user preferences');
    }
  }

  /**
   * Merge new preferences with existing ones
   */
  static async mergeUserPreferences(
    userId: string, 
    newPreferences: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    try {
      const currentPreferences = await this.getUserPreferences(userId);
      const mergedPreferences = {
        ...currentPreferences,
        ...newPreferences,
      };

      return await this.updateUserPreferences(userId, mergedPreferences);
    } catch (error) {
      console.error('Failed to merge user preferences:', error);
      throw new Error('Database error while merging user preferences');
    }
  }
}