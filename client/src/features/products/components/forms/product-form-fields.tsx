import { Field, FieldError, FieldGroup } from "@/components/ui/field"
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
import type { ProductFormValues } from "@/features/products/types/products"

export function ProductFormFields({
  categories,
  error,
  idPrefix,
  isLoadingCategories,
  isUploadingImage,
  isSubmitting,
  onFieldChange,
  onImageFileChange,
  values,
}: {
  categories: Category[]
  error: string
  idPrefix: string
  isLoadingCategories: boolean
  isUploadingImage: boolean
  isSubmitting: boolean
  onFieldChange: <TKey extends keyof ProductFormValues>(
    key: TKey,
    value: ProductFormValues[TKey]
  ) => void
  onImageFileChange: (file: File | null) => void
  values: ProductFormValues
}) {
  const selectedCategory = categories.find(
    (category) => category.name === values.selectedCategoryName
  )
  const subCategories = selectedCategory?.subCategories ?? []

  return (
    <FieldGroup>
      <Field>
        <Label htmlFor={`${idPrefix}-name`}>Product name</Label>
        <Input
          id={`${idPrefix}-name`}
          value={values.name}
          onChange={(event) => onFieldChange("name", event.target.value)}
          disabled={isSubmitting}
          required
        />
      </Field>
      <Field>
        <Label htmlFor={`${idPrefix}-sku`}>SKU</Label>
        <Input
          id={`${idPrefix}-sku`}
          value={values.sku}
          onChange={(event) => onFieldChange("sku", event.target.value)}
          disabled={isSubmitting}
          required
        />
      </Field>
      <Field>
        <Label htmlFor={`${idPrefix}-category`}>Category</Label>
        <Select
          value={values.selectedCategoryName}
          onValueChange={(value) => {
            if (value !== null) {
              onFieldChange("selectedCategoryName", value)
              onFieldChange("selectedSubCategoryName", "")
            }
          }}
        >
          <SelectTrigger
            id={`${idPrefix}-category`}
            className="w-full"
            disabled={isLoadingCategories || isSubmitting}
          >
            <SelectValue
              placeholder={
                isLoadingCategories
                  ? "Loading categories..."
                  : "Select a category"
              }
            />
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
        <Label htmlFor={`${idPrefix}-sub-category`}>Sub-category</Label>
        <Select
          value={values.selectedSubCategoryName}
          onValueChange={(value) => {
            if (value !== null) {
              onFieldChange("selectedSubCategoryName", value)
            }
          }}
        >
          <SelectTrigger
            id={`${idPrefix}-sub-category`}
            className="w-full"
            disabled={!selectedCategory || isSubmitting}
          >
            <SelectValue placeholder="Optional sub-category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {subCategories.map((subCategory) => (
                <SelectItem key={subCategory.id} value={subCategory.name}>
                  {subCategory.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
      <div className="grid gap-5 md:grid-cols-2">
        <Field>
          <Label htmlFor={`${idPrefix}-stock`}>Total unit stock</Label>
          <Input
            id={`${idPrefix}-stock`}
            type="number"
            min="0"
            value={values.totalUnitStock}
            onChange={(event) =>
              onFieldChange("totalUnitStock", event.target.value)
            }
            disabled={isSubmitting}
            required
          />
        </Field>
        <Field>
          <Label htmlFor={`${idPrefix}-threshold`}>Low stock threshold</Label>
          <Input
            id={`${idPrefix}-threshold`}
            type="number"
            min="0"
            value={values.lowStockThreshold}
            onChange={(event) =>
              onFieldChange("lowStockThreshold", event.target.value)
            }
            disabled={isSubmitting}
            required
          />
        </Field>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <Field>
          <Label htmlFor={`${idPrefix}-buy-price`}>Buy price</Label>
          <Input
            id={`${idPrefix}-buy-price`}
            type="number"
            min="0"
            step="0.01"
            value={values.buyPrice}
            onChange={(event) => onFieldChange("buyPrice", event.target.value)}
            disabled={isSubmitting}
            required
          />
        </Field>
        <Field>
          <Label htmlFor={`${idPrefix}-sell-price`}>Sell price</Label>
          <Input
            id={`${idPrefix}-sell-price`}
            type="number"
            min="0"
            step="0.01"
            value={values.sellPrice}
            onChange={(event) => onFieldChange("sellPrice", event.target.value)}
            disabled={isSubmitting}
            required
          />
        </Field>
      </div>
      <Field>
        <Label htmlFor={`${idPrefix}-image-file`}>Product image</Label>
        <Input
          id={`${idPrefix}-image-file`}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
          onChange={(event) =>
            onImageFileChange(event.target.files?.[0] ?? null)
          }
          disabled={isSubmitting || isUploadingImage}
        />
      </Field>
      <FieldError>{error}</FieldError>
    </FieldGroup>
  )
}
