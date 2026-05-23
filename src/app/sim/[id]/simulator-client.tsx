"use client";

import {
  AlertCircle,
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  Loader2,
  Send,
  TrendingUp,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import type { FeedbackResult } from "~/app/api/feedback/route";
import type { Scenario } from "~/lib/scenarios";
import { difficultyColors, difficultyLabels } from "~/lib/scenarios";
import { cn } from "~/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface Props {
  scenario: Scenario;
}

type Phase = "briefing" | "simulation" | "feedback";

export function SimulatorClient({ scenario }: Props) {
  const [phase, setPhase] = useState<Phase>("briefing");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  }, []);

  const startSimulation = useCallback(async () => {
    setPhase("simulation");
    setStreaming(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenarioId: scenario.id, messages: [] }),
      });

      if (!res.ok) throw new Error("Failed to start simulation");
      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let text = "";

      const openerMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "",
      };
      setMessages([openerMsg]);
      scrollToBottom();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        text += decoder.decode(value, { stream: true });
        setMessages([{ ...openerMsg, content: text }]);
        scrollToBottom();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setStreaming(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [scenario.id, scrollToBottom]);

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || streaming) return;

    const newMessages: Message[] = [
      ...messages,
      { id: crypto.randomUUID(), role: "user", content: trimmed },
    ];
    setMessages(newMessages);
    scrollToBottom();
    setInput("");
    setStreaming(true);
    setError(null);

    const apiMessages = newMessages.map(({ role, content }) => ({
      role,
      content,
    }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioId: scenario.id,
          messages: apiMessages,
        }),
      });

      if (!res.ok) throw new Error("Failed to send message");
      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let text = "";
      const replyMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "",
      };

      setMessages([...newMessages, replyMsg]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        text += decoder.decode(value, { stream: true });
        setMessages([...newMessages, { ...replyMsg, content: text }]);
        scrollToBottom();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setMessages(newMessages);
    } finally {
      setStreaming(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [input, messages, scenario.id, streaming, scrollToBottom]);

  const getFeedback = useCallback(async () => {
    setLoadingFeedback(true);
    setError(null);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioId: scenario.id,
          messages: messages.map(({ role, content }) => ({ role, content })),
        }),
      });
      if (!res.ok) throw new Error("Failed to generate feedback");
      const data = await res.json();
      setFeedback(data);
      setPhase("feedback");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate feedback");
    } finally {
      setLoadingFeedback(false);
    }
  }, [messages, scenario.id]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (phase === "briefing") {
    return (
      <main className="mx-auto max-w-2xl px-4 py-12">
        <Link
          href="/scenarios"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to scenarios
        </Link>

        <div className="rounded-xl border border-border bg-card p-8">
          <div className="mb-6 flex items-center justify-between">
            <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
              {scenario.category}
            </span>
            <span
              className={`text-xs font-medium ${difficultyColors[scenario.difficulty]}`}
            >
              {difficultyLabels[scenario.difficulty]}
            </span>
          </div>

          <h1 className="text-2xl font-bold">{scenario.title}</h1>
          <p className="mt-2 text-muted-foreground">{scenario.subtitle}</p>

          <div className="mt-6 rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
            {scenario.description}
          </div>

          <div className="mt-6 flex items-center gap-3 rounded-lg border border-border p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
              {scenario.opponentAvatar}
            </div>
            <div>
              <p className="font-medium text-foreground">
                {scenario.opponentName}
              </p>
              <p className="text-sm text-muted-foreground">
                {scenario.opponentTitle}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-accent/40 border border-primary/20 p-4 text-sm">
            <p className="font-medium text-foreground">Your role</p>
            <p className="mt-1 text-muted-foreground">{scenario.userRole}</p>
          </div>

          <button
            type="button"
            onClick={startSimulation}
            className="mt-8 w-full rounded-lg bg-primary py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Start Simulation
          </button>
        </div>
      </main>
    );
  }

  if (phase === "feedback" && feedback) {
    const scoreColor =
      feedback.overallScore >= 70
        ? "text-emerald-600 dark:text-emerald-400"
        : feedback.overallScore >= 50
          ? "text-amber-600 dark:text-amber-400"
          : "text-rose-600 dark:text-rose-400";

    return (
      <main className="mx-auto max-w-2xl px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Performance Feedback</h1>
          <Link
            href="/scenarios"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Try another →
          </Link>
        </div>

        {/* Score */}
        <div className="mb-4 flex items-center gap-4 rounded-xl border border-border bg-card p-6">
          <div className="flex flex-col items-center">
            <span className={`text-5xl font-black ${scoreColor}`}>
              {feedback.overallScore}
            </span>
            <span className="text-xs text-muted-foreground">/100</span>
          </div>
          <div>
            <p className="font-medium text-foreground">{scenario.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {feedback.verdict}
            </p>
          </div>
        </div>

        {/* Strengths & Improvements */}
        <div className="mb-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-900 bg-card p-5">
            <div className="mb-3 flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-sm font-semibold">Strengths</span>
            </div>
            <ul className="flex flex-col gap-2">
              {feedback.strengths.map((s) => (
                <li
                  key={s}
                  className="flex gap-2 text-sm text-muted-foreground"
                >
                  <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500 mt-1.5" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-amber-200 dark:border-amber-900 bg-card p-5">
            <div className="mb-3 flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-semibold">To improve</span>
            </div>
            <ul className="flex flex-col gap-2">
              {feedback.improvements.map((s) => (
                <li
                  key={s}
                  className="flex gap-2 text-sm text-muted-foreground"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Key moments */}
        <div className="mb-4 rounded-xl border border-border bg-card p-5">
          <div className="mb-3 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">Key moments</span>
          </div>
          <div className="flex flex-col gap-3">
            {feedback.keyMoments.map((m) => (
              <div
                key={m.moment}
                className={cn(
                  "rounded-lg border p-3 text-sm",
                  m.impact === "positive"
                    ? "border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/30"
                    : "border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/30",
                )}
              >
                <div className="flex items-center gap-2">
                  {m.impact === "positive" ? (
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <XCircle className="h-3.5 w-3.5 shrink-0 text-rose-600 dark:text-rose-400" />
                  )}
                  <span className="font-medium text-foreground">
                    {m.moment}
                  </span>
                </div>
                <p className="mt-1 text-muted-foreground pl-5">{m.tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Coaching note */}
        <div className="mb-6 rounded-xl border border-primary/20 bg-accent/40 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">
            Coach's note
          </p>
          <p className="text-sm text-muted-foreground">
            {feedback.coachingNote}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => {
              setMessages([]);
              setFeedback(null);
              setPhase("briefing");
            }}
            className="flex-1 rounded-lg border border-border py-2.5 text-sm font-medium text-foreground hover:bg-muted"
          >
            Practice again
          </button>
          <Link
            href="/scenarios"
            className="flex-1 rounded-lg bg-primary py-2.5 text-center text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Try another scenario
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex h-[calc(100vh-3.5rem)] flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-background/80 backdrop-blur-sm px-4 py-3">
        <div className="flex items-center gap-3">
          <Link
            href="/scenarios"
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              {scenario.opponentAvatar}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium leading-none">
                {scenario.opponentName}
              </span>
              <span className="text-xs text-muted-foreground">
                {scenario.opponentTitle}
              </span>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={getFeedback}
          disabled={messages.length < 2 || loadingFeedback || streaming}
          className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-40 transition-colors"
        >
          {loadingFeedback ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <BarChart3 className="h-3.5 w-3.5" />
          )}
          Get feedback
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex",
                msg.role === "user" ? "justify-end" : "justify-start",
              )}
            >
              {msg.role === "assistant" && (
                <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {scenario.opponentAvatar}
                </div>
              )}
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-muted text-foreground rounded-bl-sm",
                  msg.content === "" && "min-w-[2rem]",
                )}
              >
                {msg.content === "" ? (
                  <span className="flex gap-1 py-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:0ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:300ms]" />
                  </span>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border bg-background px-4 py-3">
        <div className="mx-auto flex max-w-2xl items-end gap-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your response…"
            rows={1}
            disabled={streaming}
            className="flex-1 resize-none rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 max-h-32 overflow-y-auto"
            style={{ minHeight: "2.75rem" }}
            onInput={(e) => {
              const t = e.currentTarget;
              t.style.height = "auto";
              t.style.height = `${Math.min(t.scrollHeight, 128)}px`;
            }}
          />
          <button
            type="button"
            onClick={sendMessage}
            disabled={!input.trim() || streaming}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-40"
          >
            {streaming ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Enter to send · Shift+Enter for new line ·{" "}
          {messages.length >= 2 && !streaming && (
            <button
              type="button"
              onClick={getFeedback}
              className="text-primary hover:underline"
            >
              end session & get feedback
            </button>
          )}
        </p>
      </div>
    </main>
  );
}
