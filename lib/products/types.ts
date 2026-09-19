export interface Product {
  id: string;
  name: string;
  sku: string;
  description?: string;
  manufacturer: string;
  category: string;
  features: string[];
  priceNet: number;
  priceGross: number;
  vatRate: number;
  currency: string;
  available: boolean;
  limited: boolean;
  stockQuantity: number | null;
  minCartQuantity: number;
  maxCartQuantity: number;
}

export type NewProduct = Omit<Product, "id">;
