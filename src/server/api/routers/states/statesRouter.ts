import { createTRPCRouter } from "../../trpc";
import { totalVotes } from "./totalVotes";
import { byState } from "./byState";

export const statesRouter = createTRPCRouter({
  totalVotes,
  byState,
});
