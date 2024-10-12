import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from 'server/appRouter.ts';
//     👆 **type-only** import

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:8000/trpc',
    }),
  ],
});