import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { env } from "~/env";
import { getScenario } from "~/lib/scenarios";

const requestSchema = z.object({
  scenarioId: z.string(),
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string(),
    }),
  ),
});

const FeedbackSchema = z.object({
  overallScore: z
    .number()
    .min(0)
    .max(100)
    .describe("Overall performance score from 0 to 100"),
  verdict: z
    .string()
    .describe(
      "One sentence overall verdict on the performance, e.g. 'Strong opener but lost momentum on pricing'",
    ),
  strengths: z
    .array(z.string())
    .min(1)
    .max(3)
    .describe("2-3 specific things the user did well"),
  improvements: z
    .array(z.string())
    .min(1)
    .max(3)
    .describe("2-3 specific things to improve"),
  keyMoments: z
    .array(
      z.object({
        moment: z.string().describe("Brief description of the moment"),
        impact: z.enum(["positive", "negative"]),
        tip: z.string().describe("Specific coaching tip for this moment"),
      }),
    )
    .min(1)
    .max(3)
    .describe("2-3 pivotal moments in the conversation worth highlighting"),
  coachingNote: z
    .string()
    .describe(
      "A 2-3 sentence personalized coaching note from the AI's perspective as a business coach",
    ),
});

export type FeedbackResult = z.infer<typeof FeedbackSchema>;

const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { scenarioId, messages } = parsed.data;
  const scenario = getScenario(scenarioId);
  if (!scenario) {
    return NextResponse.json({ error: "Scenario not found" }, { status: 404 });
  }

  const transcript = messages
    .map((m) => `${m.role === "user" ? "USER" : "OPPONENT"}: ${m.content}`)
    .join("\n\n");

  const response = await client.messages.parse({
    model: "claude-opus-4-7",
    max_tokens: 2048,
    system: `You are an expert business coach analyzing a roleplay simulation. The user practiced the following scenario: "${scenario.title}" — ${scenario.subtitle}. The user played the role of: ${scenario.userRole}. Analyze their performance objectively and provide structured, actionable feedback.`,
    messages: [
      {
        role: "user",
        content: `Here is the full conversation transcript from the simulation:\n\n${transcript}\n\nPlease analyze the user's performance and provide structured feedback.`,
      },
    ],
    output_config: {
      format: zodOutputFormat(FeedbackSchema),
    },
  });

  const feedback = response.parsed_output;
  if (!feedback) {
    return NextResponse.json(
      { error: "Failed to generate feedback" },
      { status: 500 },
    );
  }

  return NextResponse.json(feedback);
}
