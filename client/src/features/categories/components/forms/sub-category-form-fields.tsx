import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Category } from "@/features/categories/types/categories"

export function SubCategoryFormFields({
  categories,
  categoryFieldId,
  selectedCategoryName,
  categoryLabel = "Category",
  categoryPlaceholder = "Select a category",
  error,
  isCategoryDisabled,
  isSubmitting,
  name,
  nameId,
  nameLabel = "Sub-category name",
  onCategoryChange,
  onNameChange,
}: {
  categories: Category[]
  categoryFieldId: string
  categoryLabel?: string
  categoryPlaceholder?: string
  error: string
  isCategoryDisabled: boolean
  isSubmitting: boolean
  name: string
  nameId: string
  nameLabel?: string
  selectedCategoryName: string
  onCategoryChange: (value: string) => void
  onNameChange: (value: string) => void
}) {
  return (
    <FieldGroup>
      <Field>
        <Label htmlFor={categoryFieldId}>{categoryLabel}</Label>
        <Select
          value={selectedCategoryName}
          onValueChange={(value) => {
            if (value !== null) {
              onCategoryChange(value)
            }
          }}
        >
          <SelectTrigger
            id={categoryFieldId}
            className="w-full"
            disabled={isCategoryDisabled}
          >
            <SelectValue placeholder={categoryPlaceholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
      <Field>
        <Label htmlFor={nameId}>{nameLabel}</Label>
        <Input
          id={nameId}
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
