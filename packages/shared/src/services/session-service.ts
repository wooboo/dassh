import { eq, and, desc } from 'drizzle-orm';
import { db } from '../database/connection';
import { userSessions, users, type UserSession, type NewUserSession } from '../database/schema';

/**
 * Session service layer for user session management
 * Handles session creation, tracking, and cleanup
 */
export class SessionService {
  /**
   * Create a new user session
   */
  static async createSession(sessionData: {
    userId: string;
    kindeSessionId?: string;
    userAgent?: string;
    ipAddress?: string;
    expiresAt: Date;
  }): Promise<UserSession> {
    try {
      const newSession: NewUserSession = {
        userId: sessionData.userId,
        kindeSessionId: sessionData.kindeSessionId || null,
        userAgent: sessionData.userAgent || null,
        ipAddress: sessionData.ipAddress || null,
        expiresAt: sessionData.expiresAt,
        isActive: true,
      };

      const result = await db
        .insert(userSessions)
        .values(newSession)
        .returning();

      return result[0]!;
    } catch (error) {
      console.error('Failed to create session:', error);
      throw new Error('Database error while creating session');
    }
  }

  /**
   * Get active sessions for a user
   */
  static async getActiveSessions(userId: string): Promise<UserSession[]> {
    try {
      const result = await db
        .select()
        .from(userSessions)
        .where(
          and(
            eq(userSessions.userId, userId),
            eq(userSessions.isActive, true)
          )
        )
        .orderBy(desc(userSessions.lastActivityAt));

      return result;
    } catch (error) {
      console.error('Failed to get active sessions:', error);
      throw new Error('Database error while fetching active sessions');
    }
  }

  /**
   * Get all sessions for a user (including inactive)
   */
  static async getAllSessions(userId: string): Promise<UserSession[]> {
    try {
      const result = await db
        .select()
        .from(userSessions)
        .where(eq(userSessions.userId, userId))
        .orderBy(desc(userSessions.lastActivityAt));

      return result;
    } catch (error) {
      console.error('Failed to get all sessions:', error);
      throw new Error('Database error while fetching sessions');
    }
  }

  /**
   * Get session by ID
   */
  static async getSessionById(sessionId: string): Promise<UserSession | null> {
    try {
      const result = await db
        .select()
        .from(userSessions)
        .where(eq(userSessions.id, sessionId))
        .limit(1);

      return result.length > 0 ? result[0]! : null;
    } catch (error) {
      console.error('Failed to get session by ID:', error);
      throw new Error('Database error while fetching session');
    }
  }

  /**
   * Update session activity
   */
  static async updateActivity(sessionId: string): Promise<void> {
    try {
      await db
        .update(userSessions)
        .set({
          lastActivityAt: new Date(),
        })
        .where(eq(userSessions.id, sessionId));
    } catch (error) {
      console.error('Failed to update session activity:', error);
      throw new Error('Database error while updating session activity');
    }
  }

  /**
   * Terminate a specific session
   */
  static async terminateSession(sessionId: string): Promise<boolean> {
    try {
      const result = await db
        .update(userSessions)
        .set({
          isActive: false,
          lastActivityAt: new Date(),
        })
        .where(eq(userSessions.id, sessionId))
        .returning();

      return result.length > 0;
    } catch (error) {
      console.error('Failed to terminate session:', error);
      throw new Error('Database error while terminating session');
    }
  }

  /**
   * Terminate a session for a specific user (security check)
   */
  static async terminateUserSession(sessionId: string, userId: string): Promise<boolean> {
    try {
      const result = await db
        .update(userSessions)
        .set({
          isActive: false,
          lastActivityAt: new Date(),
        })
        .where(
          and(
            eq(userSessions.id, sessionId),
            eq(userSessions.userId, userId)
          )
        )
        .returning();

      return result.length > 0;
    } catch (error) {
      console.error('Failed to terminate user session:', error);
      throw new Error('Database error while terminating user session');
    }
  }

  /**
   * Terminate all sessions for a user
   */
  static async terminateAllUserSessions(userId: string): Promise<number> {
    try {
      const result = await db
        .update(userSessions)
        .set({
          isActive: false,
          lastActivityAt: new Date(),
        })
        .where(
          and(
            eq(userSessions.userId, userId),
            eq(userSessions.isActive, true)
          )
        )
        .returning();

      return result.length;
    } catch (error) {
      console.error('Failed to terminate all user sessions:', error);
      throw new Error('Database error while terminating all user sessions');
    }
  }

  /**
   * Terminate all sessions except the current one
   */
  static async terminateOtherSessions(userId: string, currentSessionId: string): Promise<number> {
    try {
      const result = await db
        .update(userSessions)
        .set({
          isActive: false,
          lastActivityAt: new Date(),
        })
        .where(
          and(
            eq(userSessions.userId, userId),
            eq(userSessions.isActive, true),
            // Not the current session
            // Note: Using SQL NOT to exclude current session
          )
        )
        .returning();

      // Filter out current session manually since Drizzle doesn't have a direct NOT operator
      const terminatedSessions = result.filter(session => session.id !== currentSessionId);
      
      return terminatedSessions.length;
    } catch (error) {
      console.error('Failed to terminate other sessions:', error);
      throw new Error('Database error while terminating other sessions');
    }
  }

  /**
   * Clean up expired sessions
   */
  static async cleanupExpiredSessions(): Promise<number> {
    try {
      const now = new Date();
      const result = await db
        .update(userSessions)
        .set({
          isActive: false,
          lastActivityAt: now,
        })
        .where(
          and(
            eq(userSessions.isActive, true),
            // Sessions where expiresAt is before now
          )
        )
        .returning();

      return result.length;
    } catch (error) {
      console.error('Failed to cleanup expired sessions:', error);
      throw new Error('Database error while cleaning up expired sessions');
    }
  }

  /**
   * Get session statistics for a user
   */
  static async getSessionStats(userId: string): Promise<{
    activeCount: number;
    totalCount: number;
    lastActivity: Date | null;
  }> {
    try {
      const sessions = await this.getAllSessions(userId);
      const activeSessions = sessions.filter(session => session.isActive);
      
      const lastActivity = sessions.length > 0 
        ? sessions[0]!.lastActivityAt 
        : null;

      return {
        activeCount: activeSessions.length,
        totalCount: sessions.length,
        lastActivity,
      };
    } catch (error) {
      console.error('Failed to get session stats:', error);
      throw new Error('Database error while getting session statistics');
    }
  }

  /**
   * Find session by Kinde session ID
   */
  static async findByKindeSessionId(kindeSessionId: string): Promise<UserSession | null> {
    try {
      const result = await db
        .select()
        .from(userSessions)
        .where(
          and(
            eq(userSessions.kindeSessionId, kindeSessionId),
            eq(userSessions.isActive, true)
          )
        )
        .limit(1);

      return result.length > 0 ? result[0]! : null;
    } catch (error) {
      console.error('Failed to find session by Kinde session ID:', error);
      throw new Error('Database error while finding session by Kinde session ID');
    }
  }

  /**
   * Check if session is valid and active
   */
  static async isSessionValid(sessionId: string): Promise<boolean> {
    try {
      const session = await this.getSessionById(sessionId);
      
      if (!session || !session.isActive) {
        return false;
      }

      // Check if session is expired
      const now = new Date();
      if (session.expiresAt < now) {
        // Auto-terminate expired session
        await this.terminateSession(sessionId);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Failed to validate session:', error);
      return false;
    }
  }

  /**
   * Get sessions with user information (for admin/dashboard views)
   */
  static async getSessionsWithUsers(): Promise<Array<UserSession & { 
    user: { 
      email: string; 
      firstName: string | null; 
      lastName: string | null; 
    } 
  }>> {
    try {
      const result = await db
        .select({
          // Session fields
          id: userSessions.id,
          userId: userSessions.userId,
          kindeSessionId: userSessions.kindeSessionId,
          userAgent: userSessions.userAgent,
          ipAddress: userSessions.ipAddress,
          createdAt: userSessions.createdAt,
          lastActivityAt: userSessions.lastActivityAt,
          expiresAt: userSessions.expiresAt,
          isActive: userSessions.isActive,
          // User fields
          userEmail: users.email,
          userFirstName: users.firstName,
          userLastName: users.lastName,
        })
        .from(userSessions)
        .innerJoin(users, eq(userSessions.userId, users.id))
        .where(eq(userSessions.isActive, true))
        .orderBy(desc(userSessions.lastActivityAt));

      return result.map(row => ({
        id: row.id,
        userId: row.userId,
        kindeSessionId: row.kindeSessionId,
        userAgent: row.userAgent,
        ipAddress: row.ipAddress,
        createdAt: row.createdAt,
        lastActivityAt: row.lastActivityAt,
        expiresAt: row.expiresAt,
        isActive: row.isActive,
        user: {
          email: row.userEmail,
          firstName: row.userFirstName,
          lastName: row.userLastName,
        },
      }));
    } catch (error) {
      console.error('Failed to get sessions with users:', error);
      throw new Error('Database error while fetching sessions with user information');
    }
  }
}