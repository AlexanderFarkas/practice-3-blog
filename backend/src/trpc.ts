import { initTRPC } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import { orm } from "./main.js";

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */

// created for each request
export const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => {
  return {
    bearerToken: req.headers.authorization?.replace("Bearer ", ""),
    em: orm.em.fork(),
  };
}; // no context
type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create();

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const publicProcedure = t.procedure;
// export const withUser = t.procedure.use(async (opts) => {
//   const { ctx } = opts;
//   if (!ctx.user?.isAdmin) {
//     throw new TRPCError({ code: "UNAUTHORIZED" });
//   }
//   return opts.next({
//     ctx: {
//       user: ctx.user,
//     },
//   });
// });
