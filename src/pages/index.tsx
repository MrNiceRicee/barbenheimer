import Head from "next/head";
import USA from "~/components/map/usa";
import BaseLayout from "~/components/layouts/BaseLayout";
import Link from "next/link";
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
      <BaseLayout>
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Vote <span className="text-[hsl(329,99%,64%)]">Barben</span>
            <span className="text-[hsl(36,100%,50%)]">heimer</span>
          </h1>
          <Link
            href="/vote"
            className="rounded-md border px-4 py-2 backdrop-blur-sm"
          >
            Go <span className="text-sky-600">here</span> to vote!
          </Link>
        </div>
        <USA />
      </BaseLayout>
    </>
  );
}
