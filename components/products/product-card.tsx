import { formatPrice, formatStock } from "@/lib/format";
import type { Product } from "@/lib/products/types";
import { StatusBadge } from "./status-badge";

/** Widok produktu na mobile (zamiast wiersza tabeli). */
export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="flex w-full flex-col gap-2 rounded-xl border border-border bg-card p-3">
      <div className="flex items-center justify-center gap-2.5">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="truncate text-base font-medium text-foreground">{product.name}</p>
          <p className="truncate text-xs text-muted-foreground">{product.sku}</p>
        </div>
        <StatusBadge available={product.available} />
      </div>
      <div className="flex w-full items-start gap-1 rounded-[9px] bg-accent p-3">
        <div className="flex flex-1 flex-col gap-1">
          <p className="text-xs text-muted-foreground">Kategoria</p>
          <p className="truncate text-sm text-foreground">{product.category}</p>
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <p className="text-xs text-muted-foreground">Cena brutto</p>
          <p className="truncate text-sm font-medium text-foreground">
            {formatPrice(product.priceGross, product.currency)}
          </p>
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <p className="text-xs text-muted-foreground">Magazyn</p>
          <p className="truncate text-sm text-foreground">{formatStock(product)}</p>
        </div>
      </div>
    </div>
  );
}
