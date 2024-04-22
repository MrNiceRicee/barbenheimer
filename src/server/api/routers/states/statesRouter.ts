import { createTRPCRouter } from "../../trpc";
import { byState } from "./byState";
import { totalVotes } from "./totalVotes";
import { vote } from "./vote";
import { winningStates } from "./winningStates";

export const statesRouter = createTRPCRouter({
	totalVotes,
	byState,
	vote,
	winningStates,
});
