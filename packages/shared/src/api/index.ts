import { baseProcedure } from './orpc';
import { authProcedures } from './routers/auth';
import { userProcedures } from './routers/user';

/**
 * Main oRPC router that combines all feature procedures
 */
export const appRouter = baseProcedure.router({
  auth: authProcedures,
  user: userProcedures,
});

/**
 * Export router type for client-side type inference
 */
export type AppRouter = typeof appRouter;

/**
 * Export context and oRPC utilities
 */
export { createORPCContext, type Context } from './context';
export { baseProcedure, publicProcedure, protectedProcedure } from './orpc';