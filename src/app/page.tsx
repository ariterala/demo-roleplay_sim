import Link from "next/link";

const scenarios = [
  {
    icon: "💼",
    title: "Job Interview",
    description:
      "Ace your first internship or part-time job interview with confidence.",
    tag: "Popular",
  },
  {
    icon: "📊",
    title: "Investor Pitch",
    description:
      "Present your startup idea and field tough questions from investors.",
    tag: "Advanced",
  },
  {
    icon: "🤝",
    title: "Salary Negotiation",
    description:
      "Negotiate your offer and advocate confidently for your worth.",
    tag: "Essential",
  },
  {
    icon: "📣",
    title: "Sales Call",
    description: "Pitch a product, handle objections, and close the deal.",
    tag: "Intermediate",
  },
  {
    icon: "👥",
    title: "Team Conflict",
    description:
      "Navigate workplace disagreements and guide your team to solutions.",
    tag: "Leadership",
  },
  {
    icon: "🎤",
    title: "Board Presentation",
    description:
      "Deliver a compelling presentation and handle tough Q&A like a pro.",
    tag: "Challenge",
  },
];

const steps = [
  {
    number: "01",
    title: "Pick a Scenario",
    description:
      "Choose from dozens of real-world business situations curated for high school students.",
  },
  {
    number: "02",
    title: "Step Into the Role",
    description:
      "Respond to prompts and navigate the situation just like you would in real life.",
  },
  {
    number: "03",
    title: "Get Feedback",
    description:
      "Receive detailed feedback on your communication, strategy, and professionalism.",
  },
];

const features = [
  {
    icon: "🎯",
    title: "Real-World Scenarios",
    description:
      "Every scenario is based on actual situations you'll face in your future career.",
  },
  {
    icon: "🧠",
    title: "Learn by Doing",
    description:
      "Roleplay builds skills faster than reading or watching videos alone.",
  },
  {
    icon: "🛡️",
    title: "Safe to Fail",
    description:
      "Make mistakes here, not in real life. Practice until you feel ready.",
  },
  {
    icon: "📈",
    title: "Track Your Growth",
    description:
      "Watch your scores and confidence improve with every session you complete.",
  },
];

export default function Home() {
  return (
    <main className="flex flex-col">
      {/* Hero */}
      <section className="flex flex-col items-center gap-6 px-4 py-20 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-1.5 text-sm text-muted-foreground">
          <span className="font-semibold text-primary">New</span>
          Built for high school business students
        </div>
        <h1 className="max-w-3xl text-5xl font-extrabold leading-tight tracking-tight">
          Master the Business World{" "}
          <span className="text-primary">Before You Enter It</span>
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          Practice real-world business scenarios through interactive roleplay.
          Build confidence, sharpen your communication, and get career-ready.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/notes"
            className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Start Practicing
          </Link>
          <Link
            href="/notes"
            className="rounded-lg border border-border px-6 py-3 font-semibold text-foreground transition-colors hover:bg-muted"
          >
            Browse Scenarios
          </Link>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
          <span>
            <strong className="text-foreground">50+</strong> Scenarios
          </span>
          <span>
            <strong className="text-foreground">10,000+</strong> Students
          </span>
          <span>
            <strong className="text-foreground">Free</strong> to use
          </span>
        </div>
      </section>

      {/* Scenario Cards */}
      <section className="border-t border-border bg-muted/40 px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Practice Any Business Scenario
            </h2>
            <p className="mt-2 text-muted-foreground">
              From entry-level interviews to high-stakes boardroom pitches.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {scenarios.map((s) => (
              <div
                key={s.title}
                className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <span className="text-3xl">{s.icon}</span>
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    {s.tag}
                  </span>
                </div>
                <h3 className="font-semibold text-card-foreground">
                  {s.title}
                </h3>
                <p className="text-sm text-muted-foreground">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight">How It Works</h2>
            <p className="mt-2 text-muted-foreground">
              Three steps to sharper business skills.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col gap-3">
                <span className="text-5xl font-extrabold text-primary/20">
                  {step.number}
                </span>
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why PitchLab */}
      <section className="border-t border-border bg-muted/40 px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Built for the Next Generation of Leaders
            </h2>
            <p className="mt-2 text-muted-foreground">
              Everything you need to walk into any business situation with
              confidence.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {features.map((f) => (
              <div key={f.title} className="flex gap-4">
                <span className="text-2xl">{f.icon}</span>
                <div>
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {f.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-3xl rounded-2xl bg-primary px-8 py-14 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary-foreground">
            Ready to Start Practicing?
          </h2>
          <p className="mt-3 text-primary-foreground/80">
            Join thousands of high schoolers building real business skills
            today.
          </p>
          <Link
            href="/notes"
            className="mt-6 inline-block rounded-lg bg-primary-foreground px-6 py-3 font-semibold text-primary transition-colors hover:bg-primary-foreground/90"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </main>
  );
}
