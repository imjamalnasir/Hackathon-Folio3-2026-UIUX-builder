export interface ResearchInsights {
  painPoints: string[];
  goals: string[];
  behaviors: string[];
  keyInsights: string[];
  summary: string;
}

export interface Persona {
  name: string;
  age: number;
  occupation: string;
  goals: string[];
  frustrations: string[];
  motivations: string[];
  techBehavior: string;
  quote?: string;
}

export interface FlowNode {
  id: string;
  label: string;
  type: "screen" | "action" | "decision";
  description?: string;
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface UserFlow {
  title: string;
  description: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
}

export interface SitemapNode {
  id: string;
  title: string;
  path: string;
  description?: string;
  children?: SitemapNode[];
}

export interface Sitemap {
  title: string;
  description: string;
  root: SitemapNode[];
}

export interface WireframeComponent {
  id: string;
  type:
    | "navbar"
    | "hero"
    | "card"
    | "form"
    | "table"
    | "cta"
    | "sidebar"
    | "footer"
    | "text"
    | "image"
    | "list"
    | "stats";
  label: string;
  props?: Record<string, string | string[]>;
}

export interface WireframeSection {
  id: string;
  title: string;
  layout: "row" | "column" | "grid" | "full";
  components: WireframeComponent[];
}

export interface WireframePage {
  id: string;
  title: string;
  path: string;
  layout: "default" | "sidebar" | "centered" | "dashboard";
  sections: WireframeSection[];
}

export interface Wireframe {
  title: string;
  description: string;
  pages: WireframePage[];
}

export type WorkflowStep =
  | "home"
  | "research"
  | "persona"
  | "flow"
  | "sitemap"
  | "wireframe";

export interface ProjectState {
  transcript: string;
  productContext: string;
  research: ResearchInsights | null;
  persona: Persona | null;
  flow: UserFlow | null;
  sitemap: Sitemap | null;
  wireframe: Wireframe | null;
}
