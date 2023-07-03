import { votes } from "~/connection/schema";
import { publicProcedure } from "../../trpc";
import { db } from "~/connection/db";
import { eq, sql, and } from "drizzle-orm";

export const totalVotes = publicProcedure.query(async () => {
  // version 2
  // shows winner for each state only done in SQL
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


  // version 1
  // const start = performance.now();

  // const totalVotes = await db
  //   .select({
  //     state: votes.state,
  //     count: sql<number>`COUNT(*)`,
  //     candidate: votes.candidate,
  //   })
  //   .from(votes)
  //   .groupBy(votes.state, votes.candidate);

  // const winnerOnly = totalVotes.reduce((acc, curr) => {
  //   const existing = acc.find((a) => a.state === curr.state);
  //   if (!existing) {
  //     acc.push(curr);
  //     return acc;
  //   }
  //   if (existing.count < curr.count) {
  //     return [curr];
  //   }
  //   return acc;
  // }, [] as typeof totalVotes);

  // const end = performance.now();
  // console.log(`totalVotes took ${end - start}ms`);

  // return winnerOnly;
});
