"use client";

import { Switch } from "@/components/ui/switch";
import { useFormField } from "./use-form-field";

export function SwitchField({ label }: { label: string }) {
  const { field } = useFormField<boolean>();

  return (
    <div className="flex items-start gap-2">
      <Switch
        id={field.name}
        checked={field.state.value}
        onCheckedChange={(checked) => field.handleChange(checked)}
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
