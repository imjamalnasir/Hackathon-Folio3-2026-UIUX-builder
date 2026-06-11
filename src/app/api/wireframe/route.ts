import { NextRequest, NextResponse } from "next/server";
import { generateStructuredJson } from "@/lib/gemini";
import { WIREFRAME_SYSTEM } from "@/lib/prompts";
import { wireframeSchema } from "@/lib/schemas";

export async function POST(request: NextRequest) {
  try {
    const { sitemap, flow, persona, productContext } = await request.json();

    if (!sitemap) {
      return NextResponse.json({ error: "Sitemap is required" }, { status: 400 });
    }

    const context = productContext ? `\nProduct context: ${productContext}` : "";

    const result = await generateStructuredJson(
      WIREFRAME_SYSTEM,
      `Create wireframe schemas for the key pages in this sitemap.${context}\n\nSitemap:\n${JSON.stringify(sitemap, null, 2)}\n\nFlow:\n${JSON.stringify(flow, null, 2)}\n\nPersona:\n${JSON.stringify(persona, null, 2)}`,
      wireframeSchema
    );

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Wireframe generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
