import { sql } from "drizzle-orm";
import { db } from "~/connection/db";
import { votes } from "~/connection/schema";
import { publicProcedure } from "../../trpc";

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
