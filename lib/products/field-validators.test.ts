import { describe, expect, it } from "vitest";
import { fieldErrorFromSchema } from "./field-validators";
import { defaultProductFormValues, step3Schema } from "./schema";

const values = (overrides: Partial<typeof defaultProductFormValues>) => ({
  ...defaultProductFormValues,
  ...overrides,
});

describe("fieldErrorFromSchema (krok 3)", () => {
  describe("ilość na magazynie", () => {
    const error = (overrides: Partial<typeof defaultProductFormValues>) =>
      fieldErrorFromSchema(step3Schema, values(overrides), "stockQuantity");

    it("wymaga wartości dla produktu limitowanego", () => {
      expect(error({ limited: true, stockQuantity: undefined })).toEqual({
        message: "Podaj ilość na magazynie",
      });
    });

    it("nie wymaga wartości dla produktu niebędącego limitowanym", () => {
      expect(error({ limited: false, stockQuantity: undefined })).toBeUndefined();
    });

    it("akceptuje zero i dodatnie liczby całkowite", () => {
      expect(error({ limited: true, stockQuantity: 0 })).toBeUndefined();
      expect(error({ limited: true, stockQuantity: 45 })).toBeUndefined();
    });

    it("odrzuca liczby ujemne i niecałkowite", () => {
      expect(error({ limited: true, stockQuantity: -1 })?.message).toBe(
        "Ilość nie może być ujemna"
      );
      expect(error({ limited: true, stockQuantity: 2.5 })?.message).toBe(
        "Ilość musi być liczbą całkowitą"
      );
    });
  });

  describe("minimalna ilość w koszyku", () => {
    const error = (min: number | undefined, max: number | undefined) =>
      fieldErrorFromSchema(
        step3Schema,
        values({ minCartQuantity: min, maxCartQuantity: max } as never),
        "minCartQuantity"
      );

    it("akceptuje wartość nie większą niż maks.", () => {
      expect(error(1, 10)).toBeUndefined();
      expect(error(10, 10)).toBeUndefined();
      expect(error(0, 10)).toBeUndefined();
    });

    it("odrzuca wartość większą niż maks.", () => {
      expect(error(11, 10)?.message).toBe("Min. ilość nie może być większa niż maksymalna");
    });

    it("nie porównuje z maks., gdy maks. jest puste", () => {
      expect(error(5, undefined)).toBeUndefined();
    });

    it("odrzuca brak wartości, ułamki i liczby ujemne", () => {
      expect(error(undefined, 10)?.message).toBe("Podaj minimalną ilość");
      expect(error(1.5, 10)?.message).toBe("Wartość musi być liczbą całkowitą");
      expect(error(-1, 10)?.message).toBe("Minimalna ilość nie może być ujemna");
    });
  });

  describe("maksymalna ilość w koszyku", () => {
    const error = (min: number | undefined, max: number | undefined) =>
      fieldErrorFromSchema(
        step3Schema,
        values({ minCartQuantity: min, maxCartQuantity: max } as never),
        "maxCartQuantity"
      );

    it("akceptuje wartość nie mniejszą niż min.", () => {
      expect(error(1, 10)).toBeUndefined();
      expect(error(1, 1)).toBeUndefined();
    });

    it("odrzuca wartość mniejszą niż min.", () => {
      expect(error(5, 2)?.message).toBe("Maks. ilość nie może być mniejsza niż minimalna");
    });

    it("nie porównuje z min., gdy min. jest puste", () => {
      expect(error(undefined, 2)).toBeUndefined();
    });

    it("odrzuca brak wartości i ułamki", () => {
      expect(error(1, undefined)?.message).toBe("Podaj maksymalną ilość");
      expect(error(1, 2.5)?.message).toBe("Wartość musi być liczbą całkowitą");
    });
  });

  it("zwraca błąd magazynu także wtedy, gdy inne pole kroku jest niepoprawne", () => {
    // reguła „magazyn wymagany” nie może znikać, gdy np. min. ilość jest pusta
    expect(
      fieldErrorFromSchema(
        step3Schema,
        values({ limited: true, stockQuantity: undefined, minCartQuantity: undefined } as never),
        "stockQuantity"
      )
    ).toEqual({ message: "Podaj ilość na magazynie" });
  });
});
