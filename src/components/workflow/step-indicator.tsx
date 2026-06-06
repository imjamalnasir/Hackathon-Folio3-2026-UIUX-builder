"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WorkflowStep } from "@/lib/types";

const STEPS: { id: WorkflowStep; label: string }[] = [
  { id: "research", label: "Research" },
  { id: "persona", label: "Persona" },
  { id: "flow", label: "User Flow" },
  { id: "sitemap", label: "Sitemap" },
  { id: "wireframe", label: "Wireframe" },
];

interface StepIndicatorProps {
  currentStep: WorkflowStep;
  completedSteps: WorkflowStep[];
  onStepClick: (step: WorkflowStep) => void;
}

export function StepIndicator({ currentStep, completedSteps, onStepClick }: StepIndicatorProps) {
  if (currentStep === "home") return null;

  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 mb-8 overflow-x-auto pb-2">
      {STEPS.map((step, index) => {
        const isCompleted = completedSteps.includes(step.id);
        const isCurrent = step.id === currentStep;
        const isClickable = isCompleted || index <= currentIndex;

        return (
          <div key={step.id} className="flex items-center">
            <button
              onClick={() => isClickable && onStepClick(step.id)}
              disabled={!isClickable}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all",
                isCurrent && "bg-primary text-primary-foreground shadow-sm",
                isCompleted && !isCurrent && "bg-accent text-accent-foreground cursor-pointer hover:bg-accent/80",
                !isCurrent && !isCompleted && "bg-secondary text-muted-foreground",
                !isClickable && "opacity-50 cursor-not-allowed"
              )}
            >
              <span
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full text-[10px]",
                  isCurrent && "bg-primary-foreground/20",
                  isCompleted && !isCurrent && "bg-primary text-primary-foreground"
                )}
              >
                {isCompleted && !isCurrent ? <Check className="h-3 w-3" /> : index + 1}
              </span>
              <span className="hidden sm:inline">{step.label}</span>
            </button>
            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  "w-4 sm:w-8 h-0.5 mx-1",
                  index < currentIndex ? "bg-primary" : "bg-border"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
