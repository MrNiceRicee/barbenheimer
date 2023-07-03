import { sql, eq, and } from "drizzle-orm";
import { db } from "~/connection/db";
import { publicProcedure } from "../../trpc";
import { votes } from "~/connection/schema";

export const winningStates = publicProcedure.query(async () => {
  const start = performance.now();
  const voteCounts = db
    .select({
      state: votes.state,
      count: sql<number>`COUNT(*)`.as("count"),
      candidate: votes.candidate,
    })
    .from(votes)
    .groupBy(votes.state, votes.candidate)
    .as("voteCounts");
  const maxVotesPerState = db
    .select({
      state: voteCounts.state,
      maxVotes: sql<number>`MAX(${voteCounts.count})`.as("maxVotes"),
    })
    .from(voteCounts)
    .groupBy(voteCounts.state)
    .as("maxVotesPerState");

  const totalVotes = await db
    .select({
      state: voteCounts.state,
      count: maxVotesPerState.maxVotes,
      candidate: voteCounts.candidate,
    })
    .from(voteCounts)
    .innerJoin(
      maxVotesPerState,
      and(
        eq(voteCounts.state, maxVotesPerState.state),
        eq(voteCounts.count, maxVotesPerState.maxVotes)
      )
    );
  const end = performance.now();
  console.log(`totalVotes took ${end - start}ms`);

  return totalVotes;
});
