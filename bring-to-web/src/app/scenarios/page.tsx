import { Clock, Zap } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  categoryLabels,
  difficultyColors,
  difficultyLabels,
  type ScenarioCategory,
  scenarios,
} from "~/lib/scenarios";

export const metadata: Metadata = {
  title: "Scenarios — PitchLab",
  description: "Browse all business roleplay scenarios",
};

const categories: ScenarioCategory[] = [
  "fundraising",
  "sales",
  "hr",
  "executive",
  "interviews",
];

export default function ScenariosPage() {
  const grouped = categories
    .map((cat) => ({
      category: cat,
      items: scenarios.filter((s) => s.category === cat),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight">Scenarios</h1>
        <p className="mt-2 text-muted-foreground">
          Choose your opponent and start a simulation. Each scenario takes 8–20
          minutes.
        </p>
      </div>

      <div className="flex flex-col gap-12">
        {grouped.map(({ category, items }) => (
          <section key={category}>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {categoryLabels[category]}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {items.map((scenario) => (
                <Link
                  key={scenario.id}
                  href={`/sim/${scenario.id}`}
                  className="group flex flex-col gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {scenario.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {scenario.subtitle}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 text-xs font-medium ${difficultyColors[scenario.difficulty]}`}
                    >
                      {difficultyLabels[scenario.difficulty]}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {scenario.description}
                  </p>

                  <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {scenario.opponentAvatar}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-foreground">
                          {scenario.opponentName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {scenario.opponentTitle}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      {scenario.durationMin} min
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-16 rounded-xl border border-primary/20 bg-accent/40 p-8 text-center">
        <Zap className="mx-auto mb-3 h-6 w-6 text-primary" />
        <h3 className="font-semibold">More scenarios coming soon</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Investor update calls, product launches, crisis communications, and
          more.
        </p>
      </div>
    </main>
  );
}
