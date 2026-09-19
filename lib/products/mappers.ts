import type { ProductFormValues } from "./schema";
import type { NewProduct } from "./types";

export function toNewProduct(values: ProductFormValues): NewProduct {
  return {
    ...values,
    description: values.description || undefined,
    stockQuantity: values.limited ? (values.stockQuantity ?? 0) : null,
  };
}
