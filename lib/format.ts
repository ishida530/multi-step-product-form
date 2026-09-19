import type { Product } from "./products/types";

export function formatPrice(value: number, currency: string): string {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/** Stan magazynowy — tylko dla produktów limitowanych, inaczej „—”. */
export function formatStock(product: Pick<Product, "limited" | "stockQuantity">): string {
  return product.limited ? String(product.stockQuantity ?? 0) : "—";
}
