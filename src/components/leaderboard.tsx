"use client";

import { useEffect, useState } from "react";
import { createClient } from "~/lib/supabase/client";
import { cn } from "~/lib/utils";

interface LeaderboardEntry {
  rank: number;
  student_id: string;
  student_name: string;
  total_score: number;
  scenarios_completed: number;
  top_scenario: string;
}

const TABS = ["All Time", "This Week", "Today"] as const;
type Tab = (typeof TABS)[number];

const PERIOD: Record<Tab, string> = {
  "All Time": "all_time",
  "This Week": "this_week",
  Today: "today",
};

const MEDAL = ["🥇", "🥈", "🥉"] as const;

const podiumColors = [
  "bg-accent/15 border-accent/40 text-accent-foreground",
  "bg-muted border-border text-foreground",
  "bg-primary/8 border-primary/25 text-foreground",
] as const;

function SkeletonRow() {
  return (
    <div className="grid grid-cols-[2.5rem_1fr_auto] gap-x-4 items-center border-b border-border px-5 py-3.5 last:border-0">
      <div className="h-4 w-5 rounded bg-muted animate-pulse" />
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-muted animate-pulse shrink-0" />
        <div className="flex flex-col gap-1.5">
          <div className="h-3 w-28 rounded bg-muted animate-pulse" />
          <div className="h-2.5 w-20 rounded bg-muted animate-pulse" />
        </div>
      </div>
      <div className="h-4 w-10 rounded bg-muted animate-pulse" />
    </div>
  );
}

export function Leaderboard() {
  const [activeTab, setActiveTab] = useState<Tab>("All Time");
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const supabase = createClient();

    supabase
      .rpc("get_leaderboard", { period: PERIOD[activeTab] })
      .then(({ data, error: rpcError }) => {
        if (cancelled) return;
        if (rpcError) {
          setError(rpcError.message);
        } else {
          setEntries((data as LeaderboardEntry[]) ?? []);
        }
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeTab]);

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);

  return (
    <div className="flex flex-col gap-6">
      {/* Tabs */}
      <div className="flex gap-1 self-start rounded-lg border border-border bg-muted p-1">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={cn(
              "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
              activeTab === tab
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {error && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Failed to load leaderboard: {error}
        </p>
      )}

      {/* Podium — top 3 */}
      {!error && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {loading
            ? ["podium-1", "podium-2", "podium-3"].map((key) => (
                <div
                  key={key}
                  className="flex flex-col items-center gap-3 rounded-xl border border-border bg-muted p-6"
                >
                  <div className="h-8 w-8 rounded-full bg-border animate-pulse" />
                  <div className="h-12 w-12 rounded-full bg-border animate-pulse" />
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-4 w-20 rounded bg-border animate-pulse" />
                    <div className="h-3 w-24 rounded bg-border animate-pulse" />
                  </div>
                  <div className="h-7 w-16 rounded bg-border animate-pulse" />
                </div>
              ))
            : top3.map((entry, i) => (
                <div
                  key={entry.student_id}
                  className={cn(
                    "flex flex-col items-center gap-3 rounded-xl border p-6 text-center",
                    podiumColors[i],
                  )}
                >
                  <span className="text-3xl">{MEDAL[i]}</span>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-lg font-bold text-primary">
                    {entry.student_name[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold">{entry.student_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {entry.top_scenario}
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-extrabold text-primary">
                      {entry.total_score.toLocaleString()}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {entry.scenarios_completed} scenarios
                    </span>
                  </div>
                </div>
              ))}
        </div>
      )}

      {/* Remaining entries */}
      {!error && (loading || rest.length > 0) && (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="grid grid-cols-[2.5rem_1fr_auto] items-center gap-x-4 border-b border-border px-5 py-2.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <span>#</span>
            <span>Student</span>
            <span className="text-right">Score</span>
          </div>
          {loading
            ? ["row-1", "row-2", "row-3", "row-4", "row-5"].map((key) => (
                <SkeletonRow key={key} />
              ))
            : rest.map((entry) => (
                <div
                  key={entry.student_id}
                  className="grid grid-cols-[2.5rem_1fr_auto] items-center gap-x-4 border-b border-border px-5 py-3.5 transition-colors last:border-0 hover:bg-muted/50"
                >
                  <span className="text-sm font-medium text-muted-foreground">
                    {entry.rank}
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {entry.student_name[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {entry.student_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {entry.top_scenario} · {entry.scenarios_completed}{" "}
                        scenarios
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {entry.total_score.toLocaleString()}
                  </span>
                </div>
              ))}
        </div>
      )}

      {!loading && !error && entries.length === 0 && (
        <p className="py-12 text-center text-muted-foreground">
          No scores yet for this period.
        </p>
      )}
    </div>
  );
}
