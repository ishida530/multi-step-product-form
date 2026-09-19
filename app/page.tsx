"use client";

import { Suspense } from "react";
import { ProductTable } from "@/components/products/product-table";
import { MOCK_PRODUCTS } from "@/lib/products/mock-data";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Suspense fallback={null}>
        <ProductTable products={MOCK_PRODUCTS} onAddProduct={() => {}} />
      </Suspense>
    </main>
  );
}
