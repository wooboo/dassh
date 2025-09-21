import { createORPCClient } from '@orpc/client';
import { RPCLink } from '@orpc/client/fetch';
import type { RouterClient } from '@orpc/server';
import type { AppRouter } from '@dassh/shared/api';

/**
 * Type-safe oRPC client for frontend usage
 */
const link = new RPCLink({
  url: () => {
    if (typeof window === 'undefined') {
      throw new Error('oRPC client is not allowed on the server side.');
    }
    return `${window.location.origin}/api/orpc`;
  },
  headers: () => ({
    'Content-Type': 'application/json',
  }),
});

/**
 * Type-safe oRPC client instance
 */
export const orpcClient: RouterClient<AppRouter> = createORPCClient(link);

/**
 * Export types for type safety
 */
export type { AppRouter };