export function BaseLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="grain-overlay min-h-screen bg-gradient-to-b from-zinc-800 to-zinc-950 before:opacity-80 dark:text-zinc-100">
      {children}
    </main>
  );
}
