import type { Currency } from "@/types/database";

export const currencies: Currency[] = ["CAD", "JPY", "USD"];

export function formatCurrency(amount: number, currency: Currency = "CAD") {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "JPY" ? 0 : 2,
  }).format(amount);
}

export function parseAmount(value: FormDataEntryValue | null) {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : 0;
}
