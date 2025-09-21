import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { db } from '../database';

/**
 * Create oRPC context with authentication and database access
 * This context is available in all oRPC procedures
 */
export async function createORPCContext() {
  // Get Kinde authentication session
  const { getUser, isAuthenticated } = getKindeServerSession();
  
  const user = await isAuthenticated() ? await getUser() : null;
  
  return {
    db,
    user,
    isAuthenticated: !!user,
  };
}

export type Context = Awaited<ReturnType<typeof createORPCContext>>;