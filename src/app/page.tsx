import {
  BarChart3,
  Brain,
  MessageSquare,
  Shield,
  Star,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { scenarios } from "~/lib/scenarios";

const features = [
  {
    icon: Brain,
    title: "AI Opponents That Push Back",
    description:
      "Every opponent is powered by Claude and behaves like the real thing — skeptical VCs, tough clients, demanding board members.",
  },
  {
    icon: MessageSquare,
    title: "Real-Time Streaming",
    description:
      "Conversations flow naturally with streaming responses. No lag, no waiting — just a live back-and-forth that keeps you sharp.",
  },
  {
    icon: BarChart3,
    title: "Instant Performance Feedback",
    description:
      "After each session, get a scored breakdown of your strengths, missed opportunities, and coaching notes from a professional perspective.",
  },
  {
    icon: Shield,
    title: "Safe Space to Fail",
    description:
      "Blow the pitch, lose the deal, stumble in the interview. Here there are no real stakes — only real learning.",
  },
];

const stats = [
  { value: "8", label: "Scenarios" },
  { value: "5", label: "Business contexts" },
  { value: "AI", label: "Powered feedback" },
  { value: "∞", label: "Practice runs" },
];

export default function Home() {
  const featured = scenarios.slice(0, 3);

  return (
    <main className="flex flex-col">
      {/* Hero */}
      <section className="relative flex flex-col items-center gap-8 px-4 py-24 text-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(0.511_0.262_276.97/0.12),transparent)]" />
        <div className="flex items-center gap-2 rounded-full border border-border bg-accent px-4 py-1.5 text-sm text-accent-foreground">
          <Zap className="h-3.5 w-3.5" />
          AI-powered business roleplay
        </div>
        <h1 className="max-w-3xl text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
          Practice the conversations
          <br />
          <span className="text-primary">that define your career</span>
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          PitchLab puts you in high-stakes business scenarios against AI
          opponents that behave like the real thing. Pitch VCs, negotiate
          contracts, navigate board meetings — then get expert feedback.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/scenarios"
            className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Choose a scenario
          </Link>
          <Link
            href="#how-it-works"
            className="rounded-lg border border-border px-6 py-3 font-semibold text-foreground transition-colors hover:bg-muted"
          >
            See how it works
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-muted/40">
        <div className="mx-auto grid max-w-4xl grid-cols-2 divide-x divide-y divide-border sm:grid-cols-4 sm:divide-y-0">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-1 p-8"
            >
              <span className="text-3xl font-bold text-foreground">
                {stat.value}
              </span>
              <span className="text-sm text-muted-foreground">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured scenarios */}
      <section className="mx-auto w-full max-w-5xl px-4 py-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Popular scenarios
            </h2>
            <p className="mt-2 text-muted-foreground">
              Jump into the most-practiced business conversations
            </p>
          </div>
          <Link
            href="/scenarios"
            className="text-sm font-medium text-primary hover:underline"
          >
            View all 8 →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {featured.map((scenario) => (
            <Link
              key={scenario.id}
              href={`/sim/${scenario.id}`}
              className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">
                  {scenario.category}
                </span>
                <span className="text-xs text-muted-foreground">
                  {scenario.durationMin} min
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {scenario.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  {scenario.subtitle}
                </p>
              </div>
              <div className="mt-auto flex items-center gap-2 pt-2 border-t border-border">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {scenario.opponentAvatar}
                </div>
                <span className="text-xs text-muted-foreground">
                  vs. {scenario.opponentName}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="border-t border-border bg-muted/40 px-4 py-20"
      >
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              How PitchLab works
            </h2>
            <p className="mt-3 text-muted-foreground">
              Three steps from cold to confident
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              {
                step: "01",
                icon: Users,
                title: "Pick your opponent",
                description:
                  "Choose from 8 scenarios across fundraising, sales, HR, and executive contexts. Each opponent has a unique persona and real motivations.",
              },
              {
                step: "02",
                icon: MessageSquare,
                title: "Run the simulation",
                description:
                  "Have a real conversation. Your AI opponent pushes back, asks hard questions, and reacts to everything you say — just like a real person.",
              },
              {
                step: "03",
                icon: Trophy,
                title: "Get your scorecard",
                description:
                  "Receive a scored breakdown of your performance with specific strengths, improvement areas, and a personalized coaching note.",
              },
            ].map((item) => (
              <div key={item.step} className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-black text-primary/20">
                    {item.step}
                  </span>
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto w-full max-w-5xl px-4 py-20">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Built for real preparation
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex gap-4 rounded-xl border border-border p-6"
            >
              <feature.icon className="h-6 w-6 shrink-0 text-primary" />
              <div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border px-4 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <Star className="mx-auto mb-4 h-8 w-8 text-primary" />
          <h2 className="text-3xl font-bold tracking-tight">
            Ready to practice?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Pick a scenario and start a simulation in under 60 seconds.
          </p>
          <Link
            href="/scenarios"
            className="mt-8 inline-block rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Browse all scenarios
          </Link>
        </div>
      </section>
    </main>
  );
}
