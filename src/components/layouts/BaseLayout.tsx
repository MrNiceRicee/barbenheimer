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
        "grain-overlay min-h-screen bg-gradient-to-b from-zinc-800 to-zinc-950 before:opacity-80 dark:text-zinc-100",
        className
      )}
    >
      {children}
    </main>
  );
}
