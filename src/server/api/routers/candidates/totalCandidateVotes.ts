import { db } from "~/connection/db";
import { publicProcedure } from "../../trpc";
import { votes } from "~/connection/schema";
import { sql } from "drizzle-orm";

export const totalCandidateVotes = publicProcedure.query(async ({ ctx }) => {
  const [totalVotes] = await db
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
    .limit(1);

  ctx.log.info(`Getting total votes`);

  return totalVotes;
});
