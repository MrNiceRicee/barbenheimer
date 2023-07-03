import USAMap, { type Event, type MapCustomizations } from "react-usa-map";
import {
  barbieColors,
  oppenheimerColors,
} from "~/server/api/routers/states/shared/colors";
import { api } from "~/utils/api";

const State_Map = {
  Alabama: "AL",
  Alaska: "AK",
  "American Samoa": "AS",
  Arizona: "AZ",
  Arkansas: "AR",
  California: "CA",
  Colorado: "CO",
  Connecticut: "CT",
  Delaware: "DE",
  // "District Of Columbia": "DC",
  // "Federated States Of Micronesia": "FM",
  Florida: "FL",
  Georgia: "GA",
  Guam: "GU",
  Hawaii: "HI",
  Idaho: "ID",
  Illinois: "IL",
  Indiana: "IN",
  Iowa: "IA",
  Kansas: "KS",
  Kentucky: "KY",
  Louisiana: "LA",
  Maine: "ME",
  "Marshall Islands": "MH",
  Maryland: "MD",
  Massachusetts: "MA",
  Michigan: "MI",
  Minnesota: "MN",
  Mississippi: "MS",
  Missouri: "MO",
  Montana: "MT",
  Nebraska: "NE",
  Nevada: "NV",
  "New Hampshire": "NH",
  "New Jersey": "NJ",
  "New Mexico": "NM",
  "New York": "NY",
  "North Carolina": "NC",
  "North Dakota": "ND",
  "Northern Mariana Islands": "MP",
  Ohio: "OH",
  Oklahoma: "OK",
  Oregon: "OR",
  Palau: "PW",
  Pennsylvania: "PA",
  "Puerto Rico": "PR",
  "Rhode Island": "RI",
  "South Carolina": "SC",
  "South Dakota": "SD",
  Tennessee: "TN",
  Texas: "TX",
  Utah: "UT",
  Vermont: "VT",
  // "Virgin Islands": "VI",
  Virginia: "VA",
  Washington: "WA",
  "West Virginia": "WV",
  Wisconsin: "WI",
  Wyoming: "WY",
} as const;

export default function USA() {
  const winningStates = api.states.winningStates.useQuery(undefined, {
    retry: false,
  });

  const onClick = (event: Event) => {
    alert(event.target.dataset.name);
  };

  const stateCustomConfig = () => {
    if (winningStates.data) {
      const stateCustoms = winningStates.data.reduce((acc, state) => {
        if (state.state) {
          console.log(state.state, state.candidate);
          acc[State_Map[state.state] as string] = {
            fill:
              state.candidate === "Barbie" ? barbieColors : oppenheimerColors,
          };
        }
        return acc;
      }, {} as MapCustomizations);
      return stateCustoms;
    }

    return {};
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <USAMap onClick={onClick} customize={stateCustomConfig()} />
    </div>
  );
}
