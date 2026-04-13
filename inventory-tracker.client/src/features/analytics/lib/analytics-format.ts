export const PIE_COLORS = [
  "#0f766e",
  "#0284c7",
  "#f59e0b",
  "#ef4444",
  "#7c3aed",
  "#84cc16",
];

export function formatCurrency(value: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "NZD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatSignedCurrency(value: number, mode: "positive" | "negative") {
  const formatted = formatCurrency(Math.abs(value));
  return mode === "negative" ? `-${formatted}` : formatted;
}

export function formatTooltipCurrency(
  value: number | string | undefined,
  mode: "positive" | "negative" = "positive",
) {
  return formatSignedCurrency(Number(value ?? 0), mode);
}

export function formatShortDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}
