import { createTRPCRouter, publicProcedure } from "../trpc";

export const ipRouter = createTRPCRouter({
  getIP: publicProcedure.query(({ ctx }) => {
    return {
      ip:
        ctx.req.headers["x-forwarded-for"] || ctx.req.connection.remoteAddress,
    };
  }),
});
