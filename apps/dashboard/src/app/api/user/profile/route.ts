import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { db, users, userProfiles } from '@dassh/shared/database';
import { eq } from 'drizzle-orm';

/**
 * GET /api/user/profile - Retrieve user profile information
 */
export async function GET() {
  try {
    const { getUser, isAuthenticated } = getKindeServerSession();

    if (!isAuthenticated()) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const kindeUser = await getUser();
    if (!kindeUser?.id) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Find user in database
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.kindeId, kindeUser.id))
      .limit(1);

    if (userResult.length === 0) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    const user = userResult[0]!;

    // Get user profile data
    const profileResult = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, user.id))
      .limit(1);

    const profileData = profileResult.length > 0 ? profileResult[0] : null;

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastLoginAt: user.lastLoginAt,
        isActive: user.isActive,
        preferences: user.preferences
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
        updatedAt: profileData.updatedAt
      } : null
    });
  } catch (error) {
    console.error('Profile retrieval error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/user/profile - Update user profile information
 */
export async function PUT(request: NextRequest) {
  try {
    const { getUser, isAuthenticated } = getKindeServerSession();

    if (!isAuthenticated()) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const kindeUser = await getUser();
    if (!kindeUser?.id) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { user: userUpdates, profile: profileUpdates } = body;

    // Find user in database
    const existingUserResult = await db
      .select()
      .from(users)
      .where(eq(users.kindeId, kindeUser.id))
      .limit(1);

    if (existingUserResult.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const existingUser = existingUserResult[0]!;
    const userId = existingUser.id;

    // Update user table if user updates provided
    if (userUpdates) {
      const allowedUserFields = ['firstName', 'lastName', 'preferences'];
      const filteredUserUpdates = Object.fromEntries(
        Object.entries(userUpdates).filter(([key]) => 
          allowedUserFields.includes(key)
        )
      );

      if (Object.keys(filteredUserUpdates).length > 0) {
        await db
          .update(users)
          .set({
            ...filteredUserUpdates,
            updatedAt: new Date()
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
        'notificationSettings'
      ];
      
      const filteredProfileUpdates = Object.fromEntries(
        Object.entries(profileUpdates).filter(([key]) => 
          allowedProfileFields.includes(key)
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
              updatedAt: new Date()
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
              updatedAt: new Date()
            });
        }
      }
    }

    // Return updated profile data
    const updatedUserResult = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    const updatedProfileResult = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId))
      .limit(1);

    const updatedUser = updatedUserResult[0]!;
    const updatedProfile = updatedProfileResult.length > 0 ? updatedProfileResult[0] : null;

    return NextResponse.json({
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        profilePicture: updatedUser.profilePicture,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
        lastLoginAt: updatedUser.lastLoginAt,
        isActive: updatedUser.isActive,
        preferences: updatedUser.preferences
      },
      profile: updatedProfile ? {
        id: updatedProfile.id,
        displayName: updatedProfile.displayName,
        timezone: updatedProfile.timezone,
        language: updatedProfile.language,
        theme: updatedProfile.theme,
        dashboardLayout: updatedProfile.dashboardLayout,
        notificationSettings: updatedProfile.notificationSettings,
        createdAt: updatedProfile.createdAt,
        updatedAt: updatedProfile.updatedAt
      } : null
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}