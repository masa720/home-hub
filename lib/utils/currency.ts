import type { Currency } from "@/types/database";

export const currencies: Currency[] = ["CAD"];

export function formatCurrency(amount: number) {
  return `$${new Intl.NumberFormat("en-CA", {
    maximumFractionDigits: 2,
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount)}`;
}

export function parseAmount(value: FormDataEntryValue | null) {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : 0;
}
