import { stripe } from "~/lib/stripe";
import { createClient } from "~/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const origin = new URL(request.url).origin;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: user.email,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "PitchLab Premium",
            description:
              "All 8 scenarios, advanced AI opponents, unlimited practice",
          },
          unit_amount: 1900,
          recurring: { interval: "month" },
        },
        quantity: 1,
      },
    ],
    success_url: `${origin}/pricing?success=true`,
    cancel_url: `${origin}/pricing`,
    metadata: { userId: user.id },
  });

  return Response.json({ url: session.url });
}
