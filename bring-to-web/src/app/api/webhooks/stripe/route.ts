import { createClient } from "@supabase/supabase-js";
import type Stripe from "stripe";
import { env } from "~/env";
import { stripe } from "~/lib/stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );
  } catch {
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
  );

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.userId;
    const customerId =
      typeof session.customer === "string" ? session.customer : null;
    const subscriptionId =
      typeof session.subscription === "string" ? session.subscription : null;

    if (!userId) {
      return Response.json(
        { error: "Missing userId in metadata" },
        { status: 400 },
      );
    }

    await supabase.from("profiles").upsert({
      id: userId,
      plan: "premium",
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      updated_at: new Date().toISOString(),
    });
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object;
    const customerId =
      typeof subscription.customer === "string" ? subscription.customer : null;

    if (customerId) {
      await supabase
        .from("profiles")
        .update({
          plan: "free",
          stripe_subscription_id: null,
          updated_at: new Date().toISOString(),
        })
        .eq("stripe_customer_id", customerId);
    }
  }

  return Response.json({ received: true });
}
