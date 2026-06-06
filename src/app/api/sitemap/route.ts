import { NextRequest, NextResponse } from "next/server";
import { generateStructuredJson } from "@/lib/anthropic";
import { SITEMAP_SYSTEM } from "@/lib/prompts";
import { sitemapSchema } from "@/lib/schemas";

export async function POST(request: NextRequest) {
  try {
    const { flow, persona, productContext } = await request.json();

    if (!flow) {
      return NextResponse.json({ error: "User flow is required" }, { status: 400 });
    }

    const context = productContext ? `\nProduct context: ${productContext}` : "";

    const result = await generateStructuredJson(
      SITEMAP_SYSTEM,
      `Create a sitemap/information architecture based on this user flow and persona.${context}\n\nFlow:\n${JSON.stringify(flow, null, 2)}\n\nPersona:\n${JSON.stringify(persona, null, 2)}`,
      sitemapSchema
    );

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Sitemap generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
