import USAMap, { type Event, type MapCustomizations } from "react-usa-map";
import {
  barbieColors,
  oppenheimerColors,
  tieColors,
} from "~/utils/colors";
import { api } from "~/utils/api";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";

// value is electoral votes
export const State_Map = {
  Alabama: {
    id: "AL",
    value: 9,
  },
  Alaska: {
    id: "AK",
    value: 3,
  },
  // "American Samoa": {
  //   id: "AS",
  //   value: 3,
  // },
  Arizona: {
    id: "AZ",
    value: 11,
  },
  Arkansas: {
    id: "AR",
    value: 6,
  },
  California: {
    id: "CA",
    value: 55,
  },
  Colorado: {
    id: "CO",
    value: 9,
  },
  Connecticut: {
    id: "CT",
    value: 7,
  },
  Delaware: {
    id: "DE",
    value: 3,
  },
  // "District Of Columbia": "DC",
  // "Federated States Of Micronesia": "FM",
  Florida: {
    id: "FL",
    value: 29,
  },
  Georgia: {
    id: "GA",
    value: 16,
  },
  // Guam: {
  //   id: "GU",
  //   value: 3,
  // },
  Hawaii: {
    id: "HI",
    value: 4,
  },
  Idaho: {
    id: "ID",
    value: 4,
  },
  Illinois: {
    id: "IL",
    value: 20,
  },
  Indiana: {
    id: "IN",
    value: 11,
  },
  Iowa: {
    id: "IA",
    value: 6,
  },
  Kansas: {
    id: "KS",
    value: 6,
  },
  Kentucky: {
    id: "KY",
    value: 8,
  },
  Louisiana: {
    id: "LA",
    value: 8,
  },
  Maine: {
    id: "ME",
    value: 4,
  },
  // "Marshall Islands": {
  //   id: "MH",
  //   value: 3,
  // },
  Maryland: {
    id: "MD",
    value: 10,
  },
  Massachusetts: {
    id: "MA",
    value: 11,
  },
  Michigan: {
    id: "MI",
    value: 16,
  },
  Minnesota: {
    id: "MN",
    value: 10,
  },
  Mississippi: {
    id: "MS",
    value: 6,
  },
  Missouri: {
    id: "MO",
    value: 10,
  },
  Montana: {
    id: "MT",
    value: 3,
  },
  Nebraska: {
    id: "NE",
    value: 5,
  },
  Nevada: {
    id: "NV",
    value: 6,
  },
  "New Hampshire": {
    id: "NH",
    value: 4,
  },
  "New Jersey": {
    id: "NJ",
    value: 14,
  },
  "New Mexico": {
    id: "NM",
    value: 5,
  },
  "New York": {
    id: "NY",
    value: 29,
  },
  "North Carolina": {
    id: "NC",
    value: 15,
  },
  "North Dakota": {
    id: "ND",
    value: 3,
  },
  // "Northern Mariana Islands": {
  //   id: "MP",
  //   value: 3,
  // },
  Ohio: {
    id: "OH",
    value: 18,
  },
  Oklahoma: {
    id: "OK",
    value: 7,
  },
  Oregon: {
    id: "OR",
    value: 7,
  },
  // Palau: {
  //   id: "PW",
  //   value: 3,
  // },
  Pennsylvania: {
    id: "PA",
    value: 20,
  },
  // "Puerto Rico": {
  //   id: "PR",
  //   value: 3,
  // },
  "Rhode Island": {
    id: "RI",
    value: 4,
  },
  "South Carolina": {
    id: "SC",
    value: 9,
  },
  "South Dakota": {
    id: "SD",
    value: 3,
  },
  Tennessee: {
    id: "TN",
    value: 11,
  },
  Texas: {
    id: "TX",
    value: 38,
  },
  Utah: {
    id: "UT",
    value: 6,
  },
  Vermont: {
    id: "VT",
    value: 3,
  },
  // "Virgin Islands": "VI",
  Virginia: {
    id: "VA",
    value: 13,
  },
  Washington: {
    id: "WA",
    value: 12,
  },
  "West Virginia": {
    id: "WV",
    value: 5,
  },
  Wisconsin: {
    id: "WI",
    value: 10,
  },
  Wyoming: {
    id: "WY",
    value: 3,
  },
} as const;

function useThemeMode() {
  const { theme, systemTheme } = useTheme();

  if (!systemTheme) {
    return theme;
  }

  return systemTheme;
}

export default function USA() {
  const theme = useThemeMode();
  const router = useRouter();

  const winningStates = api.states.winningStates.useQuery(undefined, {
    retry: false,
  });

  const onClick = (event: Event) => {
    // event target dataset name is just the Abbreviation, need to get the full name
    const stateFullName = Object.keys(State_Map).find(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (key) =>
        State_Map[key as keyof typeof State_Map].id ===
        event.target.dataset.name
    );
    void router.push(`/state/${stateFullName ?? ""}`);
  };

  const stateCustomConfig = () => {
    if (winningStates.data) {
      const stateCustoms = winningStates.data.reduce((acc, state) => {
        if (state.winner === "Barbie") {
          acc[State_Map[state.state].id] = {
            fill: barbieColors,
          };
          return acc;
        }
        if (state.winner === "Oppenheimer") {
          acc[State_Map[state.state].id] = {
            fill: oppenheimerColors,
          };
          return acc;
        }
        acc[State_Map[state.state].id] = {
          fill: tieColors,
        };
        return acc;
      }, {} as MapCustomizations);
      return stateCustoms;
    }

    return {};
  };

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <USAMap
        onClick={onClick}
        customize={stateCustomConfig()}
        defaultFill={
          theme === "light"
            ? "hsla(0deg, 0%, 55%, 1)"
            : "hsla(0deg, 0%, 33%, 1)"
        }
      />
    </div>
  );
}
