"use client";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormField } from "./use-form-field";

export function SelectField({
  label,
  placeholder,
  options,
  className,
}: {
  label: string;
  placeholder?: string;
  options: readonly string[];
  className?: string;
}) {
  const { field, errors, invalid } = useFormField<string>();

  return (
    <Field data-invalid={invalid} className={className}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Select
        value={field.state.value || null}
        onValueChange={(value) => field.handleChange(value ?? "")}
      >
        <SelectTrigger
          id={field.name}
          onBlur={field.handleBlur}
          aria-invalid={invalid}
          className="h-8 w-full rounded-full"
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldError errors={errors} />
    </Field>
  );
}
