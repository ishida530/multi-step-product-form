import { describe, expect, it } from "vitest";
import {
  validateMaxCartQuantity,
  validateMinCartQuantity,
  validateStockQuantity,
} from "./field-validators";

describe("validateStockQuantity", () => {
  it("wymaga wartości", () => {
    expect(validateStockQuantity(undefined)).toEqual({ message: "Podaj ilość na magazynie" });
  });

  it("akceptuje zero i dodatnie liczby całkowite", () => {
    expect(validateStockQuantity(0)).toBeUndefined();
    expect(validateStockQuantity(45)).toBeUndefined();
  });

  it("odrzuca liczby ujemne i niecałkowite", () => {
    expect(validateStockQuantity(-1)?.message).toBe("Ilość nie może być ujemna");
    expect(validateStockQuantity(2.5)?.message).toBe("Ilość musi być liczbą całkowitą");
  });
});

describe("validateMinCartQuantity", () => {
  it("akceptuje wartość nie większą niż maks.", () => {
    expect(validateMinCartQuantity(1, 10)).toBeUndefined();
    expect(validateMinCartQuantity(10, 10)).toBeUndefined();
    expect(validateMinCartQuantity(0, 10)).toBeUndefined();
  });

  it("odrzuca wartość większą niż maks.", () => {
    expect(validateMinCartQuantity(11, 10)?.message).toBe(
      "Min. ilość nie może być większa niż maksymalna"
    );
  });

  it("nie porównuje z maks., gdy maks. jest puste", () => {
    expect(validateMinCartQuantity(5, undefined)).toBeUndefined();
  });

  it("odrzuca brak wartości, ułamki i liczby ujemne", () => {
    expect(validateMinCartQuantity(undefined, 10)?.message).toBe("Podaj minimalną ilość");
    expect(validateMinCartQuantity(1.5, 10)?.message).toBe("Wartość musi być liczbą całkowitą");
    expect(validateMinCartQuantity(-1, 10)?.message).toBe("Minimalna ilość nie może być ujemna");
  });
});

describe("validateMaxCartQuantity", () => {
  it("akceptuje wartość nie mniejszą niż min.", () => {
    expect(validateMaxCartQuantity(10, 1)).toBeUndefined();
    expect(validateMaxCartQuantity(1, 1)).toBeUndefined();
  });

  it("odrzuca wartość mniejszą niż min.", () => {
    expect(validateMaxCartQuantity(2, 5)?.message).toBe(
      "Maks. ilość nie może być mniejsza niż minimalna"
    );
  });

  it("nie porównuje z min., gdy min. jest puste", () => {
    expect(validateMaxCartQuantity(2, undefined)).toBeUndefined();
  });

  it("odrzuca brak wartości i ułamki", () => {
    expect(validateMaxCartQuantity(undefined, 1)?.message).toBe("Podaj maksymalną ilość");
    expect(validateMaxCartQuantity(2.5, 1)?.message).toBe("Wartość musi być liczbą całkowitą");
  });
});
