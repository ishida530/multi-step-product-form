"use client";

import { useState } from "react";
import { toNewProduct } from "@/lib/products/mappers";
import { STEP_FIELDS, step1Schema, step2Schema, step3Schema } from "@/lib/products/schema";
import type { NewProduct } from "@/lib/products/types";
import { productFormOptions, useAppForm } from "../form/use-app-form";

export type WizardStep = 1 | 2 | 3;

const LAST_STEP: WizardStep = 3;

const STEP_SCHEMAS = {
  1: step1Schema,
  2: step2Schema,
  3: step3Schema,
} as const;

/**
 * Stan kreatora: bieżący krok + formularz TanStack Form.
 * Przejście dalej (lub zapis) jest możliwe tylko przy poprawnym bieżącym kroku.
 */
export function useProductWizard({ onSubmit }: { onSubmit: (product: NewProduct) => void }) {
  const [step, setStep] = useState<WizardStep>(1);

  const form = useAppForm({
    ...productFormOptions,
    onSubmit: ({ value }) => onSubmit(toNewProduct(value)),
  });

  /** Waliduje pola bieżącego kroku i odsłania ich błędy (oznacza pola jako dotknięte). */
  async function validateCurrentStep() {
    await form.validateAllFields("change");

    const fieldNames = STEP_FIELDS[step];

    for (const name of fieldNames) {
      form.setFieldMeta(name, (meta) => ({ ...meta, isTouched: true }));
    }

    const values = Object.fromEntries(fieldNames.map((name) => [name, form.getFieldValue(name)]));
    return STEP_SCHEMAS[step].safeParse(values).success;
  }

  async function next() {
    if (step === LAST_STEP || !(await validateCurrentStep())) return;
    setStep((current) => (current + 1) as WizardStep);
  }

  function back() {
    setStep((current) => Math.max(1, current - 1) as WizardStep);
  }

  async function submit() {
    if (await validateCurrentStep()) await form.handleSubmit();
  }

  function reset() {
    setStep(1);
    form.reset();
  }

  return {
    form,
    step,
    isFirstStep: step === 1,
    isLastStep: step === LAST_STEP,
    next,
    back,
    submit,
    reset,
  };
}
