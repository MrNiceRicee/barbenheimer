import { createTRPCRouter } from "../../trpc";
import { allCandidateInfo } from "./allCandidateInfo";

export const candidatesRouter = createTRPCRouter({
  allInfo: allCandidateInfo,
});
