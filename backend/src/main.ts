import { appRouter } from "./appRouter.js";
import * as trpcExpress from "@trpc/server/adapters/express";
import express from "express";
import cors from "cors";
import { createContext } from "./trpc.js";
import { MikroORM } from "@mikro-orm/postgresql";
import config from "./mikro-orm.config.js";

const app = express();
export const orm = await MikroORM.init(config);

app.use(cors());

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: createContext,
  }),
);

app.listen(8000, () => {
  console.log("Listening on port 8000");
});
