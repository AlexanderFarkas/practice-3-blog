import { publicProcedure, router } from "./trpc.js";

type User = { id: string; name: string };

export const appRouter = router({
  userList: publicProcedure.query(async (): Promise<User[]> => {
    return [
      {
        id: "my_id",
        name: "Hello, world",
      },
    ];
  }),
});

export type AppRouter = typeof appRouter;