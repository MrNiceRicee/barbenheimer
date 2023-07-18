import { createTRPCRouter } from "../../trpc";
import { allCandidateInfo } from "./allCandidateInfo";
import { totalCandidateVotes } from "./totalCandidateVotes";

export const candidatesRouter = createTRPCRouter({
  allInfo: allCandidateInfo,
  voteCounts: totalCandidateVotes,
});
