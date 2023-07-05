import Head from "next/head";
import USA from "~/components/map/usa";
import { BaseLayout } from "~/components/layouts/BaseLayout";
import { api } from "~/utils/api";
import { cn } from "~/lib/utils";
import { type RouterOutputs } from "~/utils/api";
import { State_Map } from "~/components/map/usa";
import { StateSearch } from "~/components/StateSearch";
import { useStateParams } from "~/components/shared/useStateParams";
import { StateVote } from "~/components/vote/StateVote";
import Link from "next/link";
import { Header } from "~/components/Header";

type WinningStatesOutput = RouterOutputs["states"]["winningStates"];
type TotalStatesOutput = RouterOutputs["states"]["totalVotes"];

interface StateInfoBoxProps {
  candidate: WinningStatesOutput[number]["candidate"] | null;
  state: TotalStatesOutput[number]["state"];
  count: TotalStatesOutput[number]["count"];
  index: number;
}

function StateInfoBox({ candidate, state, count, index }: StateInfoBoxProps) {
  return (
    <li
      className={cn(
        "flex items-center justify-between rounded-md border px-4 py-2 shadow-md shadow-zinc-300 animate-in fade-in duration-1000 fill-mode-forwards dark:shadow-zinc-950 sm:block",
        candidate === "Barbie" ? "bg-barbie" : "bg-oppenheimer"
      )}
      style={{
        // animationDelay: `${index * 50}ms`,
        animationDuration: `${index * 100 + 100}ms`,
      }}
    >
      <Link href={`/state/${state}`}>
        <h3 className="space-x-2 text-xl font-bold">
          <span>{state}</span>
          <span className="text-sm font-light">({State_Map[state].value})</span>
        </h3>
        <p className="text-lg font-thin">
          {count} vote{count === 1 ? "" : "s"}
        </p>
      </Link>
    </li>
  );
}

function VotesList() {
  const winningStates = api.states.winningStates.useQuery(undefined, {
    retry: false,
  });
  const totalVotes = api.states.totalVotes.useQuery(undefined, {
    retry: false,
  });

  const allVotes = totalVotes.data?.reduce((acc, state) => {
    return acc + Number(state.count);
  }, 0);

  const { searchParams } = useStateParams();

  const filteredStates = totalVotes.data?.filter((state) => {
    return state.state
      .toLowerCase()
      .includes(searchParams.state?.toLowerCase() ?? "");
  });

  return (
    <>
      <p className="mb-2 text-sm font-light">
        total votes {allVotes?.toLocaleString()}
      </p>
      <StateSearch />
      <ul
        className="max-h-[30rem] space-y-2 overflow-y-scroll py-2"
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 2%, black 98%, transparent)",
        }}
      >
        {filteredStates?.map((state, index) => {
          return (
            <StateInfoBox
              key={`${state.state}-${index}`}
              candidate={
                winningStates.data?.find((s) => s.state === state.state)
                  ?.candidate ?? null
              }
              state={state.state}
              count={state.count}
              index={index}
            />
          );
        })}
      </ul>
    </>
  );
}

export default function Home() {
  return (
    <>
      <Head>
        <title>Barbenheimer</title>
        <meta
          name="description"
          content="Vote between the movies Barbie and Oppenheimer. Both are releasing on the same day"
        />
        <meta
          property="og:image"
          content="https://www.barbenheimer.com/api/og"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <BaseLayout className="py-5">
        <Header />
        <section className="container -mt-56 grid grid-cols-12 px-4 sm:mt-0">
          <div className="col-span-12 xl:col-span-10">
            <USA />
          </div>
          <div className="col-span-12 mx-auto xl:col-span-2">
            <VotesList />
          </div>
        </section>
        <StateVote />
      </BaseLayout>
    </>
  );
}
