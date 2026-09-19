"use client";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useFormField } from "./use-form-field";

export function TextareaField({
  label,
  placeholder,
  className,
}: {
  label: string;
  placeholder?: string;
  className?: string;
}) {
  const { field, errors, invalid } = useFormField<string | undefined>();

  return (
    <Field data-invalid={invalid} className={className}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Textarea
        id={field.name}
        name={field.name}
        value={field.state.value ?? ""}
        placeholder={placeholder}
        aria-invalid={invalid}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        className="min-h-16"
      />
      <FieldError errors={errors} />
    </Field>
  );
}
