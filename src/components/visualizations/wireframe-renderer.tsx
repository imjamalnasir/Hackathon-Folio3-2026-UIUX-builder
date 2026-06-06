"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Layout,
  Menu,
  Image,
  FormInput,
  Table2,
  MousePointerClick,
  PanelLeft,
  AlignLeft,
  List,
  BarChart3,
  LayoutGrid,
} from "lucide-react";
import type { Wireframe, WireframeComponent, WireframePage } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const componentIcons: Record<WireframeComponent["type"], React.ElementType> = {
  navbar: Menu,
  hero: Layout,
  card: LayoutGrid,
  form: FormInput,
  table: Table2,
  cta: MousePointerClick,
  sidebar: PanelLeft,
  footer: AlignLeft,
  text: AlignLeft,
  image: Image,
  list: List,
  stats: BarChart3,
};

function ComponentBlock({ component }: { component: WireframeComponent }) {
  const Icon = componentIcons[component.type] ?? Layout;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "rounded-lg border-2 border-dashed border-border bg-secondary/30 p-3",
        component.type === "navbar" && "col-span-full",
        component.type === "hero" && "col-span-full min-h-[80px]",
        component.type === "footer" && "col-span-full",
        component.type === "sidebar" && "row-span-2"
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-3.5 w-3.5 text-primary" />
        <span className="text-xs font-medium">{component.label}</span>
        <Badge variant="outline" className="text-[10px] ml-auto">
          {component.type}
        </Badge>
      </div>

      {component.type === "navbar" && (
        <div className="flex items-center justify-between">
          <div className="h-3 w-16 bg-muted rounded" />
          <div className="flex gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-2 w-10 bg-muted rounded" />
            ))}
          </div>
        </div>
      )}

      {component.type === "hero" && (
        <div className="space-y-2">
          <div className="h-4 w-3/4 bg-muted rounded" />
          <div className="h-2 w-1/2 bg-muted/60 rounded" />
          <div className="h-6 w-24 bg-primary/20 rounded mt-2" />
        </div>
      )}

      {component.type === "card" && (
        <div className="space-y-2">
          <div className="h-16 bg-muted/50 rounded" />
          <div className="h-2 w-full bg-muted rounded" />
          <div className="h-2 w-2/3 bg-muted/60 rounded" />
        </div>
      )}

      {component.type === "form" && (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-7 bg-muted/50 rounded border border-border" />
          ))}
          <div className="h-7 w-24 bg-primary/20 rounded" />
        </div>
      )}

      {component.type === "table" && (
        <div className="space-y-1">
          <div className="h-5 bg-muted rounded" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-4 bg-muted/40 rounded" />
          ))}
        </div>
      )}

      {component.type === "cta" && (
        <div className="h-8 w-32 bg-primary/30 rounded mx-auto" />
      )}

      {component.type === "stats" && (
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-muted/50 rounded text-center flex flex-col items-center justify-center">
              <div className="h-3 w-8 bg-muted rounded mb-1" />
              <div className="h-2 w-12 bg-muted/60 rounded" />
            </div>
          ))}
        </div>
      )}

      {component.type === "list" && (
        <div className="space-y-1.5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary/40" />
              <div className="h-2 flex-1 bg-muted rounded" />
            </div>
          ))}
        </div>
      )}

      {(component.type === "text" || component.type === "image") && (
        <div className={cn("bg-muted/50 rounded", component.type === "image" ? "h-20" : "h-8")} />
      )}

      {component.type === "sidebar" && (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-3 bg-muted rounded" />
          ))}
        </div>
      )}

      {component.type === "footer" && (
        <div className="flex justify-between">
          <div className="h-2 w-20 bg-muted rounded" />
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-2 w-8 bg-muted rounded" />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

function PagePreview({ page }: { page: WireframePage }) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="bg-secondary/50 px-4 py-2 border-b border-border flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold">{page.title}</h4>
          <code className="text-xs text-muted-foreground">{page.path}</code>
        </div>
        <Badge variant="secondary">{page.layout}</Badge>
      </div>
      <div className="p-4 space-y-4">
        {page.sections.map((section) => (
          <div key={section.id}>
            {section.title && (
              <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">
                {section.title}
              </p>
            )}
            <div
              className={cn(
                "gap-3",
                section.layout === "grid" && "grid grid-cols-2 md:grid-cols-3",
                section.layout === "row" && "flex flex-wrap",
                section.layout === "column" && "flex flex-col",
                section.layout === "full" && "grid grid-cols-1"
              )}
            >
              {section.components.map((comp) => (
                <ComponentBlock key={comp.id} component={comp} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface WireframeRendererProps {
  wireframe: Wireframe;
}

export function WireframeRenderer({ wireframe }: WireframeRendererProps) {
  const [activePage, setActivePage] = useState(0);
  const page = wireframe.pages[activePage];

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {wireframe.pages.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setActivePage(i)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
              i === activePage
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            {p.title}
          </button>
        ))}
      </div>
      {page && <PagePreview page={page} />}
    </div>
  );
}
