import { z } from "zod";

export const projectRequirementsSchema = z.object({
  projectName: z.string(),
  projectType: z.string(),
  targetAudience: z.string(),
  problemStatement: z.string(),
  coreFeatures: z.array(z.string()),
  successMetrics: z.array(z.string()),
  constraints: z.array(z.string()),
  businessGoals: z.array(z.string()),
});

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

const VALID_COMPONENT_TYPES = [
  "navbar", "hero", "card", "form", "table", "cta",
  "sidebar", "footer", "text", "image", "list", "stats",
] as const;

const VALID_PAGE_LAYOUTS = ["default", "sidebar", "centered", "dashboard"] as const;
const VALID_SECTION_LAYOUTS = ["row", "column", "grid", "full"] as const;

// Normalizers: coerce common LLM variations to valid enum values
function normalizeComponentType(val: unknown): typeof VALID_COMPONENT_TYPES[number] {
  const s = String(val).toLowerCase().trim();
  if (s.includes("nav")) return "navbar";
  if (s.includes("hero") || s.includes("banner") || s.includes("header")) return "hero";
  if (s.includes("form") || s.includes("input")) return "form";
  if (s.includes("table") || s.includes("grid-data")) return "table";
  if (s.includes("cta") || s.includes("button") || s.includes("action")) return "cta";
  if (s.includes("sidebar") || s.includes("side-nav") || s.includes("sidenav")) return "sidebar";
  if (s.includes("footer")) return "footer";
  if (s.includes("stat") || s.includes("metric") || s.includes("number")) return "stats";
  if (s.includes("list") || s.includes("item")) return "list";
  if (s.includes("image") || s.includes("photo") || s.includes("media")) return "image";
  if (s.includes("card") || s.includes("tile")) return "card";
  if (s.includes("text") || s.includes("para") || s.includes("content")) return "text";
  return "card"; // safe fallback
}

function normalizePageLayout(val: unknown): typeof VALID_PAGE_LAYOUTS[number] {
  const s = String(val).toLowerCase().trim();
  if (s.includes("sidebar") || s.includes("side")) return "sidebar";
  if (s.includes("center") || s.includes("auth") || s.includes("narrow")) return "centered";
  if (s.includes("dashboard") || s.includes("admin")) return "dashboard";
  return "default";
}

function normalizeSectionLayout(val: unknown): typeof VALID_SECTION_LAYOUTS[number] {
  const s = String(val).toLowerCase().trim();
  if (s.includes("grid") || s.includes("two") || s.includes("three") || s.includes("col")) return "grid";
  if (s.includes("row") || s.includes("horizontal") || s.includes("flex")) return "row";
  if (s.includes("full") || s.includes("wide") || s.includes("single")) return "full";
  if (s.includes("col") || s.includes("vertical") || s.includes("stack")) return "column";
  return "column";
}

export const wireframeComponentSchema = z.object({
  id: z.string(),
  type: z
    .string()
    .transform(normalizeComponentType) as z.ZodType<typeof VALID_COMPONENT_TYPES[number]>,
  label: z.string(),
  props: z.record(z.union([z.string(), z.array(z.string())])).optional(),
});

export const wireframeSectionSchema = z.object({
  id: z.string(),
  title: z.string().catch(""),
  layout: z
    .string()
    .transform(normalizeSectionLayout) as z.ZodType<typeof VALID_SECTION_LAYOUTS[number]>,
  components: z.array(wireframeComponentSchema),
});

export const wireframePageSchema = z.object({
  id: z.string(),
  title: z.string(),
  path: z.string(),
  layout: z
    .string()
    .transform(normalizePageLayout) as z.ZodType<typeof VALID_PAGE_LAYOUTS[number]>,
  sections: z.array(wireframeSectionSchema),
});

export const wireframeSchema = z.object({
  title: z.string(),
  description: z.string(),
  pages: z.array(wireframePageSchema).min(1),
});
