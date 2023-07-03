import Head from "next/head";
import USA from "~/components/map/usa";
import { BaseLayout } from "~/components/layouts/BaseLayout";
import { api } from "~/utils/api";
import { cn } from "~/lib/utils";
import { type RouterOutputs } from "~/utils/api";

type WinningStatesOutput = RouterOutputs["states"]["winningStates"];

function StateInfoBox({
  candidate,
  state,
  count,
}: WinningStatesOutput[number]) {
  return (
    <li
      className={cn(
        "rounded-md border px-4 py-2 shadow-md shadow-popover-foreground",
        candidate === "Barbie" ? "bg-barbie" : "bg-oppenheimer"
      )}
    >
      <h3 className="text-xl font-bold">{state}</h3>
      <p className="text-lg font-thin">
        {count} vote{count === 1 ? "" : "s"}
      </p>
    </li>
  );
}

function VotesList() {
  const winningStates = api.states.winningStates.useQuery(undefined, {
    retry: false,
  });
  return (
    <ul className="space-y-2">
      {winningStates.data?.map((state, index) => {
        return <StateInfoBox key={`${state.state}-${index}`} {...state} />;
      })}
    </ul>
  );
}

function Header() {
  return (
    <header className="container mb-10 flex flex-col">
      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-oppenheimer sm:text-[4rem]">
            Oppenheimer
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-barbie sm:text-[4rem]">
            Barbie
          </h1>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  return (
    <>
      <Head>
        <title>Barbenheimer</title>
        <meta name="description" content="Barbenheimer voting!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <BaseLayout>
        {/* <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Vote <span className="text-[hsl(329,99%,64%)]">Barben</span>
            <span className="text-[hsl(36,100%,50%)]">heimer</span>
          </h1>
        </div> */}
        <Header />
        <section className="container grid grid-cols-12 px-4">
          <div className="col-span-12 md:col-span-11">
            <USA />
          </div>
          <div className="col-span-12 mx-auto md:col-span-1">
            <VotesList />
          </div>
        </section>
      </BaseLayout>
    </>
  );
}
