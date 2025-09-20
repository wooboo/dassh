import { z } from 'zod';
import { protectedProcedure, publicProcedure } from '../orpc';

/**
 * Authentication procedures with type-safe endpoints
 */
export const authProcedures = {
  /**
   * Get current authentication status
   * Public procedure that returns user info if authenticated
   */
  getStatus: publicProcedure
    .route({ method: 'GET', path: '/auth/status' })
    .handler(async ({ context }) => {
      if (!context.isAuthenticated || !context.user) {
        return {
          isAuthenticated: false,
          user: null,
        };
      }

      return {
        isAuthenticated: true,
        user: {
          id: context.user.id,
          email: context.user.email,
          given_name: context.user.given_name,
          family_name: context.user.family_name,
          picture: context.user.picture,
        },
      };
    }),
};