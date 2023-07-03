import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "~/connection/db";
import { votes } from "~/connection/schema";
import { TRPCError } from "@trpc/server";
import { publicProcedure } from "~/server/api/trpc";
import { USA_STATES_FULL } from "~/connection/schema";

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

    const [existingVote] = await db
      .select({
        ip: votes.ip,
      })
      .from(votes)
      .where(eq(votes.ip, userIP))
      .limit(1);

    console.log("existingVote", existingVote);
    if (!!existingVote) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Cannot vote more than once, you have already voted.",
      });
    }

    try {
      await db.insert(votes).values({
        ip: userIP,
        state: input.state,
      });
    } catch (err) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to vote, please try again later.",
      });
    }

    return "ok";
  });
