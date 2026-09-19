import { z } from "zod";
import { CATEGORIES, CURRENCIES, FEATURES, MANUFACTURERS, VAT_RATES } from "./constants";

/** Tekst musi pochodzić z predefiniowanej listy (pusty ciąg też jest odrzucany). */
function oneOf(options: readonly string[], message: string) {
  return z.string().refine((value) => options.includes(value), message);
}

/**
 * Krok 1 — Informacje podstawowe
 */
export const step1Schema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Nazwa produktu musi mieć co najmniej 3 znaki"),
  sku: z
    .string()
    .trim()
    .min(1, "SKU produktu jest wymagane")
    .max(24, "SKU może mieć maksymalnie 24 znaki")
    .regex(/^[A-Za-z0-9]*$/, "SKU może zawierać tylko litery i cyfry"),
  description: z.string().trim().max(500, "Opis jest zbyt długi").optional(),
  manufacturer: oneOf(MANUFACTURERS, "Wybierz producenta"),
  category: oneOf(CATEGORIES, "Wybierz kategorię"),
  features: z
    .array(oneOf(FEATURES, "Wybierz cechę z listy"))
    .min(1, "Wybierz co najmniej jedną cechę produktu"),
});

export type Step1Values = z.infer<typeof step1Schema>;

/**
 * Krok 2 — Cena
 */
export const step2Schema = z.object({
  priceNet: z.number({ error: "Podaj cenę netto" }).positive("Cena netto musi być większa od 0"),
  priceGross: z
    .number({ error: "Podaj cenę brutto" })
    .positive("Cena brutto musi być większa od 0"),
  vatRate: z
    .number({ error: "Wybierz stawkę VAT" })
    .refine((rate) => VAT_RATES.some((allowed) => allowed === rate), "Wybierz stawkę VAT"),
  currency: oneOf(CURRENCIES, "Wybierz walutę"),
});

export type Step2Values = z.infer<typeof step2Schema>;

/**
 * Krok 3 — Dostępność i stany magazynowe
 */
export const step3BaseSchema = z.object({
  available: z.boolean(),
  limited: z.boolean(),
  stockQuantity: z
    .number()
    .int("Ilość musi być liczbą całkowitą")
    .nonnegative("Ilość nie może być ujemna")
    .optional(),
  minCartQuantity: z
    .number({ error: "Podaj minimalną ilość" })
    .int("Wartość musi być liczbą całkowitą")
    .nonnegative("Minimalna ilość nie może być ujemna"),
  maxCartQuantity: z
    .number({ error: "Podaj maksymalną ilość" })
    .int("Wartość musi być liczbą całkowitą")
    .nonnegative("Maksymalna ilość nie może być ujemna"),
});

/**
 * Reguły zależne od kilku pól. `when: always` uruchamia je niezależnie od błędów w innych
 * polach — inaczej np. pusta „min. ilość” ukrywałaby błąd „magazyn wymagany”.
 * Porównania z `undefined` dają `false`, więc reguły są bezpieczne dla brakujących wartości.
 */
const always = () => true;

export const step3Schema = step3BaseSchema
  .refine((data) => !data.limited || data.stockQuantity !== undefined, {
    path: ["stockQuantity"],
    error: "Podaj ilość na magazynie",
    when: always,
  })
  .refine((data) => !(data.minCartQuantity > data.maxCartQuantity), {
    path: ["minCartQuantity"],
    error: "Min. ilość nie może być większa niż maksymalna",
    when: always,
  })
  .refine((data) => !(data.maxCartQuantity < data.minCartQuantity), {
    path: ["maxCartQuantity"],
    error: "Maks. ilość nie może być mniejsza niż minimalna",
    when: always,
  });

export type Step3Values = z.infer<typeof step3Schema>;

export type ProductFormValues = Step1Values & Step2Values & Step3Values;

export const defaultProductFormValues: ProductFormValues = {
  name: "",
  sku: "",
  description: "",
  manufacturer: "",
  category: "",
  features: [],
  priceNet: 0,
  priceGross: 0,
  vatRate: 23,
  currency: "PLN",
  available: true,
  limited: false,
  stockQuantity: undefined,
  minCartQuantity: 1,
  maxCartQuantity: 10,
};

/** brutto = netto × (1 + VAT / 100) */
export function calculateGross(net: number, vatRate: number): number {
  return Math.round(net * (1 + vatRate / 100) * 100) / 100;
}

/** netto = brutto / (1 + VAT / 100) */
export function calculateNet(gross: number, vatRate: number): number {
  return Math.round((gross / (1 + vatRate / 100)) * 100) / 100;
}

export const STEP_FIELDS = {
  1: ["name", "sku", "description", "manufacturer", "category", "features"],
  2: ["priceNet", "priceGross", "vatRate", "currency"],
  3: [
    "available",
    "limited",
    "stockQuantity",
    "minCartQuantity",
    "maxCartQuantity",
  ],
} as const satisfies Record<1 | 2 | 3, readonly (keyof ProductFormValues)[]>;
