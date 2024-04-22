import { cn } from "~/lib/utils";

export function BaseLayout({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<main
			className={cn(
				"grain-overlay min-h-screen bg-gradient-to-b from-white to-stone-50 before:opacity-80 dark:from-stone-800 dark:to-stone-950 dark:text-zinc-100",
				className,
			)}
		>
			{children}
		</main>
	);
}
