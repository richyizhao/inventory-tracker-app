export const analyticsRangeOptions = [
  { label: "1 day" },
  { label: "7 days" },
  { label: "1 month" },
  { label: "3 months" },
  { label: "1 year" },
  { label: "max" },
] as const

export type AnalyticsRangeLabel =
  (typeof analyticsRangeOptions)[number]["label"]
