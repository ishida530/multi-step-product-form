"use client";

import { Suspense, useState } from "react";
import { toast } from "sonner";
import { ProductTable } from "@/components/products/product-table";
import { AddProductDialog } from "@/components/products/add-product-dialog";
import { useProducts } from "@/lib/products/use-products";
import type { NewProduct } from "@/lib/products/types";

export default function Home() {
  const { products, addProduct } = useProducts();
  const [dialogOpen, setDialogOpen] = useState(false);

  function handleCreate(product: NewProduct) {
    addProduct(product);
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
