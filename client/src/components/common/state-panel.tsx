import { cn } from "@/lib/utils"

export function StatePanel({
  kind,
  title,
  message,
  className,
}: {
  kind: "loading" | "error" | "empty"
  title?: string
  message: string
  className?: string
}) {
  if (kind === "loading") {
    return (
      <div className="rounded-lg border p-6 text-sm text-muted-foreground">
        {message}
      </div>
    )
  }

  if (kind === "error") {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
        {title ? (
          <div className="font-medium text-destructive">{title}</div>
        ) : null}
        <div
          className={
            title
              ? "mt-1 text-sm text-muted-foreground"
              : "text-sm text-muted-foreground"
          }
        >
          {message}
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "mb-4 flex min-h-40 items-center justify-center rounded-lg border border-dashed text-center text-muted-foreground",
        className
      )}
    >
      {message}
    </div>
  )
}
