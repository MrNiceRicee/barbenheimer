import { atom } from "jotai";
import { useMemo } from "react";
import { api } from "~/utils/api";
import { State_Map } from "../map/usa";

// total electoral votes is 538
export const electoralAtom = atom({
	Oppenheimer: 0,
	Barbie: 0,
});

export function useWinningElectoralVotes() {
	const winningStates = api.states.winningStates.useQuery(undefined, {
		retry: false,
	});

	const electoralVotes = useMemo(() => {
		if (!winningStates.data) return { Oppenheimer: 0, Barbie: 0 };

		return winningStates.data.reduce(
			(acc, state) => {
				if (state.winner === "Barbie") {
					acc.Barbie += State_Map[state.state].value;
					return acc;
				}
				if (state.winner === "Oppenheimer") {
					acc.Oppenheimer += State_Map[state.state].value;
				}
				return acc;
			},
			{ Barbie: 0, Oppenheimer: 0 },
		);
	}, [winningStates.data]);

	return electoralVotes;
}
