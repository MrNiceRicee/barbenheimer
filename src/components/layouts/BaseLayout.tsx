export function BaseLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="grain-overlay flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-zinc-800 to-zinc-950 before:opacity-80 dark:text-zinc-100">
      {children}
    </main>
  );
}
