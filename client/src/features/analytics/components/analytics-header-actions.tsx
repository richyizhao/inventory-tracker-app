import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { dispatchAnalyticsRangeChange } from "@/features/analytics/lib/analytics-events"
import { analyticsRangeOptions } from "@/features/analytics/lib/analytics-ranges"
import type { AnalyticsRangeLabel } from "@/features/analytics/lib/analytics-ranges"

export function AnalyticsHeaderActions() {
  return (
    <div className="ml-auto">
      <Select
        defaultValue="1 month"
        onValueChange={(value) => {
          if (value !== null) {
            dispatchAnalyticsRangeChange(value as AnalyticsRangeLabel)
          }
        }}
      >
        <SelectTrigger
          className="w-40"
          size="sm"
          aria-label="Select analytics range"
        >
          <SelectValue placeholder="1 month" />
        </SelectTrigger>
        <SelectContent>
          {analyticsRangeOptions.map((option) => (
            <SelectItem key={option.label} value={option.label}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
