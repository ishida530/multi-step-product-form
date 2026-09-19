"use client";

import { CURRENCIES, VAT_RATES } from "@/lib/products/constants";
import { calculateGross, calculateNet, step2Schema } from "@/lib/products/schema";
import { productFormOptions, withForm } from "../../form/use-app-form";

/**
 * Ceny są ze sobą powiązane: edycja jednego pola przelicza pozostałe (listeners).
 * `dontRunListeners` zapobiega pętli netto ↔ brutto.
 */
export const PricingStep = withForm({
  ...productFormOptions,
  render: function Render({ form }) {
    return (
      <>
        <div className="flex w-full flex-col items-start gap-4 sm:flex-row">
          <form.AppField
            name="priceNet"
            validators={{ onChange: step2Schema.shape.priceNet }}
            listeners={{
              onChange: ({ value }) => {
                if (value === undefined) return;
                form.setFieldValue(
                  "priceGross",
                  calculateGross(value, form.getFieldValue("vatRate")),
                  { dontRunListeners: true }
                );
              },
            }}
          >
            {(field) => (
              <field.NumberField label="Cena netto" placeholder="0.00" className="flex-1" />
            )}
          </form.AppField>
          <form.AppField
            name="priceGross"
            validators={{ onChange: step2Schema.shape.priceGross }}
            listeners={{
              onChange: ({ value }) => {
                if (value === undefined) return;
                form.setFieldValue(
                  "priceNet",
                  calculateNet(value, form.getFieldValue("vatRate")),
                  { dontRunListeners: true }
                );
              },
            }}
          >
            {(field) => (
              <field.NumberField label="Cena brutto" placeholder="0.00" className="flex-1" />
            )}
          </form.AppField>
        </div>

        <div className="flex w-full flex-col items-start gap-4 sm:flex-row">
          <form.AppField
            name="vatRate"
            listeners={{
              onChange: ({ value }) => {
                form.setFieldValue(
                  "priceGross",
                  calculateGross(form.getFieldValue("priceNet"), value),
                  { dontRunListeners: true }
                );
              },
            }}
          >
            {(field) => (
              <field.VatRateField label="Stawka VAT" options={VAT_RATES} className="flex-1" />
            )}
          </form.AppField>
          <form.AppField
            name="currency"
            validators={{ onChange: step2Schema.shape.currency }}
          >
            {(field) => (
              <field.SelectField
                label="Waluta"
                placeholder="Wybierz walutę"
                options={CURRENCIES}
                className="flex-1"
              />
            )}
          </form.AppField>
        </div>
      </>
    );
  },
});
