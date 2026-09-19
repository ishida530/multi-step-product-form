import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { title: "Informacje", subtitle: "Dane podstawowe" },
  { title: "Cena", subtitle: "Dane cenowe" },
  { title: "Dostępność", subtitle: "Stany magazynowe" },
] as const;

export function StepIndicator({ currentStep }: { currentStep: 1 | 2 | 3 }) {
  return (
    <div className="mx-4 flex items-center gap-4 border-t border-b border-border py-6 sm:mx-0 sm:border-t-0 sm:px-4 sm:py-3">
      {STEPS.map((step, index) => {
        const stepNumber = index + 1;
        const isDone = stepNumber < currentStep;
        const isActive = stepNumber === currentStep;

        return (
          <div key={step.title} className="flex flex-1 items-center gap-4 sm:flex-none">
            <div className="flex shrink-0 flex-col items-start justify-center gap-3 sm:flex-row sm:items-center">
              <div
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                  isDone || isActive
                    ? "bg-primary text-white"
                    : "border border-border bg-accent text-muted-foreground"
                )}
              >
                {isDone ? <CheckIcon className="size-4" /> : stepNumber}
              </div>
              <div className="flex flex-col justify-center gap-0.5 whitespace-nowrap">
                <p
                  className={cn(
                    "text-sm font-medium",
                    isDone || isActive ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.title}
                </p>
                <p className="text-xs text-muted-foreground">{step.subtitle}</p>
              </div>
            </div>
            {stepNumber < STEPS.length && (
              <div
                className={cn(
                  "hidden h-px w-[67px] shrink-0 sm:block",
                  isDone ? "bg-primary" : "bg-border"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
