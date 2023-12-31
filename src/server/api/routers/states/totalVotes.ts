import { votes } from "~/connection/schema";
import { publicProcedure } from "../../trpc";
import { db } from "~/connection/db";
import { sql } from "drizzle-orm";

export const totalVotes = publicProcedure.query(async ({ ctx }) => {
  const totalVotes = await db
    .select({
      state: votes.state,
      count: sql<number>`COUNT(*)`,
    })
    .from(votes)
    .groupBy(votes.state);

  ctx.log.info("Getting total votes");

  return totalVotes;
});
