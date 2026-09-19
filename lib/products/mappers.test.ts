import { describe, expect, it } from "vitest";
import { formatPrice, formatStock } from "../format";
import { toNewProduct } from "./mappers";
import { defaultProductFormValues } from "./schema";

const values = {
  ...defaultProductFormValues,
  name: "MacBook Pro 14",
  sku: "MBP14M3PRO",
  manufacturer: "Apple",
  category: "Komputery",
  features: ["Bluetooth"],
};

describe("toNewProduct", () => {
  it("zamienia pusty opis na undefined", () => {
    expect(toNewProduct({ ...values, description: "" }).description).toBeUndefined();
    expect(toNewProduct({ ...values, description: "Laptop" }).description).toBe("Laptop");
  });

  it("zapisuje stan magazynowy tylko dla produktu limitowanego", () => {
    expect(toNewProduct({ ...values, limited: false, stockQuantity: 7 }).stockQuantity).toBeNull();
    expect(toNewProduct({ ...values, limited: true, stockQuantity: 7 }).stockQuantity).toBe(7);
    expect(toNewProduct({ ...values, limited: true, stockQuantity: undefined }).stockQuantity).toBe(0);
  });
});

describe("formatStock", () => {
  it("pokazuje ilość tylko dla produktów limitowanych", () => {
    expect(formatStock({ limited: true, stockQuantity: 45 })).toBe("45");
    expect(formatStock({ limited: true, stockQuantity: 0 })).toBe("0");
    expect(formatStock({ limited: false, stockQuantity: null })).toBe("—");
  });
});

describe("formatPrice", () => {
  it("formatuje cenę z walutą i dwoma miejscami po przecinku", () => {
    const normalize = (value: string) => value.replace(/\s/g, " ");

    // pl-PL nie grupuje liczb czterocyfrowych, grupuje od pięciu cyfr
    expect(normalize(formatPrice(9999, "PLN"))).toBe("9999,00 zł");
    expect(normalize(formatPrice(12999.5, "PLN"))).toBe("12 999,50 zł");
  });
});
