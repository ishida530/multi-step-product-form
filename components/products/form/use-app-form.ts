import { createFormHook, formOptions } from "@tanstack/react-form";
import { defaultProductFormValues } from "@/lib/products/schema";
import { CheckboxField } from "./fields/checkbox-field";
import { FeaturesField } from "./fields/features-field";
import { NumberField } from "./fields/number-field";
import { SelectField } from "./fields/select-field";
import { SwitchField } from "./fields/switch-field";
import { TextareaField } from "./fields/textarea-field";
import { TextField } from "./fields/text-field";
import { VatRateField } from "./fields/vat-rate-field";
import { fieldContext, formContext } from "./form-context";

export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    TextareaField,
    NumberField,
    SelectField,
    VatRateField,
    FeaturesField,
    SwitchField,
    CheckboxField,
  },
  formComponents: {},
});

/** Wspólne opcje formularza — używane przez `useAppForm` i `withForm` (typy kroków). */
export const productFormOptions = formOptions({
  defaultValues: defaultProductFormValues,
});
