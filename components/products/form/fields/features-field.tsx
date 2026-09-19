"use client";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { FeatureToggleGroup } from "../../feature-toggle-group";
import { useFormField } from "./use-form-field";

export function FeaturesField({
  label,
  options,
}: {
  label: string;
  options: readonly string[];
}) {
  const { field, errors, invalid } = useFormField<string[]>();

  return (
    <Field data-invalid={invalid}>
      <FieldLabel>{label}</FieldLabel>
      <FeatureToggleGroup
        options={options}
        value={field.state.value}
        onChange={(value) => {
          field.handleChange(value);
          field.handleBlur();
        }}
      />
      <FieldError errors={errors} />
    </Field>
  );
}
