"use client";

import { Separator } from "@/components/ui/separator";
import {
  validateMaxCartQuantity,
  validateMinCartQuantity,
  validateStockQuantity,
} from "@/lib/products/field-validators";
import { productFormOptions, withForm } from "../../form/use-app-form";

export const AvailabilityStep = withForm({
  ...productFormOptions,
  render: function Render({ form }) {
    return (
      <>
        <form.AppField name="available">
          {(field) => <field.SwitchField label="Produkt jest dostępny" />}
        </form.AppField>

        <Separator />

        <form.AppField
          name="limited"
          listeners={{
            onChange: ({ value }) => {
              if (!value) {
                form.setFieldValue("stockQuantity", undefined, { dontRunListeners: true });
              }
            },
          }}
        >
          {(field) => <field.CheckboxField label="Produkt limitowany" />}
        </form.AppField>

        <form.Subscribe selector={(state) => state.values.limited}>
          {(limited) =>
            limited && (
              <form.AppField
                name="stockQuantity"
                validators={{
                  onChangeListenTo: ["limited"],
                  onChange: ({ value }) => validateStockQuantity(value),
                }}
              >
                {(field) => (
                  <field.NumberField
                    label="Ilość na magazynie"
                    placeholder="0"
                    step="1"
                    className="w-full sm:max-w-[336px]"
                  />
                )}
              </form.AppField>
            )
          }
        </form.Subscribe>

        <Separator />

        <p className="text-base font-medium text-foreground">Limity koszyka</p>

        <div className="flex w-full flex-col items-start gap-4 sm:flex-row">
          <form.AppField
            name="minCartQuantity"
            validators={{
              onChangeListenTo: ["maxCartQuantity"],
              onChange: ({ value, fieldApi }) =>
                validateMinCartQuantity(value, fieldApi.form.getFieldValue("maxCartQuantity")),
            }}
          >
            {(field) => (
              <field.NumberField
                label="Minimalna ilość"
                placeholder="1"
                step="1"
                className="flex-1"
              />
            )}
          </form.AppField>
          <form.AppField
            name="maxCartQuantity"
            validators={{
              onChangeListenTo: ["minCartQuantity"],
              onChange: ({ value, fieldApi }) =>
                validateMaxCartQuantity(value, fieldApi.form.getFieldValue("minCartQuantity")),
            }}
          >
            {(field) => (
              <field.NumberField
                label="Maksymalna ilość"
                placeholder="10"
                step="1"
                className="flex-1"
              />
            )}
          </form.AppField>
        </div>
      </>
    );
  },
});
