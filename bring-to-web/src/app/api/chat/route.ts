import Anthropic from "@anthropic-ai/sdk";
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

  const stream = client.messages.stream({
    model: "claude-opus-4-7",
    max_tokens: 1024,
    system: [
      {
        type: "text",
        text: scenario.systemPrompt,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages,
  });

  const readable = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } finally {
        controller.close();
      }
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "X-Accel-Buffering": "no",
    },
  });
}
