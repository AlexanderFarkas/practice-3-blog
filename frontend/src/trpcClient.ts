import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from 'server/index.ts';
//     👆 **type-only** import

const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000',
    }),
  ],
});