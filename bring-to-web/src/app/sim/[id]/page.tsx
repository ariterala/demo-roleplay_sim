import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getScenario } from "~/lib/scenarios";
import { SimulatorClient } from "./simulator-client";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const scenario = getScenario(id);
  if (!scenario) return { title: "Not Found — PitchLab" };
  return {
    title: `${scenario.title} — PitchLab`,
    description: scenario.description,
  };
}

export default async function SimPage({ params }: Props) {
  const { id } = await params;
  const scenario = getScenario(id);
  if (!scenario) notFound();

  return <SimulatorClient scenario={scenario} />;
}
