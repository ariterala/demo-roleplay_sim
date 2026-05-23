import { Check } from "lucide-react";
import type { Metadata } from "next";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { createClient } from "~/lib/supabase/server";
import { CheckoutButton } from "./checkout-button";

export const metadata: Metadata = {
  title: "Pricing — PitchLab",
  description: "Upgrade to PitchLab Premium and unlock every scenario.",
};

const FREE_FEATURES = [
  "3 starter scenarios",
  "Beginner & intermediate difficulty",
  "AI-powered feedback",
  "Unlimited retries",
];

const PREMIUM_FEATURES = [
  "All 8 scenarios",
  "Advanced difficulty (VC pitch, board meetings)",
  "AI-powered feedback",
  "Unlimited retries",
  "New scenarios as they launch",
];

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const { success } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let plan = "free";
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .maybeSingle();
    plan = data?.plan ?? "free";
  }

  const isPremium = plan === "premium";

  return (
    <main className="mx-auto max-w-4xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Simple pricing</h1>
        <p className="mt-3 text-muted-foreground">
          Start free. Upgrade when you need more firepower.
        </p>
      </div>

      {success && (
        <div className="mb-8 rounded-lg border border-green-500/30 bg-green-500/10 px-5 py-4 text-center text-sm text-green-700 dark:text-green-400">
          You&apos;re now on Premium — enjoy all 8 scenarios!
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Free plan */}
        <div className="flex flex-col rounded-xl border border-border bg-card p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Free
              </span>
              {!isPremium && user && (
                <Badge variant="secondary">Current plan</Badge>
              )}
            </div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </div>

          <ul className="mb-8 flex flex-col gap-3">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 shrink-0 text-muted-foreground" />
                {f}
              </li>
            ))}
          </ul>

          <div className="mt-auto">
            <Button variant="outline" size="lg" className="w-full" disabled>
              {user ? "Current plan" : "Get started free"}
            </Button>
          </div>
        </div>

        {/* Premium plan */}
        <div className="flex flex-col rounded-xl border border-primary/40 bg-card p-6 ring-1 ring-primary/20">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                Premium
              </span>
              {isPremium && <Badge>Current plan</Badge>}
            </div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-4xl font-bold">$19</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </div>

          <ul className="mb-8 flex flex-col gap-3">
            {PREMIUM_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 shrink-0 text-primary" />
                {f}
              </li>
            ))}
          </ul>

          <div className="mt-auto">
            {isPremium ? (
              <Button size="lg" className="w-full" disabled>
                You&apos;re on Premium
              </Button>
            ) : (
              <CheckoutButton />
            )}
          </div>
        </div>
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        Payments are processed securely by Stripe. Cancel anytime.
      </p>
    </main>
  );
}
