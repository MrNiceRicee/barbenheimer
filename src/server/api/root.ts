import { createTRPCRouter } from "~/server/api/trpc";
import { ipRouter } from "./routers/ip";
import { statesRouter } from "./routers/states/statesRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  ip: ipRouter,
  states: statesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
