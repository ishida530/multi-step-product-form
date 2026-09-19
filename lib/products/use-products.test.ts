import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { NewProduct } from "./types";

const newProduct: NewProduct = {
  name: "Test",
  sku: "TEST1",
  manufacturer: "Apple",
  category: "Komputery",
  features: ["Bluetooth"],
  priceNet: 100,
  priceGross: 123,
  vatRate: 23,
  currency: "PLN",
  available: true,
  limited: false,
  stockQuantity: null,
  minCartQuantity: 1,
  maxCartQuantity: 10,
};

// Każdy test dostaje świeży moduł (stan magazynu jest na poziomie modułu).
async function freshHook() {
  vi.resetModules();
  const { useProducts } = await import("./use-products");
  return renderHook(() => useProducts());
}

describe("useProducts", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("zaczyna od 5 produktów mockowych", async () => {
    const { result } = await freshHook();
    expect(result.current.products).toHaveLength(5);
  });

  it("dodaje produkt z unikalnym id", async () => {
    const { result } = await freshHook();

    act(() => result.current.addProduct(newProduct));
    act(() => result.current.addProduct({ ...newProduct, sku: "TEST2" }));

    expect(result.current.products).toHaveLength(7);
    const ids = result.current.products.map((product) => product.id);
    expect(new Set(ids).size).toBe(7);
  });

  it("zachowuje dodane produkty po „odświeżeniu” (nowe załadowanie modułu)", async () => {
    const first = await freshHook();
    act(() => first.result.current.addProduct(newProduct));
    first.unmount();

    const reloaded = await freshHook();
    expect(reloaded.result.current.products).toHaveLength(6);
    expect(reloaded.result.current.products.at(-1)?.sku).toBe("TEST1");
  });

  it("wraca do danych mockowych, gdy zapisane dane są uszkodzone", async () => {
    window.localStorage.setItem("products:v1", "{not json");
    const { result } = await freshHook();
    expect(result.current.products).toHaveLength(5);
  });
});
