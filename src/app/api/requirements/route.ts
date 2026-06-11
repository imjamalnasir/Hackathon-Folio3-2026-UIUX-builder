import { NextRequest, NextResponse } from "next/server";
import { generateStructuredJson } from "@/lib/gemini";
import { REQUIREMENTS_SYSTEM } from "@/lib/prompts";
import { projectRequirementsSchema } from "@/lib/schemas";

export async function POST(request: NextRequest) {
  try {
    const { description } = await request.json();

    if (!description || description.trim().length < 20) {
      return NextResponse.json({ error: "Project description is required (min 20 characters)" }, { status: 400 });
    }

    const result = await generateStructuredJson(
      REQUIREMENTS_SYSTEM,
      `Extract structured product requirements from this project description:\n\n${description}`,
      projectRequirementsSchema
    );

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Requirements extraction failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
