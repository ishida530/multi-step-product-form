"use client";

import { useCallback, useSyncExternalStore } from "react";
import { MOCK_PRODUCTS } from "./mock-data";
import type { NewProduct, Product } from "./types";

const STORAGE_KEY = "products:v1";

// Magazyn na poziomie modułu: jeden stan dla całej aplikacji, zapisywany w localStorage,
// dzięki czemu odświeżenie strony zachowuje dodane produkty (i numer strony w URL nadal pasuje).
let current: Product[] = MOCK_PRODUCTS;
let initialized = false;
const listeners = new Set<() => void>();

function load(): Product[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed) && parsed.length > 0 ? (parsed as Product[]) : MOCK_PRODUCTS;
  } catch {
    return MOCK_PRODUCTS; // storage niedostępny lub uszkodzony — zaczynamy od danych mockowych
  }
}

function getSnapshot(): Product[] {
  if (!initialized) {
    current = load();
    initialized = true;
  }
  return current;
}

function getServerSnapshot(): Product[] {
  return MOCK_PRODUCTS;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useProducts() {
  const products = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const addProduct = useCallback((product: NewProduct) => {
    current = [...getSnapshot(), { ...product, id: crypto.randomUUID() }];
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    } catch {
      // brak zapisu nie blokuje działania — produkt zostaje w pamięci do odświeżenia
    }
    listeners.forEach((listener) => listener());
  }, []);

  return { products, addProduct };
}
