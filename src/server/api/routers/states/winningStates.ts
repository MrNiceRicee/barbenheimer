import { sql, eq, and } from "drizzle-orm";
import { db } from "~/connection/db";
import { publicProcedure } from "../../trpc";
import { votes } from "~/connection/schema";

export const winningStates = publicProcedure.query(async ({ ctx }) => {
  const votePerCandidate = db
    .select({
      state: votes.state,
      barbieVotes: sql<number>`SUM(
        CASE WHEN ${votes.candidate} = 'Barbie' THEN 1 ELSE 0 END
      )`.as("innerBarbieVotes"),
      oppenheimerVotes: sql<number>`SUM(
        CASE WHEN ${votes.candidate} = 'Oppenheimer' THEN 1 ELSE 0 END
      )`.as("innerOppenheimerVotes"),
    })
    .from(votes)
    .groupBy(votes.state)
    .as("votePerCandidate");

  const totalVotes = await db
    .select({
      state: votes.state,
      totalVotes: sql<number>`COUNT(*)`,
      barbieVotes: votePerCandidate.barbieVotes,
      oppenheimerVotes: votePerCandidate.oppenheimerVotes,
      winner: sql<
        "Barbie" | "Oppenheimer" | "Tie"
      >`CASE WHEN ${votePerCandidate.barbieVotes} > ${votePerCandidate.oppenheimerVotes} THEN 'Barbie' WHEN ${votePerCandidate.barbieVotes} < ${votePerCandidate.oppenheimerVotes} THEN 'Oppenheimer' ELSE 'Tie' END`,
    })
    .from(votes)
    .innerJoin(votePerCandidate, and(eq(votes.state, votePerCandidate.state)))
    .groupBy(votes.state);

  ctx.log.info("Getting winning states");
  return totalVotes;
});
