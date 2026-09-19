"use client";

import { Suspense, useState } from "react";
import { toast } from "sonner";
import { ProductTable } from "@/components/products/product-table";
import { AddProductDialog } from "@/components/products/add-product-dialog";
import { MOCK_PRODUCTS } from "@/lib/products/mock-data";
import type { NewProduct, Product } from "@/lib/products/types";

export default function Home() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [dialogOpen, setDialogOpen] = useState(false);

  function handleCreate(product: NewProduct) {
    setProducts((prev) => [...prev, { ...product, id: crypto.randomUUID() }]);
    toast.success("Produkt został dodany");
  }

  return (
    <main className="flex flex-1 flex-col">
      <Suspense fallback={null}>
        <ProductTable products={products} onAddProduct={() => setDialogOpen(true)} />
      </Suspense>
      <AddProductDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreate={handleCreate}
      />
    </main>
  );
}
