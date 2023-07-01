import Head from "next/head";
import USA from "~/components/map/usa";
import { api } from "~/utils/api";

export default function Home() {
  const ipQuery = api.ip.getIP.useQuery();

  return (
    <>
      <Head>
        <title>Barbenheimer</title>
        <meta name="description" content="Barbenheimer voting!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="grain-overlay flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-zinc-800 to-zinc-950 before:opacity-80">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Vote <span className="text-[hsl(329,99%,64%)]">Barben</span>
            <span className="text-[hsl(36,100%,50%)]">heimer</span>
          </h1>
          <h1 className="w-full break-words text-5xl font-extrabold tracking-tight text-white lg:w-96">
            IP: {ipQuery.data?.ip}
          </h1>
        </div>
        <USA />
      </main>
    </>
  );
}
