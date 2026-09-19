import { step3BaseSchema } from "./schema";

type FieldError = { message: string } | undefined;

const fallbackMessage = "Nieprawidłowa wartość";

/** Ilość na magazynie — pole jest renderowane (i wymagane) tylko dla produktu limitowanego. */
export function validateStockQuantity(value: number | undefined): FieldError {
  if (value === undefined) return { message: "Podaj ilość na magazynie" };

  const result = step3BaseSchema.shape.stockQuantity.safeParse(value);
  return result.success
    ? undefined
    : { message: result.error.issues[0]?.message ?? fallbackMessage };
}

/** Min. ilość w koszyku: liczba całkowita, nie większa niż maks. */
export function validateMinCartQuantity(
  value: number | undefined,
  max: number | undefined
): FieldError {
  const result = step3BaseSchema.shape.minCartQuantity.safeParse(value);
  if (!result.success) {
    return { message: result.error.issues[0]?.message ?? fallbackMessage };
  }
  if (typeof max === "number" && result.data > max) {
    return { message: "Min. ilość nie może być większa niż maksymalna" };
  }
}

/** Maks. ilość w koszyku: liczba całkowita, nie mniejsza niż min. */
export function validateMaxCartQuantity(
  value: number | undefined,
  min: number | undefined
): FieldError {
  const result = step3BaseSchema.shape.maxCartQuantity.safeParse(value);
  if (!result.success) {
    return { message: result.error.issues[0]?.message ?? fallbackMessage };
  }
  if (typeof min === "number" && result.data < min) {
    return { message: "Maks. ilość nie może być mniejsza niż minimalna" };
  }
}
