import { NextRequest, NextResponse } from "next/server";
import { generateStructuredJson } from "@/lib/gemini";
import { RESEARCH_SYSTEM } from "@/lib/prompts";
import { researchInsightsSchema } from "@/lib/schemas";

export async function POST(request: NextRequest) {
  try {
    const { transcript, requirements } = await request.json();

    const hasTranscript = transcript && typeof transcript === "string" && transcript.trim().length >= 50;
    const hasRequirements = requirements && typeof requirements === "object";

    if (!hasTranscript && !hasRequirements) {
      return NextResponse.json(
        { error: "Provide either a transcript (min 50 characters) or project requirements" },
        { status: 400 }
      );
    }

    const userPrompt = hasTranscript
      ? `Analyze this UX research data and extract structured insights:\n\n${transcript}`
      : `You are synthesizing UX research insights for a product based on its requirements. Imagine realistic user pain points, goals, behaviors, and key insights that would emerge from user interviews for this type of product.\n\nProject requirements:\n${JSON.stringify(requirements, null, 2)}\n\nGenerate realistic, evidence-based research insights that align with the target audience and problem space described.`;

    const result = await generateStructuredJson(
      RESEARCH_SYSTEM,
      userPrompt,
      researchInsightsSchema
    );

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Research analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
