import { RPCHandler } from '@orpc/server/fetch';
import { appRouter, createORPCContext } from '@dassh/shared/api';

/**
 * oRPC API handler for Next.js App Router
 */
const handler = new RPCHandler(appRouter);

async function handleRequest(request: Request) {
  const { response } = await handler.handle(request, {
    prefix: '/api/orpc',
    context: await createORPCContext(),
  });

  return response ?? new Response('Not found', { status: 404 });
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;