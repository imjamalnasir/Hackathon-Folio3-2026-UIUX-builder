"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Monitor,
  Circle,
  ChevronRight,
  Check,
  ImageIcon,
  User,
  Bell,
  Search,
  Menu,
  BarChart2,
  ArrowUp,
  Settings,
  Home,
  Folder,
  PieChart,
  HelpCircle,
  FileText,
} from "lucide-react";
import type { Wireframe, WireframeComponent, WireframePage, WireframeSection } from "@/lib/types";
import { cn } from "@/lib/utils";

// ─── helpers ────────────────────────────────────────────────────────────────

function prop(c: WireframeComponent, key: string): string {
  const val = c.props?.[key];
  if (!val) return "";
  return Array.isArray(val) ? val.join(", ") : val;
}

function propArray(c: WireframeComponent, key: string): string[] {
  const val = c.props?.[key];
  if (!val) return [];
  return Array.isArray(val) ? val : [val];
}

// Gray swatch shorthand
function G({ className }: { className?: string }) {
  return <div className={cn("bg-gray-200 rounded", className)} />;
}

// Image placeholder with icon
function ImgPlaceholder({ className, label }: { className?: string; label?: string }) {
  return (
    <div className={cn("bg-gray-100 border border-gray-200 rounded flex flex-col items-center justify-center gap-1", className)}>
      <ImageIcon className="h-6 w-6 text-gray-300" />
      {label && <span className="text-[9px] text-gray-400">{label}</span>}
    </div>
  );
}

// Avatar placeholder
function Avatar({ size = "sm" }: { size?: "xs" | "sm" | "md" }) {
  const s = size === "xs" ? "h-4 w-4" : size === "sm" ? "h-6 w-6" : "h-8 w-8";
  return (
    <div className={cn("rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center shrink-0", s)}>
      <User className="h-2.5 w-2.5 text-gray-400" />
    </div>
  );
}

// Pill / badge
function Pill({ label, dark }: { label: string; dark?: boolean }) {
  return (
    <span className={cn("text-[9px] font-medium px-2 py-0.5 rounded-full border", dark ? "bg-gray-800 text-white border-gray-800" : "bg-white text-gray-600 border-gray-300")}>
      {label}
    </span>
  );
}

// Button mock
function Btn({ label, filled }: { label: string; filled?: boolean }) {
  return (
    <div className={cn("inline-flex items-center justify-center px-3 py-1.5 rounded border text-[10px] font-semibold select-none", filled ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-700 border-gray-400")}>
      {label}
    </div>
  );
}

// ─── Component renderers ────────────────────────────────────────────────────

function NavbarBlock({ c }: { c: WireframeComponent }) {
  const logo = prop(c, "logo") || c.label;
  const links = propArray(c, "links").length ? propArray(c, "links") : ["Home", "Features", "Pricing", "About"];
  const cta = prop(c, "cta") || "Sign Up";
  return (
    <div className="flex items-center justify-between px-4 py-2.5 bg-white border border-gray-200 rounded">
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 rounded bg-gray-800 flex items-center justify-center">
          <span className="text-[9px] text-white font-bold">{logo[0]}</span>
        </div>
        <span className="text-xs font-bold text-gray-800">{logo}</span>
      </div>
      <div className="hidden sm:flex items-center gap-5">
        {links.map((l, i) => (
          <span key={i} className={cn("text-[11px] cursor-pointer", i === 0 ? "text-gray-900 font-semibold border-b-2 border-gray-900 pb-0.5" : "text-gray-500")}>{l}</span>
        ))}
      </div>
      <div className="flex items-center gap-2.5">
        <Search className="h-3.5 w-3.5 text-gray-400" />
        <Bell className="h-3.5 w-3.5 text-gray-400" />
        <Btn label={cta} filled />
      </div>
    </div>
  );
}

function HeroBlock({ c }: { c: WireframeComponent }) {
  const headline = prop(c, "headline") || c.label;
  const sub = prop(c, "subheadline") || "Supporting message that explains the value proposition to new visitors.";
  const primary = prop(c, "primaryCta") || "Get Started";
  const secondary = prop(c, "secondaryCta");
  return (
    <div className="bg-white border border-gray-200 rounded px-8 py-10">
      <div className="max-w-xl mx-auto text-center space-y-4">
        <Pill label="New · Version 2.0" />
        <h2 className="text-2xl font-bold text-gray-900 leading-tight">{headline}</h2>
        <p className="text-xs text-gray-500 leading-relaxed">{sub}</p>
        <div className="flex items-center justify-center gap-3 pt-1">
          <Btn label={primary} filled />
          {secondary && <Btn label={secondary} />}
        </div>
        <div className="flex justify-center gap-5 pt-2">
          {["No credit card", "Free 14-day trial", "Cancel anytime"].map((t, i) => (
            <span key={i} className="text-[10px] text-gray-400 flex items-center gap-1">
              <Check className="h-2.5 w-2.5 text-gray-500" />{t}
            </span>
          ))}
        </div>
        <ImgPlaceholder className="mt-4 h-32 w-full" label="Hero illustration / screenshot" />
      </div>
    </div>
  );
}

function StatsBlock({ c }: { c: WireframeComponent }) {
  const items = propArray(c, "items").length
    ? propArray(c, "items")
    : ["1,200 Users", "98% Uptime", "4.9 Rating", "50 Integrations"];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {items.slice(0, 4).map((item, i) => (
        <div key={i} className="bg-white border border-gray-200 rounded p-4 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            {i % 2 === 0
              ? <BarChart2 className="h-3.5 w-3.5 text-gray-400" />
              : <ArrowUp className="h-3.5 w-3.5 text-gray-400" />
            }
          </div>
          <div className="font-bold text-base text-gray-900">{item}</div>
          <div className="text-[9px] text-gray-400 mt-0.5">vs last period</div>
        </div>
      ))}
    </div>
  );
}

function CardBlock({ c }: { c: WireframeComponent }) {
  const title = prop(c, "title") || c.label;
  const desc = prop(c, "description") || "Brief description of this card's content and purpose.";
  const tag = prop(c, "tag") || "Category";
  const action = prop(c, "action") || "View Details";
  return (
    <div className="bg-white border border-gray-200 rounded overflow-hidden">
      <ImgPlaceholder className="h-24 w-full rounded-none" label="Card image" />
      <div className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-1">
          <span className="font-semibold text-xs text-gray-800 leading-snug">{title}</span>
          <Pill label={tag} />
        </div>
        <p className="text-[10px] text-gray-500 leading-relaxed">{desc}</p>
        <div className="flex items-center justify-between pt-1 border-t border-gray-100">
          <div className="flex -space-x-1.5">
            {[0, 1, 2].map(i => <Avatar key={i} size="xs" />)}
          </div>
          <span className="text-[10px] text-gray-600 flex items-center gap-0.5 font-medium">
            {action} <ChevronRight className="h-2.5 w-2.5" />
          </span>
        </div>
      </div>
    </div>
  );
}

function FormBlock({ c }: { c: WireframeComponent }) {
  const title = prop(c, "title") || c.label;
  const fields = propArray(c, "fields").length ? propArray(c, "fields") : ["Full Name", "Email Address", "Password", "Phone Number"];
  const submit = prop(c, "submit") || "Submit";
  return (
    <div className="bg-white border border-gray-200 rounded p-5 space-y-3">
      <h4 className="font-semibold text-sm text-gray-800">{title}</h4>
      <div className="grid gap-3 sm:grid-cols-2">
        {fields.map((f, i) => (
          <div key={i} className="space-y-1">
            <div className="text-[10px] text-gray-600 font-medium">{f}</div>
            <div className="h-7 rounded border border-gray-300 bg-gray-50 px-2 flex items-center">
              <G className="h-2 w-24" />
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 pt-1">
        <Btn label={submit} filled />
        <span className="text-[10px] text-gray-400">All fields required</span>
      </div>
    </div>
  );
}

function TableBlock({ c }: { c: WireframeComponent }) {
  const title = prop(c, "title") || c.label;
  const cols = propArray(c, "columns").length ? propArray(c, "columns") : ["Name", "Status", "Date", "Category", "Actions"];
  const statuses = ["Active", "Pending", "Draft", "Archived"];
  return (
    <div className="bg-white border border-gray-200 rounded overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100">
        <span className="font-semibold text-xs text-gray-800">{title}</span>
        <div className="flex items-center gap-2">
          <div className="h-6 w-20 rounded border border-gray-200 bg-gray-50 flex items-center px-2 gap-1">
            <Search className="h-2.5 w-2.5 text-gray-300" />
            <G className="h-1.5 w-12" />
          </div>
          <Btn label="Export" />
          <Btn label="+ Add New" filled />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[10px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="w-4 px-3 py-2"><div className="h-3 w-3 rounded border border-gray-300 bg-white" /></th>
              {cols.map((col, i) => (
                <th key={i} className="px-3 py-2 text-left text-gray-500 font-semibold whitespace-nowrap">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[0, 1, 2, 3, 4].map((row) => (
              <tr key={row} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-3 py-2"><div className="h-3 w-3 rounded border border-gray-200 bg-white" /></td>
                {cols.map((_, ci) => (
                  <td key={ci} className="px-3 py-2.5">
                    {ci === 0
                      ? <div className="flex items-center gap-2"><Avatar size="xs" /><G className="h-2 w-16" /></div>
                      : ci === 1
                      ? <Pill label={statuses[row % statuses.length]} dark={row % 4 === 0} />
                      : ci === cols.length - 1
                      ? <div className="flex gap-1"><G className="h-4 w-8" /><G className="h-4 w-8" /></div>
                      : <G className={cn("h-2", ci === 2 ? "w-14" : "w-16")} />
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between px-4 py-2 border-t border-gray-100">
        <span className="text-[10px] text-gray-400">Showing 1–5 of 24 results</span>
        <div className="flex gap-1">
          {["←", "1", "2", "3", "→"].map((p, i) => (
            <div key={i} className={cn("h-5 w-5 flex items-center justify-center rounded text-[9px]", i === 1 ? "bg-gray-900 text-white" : "border border-gray-200 text-gray-500")}>{p}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CtaBlock({ c }: { c: WireframeComponent }) {
  const headline = prop(c, "headline") || c.label;
  const desc = prop(c, "description") || "Take the next step and get started today.";
  const button = prop(c, "button") || "Get Started";
  return (
    <div className="bg-gray-900 rounded px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-5">
      <div className="text-center sm:text-left space-y-1.5">
        <h4 className="font-bold text-sm text-white">{headline}</h4>
        <p className="text-[11px] text-gray-400">{desc}</p>
      </div>
      <div className="flex gap-2 shrink-0">
        <div className="bg-white text-gray-900 text-xs font-bold px-5 py-2 rounded">{button}</div>
        <div className="border border-gray-600 text-gray-400 text-xs px-4 py-2 rounded">Learn more</div>
      </div>
    </div>
  );
}

function SidebarBlock({ c }: { c: WireframeComponent }) {
  const logo = prop(c, "logo") || c.label;
  const items = propArray(c, "items").length ? propArray(c, "items") : ["Dashboard", "Projects", "Analytics", "Team", "Settings", "Help"];
  const sideIcons = [Home, Folder, PieChart, User, Settings, HelpCircle];
  return (
    <div className="w-44 min-h-[200px] bg-white border border-gray-200 rounded p-2 space-y-0.5">
      <div className="flex items-center gap-2 px-2 py-2 mb-1 border-b border-gray-100">
        <div className="h-5 w-5 rounded bg-gray-800 flex items-center justify-center">
          <span className="text-[8px] text-white font-bold">{logo[0]}</span>
        </div>
        <span className="text-xs font-bold text-gray-800">{logo}</span>
      </div>
      {items.map((item, i) => {
        const Icon = sideIcons[i % sideIcons.length];
        return (
          <div key={i} className={cn("flex items-center gap-2 px-2 py-1.5 rounded text-[11px] cursor-pointer", i === 0 ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-50")}>
            <Icon className="h-3 w-3 shrink-0" />
            {item}
          </div>
        );
      })}
    </div>
  );
}

function ListBlock({ c }: { c: WireframeComponent }) {
  const title = prop(c, "title") || c.label;
  const items = propArray(c, "items").length ? propArray(c, "items") : ["First list item description", "Second list item description", "Third list item description", "Fourth list item description"];
  return (
    <div className="bg-white border border-gray-200 rounded p-4 space-y-2">
      <h4 className="font-semibold text-xs text-gray-800 mb-3">{title}</h4>
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-2.5 pb-2 border-b border-gray-50 last:border-0">
          <div className={cn("h-4 w-4 rounded border-2 border-gray-300 flex items-center justify-center shrink-0 mt-0.5", i < 2 && "bg-gray-900 border-gray-900")}>
            {i < 2 && <Check className="h-2.5 w-2.5 text-white" />}
          </div>
          <div className="flex-1 space-y-1">
            <span className={cn("text-[11px]", i < 2 ? "text-gray-400 line-through" : "text-gray-700")}>{item}</span>
            <G className="h-1.5 w-24" />
          </div>
          <span className="text-[9px] text-gray-400">{i < 2 ? "Done" : "Todo"}</span>
        </div>
      ))}
    </div>
  );
}

function TextBlock({ c }: { c: WireframeComponent }) {
  const heading = prop(c, "heading") || c.label;
  const body = prop(c, "body") || "This section contains descriptive content providing context and information to the user.";
  return (
    <div className="bg-white border border-gray-200 rounded p-5 space-y-3">
      <h4 className="font-bold text-sm text-gray-900">{heading}</h4>
      <p className="text-[11px] text-gray-500 leading-relaxed">{body}</p>
      <div className="space-y-1.5">
        <G className="h-2 w-full" />
        <G className="h-2 w-5/6" />
        <G className="h-2 w-4/6" />
      </div>
    </div>
  );
}

function ImageBlock({ c }: { c: WireframeComponent }) {
  const caption = prop(c, "caption") || c.label;
  return (
    <ImgPlaceholder className="h-40 w-full" label={caption} />
  );
}

function FooterBlock({ c }: { c: WireframeComponent }) {
  const brand = prop(c, "brand") || c.label;
  const links = propArray(c, "links").length ? propArray(c, "links") : ["Privacy", "Terms", "Contact", "Blog", "Support"];
  const copy = prop(c, "copy") || `© 2025 ${brand}. All rights reserved.`;
  return (
    <div className="bg-gray-50 border border-gray-200 rounded px-6 py-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="font-bold text-xs text-gray-700">{brand}</span>
          <p className="text-[10px] text-gray-400">Building better products.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          {links.map((l, i) => (
            <span key={i} className="text-[10px] text-gray-500 hover:text-gray-800 cursor-pointer">{l}</span>
          ))}
        </div>
        <span className="text-[10px] text-gray-400">{copy}</span>
      </div>
    </div>
  );
}

// ─── Dispatcher ─────────────────────────────────────────────────────────────

function ComponentBlock({ component }: { component: WireframeComponent }) {
  switch (component.type) {
    case "navbar":  return <NavbarBlock c={component} />;
    case "hero":    return <HeroBlock c={component} />;
    case "stats":   return <StatsBlock c={component} />;
    case "card":    return <CardBlock c={component} />;
    case "form":    return <FormBlock c={component} />;
    case "table":   return <TableBlock c={component} />;
    case "cta":     return <CtaBlock c={component} />;
    case "sidebar": return <SidebarBlock c={component} />;
    case "list":    return <ListBlock c={component} />;
    case "text":    return <TextBlock c={component} />;
    case "image":   return <ImageBlock c={component} />;
    case "footer":  return <FooterBlock c={component} />;
    default:        return <div className="p-3 rounded border border-gray-200 text-xs text-gray-400">{component.label}</div>;
  }
}

// ─── Section ────────────────────────────────────────────────────────────────

function SectionBlock({ section }: { section: WireframeSection }) {
  return (
    <div className="space-y-2.5">
      {section.title && (
        <div className="flex items-center gap-2">
          <div className="h-px flex-1 bg-gray-100" />
          <span className="text-[9px] uppercase tracking-widest text-gray-400 font-semibold px-2">{section.title}</span>
          <div className="h-px flex-1 bg-gray-100" />
        </div>
      )}
      <div
        className={cn(
          "gap-3",
          section.layout === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" :
          section.layout === "row" ? "flex flex-wrap items-start" :
          "flex flex-col"
        )}
      >
        {section.components.map((comp) => (
          <motion.div
            key={comp.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              section.layout === "row" && !["navbar","hero","cta","footer","sidebar"].includes(comp.type) ? "flex-1 min-w-[200px]" : "",
              ["navbar","hero","cta","footer"].includes(comp.type) ? "w-full" : ""
            )}
          >
            <ComponentBlock component={comp} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Browser chrome ──────────────────────────────────────────────────────────

function BrowserChrome({ page }: { page: WireframePage }) {
  return (
    <div className="rounded-xl border border-gray-300 overflow-hidden shadow-md bg-white">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 border-b border-gray-200">
        <div className="flex gap-1.5">
          <Circle className="h-2.5 w-2.5 fill-gray-300 text-gray-300" />
          <Circle className="h-2.5 w-2.5 fill-gray-300 text-gray-300" />
          <Circle className="h-2.5 w-2.5 fill-gray-300 text-gray-300" />
        </div>
        <div className="flex items-center gap-2 ml-2">
          {["←","→","↺"].map((a, i) => (
            <span key={i} className="text-[10px] text-gray-400 font-mono">{a}</span>
          ))}
        </div>
        {/* URL bar */}
        <div className="flex-1 mx-2 bg-white border border-gray-200 rounded-md px-3 py-1 flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-gray-400" />
          <span className="text-[10px] text-gray-500 font-mono">localhost:3000{page.path}</span>
        </div>
        <Menu className="h-3.5 w-3.5 text-gray-400" />
      </div>

      {/* Page content */}
      <div className={cn("overflow-y-auto max-h-[640px] bg-white", (page.layout === "sidebar" || page.layout === "dashboard") && "flex")}>
        {(page.layout === "sidebar" || page.layout === "dashboard") && (
          <div className="w-44 shrink-0 bg-gray-50 border-r border-gray-200 min-h-[640px] p-2 space-y-0.5">
            <div className="flex items-center gap-2 px-2 py-2 mb-1 border-b border-gray-100">
              <div className="h-5 w-5 rounded bg-gray-800 flex items-center justify-center">
                <span className="text-[8px] text-white font-bold">A</span>
              </div>
              <span className="text-xs font-bold text-gray-700">App</span>
            </div>
            {[
              { icon: Home, label: "Dashboard" },
              { icon: Folder, label: "Projects" },
              { icon: PieChart, label: "Analytics" },
              { icon: FileText, label: "Reports" },
              { icon: Settings, label: "Settings" },
            ].map(({ icon: Icon, label }, i) => (
              <div key={i} className={cn("flex items-center gap-2 px-2 py-1.5 rounded text-[11px]", i === 0 ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-100")}>
                <Icon className="h-3 w-3 shrink-0" />
                {label}
              </div>
            ))}
          </div>
        )}
        <div className={cn("flex-1 p-5 space-y-6 bg-white", page.layout === "centered" ? "max-w-2xl mx-auto" : "")}>
          {page.sections.map(s => <SectionBlock key={s.id} section={s} />)}
        </div>
      </div>
    </div>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────

export function WireframeRenderer({ wireframe }: { wireframe: Wireframe }) {
  const [activePage, setActivePage] = useState(0);
  const page = wireframe.pages[activePage];
  const totalComponents = wireframe.pages.reduce(
    (a, p) => a + p.sections.reduce((b, s) => b + s.components.length, 0), 0
  );

  return (
    <div className="space-y-4">
      {/* Page tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        <Monitor className="h-4 w-4 text-muted-foreground shrink-0" />
        {wireframe.pages.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setActivePage(i)}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all border",
              i === activePage
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
            )}
          >
            {p.title}
            <span className="ml-1.5 opacity-40 text-[10px] font-mono">{p.path}</span>
          </button>
        ))}
        <div className="ml-auto flex items-center gap-1.5 text-[10px] text-muted-foreground border border-border rounded-lg px-3 py-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-gray-400" />
          {wireframe.pages.length} pages · {totalComponents} components
        </div>
      </div>

      {/* Browser mockup */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activePage}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.18 }}
        >
          {page && <BrowserChrome page={page} />}
        </motion.div>
      </AnimatePresence>

      {/* Section summary strip */}
      {page && (
        <div className="flex flex-wrap gap-2">
          {page.sections.map((s, i) => (
            <div key={s.id} className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1">
              <span className="text-[10px] font-medium text-gray-600">{s.title || `Section ${i + 1}`}</span>
              <span className="text-[9px] text-gray-400 bg-white border border-gray-200 rounded px-1">{s.components.length} components</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
