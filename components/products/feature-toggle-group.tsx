"use client";

import { cn } from "@/lib/utils";

export function FeatureToggleGroup({
  options,
  value,
  onChange,
}: {
  options: readonly string[];
  value: string[];
  onChange: (value: string[]) => void;
}) {
  function toggle(option: string) {
    if (value.includes(option)) {
      onChange(value.filter((item) => item !== option));
    } else {
      onChange([...value, option]);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const selected = value.includes(option);
        return (
          <button
            key={option}
            type="button"
            onClick={() => toggle(option)}
            aria-pressed={selected}
            className={cn(
              "inline-flex h-[26px] shrink-0 items-center justify-center rounded-4xl border px-2 py-0.5 text-sm whitespace-nowrap outline-none transition-colors active:translate-y-px",
              "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
              selected
                ? "border-transparent bg-primary text-primary-foreground hover:bg-primary/80"
                : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
