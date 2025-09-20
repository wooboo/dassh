import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { db, users, userSessions } from '@dassh/shared/database';
import { eq, and, desc } from 'drizzle-orm';

/**
 * GET /api/user/sessions - Retrieve user's active sessions
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
      .select({ id: users.id })
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
        isActive: userSessions.isActive
      })
      .from(userSessions)
      .where(
        and(
          eq(userSessions.userId, user.id),
          eq(userSessions.isActive, true)
        )
      )
      .orderBy(desc(userSessions.lastActivityAt));

    return NextResponse.json({
      sessions: sessions.map(session => ({
        id: session.id,
        userAgent: session.userAgent,
        ipAddress: session.ipAddress,
        createdAt: session.createdAt,
        lastActivityAt: session.lastActivityAt,
        expiresAt: session.expiresAt,
        isActive: session.isActive,
        isCurrent: session.kindeSessionId === kindeUser.id // Basic check - might need improvement
      }))
    });
  } catch (error) {
    console.error('Sessions retrieval error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}