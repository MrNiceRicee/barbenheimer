import { z } from "zod";
import { db } from "~/connection/db";
import { publicProcedure } from "../../trpc";
import { votes } from "~/connection/schema";
import { eq, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

const candidateSchema = z.object({
  candidate: z
    .string()
    .min(1)
    .transform((val, ctx) => {
      const check = val.toLowerCase();
      if (check === "barbie" || check === "oppenheimer") {
        return check.charAt(0).toUpperCase() + check.slice(1);
      }
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Candidate must be either Barbie or Oppenheimer",
        path: [],
      });
    })
    .pipe(z.enum(["Barbie", "Oppenheimer"])),
});

export const allCandidateInfo = publicProcedure
  .input(candidateSchema)
  .query(async ({ input, ctx }) => {
    const totalVotesQuery = db
      .select({
        totalVotes: sql<number>`COUNT(*)`,
      })
      .from(votes)
      .where(eq(votes.candidate, input.candidate))
      .limit(1);

    const candidateQuery = db
      .select({
        messages: votes.message,
        state: votes.state,
        votedAt: votes.votedAt,
      })
      .from(votes)
      .where(eq(votes.candidate, input.candidate));

    const [totalVotes, candidateData] = await Promise.allSettled([
      totalVotesQuery,
      candidateQuery,
    ]);

    if (totalVotes.status === "rejected") {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error getting total votes",
      });
    }

    if (candidateData.status === "rejected") {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error getting candidate data",
      });
    }

    ctx.log.info(`Getting candidate data for ${input.candidate}`);

    return {
      totalVotes: totalVotes.value[0]?.totalVotes || 0,
      data: candidateData.value,
    };
  });
