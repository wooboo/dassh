import { createORPCClient } from '@orpc/client';
import { RPCLink } from '@orpc/client/fetch';

/**
 * oRPC client instance
 */
function getBaseUrl() {
  if (typeof window !== 'undefined') return '';
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

const rpcLink = new RPCLink({
  url: `${getBaseUrl()}/api/orpc`,
  headers: async () => {
    // Add any auth headers here if needed
    return {};
  },
});

export const orpc = createORPCClient(rpcLink);