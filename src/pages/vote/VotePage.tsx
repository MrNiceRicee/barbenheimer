import { useRouter } from "next/router";
import { BaseLayout } from "~/components/layouts/BaseLayout";

export default function VotePage() {
	const router = useRouter();

	return (
		<BaseLayout>
			<div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
				<h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
					Vote <span className="text-[hsl(329,99%,64%)]">Barben</span>
					<span className="text-[hsl(36,100%,50%)]">heimer</span>
				</h1>
				<p>
					Voting in <span className="font-bold">{router.query.state}</span>
				</p>
			</div>
		</BaseLayout>
	);
}
