import Groq from "groq-sdk";
import { z } from "zod";

const MODEL = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";

function getClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured");
  }
  return new Groq({ apiKey });
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
  const client = getClient();
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const prompt =
        attempt > 0 && lastError
          ? `${userPrompt}\n\nYour previous response failed validation with this error:\n${lastError.message}\n\nFix the error and return ONLY valid JSON. Double-check every enum value matches the allowed values exactly.`
          : userPrompt;

      const completion = await client.chat.completions.create({
        model: MODEL,
        messages: [
          {
            role: "system",
            content: `${systemPrompt}\n\nYou MUST respond with ONLY valid JSON. No markdown, no explanations, no code fences.`,
          },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
        max_tokens: 8000,
      });

      const text = completion.choices[0]?.message?.content;
      if (!text) {
        throw new Error("No text response from Groq");
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
