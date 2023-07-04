import Head from "next/head";
import USA from "~/components/map/usa";
import Image from "next/image";
import { BaseLayout } from "~/components/layouts/BaseLayout";
import { api } from "~/utils/api";
import { cn } from "~/lib/utils";
import { type RouterOutputs } from "~/utils/api";
import { useAtomValue } from "jotai";
import { electoralAtom } from "~/components/shared/electoral";
import { State_Map } from "~/components/map/usa";

type WinningStatesOutput = RouterOutputs["states"]["winningStates"];

function StateInfoBox({
  candidate,
  state,
  count,
}: WinningStatesOutput[number]) {
  return (
    <li
      className={cn(
        "flex items-center justify-between rounded-md border px-4 py-2 shadow-md shadow-popover-foreground sm:block",
        candidate === "Barbie" ? "bg-barbie" : "bg-oppenheimer"
      )}
    >
      <h3 className="text-xl font-bold">
        {state}
        <span className="mr-2 text-sm font-thin">
          ({State_Map[state].value})
        </span>
      </h3>
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

function VoteLine() {
  const midVotes = 270; // Winning condition

  const electoralVotes = useAtomValue(electoralAtom);

  const oppenheimerPercentage = Math.round(
    (electoralVotes.Oppenheimer / midVotes) * 100
  );

  const barbiePercentage = Math.round((electoralVotes.Barbie / midVotes) * 100);

  return (
    <div className="relative col-span-12 flex items-center justify-center sm:-mt-24">
      <div className="my-10 grid w-full grid-cols-12 sm:w-[66%]">
        <div className="col-span-6 flex h-10 flex-col items-start">
          <div
            className="h-10 bg-oppenheimer"
            style={{
              width: `${oppenheimerPercentage}%`,
            }}
          />
          <p className="text-left">{electoralVotes.Oppenheimer}</p>
        </div>
        <div className="col-span-6 flex h-10 flex-col items-end">
          <div
            className="h-10 bg-barbie"
            style={{
              width: `${barbiePercentage}%`,
            }}
          />
          <p className="text-right">{electoralVotes.Barbie}</p>
        </div>
        <div className="absolute left-1/2 top-1/2 col-span-12 h-4 w-[1px] -translate-x-1/2 -translate-y-1/2 bg-gray-400" />
        <p className="absolute left-1/2 -translate-x-1/2 translate-y-full text-center">
          {midVotes}
        </p>
      </div>
    </div>
  );
}

function Header() {
  const electoralVotes = useAtomValue(electoralAtom);
  return (
    <header className="container mb-10 flex flex-col">
      <div className="grid grid-cols-12">
        <div className="col-span-6 flex justify-start sm:col-span-2">
          <Image
            src="/images/Oppenheimer.jpg"
            alt="Oppenheimer"
            width={200}
            height={200}
          />
        </div>
        <div className="col-span-6 ml-2 flex justify-start space-y-4 break-words sm:col-span-4 sm:ml-0">
          <h1 className="text-2xl font-extrabold tracking-tight text-oppenheimer sm:text-[3rem]">
            Oppenheimer
          </h1>
        </div>
        <div className="col-span-6 ml-2 justify-end space-y-4 break-words sm:col-span-4 sm:ml-0 sm:flex">
          <h1 className="text-3xl font-extrabold tracking-tight text-barbie sm:text-[4rem]">
            Barbie
          </h1>
        </div>
        <div className="col-span-6 row-start-2 flex justify-end sm:col-span-2 sm:row-start-auto">
          <Image
            src="/images/Barbie.jpg"
            alt="Barbie"
            width={200}
            height={200}
          />
        </div>
        <VoteLine />
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
      <BaseLayout className="py-5">
        {/* <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Vote <span className="text-[hsl(329,99%,64%)]">Barben</span>
            <span className="text-[hsl(36,100%,50%)]">heimer</span>
          </h1>
        </div> */}
        <Header />
        <section className="container -mt-56 grid grid-cols-12 px-4 sm:mt-0">
          <div className="col-span-12 xl:col-span-10">
            <USA />
          </div>
          <div className="col-span-12 mx-auto xl:col-span-2">
            <VotesList />
          </div>
        </section>
      </BaseLayout>
    </>
  );
}
