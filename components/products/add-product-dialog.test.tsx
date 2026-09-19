import { useState } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AddProductDialog } from "./add-product-dialog";
import type { NewProduct } from "@/lib/products/types";

function Harness({ onCreate }: { onCreate: (product: NewProduct) => void }) {
  const [open, setOpen] = useState(true);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Otwórz
      </button>
      <AddProductDialog open={open} onOpenChange={setOpen} onCreate={onCreate} />
    </>
  );
}

async function selectOption(
  user: ReturnType<typeof userEvent.setup>,
  label: string,
  option: string
) {
  await user.click(screen.getByRole("combobox", { name: label }));
  await user.click(await screen.findByRole("option", { name: option }));
}

async function fillStep1(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Nazwa produktu"), "MacBook Pro 14");
  await user.type(screen.getByLabelText("SKU produktu"), "MBP14M3PRO");
  await selectOption(user, "Producent", "Apple");
  await selectOption(user, "Kategoria", "Komputery");
  await user.click(screen.getByRole("button", { name: "Bluetooth" }));
}

const next = (user: ReturnType<typeof userEvent.setup>) =>
  user.click(screen.getByRole("button", { name: /Dalej/ }));

describe("AddProductDialog", () => {
  it("nie pozwala przejść dalej z niepoprawnym krokiem 1 i pokazuje błędy przy polach", async () => {
    const user = userEvent.setup();
    render(<Harness onCreate={vi.fn()} />);

    await next(user);

    expect(
      await screen.findByText("Nazwa produktu musi mieć co najmniej 3 znaki")
    ).toBeInTheDocument();
    expect(screen.getByText("SKU produktu jest wymagane")).toBeInTheDocument();
    // ten sam tekst jest placeholderem selecta i komunikatem błędu
    expect(screen.getAllByText("Wybierz producenta")).toHaveLength(2);
    expect(screen.getAllByText("Wybierz kategorię")).toHaveLength(2);
    expect(
      screen.getByText("Wybierz co najmniej jedną cechę produktu")
    ).toBeInTheDocument();
    // wciąż krok 1
    expect(screen.getByLabelText("Nazwa produktu")).toBeInTheDocument();
    expect(screen.queryByLabelText("Cena netto")).not.toBeInTheDocument();
  });

  it("waliduje SKU (tylko litery i cyfry)", async () => {
    const user = userEvent.setup();
    render(<Harness onCreate={vi.fn()} />);

    await user.type(screen.getByLabelText("SKU produktu"), "MBP-14");
    await user.tab();

    expect(
      await screen.findByText("SKU może zawierać tylko litery i cyfry")
    ).toBeInTheDocument();
  });

  it("przechodzi przez 3 kroki, przelicza ceny i zapisuje produkt", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();
    render(<Harness onCreate={onCreate} />);

    // Krok 1
    await fillStep1(user);
    await next(user);

    // Krok 2 — netto → brutto
    const net = await screen.findByLabelText("Cena netto");
    const gross = screen.getByLabelText("Cena brutto");
    await user.type(net, "100");
    await waitFor(() => expect(gross).toHaveValue(123));

    // brutto → netto
    await user.clear(gross);
    await user.type(gross, "246");
    await waitFor(() => expect(net).toHaveValue(200));

    // zmiana VAT przelicza brutto
    await selectOption(user, "Stawka VAT", "8%");
    await waitFor(() => expect(gross).toHaveValue(216));

    await next(user);

    // Krok 3
    await user.click(await screen.findByRole("checkbox", { name: "Produkt limitowany" }));
    const stock = await screen.findByLabelText("Ilość na magazynie");

    // ilość na magazynie wymagana dla produktu limitowanego
    await user.click(screen.getByRole("button", { name: "Zapisz produkt" }));
    expect(await screen.findByText("Podaj ilość na magazynie")).toBeInTheDocument();
    expect(onCreate).not.toHaveBeenCalled();

    await user.type(stock, "12");
    await user.click(screen.getByRole("button", { name: "Zapisz produkt" }));

    await waitFor(() => expect(onCreate).toHaveBeenCalledTimes(1));
    expect(onCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "MacBook Pro 14",
        sku: "MBP14M3PRO",
        manufacturer: "Apple",
        category: "Komputery",
        features: ["Bluetooth"],
        priceNet: 200,
        priceGross: 216,
        vatRate: 8,
        currency: "PLN",
        available: true,
        limited: true,
        stockQuantity: 12,
        minCartQuantity: 1,
        maxCartQuantity: 10,
      })
    );
  });

  it("blokuje zapis, gdy min. ilość w koszyku jest większa niż maks.", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();
    render(<Harness onCreate={onCreate} />);

    await fillStep1(user);
    await next(user);
    await user.type(await screen.findByLabelText("Cena netto"), "100");
    await next(user);

    const min = await screen.findByLabelText("Minimalna ilość");
    await user.clear(min);
    await user.type(min, "20");

    expect(
      await screen.findByText("Min. ilość nie może być większa niż maksymalna")
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Zapisz produkt" }));
    expect(onCreate).not.toHaveBeenCalled();
  });

  it("zachowuje wartości po powrocie do poprzedniego kroku", async () => {
    const user = userEvent.setup();
    render(<Harness onCreate={vi.fn()} />);

    await fillStep1(user);
    await next(user);
    await user.type(await screen.findByLabelText("Cena netto"), "50");

    await user.click(screen.getByRole("button", { name: /Wstecz/ }));
    expect(await screen.findByLabelText("Nazwa produktu")).toHaveValue("MacBook Pro 14");
    expect(screen.getByLabelText("SKU produktu")).toHaveValue("MBP14M3PRO");
    expect(screen.getByRole("button", { name: "Bluetooth" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );

    await next(user);
    expect(await screen.findByLabelText("Cena netto")).toHaveValue(50);
  });

  it("pokazuje błędy kroku 2 i nie pozwala przejść dalej bez cen", async () => {
    const user = userEvent.setup();
    render(<Harness onCreate={vi.fn()} />);

    await fillStep1(user);
    await next(user);
    await screen.findByLabelText("Cena netto");

    await next(user);

    expect(await screen.findByText("Cena netto musi być większa od 0")).toBeInTheDocument();
    expect(screen.getByText("Cena brutto musi być większa od 0")).toBeInTheDocument();
    expect(screen.queryByRole("checkbox", { name: "Produkt limitowany" })).not.toBeInTheDocument();
  });

  it("pokazuje błąd magazynu także wtedy, gdy min. ilość jest pusta", async () => {
    const user = userEvent.setup();
    render(<Harness onCreate={vi.fn()} />);

    await fillStep1(user);
    await next(user);
    await user.type(await screen.findByLabelText("Cena netto"), "100");
    await next(user);

    await user.click(await screen.findByRole("checkbox", { name: "Produkt limitowany" }));
    await user.clear(screen.getByLabelText("Minimalna ilość"));
    await user.click(screen.getByRole("button", { name: "Zapisz produkt" }));

    expect(await screen.findByText("Podaj ilość na magazynie")).toBeInTheDocument();
    expect(screen.getByText("Podaj minimalną ilość")).toBeInTheDocument();
  });

  it("po zapisie zamyka dialog, a ponowne otwarcie zaczyna od pustego kroku 1", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();
    render(<Harness onCreate={onCreate} />);

    await fillStep1(user);
    await next(user);
    await user.type(await screen.findByLabelText("Cena netto"), "100");
    await next(user);
    await user.click(await screen.findByRole("button", { name: "Zapisz produkt" }));

    await waitFor(() => expect(onCreate).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(screen.queryByRole("button", { name: "Zapisz produkt" })).not.toBeInTheDocument()
    );

    await user.click(screen.getByRole("button", { name: "Otwórz" }));
    expect(await screen.findByLabelText("Nazwa produktu")).toHaveValue("");
    expect(screen.queryByLabelText("Cena netto")).not.toBeInTheDocument();
  });

  it("zamknięcie klawiszem Escape resetuje formularz do kroku 1", async () => {
    const user = userEvent.setup();
    render(<Harness onCreate={vi.fn()} />);

    await fillStep1(user);
    await next(user);
    expect(await screen.findByLabelText("Cena netto")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen.queryByLabelText("Cena netto")).not.toBeInTheDocument()
    );

    await user.click(screen.getByRole("button", { name: "Otwórz" }));
    expect(await screen.findByLabelText("Nazwa produktu")).toHaveValue("");
  });

  it("zamknięcie dialogu resetuje formularz do kroku 1", async () => {
    const user = userEvent.setup();
    render(<Harness onCreate={vi.fn()} />);

    await fillStep1(user);
    await next(user);
    expect(await screen.findByLabelText("Cena netto")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Zamknij" }));
    await waitFor(() =>
      expect(screen.queryByLabelText("Cena netto")).not.toBeInTheDocument()
    );

    await user.click(screen.getByRole("button", { name: "Otwórz" }));
    const name = await screen.findByLabelText("Nazwa produktu");
    expect(name).toHaveValue("");
    expect(screen.queryByLabelText("Cena netto")).not.toBeInTheDocument();
  });
});
