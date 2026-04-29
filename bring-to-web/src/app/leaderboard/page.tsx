import { Trophy } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Leaderboard — PitchLab",
};

export default function LeaderboardPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-20 text-center">
      <Trophy className="mx-auto mb-4 h-10 w-10 text-primary" />
      <h1 className="text-3xl font-bold">Leaderboard</h1>
      <p className="mt-3 text-muted-foreground">
        Coming soon — track your scores across scenarios and see how you rank
        against other practitioners.
      </p>
      <Link
        href="/scenarios"
        className="mt-8 inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:opacity-90"
      >
        Practice now
      </Link>
    </main>
  );
}
