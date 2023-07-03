import { z } from "zod";
import { publicProcedure } from "../../trpc";
import { USA_STATES_FULL } from "~/connection/schema";
import { db } from "~/connection/db";
import { votes } from "~/connection/schema";
import { TRPCError } from "@trpc/server";

export const vote = publicProcedure
  .input(
    z.object({
      state: z.enum(USA_STATES_FULL),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const userIP = ctx.req.headers["x-forwarded-for"]?.toString();
    if (!userIP) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Cannot identify user.",
      });
    }

    try {
      await db.insert(votes).values({
        ip: userIP,
        state: input.state,
      });
    } catch (err) {
      console.log(err);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const error = err as any;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code === "ER_DUP_ENTRY") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You have already voted.",
        });
      }
      throw err;
    }

    return "ok";
  });
