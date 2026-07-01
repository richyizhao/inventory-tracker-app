const relativeTimeFormatter = new Intl.RelativeTimeFormat(undefined, {
  numeric: "auto",
})

export function formatExactDateTime(dateString: string | null) {
  if (!dateString) {
    return "-"
  }

  return new Date(dateString).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

export function formatRelativeDateTime(dateString: string | null) {
  if (!dateString) {
    return "-"
  }

  const date = new Date(dateString)
  const now = new Date()

  const diffMs = date.getTime() - now.getTime()
  const diffMinutes = Math.round(diffMs / (1000 * 60))
  const diffHours = Math.round(diffMs / (1000 * 60 * 60))
  const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const startOfNow = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const diffDays = Math.round(
    (startOfDate.getTime() - startOfNow.getTime()) / (1000 * 60 * 60 * 24)
  )

  if (Math.abs(diffMinutes) < 1) {
    return "Just now"
  }

  if (Math.abs(diffMinutes) < 60) {
    return relativeTimeFormatter.format(diffMinutes, "minute")
  }

  if (Math.abs(diffHours) < 24 && diffDays === 0) {
    return relativeTimeFormatter.format(diffHours, "hour")
  }

  if (diffDays === -1) {
    return "Yesterday"
  }

  if (diffDays <= -2 && diffDays >= -6) {
    return `${Math.abs(diffDays)} days ago`
  }

  return new Date(dateString).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}
