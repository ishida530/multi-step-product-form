"use client";

import { useQueryState, parseAsInteger } from "nuqs";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice, formatStock } from "@/lib/format";
import { PAGE_SIZE } from "@/lib/products/constants";
import type { Product } from "@/lib/products/types";
import { StatusBadge } from "./status-badge";
import { PaginationControls } from "./pagination-controls";
import { ProductCard } from "./product-card";

export function ProductTable({
  products,
  onAddProduct,
}: {
  products: Product[];
  onAddProduct: () => void;
}) {
  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1).withOptions({ clearOnDefault: true })
  );

  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageItems = products.slice(start, start + PAGE_SIZE);
  const caption = `Strona ${currentPage} z ${totalPages} · ${products.length} produktów`;

  return (
    <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-6 px-4 py-6 sm:px-6 sm:py-[50px]">
      <div className="flex items-center justify-between gap-1 sm:h-[52px]">
        <div className="flex flex-col justify-center gap-1">
          <h1 className="text-xl font-semibold text-foreground">Produkty</h1>
          <p className="text-sm text-muted-foreground">
            {products.length}{" "}
            {products.length === 1 ? "produkt" : "produktów"} w katalogu
          </p>
        </div>
        <Button onClick={onAddProduct} className="h-9 rounded-full px-4">
          <PlusIcon className="size-4" />
          Dodaj produkt
        </Button>
      </div>

      {/* Mobile: card list */}
      <div className="flex flex-col gap-6 sm:hidden">
        <div className="flex flex-col gap-2">
          {pageItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="flex flex-col items-center gap-4">
          <p className="w-full text-center text-xs text-muted-foreground">{caption}</p>
          <PaginationControls
            page={currentPage}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p === 1 ? null : p)}
          />
        </div>
      </div>

      {/* Desktop: table */}
      <div className="hidden w-full overflow-hidden rounded-lg border border-border bg-card shadow-xs sm:block">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="h-10 w-[29%] px-4 text-muted-foreground">
                Nazwa
              </TableHead>
              <TableHead className="h-10 px-4 text-muted-foreground">
                SKU
              </TableHead>
              <TableHead className="h-10 px-4 text-muted-foreground">
                Kategoria
              </TableHead>
              <TableHead className="h-10 px-4 text-muted-foreground">
                Cena Brutto
              </TableHead>
              <TableHead className="h-10 px-4 text-muted-foreground">
                Status
              </TableHead>
              <TableHead className="h-10 px-4 text-muted-foreground">
                Magazyn
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageItems.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="h-12 px-4 py-2 font-medium text-foreground">
                  {product.name}
                </TableCell>
                <TableCell className="h-12 px-4 py-2 text-xs text-muted-foreground">
                  {product.sku}
                </TableCell>
                <TableCell className="h-12 px-4 py-2 text-foreground">
                  {product.category}
                </TableCell>
                <TableCell className="h-12 px-4 py-2 font-medium text-foreground">
                  {formatPrice(product.priceGross, product.currency)}
                </TableCell>
                <TableCell className="h-12 px-4 py-2">
                  <StatusBadge available={product.available} />
                </TableCell>
                <TableCell className="h-12 px-4 py-2 text-foreground">
                  {formatStock(product)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between bg-gray-50 px-4 pt-4 pb-4">
          <span className="text-xs text-muted-foreground">{caption}</span>
          <PaginationControls
            page={currentPage}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p === 1 ? null : p)}
          />
        </div>
      </div>
    </div>
  );
}
