import { NextRequest, NextResponse } from "next/server";
import { generateStructuredJson } from "@/lib/gemini";
import { PERSONA_SYSTEM } from "@/lib/prompts";
import { personaSchema } from "@/lib/schemas";

export async function POST(request: NextRequest) {
  try {
    const { research, productContext } = await request.json();

    if (!research) {
      return NextResponse.json({ error: "Research insights are required" }, { status: 400 });
    }

    const context = productContext ? `\nProduct context: ${productContext}` : "";

    const result = await generateStructuredJson(
      PERSONA_SYSTEM,
      `Create a user persona based on these research insights:${context}\n\n${JSON.stringify(research, null, 2)}`,
      personaSchema
    );

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Persona generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
