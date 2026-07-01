import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function CategoryFormFields({
  error,
  id,
  isSubmitting,
  label = "Category name",
  name,
  onNameChange,
}: {
  error: string
  id: string
  isSubmitting: boolean
  label?: string
  name: string
  onNameChange: (value: string) => void
}) {
  return (
    <FieldGroup>
      <Field>
        <Label htmlFor={id}>{label}</Label>
        <Input
          id={id}
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          disabled={isSubmitting}
          required
        />
      </Field>
      {error ? <div className="text-sm text-destructive">{error}</div> : null}
    </FieldGroup>
  )
}
