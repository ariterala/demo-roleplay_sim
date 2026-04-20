import { Leaderboard } from "~/components/leaderboard";

export default function LeaderboardPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
        <p className="text-muted-foreground">
          Top students ranked by total score across all practice scenarios.
        </p>
      </div>
      <Leaderboard />
    </main>
  );
}
