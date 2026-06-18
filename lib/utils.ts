import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}

export function formatCurrency(
  amount: number,
  currency = "MAD",
  locale = "ar-MA",
) {
  return `${new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  }).format(amount)} درهم`;
}

export function formatPercent(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits: 0,
  }).format(value);
}
