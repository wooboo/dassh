import { eq } from 'drizzle-orm';
import { db } from '../database/connection';
import { userProfiles, users, type UserProfile, type NewUserProfile } from '../database/schema';

/**
 * Profile service layer for user profile management
 * Handles profile creation, updates, and preferences
 */
export class ProfileService {
  /**
   * Create a new user profile
   */
  static async createProfile(profileData: {
    userId: string;
    displayName?: string;
    timezone?: string;
    language?: string;
    theme?: string;
    dashboardLayout?: any;
    notificationSettings?: any;
  }): Promise<UserProfile> {
    try {
      const newProfile: NewUserProfile = {
        userId: profileData.userId,
        displayName: profileData.displayName || null,
        timezone: profileData.timezone || 'UTC',
        language: profileData.language || 'en',
        theme: profileData.theme || 'light',
        dashboardLayout: profileData.dashboardLayout || {},
        notificationSettings: profileData.notificationSettings || {},
      };

      const result = await db
        .insert(userProfiles)
        .values(newProfile)
        .returning();

      return result[0]!;
    } catch (error) {
      console.error('Failed to create profile:', error);
      throw new Error('Database error while creating profile');
    }
  }

  /**
   * Get profile by user ID
   */
  static async getProfileByUserId(userId: string): Promise<UserProfile | null> {
    try {
      const result = await db
        .select()
        .from(userProfiles)
        .where(eq(userProfiles.userId, userId))
        .limit(1);

      return result.length > 0 ? result[0]! : null;
    } catch (error) {
      console.error('Failed to get profile by user ID:', error);
      throw new Error('Database error while fetching profile');
    }
  }

  /**
   * Get profile by profile ID
   */
  static async getProfileById(profileId: string): Promise<UserProfile | null> {
    try {
      const result = await db
        .select()
        .from(userProfiles)
        .where(eq(userProfiles.id, profileId))
        .limit(1);

      return result.length > 0 ? result[0]! : null;
    } catch (error) {
      console.error('Failed to get profile by ID:', error);
      throw new Error('Database error while fetching profile');
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(
    userId: string,
    updates: Partial<{
      displayName: string | null;
      timezone: string;
      language: string;
      theme: string;
      dashboardLayout: any;
      notificationSettings: any;
    }>
  ): Promise<UserProfile | null> {
    try {
      const result = await db
        .update(userProfiles)
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where(eq(userProfiles.userId, userId))
        .returning();

      return result.length > 0 ? result[0]! : null;
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw new Error('Database error while updating profile');
    }
  }

  /**
   * Update display name
   */
  static async updateDisplayName(userId: string, displayName: string): Promise<UserProfile | null> {
    return this.updateProfile(userId, { displayName });
  }

  /**
   * Update timezone
   */
  static async updateTimezone(userId: string, timezone: string): Promise<UserProfile | null> {
    return this.updateProfile(userId, { timezone });
  }

  /**
   * Update language
   */
  static async updateLanguage(userId: string, language: string): Promise<UserProfile | null> {
    return this.updateProfile(userId, { language });
  }

  /**
   * Update theme preference
   */
  static async updateTheme(userId: string, theme: string): Promise<UserProfile | null> {
    return this.updateProfile(userId, { theme });
  }

  /**
   * Update dashboard layout
   */
  static async updateDashboardLayout(userId: string, dashboardLayout: any): Promise<UserProfile | null> {
    return this.updateProfile(userId, { dashboardLayout });
  }

  /**
   * Update notification settings
   */
  static async updateNotificationSettings(userId: string, notificationSettings: any): Promise<UserProfile | null> {
    return this.updateProfile(userId, { notificationSettings });
  }

  /**
   * Get profile with user information
   */
  static async getProfileWithUser(userId: string): Promise<{
    profile: UserProfile;
    user: {
      id: string;
      kindeId: string;
      email: string;
      firstName: string | null;
      lastName: string | null;
    };
  } | null> {
    try {
      const result = await db
        .select({
          // Profile fields
          profileId: userProfiles.id,
          profileUserId: userProfiles.userId,
          displayName: userProfiles.displayName,
          timezone: userProfiles.timezone,
          language: userProfiles.language,
          theme: userProfiles.theme,
          dashboardLayout: userProfiles.dashboardLayout,
          notificationSettings: userProfiles.notificationSettings,
          profileCreatedAt: userProfiles.createdAt,
          profileUpdatedAt: userProfiles.updatedAt,
          // User fields
          userId: users.id,
          kindeId: users.kindeId,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
        })
        .from(userProfiles)
        .innerJoin(users, eq(userProfiles.userId, users.id))
        .where(eq(userProfiles.userId, userId))
        .limit(1);

      if (result.length === 0) {
        return null;
      }

      const row = result[0]!;
      return {
        profile: {
          id: row.profileId,
          userId: row.profileUserId,
          displayName: row.displayName,
          timezone: row.timezone,
          language: row.language,
          theme: row.theme,
          dashboardLayout: row.dashboardLayout,
          notificationSettings: row.notificationSettings,
          createdAt: row.profileCreatedAt,
          updatedAt: row.profileUpdatedAt,
        },
        user: {
          id: row.userId,
          kindeId: row.kindeId,
          email: row.email,
          firstName: row.firstName,
          lastName: row.lastName,
        },
      };
    } catch (error) {
      console.error('Failed to get profile with user:', error);
      throw new Error('Database error while fetching profile with user information');
    }
  }

  /**
   * Find or create profile for user
   */
  static async findOrCreateProfile(userId: string): Promise<UserProfile> {
    try {
      // Try to find existing profile
      const existingProfile = await this.getProfileByUserId(userId);
      if (existingProfile) {
        return existingProfile;
      }

      // Create new profile with defaults
      return await this.createProfile({
        userId,
        timezone: 'UTC',
        language: 'en',
        theme: 'light',
        dashboardLayout: {},
        notificationSettings: {},
      });
    } catch (error) {
      console.error('Failed to find or create profile:', error);
      throw new Error('Database error while finding or creating profile');
    }
  }

  /**
   * Delete user profile
   */
  static async deleteProfile(userId: string): Promise<boolean> {
    try {
      const result = await db
        .delete(userProfiles)
        .where(eq(userProfiles.userId, userId))
        .returning();

      return result.length > 0;
    } catch (error) {
      console.error('Failed to delete profile:', error);
      throw new Error('Database error while deleting profile');
    }
  }

  /**
   * Get notification settings from profile
   */
  static async getNotificationSettings(userId: string): Promise<any | null> {
    try {
      const profile = await this.getProfileByUserId(userId);
      return profile ? profile.notificationSettings : null;
    } catch (error) {
      console.error('Failed to get notification settings:', error);
      throw new Error('Database error while fetching notification settings');
    }
  }

  /**
   * Get display preferences
   */
  static async getDisplayPreferences(userId: string): Promise<{
    theme: string;
    timezone: string;
    language: string;
  } | null> {
    try {
      const profile = await this.getProfileByUserId(userId);
      if (!profile) {
        return null;
      }

      return {
        theme: profile.theme,
        timezone: profile.timezone,
        language: profile.language,
      };
    } catch (error) {
      console.error('Failed to get display preferences:', error);
      throw new Error('Database error while fetching display preferences');
    }
  }

  /**
   * Get dashboard layout
   */
  static async getDashboardLayout(userId: string): Promise<any | null> {
    try {
      const profile = await this.getProfileByUserId(userId);
      return profile ? profile.dashboardLayout : null;
    } catch (error) {
      console.error('Failed to get dashboard layout:', error);
      throw new Error('Database error while fetching dashboard layout');
    }
  }

  /**
   * Check if profile exists for user
   */
  static async profileExists(userId: string): Promise<boolean> {
    try {
      const profile = await this.getProfileByUserId(userId);
      return profile !== null;
    } catch (error) {
      console.error('Failed to check if profile exists:', error);
      return false;
    }
  }

  /**
   * Get profile statistics
   */
  static async getProfileStats(): Promise<{
    totalProfiles: number;
    profilesWithDisplayName: number;
    themeDistribution: Record<string, number>;
    languageDistribution: Record<string, number>;
  }> {
    try {
      const allProfiles = await db.select().from(userProfiles);

      const totalProfiles = allProfiles.length;
      const profilesWithDisplayName = allProfiles.filter(p => p.displayName !== null).length;

      const themeDistribution = allProfiles.reduce(
        (acc, profile) => {
          const theme = profile.theme;
          acc[theme] = (acc[theme] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      const languageDistribution = allProfiles.reduce(
        (acc, profile) => {
          const language = profile.language;
          acc[language] = (acc[language] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      return {
        totalProfiles,
        profilesWithDisplayName,
        themeDistribution,
        languageDistribution,
      };
    } catch (error) {
      console.error('Failed to get profile statistics:', error);
      throw new Error('Database error while getting profile statistics');
    }
  }
}