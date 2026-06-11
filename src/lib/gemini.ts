import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

const MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

function getApiKey() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }
  return apiKey;
}

function extractJson(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) return fenced[1].trim();

  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    return text.slice(start, end + 1);
  }

  const arrStart = text.indexOf("[");
  const arrEnd = text.lastIndexOf("]");
  if (arrStart !== -1 && arrEnd !== -1 && arrEnd > arrStart) {
    return text.slice(arrStart, arrEnd + 1);
  }

  return text.trim();
}

export async function generateStructuredJson<T>(
  systemPrompt: string,
  userPrompt: string,
  schema: z.ZodType<T>,
  maxRetries = 2
): Promise<T> {
  const genAI = new GoogleGenerativeAI(getApiKey());
  const model = genAI.getGenerativeModel({
    model: MODEL,
    systemInstruction: `${systemPrompt}\n\nYou MUST respond with ONLY valid JSON. No markdown, no explanations, no code fences.`,
    generationConfig: {
      responseMimeType: "application/json",
      maxOutputTokens: 4096,
    },
  });

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const prompt =
        attempt > 0
          ? `${userPrompt}\n\nPrevious response was invalid JSON. Return ONLY valid JSON matching the schema.`
          : userPrompt;

      const result = await model.generateContent(prompt);
      const text = result.response.text();

      if (!text) {
        throw new Error("No text response from Gemini");
      }

      const raw = extractJson(text);
      const parsed = JSON.parse(raw);
      return schema.parse(parsed);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
    }
  }

  throw lastError ?? new Error("Failed to generate valid JSON");
}
