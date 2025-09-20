import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { db, users, userSessions } from '@dassh/shared/database';
import { eq, and } from 'drizzle-orm';

/**
 * DELETE /api/user/sessions/[sessionId] - Delete a specific user session
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
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

    const { sessionId } = params;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
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

    // Check if session exists and belongs to the user
    const sessionResult = await db
      .select({ id: userSessions.id })
      .from(userSessions)
      .where(
        and(
          eq(userSessions.id, sessionId),
          eq(userSessions.userId, user.id),
          eq(userSessions.isActive, true)
        )
      )
      .limit(1);

    if (sessionResult.length === 0) {
      return NextResponse.json(
        { error: 'Session not found or already inactive' },
        { status: 404 }
      );
    }

    // Mark session as inactive (soft delete)
    await db
      .update(userSessions)
      .set({
        isActive: false,
        lastActivityAt: new Date()
      })
      .where(eq(userSessions.id, sessionId));

    return NextResponse.json({
      message: 'Session successfully deleted'
    });
  } catch (error) {
    console.error('Session deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}