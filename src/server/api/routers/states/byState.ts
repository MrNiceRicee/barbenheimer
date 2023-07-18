import { z } from "zod";
import { USA_STATES_FULL, votes } from "~/connection/schema";
import { publicProcedure } from "../../trpc";
import { db } from "~/connection/db";
import { desc, eq, sql } from "drizzle-orm";

export const byState = publicProcedure
  .input(
    z.object({
      state: z.enum(USA_STATES_FULL),
    })
  )
  .query(async ({ input, ctx }) => {
    const [stateVotes] = await db
      .select({
        totalVotes: sql<number>`COUNT(*)`,
        barbieVotes: sql<number>`SUM(
          CASE WHEN ${votes.candidate} = 'Barbie' THEN 1 ELSE 0 END
        )`,
        oppenheimerVotes: sql<number>`SUM(
          CASE WHEN ${votes.candidate} = 'Oppenheimer' THEN 1 ELSE 0 END
        )`,
      })
      .from(votes)
      .where(eq(votes.state, input.state))
      .limit(1);

    const stateData = await db
      .select({
        state: votes.state,
        messages: votes.message,
        candidate: votes.candidate,
        votedAt: votes.votedAt,
      })
      .from(votes)
      .where(eq(votes.state, input.state))
      .orderBy(desc(votes.votedAt));

    ctx.log.info(`Getting votes for ${input.state}`);

    return {
      votes: stateVotes,
      data: stateData,
    };
  });
