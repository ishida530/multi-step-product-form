"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/** Multi-select cech produktu: każda cecha to `Badge` renderowany jako przycisk przełączający. */
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
          <Badge
            key={option}
            variant={selected ? "default" : "outline"}
            render={
              <button type="button" aria-pressed={selected} onClick={() => toggle(option)} />
            }
            className={cn(
              "h-6 cursor-pointer py-px text-sm leading-5 font-normal active:translate-y-px",
              selected
                ? "hover:bg-primary/80"
                : "bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {option}
          </Badge>
        );
      })}
    </div>
  );
}
