"use client";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useFormField } from "./use-form-field";

export function TextField({
  label,
  placeholder,
  className,
}: {
  label: string;
  placeholder?: string;
  className?: string;
}) {
  const { field, errors, invalid } = useFormField<string>();

  return (
    <Field data-invalid={invalid} className={className}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Input
        id={field.name}
        name={field.name}
        value={field.state.value ?? ""}
        placeholder={placeholder}
        aria-invalid={invalid}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        className="h-8 rounded-full"
      />
      <FieldError errors={errors} />
    </Field>
  );
}
