import { os } from '@orpc/server';
import { type Context, createORPCContext } from './context';

/**
 * Base oRPC procedure with context setup
 */
export const baseProcedure = os.$context<Context>();

/**
 * Context middleware that provides authentication and database context
 */
const withContext = baseProcedure.use(async ({ next }) => {
  const context = await createORPCContext();
  return next({ context });
});

/**
 * Public procedure - no authentication required
 */
export const publicProcedure = withContext;

/**
 * Authentication middleware for oRPC
 */
const withAuth = withContext.use(async ({ next, context }) => {
  if (!context.isAuthenticated || !context.user) {
    throw new Error('UNAUTHORIZED: You must be authenticated to access this resource');
  }
  
  return next({
    context: {
      ...context,
      user: context.user, // Ensure user is not null
    },
  });
});

/**
 * Protected procedure - requires authentication
 */
export const protectedProcedure = withAuth;