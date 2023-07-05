import { useRouter } from "next/router";
import { BaseLayout } from "~/components/layouts/BaseLayout";
import { Header } from "~/components/Header";
import { api } from "~/utils/api";
import { type States } from "~/components/shared/useStateParams";
import type { RouterOutputs } from "~/utils/api";
import { CheckCircle } from "lucide-react";
import { cn } from "~/lib/utils";
import Link from "next/link";

type StateInfo = RouterOutputs["states"]["byState"];

function Winner({
  barbieVotes,
  oppenheimerVotes,
}: {
  barbieVotes: NonNullable<StateInfo["votes"]>["barbieVotes"];
  oppenheimerVotes: NonNullable<StateInfo["votes"]>["oppenheimerVotes"];
}) {
  if (barbieVotes > oppenheimerVotes) {
    return (
      <p className="text-xl font-bold text-barbie sm:text-3xl">
        Barbie
        <CheckCircle className="ml-2 inline-block text-barbie" />
      </p>
    );
  }

  if (oppenheimerVotes > barbieVotes) {
    return (
      <p className="text-xl font-bold text-oppenheimer sm:text-3xl">
        Oppenheimer
      </p>
    );
  }

  return <p className="animate-pulse text-gray-500">Tie</p>;
}

function calculatePercentage({
  value,
  total,
}: {
  value: number;
  total: number;
}) {
  if (total === 0) return "0%";
  return `${Math.round((value / total) * 100)}%`;
}

function calculateWidth({ value, total }: { value: number; total: number }) {
  return calculatePercentage({ value, total });
}

function ColoredBars({
  value,
  total,
  className,
}: {
  value: number;
  total: number;
  className?: string;
}) {
  return (
    <>
      <div
        aria-hidden
        className="absolute left-0 top-full h-2 w-full"
        style={{
          background: `repeating-linear-gradient(
            45deg,
            rgb(161, 161, 170),
            rgb(161, 161, 170) 4px,
            rgB(212, 212, 216) 4px,
            rgb(212, 212, 216) 8px
          )`,
        }}
      />
      <div
        aria-hidden
        className={cn(
          "absolute left-0 top-full h-2 w-full origin-left animate-grow-x duration-700 delay-200 ease-out",
          className
        )}
        style={{
          width: calculateWidth({ value, total }),
        }}
      />
    </>
  );
}

function Headliner({
  state,
  barbieVotes,
  oppenheimerVotes,
  totalVotes,
}: {
  state: States;
  barbieVotes: NonNullable<StateInfo["votes"]>["barbieVotes"];
  oppenheimerVotes: NonNullable<StateInfo["votes"]>["oppenheimerVotes"];
  totalVotes: NonNullable<StateInfo["votes"]>["totalVotes"];
}) {
  return (
    <header className="flex flex-col items-center justify-center space-y-2">
      <Link href="/">Go back</Link>
      <h2 className="text-2xl font-extrabold tracking-tight sm:text-[3rem]">
        {state}
      </h2>
      <Winner
        barbieVotes={barbieVotes ?? 0}
        oppenheimerVotes={oppenheimerVotes ?? 0}
      />

      <div className="w-full space-y-2 text-lg sm:w-96">
        <div className="relative w-full text-barbie">
          <p className="flex justify-between">
            <span>
              Barbie
              <span className="ml-1 text-sm font-light">
                {calculatePercentage({
                  value: barbieVotes ?? 0,
                  total: totalVotes ?? 0,
                })}
              </span>
            </span>
            <span>{barbieVotes ?? 0}</span>
          </p>
          <ColoredBars
            total={totalVotes ?? 0}
            value={barbieVotes ?? 0}
            className="bg-barbie"
          />
        </div>
        <div className="relative w-full text-oppenheimer">
          <p className="flex justify-between">
            <span>
              Oppenheimer
              <span className="ml-1 text-sm font-light">
                {calculatePercentage({
                  value: oppenheimerVotes ?? 0,
                  total: totalVotes ?? 0,
                })}
              </span>
            </span>
            <span>{oppenheimerVotes ?? 0}</span>
          </p>
          <ColoredBars
            total={totalVotes ?? 0}
            value={oppenheimerVotes ?? 0}
            className="bg-oppenheimer"
          />
        </div>
        <div className="relative w-full text-gray-500">
          <p className="flex justify-between">
            <span>Total</span>
            <span>{totalVotes ?? 0}</span>
          </p>
          <ColoredBars total={totalVotes ?? 0} value={totalVotes ?? 0} />
        </div>
      </div>
    </header>
  );
}

function PeopleMessage({ message }: { message: StateInfo["data"][number] }) {
  if (!message.messages) {
    return (
      <li
        className={cn(
          "flex flex-col space-y-2 border-l-2 px-2 animate-in fade-in slide-in-from-left-3",
          message.candidate === "Barbie"
            ? "border-barbie"
            : "border-oppenheimer"
        )}
      >
        <p className="text-sm text-gray-500">
          {new Date(message.votedAt ?? "").toLocaleString()}
        </p>
      </li>
    );
  }
  return (
    <li
      className={cn(
        "flex flex-col border-l-2 px-2 animate-in fade-in slide-in-from-left-3",
        message.candidate === "Barbie" ? "border-barbie" : "border-oppenheimer"
      )}
    >
      <h3 className="text-lg font-bold leading-tight">Voter says</h3>
      <p className="break-words text-xl leading-tight">{message.messages}</p>
      <p className="text-sm text-gray-500">
        {new Date(message.votedAt ?? "").toLocaleString()}
      </p>
    </li>
  );
}

function PeopleMessageList({ messages }: { messages: StateInfo["data"] }) {
  return (
    <div className="mx-auto w-full sm:w-96 space-y-4 mt-6">
      <h3 className="text-xl font-bold">{"Voter's"} Voices</h3>
      <ul className="space-y-4">
        {messages.map((message, index) => {
          return (
            <PeopleMessage
              key={`message-${message.candidate}-${index}`}
              message={message}
            />
          );
        })}
      </ul>
    </div>
  );
}

export default function StatePage() {
  const router = useRouter();
  const stateInfo = api.states.byState.useQuery(
    {
      state: router.query.state as States,
    },
    {
      enabled: Boolean(router.query.state),
      retry: false,
    }
  );

  return (
    <BaseLayout className="py-5">
      <Header />
      <section className="container space-y-10">
        {stateInfo.isLoading ? (
          <div className="mx-auto w-52 animate-pulse rounded-md bg-stone-400 p-10 text-center font-mono text-xl dark:bg-stone-950">
            Loading...
          </div>
        ) : (
          <Headliner
            barbieVotes={stateInfo.data?.votes?.barbieVotes ?? 0}
            oppenheimerVotes={stateInfo.data?.votes?.oppenheimerVotes ?? 0}
            totalVotes={stateInfo.data?.votes?.totalVotes ?? 0}
            state={router.query.state as States}
          />
        )}
        {stateInfo.isLoading ? (
          <div className="mx-auto w-52 animate-pulse rounded-md bg-stone-400 p-10 text-center font-mono text-xl dark:bg-stone-950">
            Loading...
          </div>
        ) : (
          <PeopleMessageList messages={stateInfo.data?.data ?? []} />
        )}
      </section>
    </BaseLayout>
  );
}
