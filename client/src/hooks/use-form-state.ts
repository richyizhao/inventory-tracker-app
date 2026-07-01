import * as React from "react"

export function useFormState<TValues>(initialValues: TValues) {
  const [values, setValues] = React.useState<TValues>(initialValues)

  React.useEffect(() => {
    setValues(initialValues)
  }, [initialValues])

  const setField = React.useCallback(function updateField<
    TKey extends keyof TValues,
  >(key: TKey, value: TValues[TKey]) {
    setValues((currentValues) => ({
      ...currentValues,
      [key]: value,
    }))
  }, [])

  return {
    setField,
    setValues,
    values,
  }
}
