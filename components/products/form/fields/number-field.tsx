"use client";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useFormField } from "./use-form-field";

export function NumberField({
  label,
  placeholder,
  step = "0.01",
  className,
}: {
  label: string;
  placeholder?: string;
  step?: string;
  className?: string;
}) {
  const { field, errors, invalid } = useFormField<number | undefined>();
  const value = field.state.value;

  return (
    <Field data-invalid={invalid} className={className}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Input
        id={field.name}
        name={field.name}
        type="number"
        step={step}
        value={value === undefined || Number.isNaN(value) ? "" : value}
        placeholder={placeholder}
        aria-invalid={invalid}
        onChange={(e) => {
          const parsed = e.target.valueAsNumber;
          field.handleChange(Number.isNaN(parsed) ? undefined : parsed);
        }}
        onBlur={field.handleBlur}
        className="h-8 rounded-full"
      />
      <FieldError errors={errors} />
    </Field>
  );
}
