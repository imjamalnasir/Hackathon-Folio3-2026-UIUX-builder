"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Upload,
  Download,
  User,
  GitBranch,
  Map,
  Layout,
  FileSearch,
  Target,
  AlertCircle,
  Lightbulb,
  Activity,
  ClipboardList,
  CheckCircle2,
  TrendingUp,
  ShieldAlert,
} from "lucide-react";
import type {
  WorkflowStep,
  ProjectState,
  ProjectRequirements,
  ResearchInsights,
  Persona,
  UserFlow,
  Sitemap,
  Wireframe,
} from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { StepIndicator } from "./step-indicator";
import { LoadingState } from "./loading-state";
import { FlowDiagram } from "@/components/visualizations/flow-diagram";
import { SitemapTree } from "@/components/visualizations/sitemap-tree";
import { WireframeRenderer } from "@/components/visualizations/wireframe-renderer";

const SAMPLE_TRANSCRIPT = `Interview with Sarah, 32, Product Manager at a mid-size SaaS company.

"I spend at least 2 hours every morning just trying to figure out what my team should prioritize. Our backlog has 200+ items and there's no clear way to see what's actually important vs what's just loud."

Pain points:
- Too many tools — Jira, Slack, Notion, all disconnected
- No visibility into why decisions were made
- Stakeholders constantly changing priorities
- Hard to communicate roadmap to leadership

Goals:
- Single source of truth for product priorities
- Quick way to align team on what matters this sprint
- Easy reporting for leadership meetings
- Reduce time spent in status meetings

Behaviors:
- Checks Slack first thing in the morning
- Uses spreadsheets as workaround for missing features
- Schedules 3-4 alignment meetings per week
- Reviews competitor products monthly

Key insight: Sarah doesn't need more features — she needs fewer decisions to make each day. The product should surface what matters and hide what doesn't.`;

const SAMPLE_REQUIREMENTS = `Project: Smart Task Prioritization App

We are building a mobile-first productivity app for busy professionals who struggle with overwhelming task lists. The app should help users automatically prioritize tasks based on deadlines, importance, and energy levels throughout the day.

Target users: Knowledge workers aged 25-45 who manage 20+ tasks daily across multiple projects.

Core features needed:
- AI-powered task prioritization engine
- Time-blocking calendar integration
- Energy level tracking (morning/afternoon/evening modes)
- Team collaboration and delegation
- Daily/weekly progress reports

Business goals:
- Reach 50,000 MAU within 12 months
- Achieve 4.5+ app store rating
- Target B2B sales to companies with 50-500 employees

Constraints:
- Must work offline
- GDPR compliant data storage
- Launch on iOS first, Android in Q2`;

const initialState: ProjectState = {
  transcript: "",
  productContext: "",
  requirements: null,
  research: null,
  persona: null,
  flow: null,
  sitemap: null,
  wireframe: null,
};

async function callApi<T>(endpoint: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`/api/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Request failed");
  return data as T;
}

export function CopilotDashboard() {
  const [step, setStep] = useState<WorkflowStep>("home");
  const [state, setState] = useState<ProjectState>(initialState);
  const [requirementInput, setRequirementInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<WorkflowStep[]>([]);

  const progress = (completedSteps.length / 6) * 100;

  const markComplete = useCallback((s: WorkflowStep) => {
    setCompletedSteps((prev) => (prev.includes(s) ? prev : [...prev, s]));
  }, []);

  const handleRequirements = async () => {
    setLoading(true);
    setError(null);
    try {
      const requirements = await callApi<ProjectRequirements>("requirements", {
        description: requirementInput,
      });
      setState((s) => ({ ...s, requirements }));
      markComplete("requirements");
      setStep("research");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to extract requirements");
    } finally {
      setLoading(false);
    }
  };

  const handleResearch = async (fromRequirements = false) => {
    setLoading(true);
    setError(null);
    try {
      const research = await callApi<ResearchInsights>("research", {
        transcript: fromRequirements ? undefined : state.transcript,
        requirements: fromRequirements ? state.requirements : undefined,
      });
      setState((s) => ({ ...s, research }));
      markComplete("research");
      setStep("persona");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to analyze research");
    } finally {
      setLoading(false);
    }
  };

  const handlePersona = async () => {
    setLoading(true);
    setError(null);
    try {
      const persona = await callApi<Persona>("persona", {
        research: state.research,
        productContext: state.productContext,
        requirements: state.requirements,
      });
      setState((s) => ({ ...s, persona }));
      markComplete("persona");
      setStep("flow");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate persona");
    } finally {
      setLoading(false);
    }
  };

  const handleFlow = async () => {
    setLoading(true);
    setError(null);
    try {
      const flow = await callApi<UserFlow>("flow", {
        persona: state.persona,
        research: state.research,
        productContext: state.productContext,
        requirements: state.requirements,
      });
      setState((s) => ({ ...s, flow }));
      markComplete("flow");
      setStep("sitemap");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate flow");
    } finally {
      setLoading(false);
    }
  };

  const handleSitemap = async () => {
    setLoading(true);
    setError(null);
    try {
      const sitemap = await callApi<Sitemap>("sitemap", {
        flow: state.flow,
        persona: state.persona,
        productContext: state.productContext,
      });
      setState((s) => ({ ...s, sitemap }));
      markComplete("sitemap");
      setStep("wireframe");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate sitemap");
    } finally {
      setLoading(false);
    }
  };

  const handleWireframe = async () => {
    setLoading(true);
    setError(null);
    try {
      const wireframe = await callApi<Wireframe>("wireframe", {
        sitemap: state.sitemap,
        flow: state.flow,
        persona: state.persona,
        productContext: state.productContext,
        requirements: state.requirements,
      });
      setState((s) => ({ ...s, wireframe }));
      markComplete("wireframe");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate wireframe");
    } finally {
      setLoading(false);
    }
  };

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ux-copilot-output.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setState((s) => ({ ...s, transcript: text }));
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => setStep("home")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="text-left">
              <h1 className="text-lg font-bold leading-none">AI UX Copilot</h1>
              <p className="text-xs text-muted-foreground">Research → Design</p>
            </div>
          </button>
          {step !== "home" && (
            <div className="flex items-center gap-3">
              <div className="hidden sm:block w-32">
                <Progress value={progress} />
              </div>
              {completedSteps.length === 6 && (
                <Button variant="outline" size="sm" onClick={downloadJson}>
                  <Download className="h-4 w-4" />
                  Export JSON
                </Button>
              )}
            </div>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <StepIndicator
          currentStep={step}
          completedSteps={completedSteps}
          onStepClick={setStep}
        />

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {step === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12"
            >
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-6">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-3">
                Research to Design, Automated
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto mb-8">
                Paste your UX research and let AI generate personas, user flows, sitemaps, and
                wireframes in under 2 minutes.
              </p>
              <Button size="lg" onClick={() => setStep("requirements")}>
                Start New Project
                <ArrowRight className="h-4 w-4" />
              </Button>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-16 max-w-3xl mx-auto">
                {[
                  { icon: ClipboardList, label: "Requirements" },
                  { icon: User, label: "Personas" },
                  { icon: GitBranch, label: "User Flows" },
                  { icon: Map, label: "Sitemaps" },
                  { icon: Layout, label: "Wireframes" },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border"
                  >
                    <Icon className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {step === "requirements" && (
            <motion.div
              key="requirements"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {loading ? (
                <LoadingState message="Extracting project requirements..." />
              ) : (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <ClipboardList className="h-6 w-6 text-primary" />
                      Project Requirements
                    </h2>
                    <p className="text-muted-foreground mt-1">
                      Describe your project. The AI will extract structured requirements to guide persona and flow generation.
                    </p>
                  </div>

                  <Textarea
                    placeholder="Describe your project — what it is, who it's for, key features, business goals, and any constraints..."
                    className="min-h-[240px] text-sm"
                    value={requirementInput}
                    onChange={(e) => setRequirementInput(e.target.value)}
                  />

                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setRequirementInput(SAMPLE_REQUIREMENTS)}
                    >
                      Load sample requirements
                    </Button>
                    <Button
                      onClick={handleRequirements}
                      disabled={requirementInput.trim().length < 20}
                    >
                      Extract Requirements
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>

                  {state.requirements && (
                    <RequirementsCard requirements={state.requirements} />
                  )}
                </div>
              )}
            </motion.div>
          )}

          {step === "research" && (
            <motion.div
              key="research"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {loading ? (
                <LoadingState message="Analyzing research insights with Gemini..." />
              ) : (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <FileSearch className="h-6 w-6 text-primary" />
                      Research
                    </h2>
                    <p className="text-muted-foreground mt-1">
                      Generate research from your project requirements, or paste real interview transcripts.
                    </p>
                  </div>

                  {state.requirements && (
                    <Card className="border-primary/30 bg-primary/5">
                      <CardContent className="pt-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-semibold text-sm">Generate research from requirements</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              AI will synthesize realistic UX research insights for <span className="font-medium">{state.requirements.projectName}</span> based on your extracted requirements.
                            </p>
                          </div>
                          <Button onClick={() => handleResearch(true)} className="shrink-0">
                            <Sparkles className="h-4 w-4" />
                            Generate Research
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="relative flex items-center gap-3">
                    <div className="flex-1 border-t border-border" />
                    <span className="text-xs text-muted-foreground">or paste your own transcript</span>
                    <div className="flex-1 border-t border-border" />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Product Context (optional)</label>
                      <Input
                        placeholder="e.g. B2B SaaS prioritization tool for product teams"
                        value={state.productContext}
                        onChange={(e) =>
                          setState((s) => ({ ...s, productContext: e.target.value }))
                        }
                      />
                    </div>
                    <div className="flex items-end">
                      <label className="cursor-pointer">
                        <input type="file" accept=".txt,.md,.csv" className="hidden" onChange={handleFileUpload} />
                        <span className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-border bg-card text-sm hover:bg-accent transition-colors">
                          <Upload className="h-4 w-4" />
                          Upload transcript
                        </span>
                      </label>
                    </div>
                  </div>

                  <Textarea
                    placeholder="Paste your UX research transcript here..."
                    className="min-h-[220px] font-mono text-sm"
                    value={state.transcript}
                    onChange={(e) => setState((s) => ({ ...s, transcript: e.target.value }))}
                  />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => setStep("requirements")}>
                        <ArrowLeft className="h-4 w-4" /> Back
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setState((s) => ({ ...s, transcript: SAMPLE_TRANSCRIPT }))}
                      >
                        Load sample
                      </Button>
                    </div>
                    <Button
                      onClick={() => handleResearch(false)}
                      disabled={state.transcript.trim().length < 50}
                    >
                      Extract Insights
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>

                  {state.research && (
                    <ResearchResults research={state.research} />
                  )}
                </div>
              )}
            </motion.div>
          )}

          {step === "persona" && (
            <motion.div
              key="persona"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {loading ? (
                <LoadingState message="Generating user persona..." />
              ) : state.persona ? (
                <div className="space-y-6">
                  <PersonaCard persona={state.persona} />
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setStep("research")}>
                      <ArrowLeft className="h-4 w-4" /> Back
                    </Button>
                    <Button onClick={() => setStep("flow")}>
                      Continue to Flow <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 space-y-4">
                  <User className="h-12 w-12 text-primary mx-auto" />
                  <h2 className="text-2xl font-bold">Generate Persona</h2>
                  <p className="text-muted-foreground">
                    Create an evidence-based user persona from your research insights.
                  </p>
                  <div className="flex justify-center gap-3">
                    <Button variant="outline" onClick={() => setStep("research")}>
                      <ArrowLeft className="h-4 w-4" /> Back
                    </Button>
                    <Button onClick={handlePersona}>
                      Generate Persona <Sparkles className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {step === "flow" && (
            <motion.div
              key="flow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {loading ? (
                <LoadingState message="Creating user flow diagram..." />
              ) : state.flow ? (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold">{state.flow.title}</h2>
                    <p className="text-muted-foreground">{state.flow.description}</p>
                  </div>
                  <FlowDiagram flow={state.flow} />
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setStep("persona")}>
                      <ArrowLeft className="h-4 w-4" /> Back
                    </Button>
                    <Button onClick={() => setStep("sitemap")}>
                      Continue to Sitemap <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 space-y-4">
                  <GitBranch className="h-12 w-12 text-primary mx-auto" />
                  <h2 className="text-2xl font-bold">Generate User Flow</h2>
                  <p className="text-muted-foreground">
                    Map the step-by-step journey your persona takes through the product.
                  </p>
                  <div className="flex justify-center gap-3">
                    <Button variant="outline" onClick={() => setStep("persona")}>
                      <ArrowLeft className="h-4 w-4" /> Back
                    </Button>
                    <Button onClick={handleFlow}>
                      Generate Flow <Sparkles className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {step === "sitemap" && (
            <motion.div
              key="sitemap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {loading ? (
                <LoadingState message="Building information architecture..." />
              ) : state.sitemap ? (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold">{state.sitemap.title}</h2>
                    <p className="text-muted-foreground">{state.sitemap.description}</p>
                  </div>
                  <SitemapTree nodes={state.sitemap.root} />
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setStep("flow")}>
                      <ArrowLeft className="h-4 w-4" /> Back
                    </Button>
                    <Button onClick={() => setStep("wireframe")}>
                      Continue to Wireframe <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 space-y-4">
                  <Map className="h-12 w-12 text-primary mx-auto" />
                  <h2 className="text-2xl font-bold">Generate Sitemap</h2>
                  <p className="text-muted-foreground">
                    Create a hierarchical site structure from your user flow.
                  </p>
                  <div className="flex justify-center gap-3">
                    <Button variant="outline" onClick={() => setStep("flow")}>
                      <ArrowLeft className="h-4 w-4" /> Back
                    </Button>
                    <Button onClick={handleSitemap}>
                      Generate Sitemap <Sparkles className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {step === "wireframe" && (
            <motion.div
              key="wireframe"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {loading ? (
                <LoadingState message="Generating wireframe layouts..." />
              ) : state.wireframe ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">{state.wireframe.title}</h2>
                      <p className="text-muted-foreground">{state.wireframe.description}</p>
                    </div>
                    <Button variant="outline" onClick={downloadJson}>
                      <Download className="h-4 w-4" /> Export
                    </Button>
                  </div>
                  <WireframeRenderer wireframe={state.wireframe} />
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setStep("sitemap")}>
                      <ArrowLeft className="h-4 w-4" /> Back
                    </Button>
                    <Button onClick={() => { setState(initialState); setRequirementInput(""); setCompletedSteps([]); setStep("home"); }}>
                      Start New Project
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 space-y-4">
                  <Layout className="h-12 w-12 text-primary mx-auto" />
                  <h2 className="text-2xl font-bold">Generate Wireframes</h2>
                  <p className="text-muted-foreground">
                    Convert your sitemap into component-based UI wireframe previews.
                  </p>
                  <div className="flex justify-center gap-3">
                    <Button variant="outline" onClick={() => setStep("sitemap")}>
                      <ArrowLeft className="h-4 w-4" /> Back
                    </Button>
                    <Button onClick={handleWireframe}>
                      Generate Wireframes <Sparkles className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function RequirementsCard({ requirements }: { requirements: ProjectRequirements }) {
  const sections = [
    { icon: Target, label: "Core Features", items: requirements.coreFeatures, color: "text-primary" },
    { icon: TrendingUp, label: "Business Goals", items: requirements.businessGoals, color: "text-green-600" },
    { icon: CheckCircle2, label: "Success Metrics", items: requirements.successMetrics, color: "text-blue-600" },
    { icon: ShieldAlert, label: "Constraints", items: requirements.constraints, color: "text-orange-600" },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{requirements.projectName}</CardTitle>
            <CardDescription>{requirements.projectType} · {requirements.targetAudience}</CardDescription>
          </div>
          <Badge variant="outline">{requirements.projectType}</Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-2 border-l-2 border-primary pl-3">
          {requirements.problemStatement}
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          {sections.map(({ icon: Icon, label, items, color }) => (
            <div key={label} className="space-y-2">
              <h4 className={`text-sm font-semibold flex items-center gap-1.5 ${color}`}>
                <Icon className="h-4 w-4" />
                {label}
              </h4>
              <ul className="space-y-1">
                {items.map((item, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 rounded-full bg-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ResearchResults({ research }: { research: ResearchInsights }) {
  const sections = [
    { icon: AlertCircle, label: "Pain Points", items: research.painPoints, color: "text-destructive" },
    { icon: Target, label: "Goals", items: research.goals, color: "text-primary" },
    { icon: Activity, label: "Behaviors", items: research.behaviors, color: "text-accent-foreground" },
    { icon: Lightbulb, label: "Key Insights", items: research.keyInsights, color: "text-primary" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Research Insights</CardTitle>
        <CardDescription>{research.summary}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          {sections.map(({ icon: Icon, label, items, color }) => (
            <div key={label} className="space-y-2">
              <h4 className={`text-sm font-semibold flex items-center gap-1.5 ${color}`}>
                <Icon className="h-4 w-4" />
                {label}
              </h4>
              <ul className="space-y-1">
                {items.map((item, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-1.5 h-1 w-1 rounded-full bg-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function PersonaCard({ persona }: { persona: Persona }) {
  return (
    <Card className="overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-primary to-primary/60" />
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl">{persona.name}</CardTitle>
            <CardDescription>
              {persona.age} · {persona.occupation}
            </CardDescription>
          </div>
          <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-7 w-7 text-primary" />
          </div>
        </div>
        {persona.quote && (
          <blockquote className="mt-4 border-l-2 border-primary pl-4 italic text-muted-foreground text-sm">
            &ldquo;{persona.quote}&rdquo;
          </blockquote>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          <PersonaSection title="Goals" items={persona.goals} variant="accent" />
          <PersonaSection title="Frustrations" items={persona.frustrations} variant="outline" />
          <PersonaSection title="Motivations" items={persona.motivations} variant="accent" />
          <div>
            <h4 className="text-sm font-semibold mb-2">Tech Behavior</h4>
            <p className="text-sm text-muted-foreground">{persona.techBehavior}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PersonaSection({
  title,
  items,
  variant,
}: {
  title: string;
  items: string[];
  variant: "accent" | "outline";
}) {
  return (
    <div>
      <h4 className="text-sm font-semibold mb-2">{title}</h4>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item, i) => (
          <Badge key={i} variant={variant} className="text-xs font-normal">
            {item}
          </Badge>
        ))}
      </div>
    </div>
  );
}
