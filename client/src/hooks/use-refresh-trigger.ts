import * as React from "react"

export function useRefreshTrigger(
  eventName: string,
  onRefresh?: () => void
) {
  const [refreshKey, setRefreshKey] = React.useState(0)

  React.useEffect(() => {
    function handleRefresh() {
      onRefresh?.()
      setRefreshKey((currentValue) => currentValue + 1)
    }

    window.addEventListener(eventName, handleRefresh)

    return () => {
      window.removeEventListener(eventName, handleRefresh)
    }
  }, [eventName, onRefresh])

  return refreshKey
}
