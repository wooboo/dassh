import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { db, users } from '@dassh/shared/database';
import { eq } from 'drizzle-orm';

/**
 * GET /api/user/preferences - Retrieve user preferences
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
      .select({
        id: users.id,
        preferences: users.preferences
      })
      .from(users)
      .where(eq(users.kindeId, kindeUser.id))
      .limit(1);

    if (userResult.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const user = userResult[0]!;

    return NextResponse.json({
      preferences: user.preferences || {}
    });
  } catch (error) {
    console.error('Preferences retrieval error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/user/preferences - Update user preferences
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
    const { preferences } = body;

    if (!preferences || typeof preferences !== 'object') {
      return NextResponse.json(
        { error: 'Invalid preferences data' },
        { status: 400 }
      );
    }

    // Find user in database
    const userResult = await db
      .select({
        id: users.id,
        preferences: users.preferences
      })
      .from(users)
      .where(eq(users.kindeId, kindeUser.id))
      .limit(1);

    if (userResult.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const user = userResult[0]!;
    const currentPreferences = user.preferences as Record<string, any> || {};

    // Merge new preferences with existing ones
    const updatedPreferences = {
      ...currentPreferences,
      ...preferences
    };

    // Update user preferences
    await db
      .update(users)
      .set({
        preferences: updatedPreferences,
        updatedAt: new Date()
      })
      .where(eq(users.id, user.id));

    return NextResponse.json({
      preferences: updatedPreferences
    });
  } catch (error) {
    console.error('Preferences update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}