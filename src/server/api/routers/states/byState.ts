import { z } from "zod";
import { USA_STATES_FULL, votes } from "~/connection/schema";
import { publicProcedure } from "../../trpc";
import { db } from "~/connection/db";
import { eq, sql } from "drizzle-orm";

export const byState = publicProcedure
  .input(
    z.object({
      state: z.enum(USA_STATES_FULL),
    })
  )
  .query(async ({ input }) => {
    const stateVotes = await db
      .select({
        // cast to number
        count: sql<number>`COUNT(*)`,
      })
      .from(votes)
      .where(eq(votes.state, input.state));

    if (!stateVotes[0]) {
      return 0;
    }

    return stateVotes[0].count;
  });
