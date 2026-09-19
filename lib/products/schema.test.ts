import { describe, expect, it } from "vitest";
import {
  STEP_FIELDS,
  calculateGross,
  calculateNet,
  defaultProductFormValues,
  step1Schema,
  step2Schema,
  step3Schema,
} from "./schema";

const validStep1 = {
  name: "MacBook Pro 14",
  sku: "MBP14M3PRO",
  description: "",
  manufacturer: "Apple",
  category: "Komputery",
  features: ["Bluetooth"],
};

const validStep3 = {
  available: true,
  limited: false,
  stockQuantity: undefined,
  minCartQuantity: 1,
  maxCartQuantity: 10,
};

function messages(result: { success: boolean; error?: { issues: { message: string }[] } }) {
  return result.error?.issues.map((issue) => issue.message) ?? [];
}

describe("step1Schema — informacje podstawowe", () => {
  it("akceptuje poprawne dane", () => {
    expect(step1Schema.safeParse(validStep1).success).toBe(true);
  });

  it("wymaga nazwy o długości min. 3 znaków", () => {
    expect(step1Schema.safeParse({ ...validStep1, name: "ab" }).success).toBe(false);
    expect(step1Schema.safeParse({ ...validStep1, name: "" }).success).toBe(false);
    expect(step1Schema.safeParse({ ...validStep1, name: "abc" }).success).toBe(true);
  });

  it("nie liczy białych znaków do długości nazwy", () => {
    expect(step1Schema.safeParse({ ...validStep1, name: "  ab  " }).success).toBe(false);
  });

  it("wymaga SKU", () => {
    expect(messages(step1Schema.safeParse({ ...validStep1, sku: "" }))).toContain(
      "SKU produktu jest wymagane"
    );
  });

  it.each(["MBP-14", "MBP 14", "MBP_14", "MBPĄ14", "MBP14!"])(
    "odrzuca SKU ze znakami innymi niż litery i cyfry: %s",
    (sku) => {
      expect(messages(step1Schema.safeParse({ ...validStep1, sku }))).toContain(
        "SKU może zawierać tylko litery i cyfry"
      );
    }
  );

  it("akceptuje SKU do 24 znaków i odrzuca dłuższe", () => {
    expect(step1Schema.safeParse({ ...validStep1, sku: "A".repeat(24) }).success).toBe(true);
    expect(step1Schema.safeParse({ ...validStep1, sku: "A".repeat(25) }).success).toBe(false);
  });

  it("traktuje opis jako opcjonalny", () => {
    const withoutDescription: Partial<typeof validStep1> = { ...validStep1 };
    delete withoutDescription.description;
    expect(step1Schema.safeParse(withoutDescription).success).toBe(true);
    expect(step1Schema.safeParse({ ...validStep1, description: "" }).success).toBe(true);
  });

  it("wymaga producenta i kategorii", () => {
    expect(step1Schema.safeParse({ ...validStep1, manufacturer: "" }).success).toBe(false);
    expect(step1Schema.safeParse({ ...validStep1, category: "" }).success).toBe(false);
  });

  it("wymaga co najmniej jednej cechy produktu", () => {
    expect(step1Schema.safeParse({ ...validStep1, features: [] }).success).toBe(false);
    expect(
      step1Schema.safeParse({ ...validStep1, features: ["Bluetooth", "WiFi"] }).success
    ).toBe(true);
  });
});

describe("step2Schema — cena", () => {
  const valid = { priceNet: 100, priceGross: 123, vatRate: 23, currency: "PLN" };

  it("akceptuje poprawne dane", () => {
    expect(step2Schema.safeParse(valid).success).toBe(true);
  });

  it("odrzuca cenę zerową, ujemną i brak wartości", () => {
    expect(step2Schema.safeParse({ ...valid, priceNet: 0 }).success).toBe(false);
    expect(step2Schema.safeParse({ ...valid, priceGross: -1 }).success).toBe(false);
    expect(step2Schema.safeParse({ ...valid, priceNet: undefined }).success).toBe(false);
  });

  it("wymaga waluty", () => {
    expect(step2Schema.safeParse({ ...valid, currency: "" }).success).toBe(false);
  });
});

describe("step3Schema — dostępność i stany magazynowe", () => {
  it("akceptuje produkt niedostępny bez limitu", () => {
    expect(step3Schema.safeParse({ ...validStep3, available: false }).success).toBe(true);
  });

  it("wymaga ilości na magazynie tylko dla produktu limitowanego", () => {
    expect(step3Schema.safeParse({ ...validStep3, limited: false }).success).toBe(true);

    const result = step3Schema.safeParse({ ...validStep3, limited: true });
    expect(result.success).toBe(false);
    expect(messages(result)).toContain("Podaj ilość na magazynie");
    expect(result.error?.issues[0]?.path).toEqual(["stockQuantity"]);
  });

  it("akceptuje zero i dodatnie liczby całkowite w magazynie", () => {
    expect(
      step3Schema.safeParse({ ...validStep3, limited: true, stockQuantity: 0 }).success
    ).toBe(true);
    expect(
      step3Schema.safeParse({ ...validStep3, limited: true, stockQuantity: 45 }).success
    ).toBe(true);
  });

  it("odrzuca ujemną i niecałkowitą ilość w magazynie", () => {
    expect(
      step3Schema.safeParse({ ...validStep3, limited: true, stockQuantity: -1 }).success
    ).toBe(false);
    expect(
      step3Schema.safeParse({ ...validStep3, limited: true, stockQuantity: 1.5 }).success
    ).toBe(false);
  });

  it("odrzuca niecałkowite limity koszyka", () => {
    expect(step3Schema.safeParse({ ...validStep3, minCartQuantity: 1.5 }).success).toBe(false);
    expect(step3Schema.safeParse({ ...validStep3, maxCartQuantity: 2.5 }).success).toBe(false);
  });

  it("dopuszcza minimalną ilość równą 0", () => {
    expect(step3Schema.safeParse({ ...validStep3, minCartQuantity: 0 }).success).toBe(true);
  });

  it("odrzuca ujemne limity koszyka", () => {
    expect(step3Schema.safeParse({ ...validStep3, minCartQuantity: -1 }).success).toBe(false);
    expect(step3Schema.safeParse({ ...validStep3, maxCartQuantity: -1 }).success).toBe(false);
  });

  it("odrzuca min. większą niż maks. i zgłasza błąd przy obu polach", () => {
    const result = step3Schema.safeParse({
      ...validStep3,
      minCartQuantity: 5,
      maxCartQuantity: 2,
    });
    expect(result.success).toBe(false);
    const paths = result.error?.issues.map((issue) => issue.path[0]);
    expect(paths).toContain("minCartQuantity");
    expect(paths).toContain("maxCartQuantity");
  });

  it("akceptuje min. równe maks.", () => {
    expect(
      step3Schema.safeParse({ ...validStep3, minCartQuantity: 3, maxCartQuantity: 3 }).success
    ).toBe(true);
  });
});

describe("przeliczanie cen (brutto = netto × (1 + VAT / 100))", () => {
  it("liczy brutto z netto", () => {
    expect(calculateGross(100, 23)).toBe(123);
    expect(calculateGross(100, 8)).toBe(108);
    expect(calculateGross(100, 0)).toBe(100);
    expect(calculateGross(8129.27, 23)).toBe(9999);
  });

  it("liczy netto z brutto", () => {
    expect(calculateNet(123, 23)).toBe(100);
    expect(calculateNet(108, 8)).toBe(100);
    expect(calculateNet(9999, 23)).toBe(8129.27);
  });

  it("zaokrągla do 2 miejsc po przecinku", () => {
    expect(calculateGross(0.01, 23)).toBe(0.01);
    expect(calculateGross(33.33, 23)).toBe(41);
    expect(calculateNet(10, 23)).toBe(8.13);
  });

  it("zwraca 0 dla 0", () => {
    expect(calculateGross(0, 23)).toBe(0);
    expect(calculateNet(0, 23)).toBe(0);
  });
});

describe("konfiguracja formularza", () => {
  it("STEP_FIELDS pokrywa wszystkie pola formularza dokładnie raz", () => {
    const covered = Object.values(STEP_FIELDS).flat();
    expect(new Set(covered).size).toBe(covered.length);
    expect([...covered].sort()).toEqual(Object.keys(defaultProductFormValues).sort());
  });

  it("wartości domyślne nie przechodzą walidacji kroku 1 ani 2", () => {
    expect(step1Schema.safeParse(defaultProductFormValues).success).toBe(false);
    expect(step2Schema.safeParse(defaultProductFormValues).success).toBe(false);
  });

  it("wartości domyślne przechodzą walidację kroku 3", () => {
    expect(step3Schema.safeParse(defaultProductFormValues).success).toBe(true);
  });
});
