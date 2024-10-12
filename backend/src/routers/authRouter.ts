import { publicProcedure, router } from "../trpc.js";
import { z } from "zod";

export const authRouter = router({
  register: publicProcedure
    .input(
      z.object({
        password: z.string(),
        email: z.string().email(),
      }),
    )
    .mutation(async ({ input: { email, password } }) => {}),
  login: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input: { email, password } }) => {}),
});
