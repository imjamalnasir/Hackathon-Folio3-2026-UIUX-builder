import { NextRequest, NextResponse } from "next/server";
import { generateStructuredJson } from "@/lib/anthropic";
import { RESEARCH_SYSTEM } from "@/lib/prompts";
import { researchInsightsSchema } from "@/lib/schemas";

export async function POST(request: NextRequest) {
  try {
    const { transcript } = await request.json();

    if (!transcript || typeof transcript !== "string" || transcript.trim().length < 50) {
      return NextResponse.json(
        { error: "Transcript must be at least 50 characters" },
        { status: 400 }
      );
    }

    const result = await generateStructuredJson(
      RESEARCH_SYSTEM,
      `Analyze this UX research data and extract structured insights:\n\n${transcript}`,
      researchInsightsSchema
    );

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Research analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
