"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function WizardFooter({
  isFirstStep,
  isLastStep,
  onBack,
  onNext,
  onSubmit,
}: {
  isFirstStep: boolean;
  isLastStep: boolean;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 border-t border-border bg-muted/50 p-4 pt-[15px]",
        isFirstStep ? "justify-end" : "justify-between"
      )}
    >
      {!isFirstStep && (
        <Button type="button" variant="outline" className="h-9 rounded-full" onClick={onBack}>
          <ArrowLeftIcon className="size-4" />
          Wstecz
        </Button>
      )}
      {isLastStep ? (
        <Button type="button" className="h-9 rounded-full" onClick={onSubmit}>
          Zapisz produkt
        </Button>
      ) : (
        <Button type="button" className="h-9 rounded-full" onClick={onNext}>
          Dalej
          <ArrowRightIcon className="size-4" />
        </Button>
      )}
    </div>
  );
}
