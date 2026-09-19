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

/** Select ze stawkami VAT — wartość w formularzu jest liczbą, w Select tekstem. */
export function VatRateField({
  label,
  options,
  className,
}: {
  label: string;
  options: readonly number[];
  className?: string;
}) {
  const { field, errors, invalid } = useFormField<number>();

  return (
    <Field data-invalid={invalid} className={className}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Select
        value={String(field.state.value)}
        onValueChange={(value) => {
          if (value !== null) field.handleChange(Number(value));
        }}
      >
        <SelectTrigger
          id={field.name}
          onBlur={field.handleBlur}
          aria-invalid={invalid}
          className="h-8 w-full rounded-full"
        >
          <SelectValue placeholder="Wybierz stawkę VAT">
            {(value: string | null) => (value === null ? null : `${value}%`)}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((rate) => (
            <SelectItem key={rate} value={String(rate)}>
              {rate}%
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldError errors={errors} />
    </Field>
  );
}
