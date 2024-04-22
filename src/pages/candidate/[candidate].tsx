import Link from "next/link";
import { useRouter } from "next/router";
import { NotFound } from "~/components/Error/NotFound";
import { Header } from "~/components/Header";
import { BaseLayout } from "~/components/layouts/BaseLayout";
import { cn } from "~/lib/utils";
import { type RouterOutputs, api } from "~/utils/api";

type CandidateInfo = RouterOutputs["candidates"]["allInfo"];

const candidateMap = {
	oppenheimer: "Oppenheimer",
	barbie: "Barbie",
} as const;

function PeopleMessage({
	message,
	candidate,
}: {
	message: CandidateInfo["data"][number];
	candidate: "Barbie" | "Oppenheimer";
}) {
	if (!message.messages) {
		return (
			<li
				className={cn(
					"flex flex-col space-y-2 border-l-2 px-2 animate-in fade-in slide-in-from-left-3",
					candidate === "Barbie" ? "border-barbie" : "border-oppenheimer",
				)}
			>
				<p className="text-sm text-gray-500">
					<span className="mr-2">{message.state}</span>
					{new Date(message.votedAt ?? "").toLocaleString()}
				</p>
			</li>
		);
	}

	return (
		<li
			className={cn(
				"flex flex-col border-l-2 px-2 animate-in fade-in slide-in-from-left-3",
				candidate === "Barbie" ? "border-barbie" : "border-oppenheimer",
			)}
		>
			<h3 className="text-lg font-bold leading-tight">{message.state}</h3>
			<p className="break-words text-xl leading-tight">{message.messages}</p>
			<p className="text-sm text-gray-500">
				{new Date(message.votedAt ?? "").toLocaleString()}
			</p>
		</li>
	);
}

function PeopleMessageList({
	messages,
	candidate,
}: {
	messages: CandidateInfo["data"];
	candidate: "Barbie" | "Oppenheimer";
}) {
	return (
		<div className="mx-auto mt-6 w-full space-y-4 sm:w-96">
			<h3 className="text-xl font-bold">{"Voter's"} Voices</h3>
			<ul className="space-y-6">
				{messages.map((message) => {
					return (
						<PeopleMessage
							key={`message-${candidate}-${message.votedAt}`}
							candidate={candidate}
							message={message}
						/>
					);
				})}
			</ul>
		</div>
	);
}

function CandidateInformation({
	candidate,
}: {
	candidate: "Barbie" | "Oppenheimer";
}) {
	const data = api.candidates.allInfo.useQuery(
		{
			candidate,
		},
		{
			retry: false,
			enabled: Boolean(candidate),
		},
	);

	return (
		<BaseLayout>
			<Header />
			<section className="container mx-auto flex flex-col items-center justify-center space-y-10">
				<section className="flex flex-col items-center justify-center">
					<Link href="/" className="underline">
						Go back
					</Link>
					<h1
						className={cn(
							"text-4xl font-bold leading-tight animate-in fade-in",
							candidate === "Barbie" ? "text-barbie" : "text-oppenheimer",
						)}
					>
						{candidate}
					</h1>
				</section>
				{data.isInitialLoading ? (
					<div className="mx-auto w-52 animate-pulse rounded-md bg-stone-400 p-10 text-center font-mono text-xl dark:bg-stone-950">
						Loading...
					</div>
				) : (
					<PeopleMessageList
						candidate={candidate}
						messages={data.data?.data ?? []}
					/>
				)}
			</section>
		</BaseLayout>
	);
}

export default function CandidatePage() {
	const router = useRouter();

	if (!router.query.candidate) {
		return <NotFound />;
	}

	if (!Object.keys(candidateMap).includes(router.query.candidate as string)) {
		return <NotFound message="Candidate not found" />;
	}

	return (
		<CandidateInformation
			candidate={
				candidateMap[
					router.query.candidate.toString() as "barbie" | "oppenheimer"
				]
			}
		/>
	);
}
