"use client";

import { Label } from "@/components/ui/label";
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
      <Label htmlFor={field.name} className="cursor-pointer leading-5">
        {label}
      </Label>
    </div>
  );
}
