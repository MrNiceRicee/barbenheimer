import { sql } from "drizzle-orm";
import { db } from "~/connection/db";
import { votes } from "~/connection/schema";
import { publicProcedure } from "../../trpc";

export const winningStates = publicProcedure.query(async ({ ctx }) => {
	// this worked in mysql but not postgres
	// const votePerCandidate = db
	// 	.select({
	// 		state: votes.state,
	// 		barbieVotes: sql<number>`SUM(
	//       CASE WHEN ${votes.candidate} = 'Barbie' THEN 1 ELSE 0 END
	//     )`.as("innerBarbieVotes"),
	// 		oppenheimerVotes: sql<number>`SUM(
	//       CASE WHEN ${votes.candidate} = 'Oppenheimer' THEN 1 ELSE 0 END
	//     )`.as("innerOppenheimerVotes"),
	// 	})
	// 	.from(votes)
	// 	.groupBy(votes.state)
	// 	.as("votePerCandidate");

	// const totalVotes = await db
	// 	.select({
	// 		state: votes.state,
	// 		totalVotes: sql<number>`COUNT(*)`,
	// 		barbieVotes: votePerCandidate.barbieVotes,
	// 		oppenheimerVotes: votePerCandidate.oppenheimerVotes,
	// 		winner: sql<
	// 			"Barbie" | "Oppenheimer" | "Tie"
	// 		>`CASE WHEN ${votePerCandidate.barbieVotes} > ${votePerCandidate.oppenheimerVotes} THEN 'Barbie' WHEN ${votePerCandidate.barbieVotes} < ${votePerCandidate.oppenheimerVotes} THEN 'Oppenheimer' ELSE 'Tie' END`,
	// 	})
	// 	.from(votes)
	// 	.innerJoin(votePerCandidate, and(eq(votes.state, votePerCandidate.state)))
	// 	.orderBy(votes.state)
	// 	.groupBy(votes.state);

	const totalVotes = await db
		.select({
			state: votes.state,
			totalVotes: sql<number>`COUNT(*)`,
			barbieVotes: sql<number>`SUM(
        CASE WHEN ${votes.candidate} = 'Barbie' THEN 1 ELSE 0 END
      )`,
			oppenheimerVotes: sql<number>`SUM(
        CASE WHEN ${votes.candidate} = 'Oppenheimer' THEN 1 ELSE 0 END
      )`,
			winner: sql<"Barbie" | "Oppenheimer" | "Tie">`
      CASE
          WHEN SUM(CASE WHEN candidate = 'Barbie' THEN 1 ELSE 0 END) > SUM(CASE WHEN candidate = 'Oppenheimer' THEN 1 ELSE 0 END) THEN 'Barbie'
          WHEN SUM(CASE WHEN candidate = 'Barbie' THEN 1 ELSE 0 END) < SUM(CASE WHEN candidate = 'Oppenheimer' THEN 1 ELSE 0 END) THEN 'Oppenheimer'
          ELSE 'Tie'
      END AS winner
  `,
		})
		.from(votes)
		.orderBy(votes.state)
		.groupBy(votes.state);

	ctx.log.info("Getting winning states");
	return totalVotes;
});
