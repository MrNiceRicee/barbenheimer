import { z } from "zod";
// import { eq } from "drizzle-orm";
// import { db } from "~/connection/db";
// import { votes } from "~/connection/schema";
import { TRPCError } from "@trpc/server";
import { publicProcedure } from "~/server/api/trpc";
import { USA_STATES_FULL } from "~/connection/schema";

// the last day to vote will be end of day on July 21st, 2023
// const END_OF_VOTING_DATE = new Date("2023-07-22T09:00:00.000Z").getTime();

export const vote = publicProcedure
	.input(
		z.object({
			state: z.enum(USA_STATES_FULL),
			candidate: z.enum(["Barbie", "Oppenheimer"]),
			message: z.string().max(280).optional(),
		}),
	)
	.mutation(() => {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message:
				"Voting has ended. Go watch one of the movies. Stop voting here 🤨",
		});

		// code under here is for voting, which is now closed
		// const userIP = ctx.req.headers["x-forwarded-for"]?.toString();

		// if (!userIP) {
		//   throw new TRPCError({
		//     code: "BAD_REQUEST",
		//     message: "Cannot identify user.",
		//   });
		// }

		// const [existingVote] = await db
		//   .select({
		//     ip: votes.ip,
		//   })
		//   .from(votes)
		//   .where(eq(votes.ip, userIP))
		//   .limit(1);

		// if (!!existingVote) {
		//   throw new TRPCError({
		//     code: "BAD_REQUEST",
		//     message: "Cannot vote more than once, you have already voted.",
		//   });
		// }

		// try {
		//   await db.insert(votes).values({
		//     ip: userIP,
		//     state: input.state,
		//     candidate: input.candidate,
		//     message: input.message,
		//   });

		//   ctx.log.info("Vote added", {
		//     candidate: input.candidate,
		//     state: input.state,
		//   });
		// } catch (err) {
		//   ctx.log.error("Failed to add vote", {
		//     candidate: input.candidate,
		//     state: input.state,
		//   });
		//   throw new TRPCError({
		//     code: "INTERNAL_SERVER_ERROR",
		//     message: "Failed to vote, please try again later.",
		//   });
		// }

		// return "ok";
	});
