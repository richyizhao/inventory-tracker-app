import { Field, FieldDescription, FieldError, FieldGroup } from "@/components/ui/field"
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
import { transactionTypeOptions } from "@/features/transactions/lib/transaction-form"
import type { Product } from "@/features/products/types/products"
import type {
  TransactionFormValues,
  TransactionTypeValue,
} from "@/features/transactions/types/transactions"
import type { User } from "@/features/users/types/users"

export function TransactionFormFields({
  error,
  idPrefix,
  isLoadingOptions,
  isSubmitting,
  onFieldChange,
  products,
  users,
  values,
}: {
  error: string
  idPrefix: string
  isLoadingOptions: boolean
  isSubmitting: boolean
  onFieldChange: <TKey extends keyof TransactionFormValues>(
    key: TKey,
    value: TransactionFormValues[TKey]
  ) => void
  products: Product[]
  users: User[]
  values: TransactionFormValues
}) {
  const estimatedTotal =
    Number(values.productQuantityChanged || 0) * Number(values.unitProductCost || 0)

  return (
    <FieldGroup>
      <Field>
        <Label htmlFor={`${idPrefix}-product`}>Product</Label>
        <Select
          value={values.selectedProductName}
          onValueChange={(value) => {
            if (value !== null) {
              onFieldChange("selectedProductName", value)
            }
          }}
        >
          <SelectTrigger
            id={`${idPrefix}-product`}
            className="w-full"
            disabled={isLoadingOptions || isSubmitting}
          >
            <SelectValue
              placeholder={
                isLoadingOptions ? "Loading products..." : "Select a product"
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {products.map((product) => (
                <SelectItem key={product.id} value={product.name}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
      <Field>
        <Label htmlFor={`${idPrefix}-user`}>User</Label>
        <Select
          value={values.selectedUsername}
          onValueChange={(value) => {
            if (value !== null) {
              onFieldChange("selectedUsername", value)
            }
          }}
        >
          <SelectTrigger
            id={`${idPrefix}-user`}
            className="w-full"
            disabled={isLoadingOptions || isSubmitting}
          >
            <SelectValue
              placeholder={isLoadingOptions ? "Loading users..." : "Select a user"}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.username}>
                  {user.displayName} ({user.username})
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
      <Field>
        <Label htmlFor={`${idPrefix}-type`}>Type</Label>
        <Select
          value={values.type}
          onValueChange={(value) => {
            if (
              value === "IN" ||
              value === "OUT" ||
              value === "ADJUSTMENT"
            ) {
              onFieldChange("type", value as TransactionTypeValue)
            }
          }}
        >
          <SelectTrigger
            id={`${idPrefix}-type`}
            className="w-full"
            disabled={isSubmitting}
          >
            <SelectValue placeholder="Select a type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {transactionTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
      <div className="grid gap-5 md:grid-cols-2">
        <Field>
          <Label htmlFor={`${idPrefix}-quantity`}>Quantity changed</Label>
          <Input
            id={`${idPrefix}-quantity`}
            type="number"
            min="1"
            value={values.productQuantityChanged}
            onChange={(event) =>
              onFieldChange("productQuantityChanged", event.target.value)
            }
            disabled={isSubmitting}
            required
          />
        </Field>
        <Field>
          <Label htmlFor={`${idPrefix}-unit-cost`}>Unit product cost</Label>
          <Input
            id={`${idPrefix}-unit-cost`}
            type="number"
            min="0"
            step="0.01"
            value={values.unitProductCost}
            onChange={(event) => onFieldChange("unitProductCost", event.target.value)}
            disabled={isSubmitting}
            required
          />
        </Field>
      </div>
      <Field>
        <Label htmlFor={`${idPrefix}-note`}>Note</Label>
        <Input
          id={`${idPrefix}-note`}
          value={values.note}
          onChange={(event) => onFieldChange("note", event.target.value)}
          disabled={isSubmitting}
          placeholder="Optional note"
        />
        <FieldDescription>
          Estimated total cost: {new Intl.NumberFormat(undefined, {
            style: "currency",
            currency: "USD",
          }).format(estimatedTotal)}
        </FieldDescription>
      </Field>
      <FieldError>{error}</FieldError>
    </FieldGroup>
  )
}
