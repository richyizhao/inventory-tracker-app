export function formatDate(value: string) {
  return new Date(value).toLocaleDateString();
}

export function formatDateTime(value: string) {
  return new Date(value).toLocaleString();
}

export function formatCompactNumber(value: number) {
  return new Intl.NumberFormat(undefined, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}
