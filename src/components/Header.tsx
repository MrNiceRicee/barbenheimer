import Link from "next/link";
import { useWinningElectoralVotes } from "./shared/electoral";
import Image from "next/image";

function VoteLine() {
  const midVotes = 270; // Winning condition

  const electoralVotes = useWinningElectoralVotes();

  const oppenheimerPercentage = Math.round(
    (electoralVotes.Oppenheimer / midVotes) * 100
  );

  const barbiePercentage = Math.round((electoralVotes.Barbie / midVotes) * 100);

  return (
    <div className="relative col-span-12 flex items-center justify-center sm:-mt-24">
      <div className="my-10 grid w-full grid-cols-12 sm:w-[66%]">
        <div className="col-span-6 flex h-10 flex-col items-start">
          <div
            className="flex h-10 origin-left animate-grow-x items-center justify-end bg-oppenheimer px-2 duration-700"
            style={{
              width: `${oppenheimerPercentage}%`,
            }}
          />
        </div>
        <div className="col-span-6 flex h-10 flex-col items-end">
          <div
            className="flex h-10 origin-right animate-grow-x items-center justify-start bg-barbie px-2 duration-700"
            style={{
              width: `${barbiePercentage}%`,
            }}
          />
        </div>
        <div className="absolute left-1/2 top-1/2 col-span-12 h-10 w-[1px] -translate-x-1/2 -translate-y-1/2 bg-gray-400" />
        <p className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-full text-center">
          {midVotes}
        </p>
      </div>
    </div>
  );
}

export function Header() {
  const votes = useWinningElectoralVotes();

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
          <div className="space-y-8">
            <Link href="/candidate/oppenheimer">
              <h1 className="text-2xl font-extrabold tracking-tight text-oppenheimer sm:text-[3rem]">
                Oppenheimer
              </h1>
            </Link>
            <p className="text-center text-3xl font-bold text-oppenheimer animate-in slide-in-from-bottom-3 duration-300 delay-100 sm:text-[3rem]">
              {votes.Oppenheimer}
            </p>
          </div>
        </div>
        <div className="col-span-6 ml-2 justify-end space-y-4 break-words sm:col-span-4 sm:ml-0 sm:flex">
          <div className="space-y-8">
            <Link href="/candidate/barbie">
              <h1 className="text-3xl font-extrabold tracking-tight text-barbie sm:text-[4rem]">
                Barbie
              </h1>
            </Link>
            <p className="text-center text-3xl font-bold text-barbie animate-in slide-in-from-bottom-3 duration-300 delay-100 sm:text-[3rem]">
              {votes.Barbie}
            </p>
          </div>
        </div>
        <div className="col-span-6 row-start-2 flex justify-end sm:col-span-2 sm:row-start-auto">
          <Image
            src="/images/Barbie.jpg"
            alt="Barbie"
            width={200}
            height={200}
          />
        </div>
        <VoteLine key={`${votes.Barbie}-${votes.Oppenheimer}`} />
      </div>
    </header>
  );
}
