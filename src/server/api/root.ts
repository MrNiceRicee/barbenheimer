import { createTRPCRouter } from "~/server/api/trpc";
import { ipRouter } from "./routers/ip";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  ip: ipRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
