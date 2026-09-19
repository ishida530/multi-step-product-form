"use client";

import { CATEGORIES, FEATURES, MANUFACTURERS } from "@/lib/products/constants";
import { step1Schema } from "@/lib/products/schema";
import { productFormOptions, withForm } from "../../form/use-app-form";

export const BasicInfoStep = withForm({
  ...productFormOptions,
  render: function Render({ form }) {
    return (
      <>
        <div className="flex w-full flex-col items-start gap-4 sm:flex-row">
          <form.AppField name="name" validators={{ onChange: step1Schema.shape.name }}>
            {(field) => (
              <field.TextField
                label="Nazwa produktu"
                placeholder="np. MacBook Pro 14"
                className="flex-1"
              />
            )}
          </form.AppField>
          <form.AppField name="sku" validators={{ onChange: step1Schema.shape.sku }}>
            {(field) => (
              <field.TextField
                label="SKU produktu"
                placeholder="np. MBP14M3PRO"
                className="flex-1"
              />
            )}
          </form.AppField>
        </div>

        <form.AppField name="description">
          {(field) => (
            <field.TextareaField label="Opis" placeholder="Krótki opis produktu" />
          )}
        </form.AppField>

        <div className="flex w-full flex-col items-start gap-4 sm:flex-row">
          <form.AppField
            name="manufacturer"
            validators={{ onChange: step1Schema.shape.manufacturer }}
          >
            {(field) => (
              <field.SelectField
                label="Producent"
                placeholder="Wybierz producenta"
                options={MANUFACTURERS}
                className="flex-1"
              />
            )}
          </form.AppField>
          <form.AppField
            name="category"
            validators={{ onChange: step1Schema.shape.category }}
          >
            {(field) => (
              <field.SelectField
                label="Kategoria"
                placeholder="Wybierz kategorię"
                options={CATEGORIES}
                className="flex-1"
              />
            )}
          </form.AppField>
        </div>

        <form.AppField
          name="features"
          validators={{ onChange: step1Schema.shape.features }}
        >
          {(field) => <field.FeaturesField label="Cechy produktu" options={FEATURES} />}
        </form.AppField>
      </>
    );
  },
});
