"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { useFormField } from "./use-form-field";

export function CheckboxField({ label }: { label: string }) {
  const { field } = useFormField<boolean>();

  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id={field.name}
        checked={field.state.value}
        onCheckedChange={(checked) => field.handleChange(checked === true)}
      />
      <label
        htmlFor={field.name}
        className="cursor-pointer text-sm font-medium text-foreground"
      >
        {label}
      </label>
    </div>
  );
}
