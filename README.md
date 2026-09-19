# WorkConnect — Wieloetapowy formularz dodawania produktu

Implementacja zadania rekrutacyjnego: tabela produktów z paginacją oraz trzyetapowy formularz
dodawania produktu osadzony w oknie modalnym, zgodny z projektem Figma.

## Wersja online

- Aplikacja: https://multi-step-product-form.vercel.app
- Repozytorium: https://github.com/ishida530/multi-step-product-form

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **shadcn/ui** — komponenty interfejsu (Dialog, Field, Select, Table, Switch, Checkbox, Badge...)
- **TanStack Form** — zarządzanie stanem formularza i obsługa kroków
- **Zod** — schematy walidacji dla każdego kroku (`lib/products/schema.ts`)
- **nuqs** — synchronizacja paginacji tabeli z parametrem `page` w URL
- **sonner** — powiadomienia toast

## Uruchomienie lokalne

```bash
npm install
npm run dev
```

Aplikacja będzie dostępna pod adresem [http://localhost:3000](http://localhost:3000).

Inne dostępne skrypty:

```bash
npm run build   # build produkcyjny
npm run start   # uruchomienie builda produkcyjnego
npm run lint    # ESLint
npm test        # testy (Vitest + Testing Library)
npm run typecheck  # generuje typy Next.js i uruchamia tsc
```

## Testy

- `lib/products/schema.test.ts` — schematy Zod wszystkich trzech kroków (każda reguła walidacji
  ze specyfikacji) oraz przeliczanie cen netto/brutto.
- `lib/products/field-validators.test.ts`, `lib/products/mappers.test.ts` — błędy pól ze
  schematu, mapowanie formularza na produkt, formatowanie ceny i stanu magazynu.
- `lib/products/use-products.test.ts` — dodawanie produktów i zachowanie ich po odświeżeniu.
- `components/products/add-product-dialog.test.tsx` — przepływ formularza: blokada przejścia
  dalej przy błędach, przeliczanie cen i VAT, walidacja pola „ilość na magazynie” i limitów
  koszyka, zachowanie wartości po powrocie oraz reset po zamknięciu dialogu.

## Struktura

- `app/page.tsx` — strona główna: tabela produktów + przycisk „Dodaj produkt”.
- `components/products/product-table.tsx` — tabela produktów z paginacją (nuqs, `?page=`);
  `product-card.tsx` to jej widok mobilny.
- `components/products/add-product-dialog.tsx` — okno `Dialog` składające kreator w całość.
- `components/products/wizard/` — logika i widoki kreatora:
  - `use-product-wizard.ts` — stan kroku i formularza, blokada przejścia dalej przy błędach,
  - `steps/` — po jednym pliku na krok (`basic-info`, `pricing`, `availability`),
  - `wizard-footer.tsx` — przyciski Wstecz / Dalej / Zapisz.
- `components/products/form/` — warstwa TanStack Form (`createFormHook` + `withForm`):
  `use-app-form.ts` rejestruje typowane komponenty pól z `form/fields/`, które czytają
  stan przez `useFieldContext` (bez `any` i rzutowań).
- `lib/products/schema.ts` — schematy Zod dla każdego kroku formularza + typy.
- `lib/products/field-validators.ts` — przypisuje błędy schematu Zod do pojedynczych pól, więc
  reguły zależne od kilku pól (min ≤ maks, magazyn dla produktu limitowanego) są zapisane tylko
  w schemacie.
- `lib/products/mock-data.ts` — 5 przykładowych produktów (dane startowe).
- `lib/products/use-products.ts` — lista produktów zapisywana w `localStorage`, dzięki czemu
  odświeżenie strony zachowuje dodane produkty i numer strony z URL.
- `components/ui/*` — komponenty shadcn/ui.

## Funkcjonalność formularza

1. **Informacje podstawowe** — nazwa, SKU (tylko litery/cyfry, max 24 znaki), opis, producent,
   kategoria, cechy produktu (multi-select w formie przełączanych plakietek).
2. **Cena** — cena netto/brutto wzajemnie przeliczane wg wybranej stawki VAT
   (`brutto = netto × (1 + VAT / 100)`), waluta.
3. **Dostępność i stany magazynowe** — przełącznik dostępności, checkbox „produkt limitowany”
   (odsłania pole ilości na magazynie), minimalna/maksymalna ilość w koszyku (walidacja
   krzyżowa min ≤ max).

Przejście do kolejnego kroku jest zablokowane, dopóki bieżący krok nie przejdzie walidacji Zod.
Powrót do poprzedniego kroku nie czyści wprowadzonych danych. Zamknięcie okna (przyciskiem X lub
poza modalem) resetuje formularz do kroku 1. Po zapisaniu produkt trafia do tabeli, a użytkownik
widzi potwierdzenie w postaci toasta.
