import { z } from "zod";

export const researchInsightsSchema = z.object({
  painPoints: z.array(z.string()),
  goals: z.array(z.string()),
  behaviors: z.array(z.string()),
  keyInsights: z.array(z.string()),
  summary: z.string(),
});

export const personaSchema = z.object({
  name: z.string(),
  age: z.number(),
  occupation: z.string(),
  goals: z.array(z.string()),
  frustrations: z.array(z.string()),
  motivations: z.array(z.string()),
  techBehavior: z.string(),
  quote: z.string().optional(),
});

export const flowNodeSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: z.enum(["screen", "action", "decision"]),
  description: z.string().optional(),
});

export const flowEdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  label: z.string().optional(),
});

export const userFlowSchema = z.object({
  title: z.string(),
  description: z.string(),
  nodes: z.array(flowNodeSchema).max(8),
  edges: z.array(flowEdgeSchema),
});

export const sitemapNodeSchema: z.ZodType<{
  id: string;
  title: string;
  path: string;
  description?: string;
  children?: Array<{
    id: string;
    title: string;
    path: string;
    description?: string;
    children?: unknown[];
  }>;
}> = z.lazy(() =>
  z.object({
    id: z.string(),
    title: z.string(),
    path: z.string(),
    description: z.string().optional(),
    children: z.array(sitemapNodeSchema).optional(),
  })
);

export const sitemapSchema = z.object({
  title: z.string(),
  description: z.string(),
  root: z.array(sitemapNodeSchema),
});

export const wireframeComponentSchema = z.object({
  id: z.string(),
  type: z.enum([
    "navbar",
    "hero",
    "card",
    "form",
    "table",
    "cta",
    "sidebar",
    "footer",
    "text",
    "image",
    "list",
    "stats",
  ]),
  label: z.string(),
  props: z.record(z.union([z.string(), z.array(z.string())])).optional(),
});

export const wireframeSectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  layout: z.enum(["row", "column", "grid", "full"]),
  components: z.array(wireframeComponentSchema),
});

export const wireframePageSchema = z.object({
  id: z.string(),
  title: z.string(),
  path: z.string(),
  layout: z.enum(["default", "sidebar", "centered", "dashboard"]),
  sections: z.array(wireframeSectionSchema),
});

export const wireframeSchema = z.object({
  title: z.string(),
  description: z.string(),
  pages: z.array(wireframePageSchema),
});
