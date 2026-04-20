"use client";

import { useState } from "react";
import { cn } from "~/lib/utils";

interface LeaderboardEntry {
  rank: number;
  displayName: string;
  avatar: string;
  score: number;
  scenariosCompleted: number;
  topScenario: string;
}

const MOCK_DATA: Record<string, LeaderboardEntry[]> = {
  "All Time": [
    {
      rank: 1,
      displayName: "Priya S.",
      avatar: "P",
      score: 9840,
      scenariosCompleted: 47,
      topScenario: "Investor Pitch",
    },
    {
      rank: 2,
      displayName: "Marcus T.",
      avatar: "M",
      score: 9210,
      scenariosCompleted: 43,
      topScenario: "Sales Call",
    },
    {
      rank: 3,
      displayName: "Aiko N.",
      avatar: "A",
      score: 8750,
      scenariosCompleted: 39,
      topScenario: "Board Presentation",
    },
    {
      rank: 4,
      displayName: "Jordan L.",
      avatar: "J",
      score: 7920,
      scenariosCompleted: 35,
      topScenario: "Job Interview",
    },
    {
      rank: 5,
      displayName: "Sam R.",
      avatar: "S",
      score: 7400,
      scenariosCompleted: 32,
      topScenario: "Salary Negotiation",
    },
    {
      rank: 6,
      displayName: "Elena V.",
      avatar: "E",
      score: 6870,
      scenariosCompleted: 28,
      topScenario: "Team Conflict",
    },
    {
      rank: 7,
      displayName: "Chris B.",
      avatar: "C",
      score: 6340,
      scenariosCompleted: 25,
      topScenario: "Investor Pitch",
    },
    {
      rank: 8,
      displayName: "Maya K.",
      avatar: "M",
      score: 5910,
      scenariosCompleted: 22,
      topScenario: "Sales Call",
    },
    {
      rank: 9,
      displayName: "David H.",
      avatar: "D",
      score: 5480,
      scenariosCompleted: 20,
      topScenario: "Job Interview",
    },
    {
      rank: 10,
      displayName: "Sofia M.",
      avatar: "S",
      score: 4950,
      scenariosCompleted: 18,
      topScenario: "Board Presentation",
    },
  ],
  "This Week": [
    {
      rank: 1,
      displayName: "Jordan L.",
      avatar: "J",
      score: 1840,
      scenariosCompleted: 9,
      topScenario: "Job Interview",
    },
    {
      rank: 2,
      displayName: "Aiko N.",
      avatar: "A",
      score: 1620,
      scenariosCompleted: 8,
      topScenario: "Board Presentation",
    },
    {
      rank: 3,
      displayName: "Chris B.",
      avatar: "C",
      score: 1410,
      scenariosCompleted: 7,
      topScenario: "Investor Pitch",
    },
    {
      rank: 4,
      displayName: "Priya S.",
      avatar: "P",
      score: 1280,
      scenariosCompleted: 6,
      topScenario: "Investor Pitch",
    },
    {
      rank: 5,
      displayName: "Maya K.",
      avatar: "M",
      score: 1090,
      scenariosCompleted: 5,
      topScenario: "Sales Call",
    },
    {
      rank: 6,
      displayName: "Marcus T.",
      avatar: "M",
      score: 980,
      scenariosCompleted: 5,
      topScenario: "Sales Call",
    },
    {
      rank: 7,
      displayName: "Elena V.",
      avatar: "E",
      score: 870,
      scenariosCompleted: 4,
      topScenario: "Team Conflict",
    },
    {
      rank: 8,
      displayName: "Sam R.",
      avatar: "S",
      score: 740,
      scenariosCompleted: 3,
      topScenario: "Salary Negotiation",
    },
  ],
  Today: [
    {
      rank: 1,
      displayName: "Maya K.",
      avatar: "M",
      score: 620,
      scenariosCompleted: 3,
      topScenario: "Sales Call",
    },
    {
      rank: 2,
      displayName: "Chris B.",
      avatar: "C",
      score: 490,
      scenariosCompleted: 2,
      topScenario: "Investor Pitch",
    },
    {
      rank: 3,
      displayName: "Sofia M.",
      avatar: "S",
      score: 390,
      scenariosCompleted: 2,
      topScenario: "Board Presentation",
    },
    {
      rank: 4,
      displayName: "David H.",
      avatar: "D",
      score: 310,
      scenariosCompleted: 1,
      topScenario: "Job Interview",
    },
    {
      rank: 5,
      displayName: "Jordan L.",
      avatar: "J",
      score: 280,
      scenariosCompleted: 1,
      topScenario: "Salary Negotiation",
    },
  ],
};

const TABS = ["All Time", "This Week", "Today"] as const;
type Tab = (typeof TABS)[number];

const MEDAL = ["🥇", "🥈", "🥉"] as const;

const podiumColors = [
  "bg-accent/15 border-accent/40 text-accent-foreground",
  "bg-muted border-border text-foreground",
  "bg-primary/8 border-primary/25 text-foreground",
] as const;

export function Leaderboard() {
  const [activeTab, setActiveTab] = useState<Tab>("All Time");
  const entries = MOCK_DATA[activeTab];
  const [top3, rest] = [entries.slice(0, 3), entries.slice(3)];

  return (
    <div className="flex flex-col gap-6">
      {/* Tabs */}
      <div className="flex gap-1 rounded-lg border border-border bg-muted p-1 self-start">
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

      {/* Podium — top 3 */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {top3.map((entry, i) => (
          <div
            key={entry.displayName}
            className={cn(
              "flex flex-col items-center gap-3 rounded-xl border p-6 text-center",
              podiumColors[i],
            )}
          >
            <span className="text-3xl">{MEDAL[i]}</span>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-lg font-bold text-primary">
              {entry.avatar}
            </div>
            <div>
              <p className="font-semibold">{entry.displayName}</p>
              <p className="text-xs text-muted-foreground">
                {entry.topScenario}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-extrabold text-primary">
                {entry.score.toLocaleString()}
              </span>
              <span className="text-xs text-muted-foreground">
                {entry.scenariosCompleted} scenarios
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Remaining entries */}
      {rest.length > 0 && (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="grid grid-cols-[2.5rem_1fr_auto] gap-x-4 items-center border-b border-border px-5 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
            <span>#</span>
            <span>Student</span>
            <span className="text-right">Score</span>
          </div>
          {rest.map((entry) => (
            <div
              key={entry.displayName}
              className="grid grid-cols-[2.5rem_1fr_auto] gap-x-4 items-center border-b border-border px-5 py-3.5 last:border-0 transition-colors hover:bg-muted/50"
            >
              <span className="text-sm font-medium text-muted-foreground">
                {entry.rank}
              </span>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {entry.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {entry.displayName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {entry.topScenario} · {entry.scenariosCompleted} scenarios
                  </p>
                </div>
              </div>
              <span className="text-sm font-semibold text-foreground">
                {entry.score.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
