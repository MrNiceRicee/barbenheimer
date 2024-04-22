import { MapPin } from "lucide-react";
import Link from "next/link";
import { BaseLayout } from "../layouts/BaseLayout";
import { Button } from "../ui/Button";

export function NotFound({ message = "Page not found" }) {
	return (
		<BaseLayout className="flex flex-col items-center justify-center">
			<MapPin className="h-32 w-32 text-amber-500 animate-in spin-in-[3deg] slide-in-from-bottom-6 duration-200" />
			<div className="flex h-fit w-fit items-center justify-center overflow-hidden">
				<h1 className="text-4xl font-bold animate-in fade-in slide-in-from-bottom-12 duration-300 fill-mode-forwards">
					404
				</h1>
			</div>
			<div className="h-fit w-fit overflow-hidden border-t">
				<p className="text-xl animate-in fade-in slide-in-from-top-12 duration-500">
					{message}
				</p>
			</div>
			<Button asChild variant="outline">
				<Link
					href="/"
					className="mt-6 text-zinc-900 animate-in fade-in duration-700 dark:text-zinc-900"
				>
					Go back home
				</Link>
			</Button>
		</BaseLayout>
	);
}
