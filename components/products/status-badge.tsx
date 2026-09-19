import { cn } from "@/lib/utils";

export function StatusBadge({ available }: { available: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        available
          ? "bg-green-600/10 text-green-600"
          : "bg-destructive/10 text-destructive"
      )}
    >
      {available ? "Dostępny" : "Niedostępny"}
    </span>
  );
}
