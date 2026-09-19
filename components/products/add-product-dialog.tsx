"use client";

import { XIcon } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { NewProduct } from "@/lib/products/types";
import { StepIndicator } from "./step-indicator";
import { AvailabilityStep } from "./wizard/steps/availability-step";
import { BasicInfoStep } from "./wizard/steps/basic-info-step";
import { PricingStep } from "./wizard/steps/pricing-step";
import { useProductWizard } from "./wizard/use-product-wizard";
import { WizardFooter } from "./wizard/wizard-footer";

export function AddProductDialog({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (product: NewProduct) => void;
}) {
  const wizard = useProductWizard({
    onSubmit: (product) => {
      onCreate(product);
      handleOpenChange(false);
    },
  });
  const { form, step } = wizard;

  function handleOpenChange(next: boolean) {
    onOpenChange(next);
    if (!next) wizard.reset();
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="fixed inset-0 flex h-full max-h-full w-full max-w-full translate-x-0 translate-y-0 flex-col gap-0 overflow-hidden rounded-none p-0 ring-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:h-auto sm:max-h-[85vh] sm:max-w-[720px] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-xl sm:ring-1"
      >
        <div className="flex items-start gap-2 px-4 py-6 sm:border-b sm:border-border">
          <DialogTitle className="flex-1 text-base leading-none font-medium">
            Dodaj nowy produkt
          </DialogTitle>
          <button
            type="button"
            onClick={() => handleOpenChange(false)}
            className="rounded-xs opacity-70 transition-opacity hover:opacity-100"
          >
            <XIcon className="size-4" />
            <span className="sr-only">Zamknij</span>
          </button>
        </div>

        <StepIndicator currentStep={step} />

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 pt-4 pb-4 sm:flex-none sm:max-h-[60vh] sm:py-5">
          {step === 1 && <BasicInfoStep form={form} />}
          {step === 2 && <PricingStep form={form} />}
          {step === 3 && <AvailabilityStep form={form} />}
        </div>

        <WizardFooter
          isFirstStep={wizard.isFirstStep}
          isLastStep={wizard.isLastStep}
          onBack={wizard.back}
          onNext={wizard.next}
          onSubmit={wizard.submit}
        />
      </DialogContent>
    </Dialog>
  );
}
