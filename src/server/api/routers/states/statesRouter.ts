import { createTRPCRouter } from "../../trpc";
import { totalVotes } from "./totalVotes";
import { byState } from "./byState";
import { vote } from "./vote";
import { winningStates } from "./winningStates";

export const statesRouter = createTRPCRouter({
  totalVotes,
  byState,
  vote,
  winningStates,
});
