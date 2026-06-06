import { NextRequest, NextResponse } from "next/server";
import { generateStructuredJson } from "@/lib/anthropic";
import { FLOW_SYSTEM } from "@/lib/prompts";
import { userFlowSchema } from "@/lib/schemas";

export async function POST(request: NextRequest) {
  try {
    const { persona, research, productContext } = await request.json();

    if (!persona) {
      return NextResponse.json({ error: "Persona is required" }, { status: 400 });
    }

    const context = productContext ? `\nProduct context: ${productContext}` : "";

    const result = await generateStructuredJson(
      FLOW_SYSTEM,
      `Create a user flow for this persona. Maximum 6-8 nodes.${context}\n\nPersona:\n${JSON.stringify(persona, null, 2)}\n\nResearch:\n${JSON.stringify(research, null, 2)}`,
      userFlowSchema
    );

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Flow generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
