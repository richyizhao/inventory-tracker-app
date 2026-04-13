import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { ProductOption } from "@/features/transactions/api/transactions-api";
import {
  TRANSACTION_REASONS,
  type TransactionFormState,
} from "@/features/transactions/types/transaction-form";

type TransactionFormFieldsProps = {
  form: TransactionFormState;
  products: ProductOption[];
  prefix: string;
  noteClassName?: string;
  onChange: (
    updater: (current: TransactionFormState) => TransactionFormState,
  ) => void;
};

export function TransactionFormFields({
  form,
  products,
  prefix,
  noteClassName,
  onChange,
}: TransactionFormFieldsProps) {
  const selectedProduct = products.find((product) => product.id === form.productId);

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor={`${prefix}-transaction-product`}>Product</Label>
        <Select
          value={form.productId}
          onValueChange={(value) => {
            const productId = String(value ?? "");
            const nextProduct = products.find((product) => product.id === productId);

            onChange((current) => ({
              ...current,
              productId,
              unitCost:
                current.unitCost || !nextProduct
                  ? current.unitCost
                  : String(nextProduct.unitCost),
            }));
          }}
        >
          <SelectTrigger className="w-full" id={`${prefix}-transaction-product`}>
            <SelectValue placeholder="Select a product">
              {selectedProduct
                ? `${selectedProduct.name} (${selectedProduct.sku})`
                : undefined}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {products.map((product) => (
              <SelectItem key={product.id} value={product.id}>
                {product.name} ({product.sku})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${prefix}-transaction-type`}>Type</Label>
        <Select
          value={form.type}
          onValueChange={(value) =>
            onChange((current) => ({
              ...current,
              type: value as "In" | "Out" | "Adjustment",
              expenseAmount: value === "In" ? current.expenseAmount : "0",
            }))
          }
        >
          <SelectTrigger className="w-full" id={`${prefix}-transaction-type`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="In">In</SelectItem>
            <SelectItem value="Out">Out</SelectItem>
            <SelectItem value="Adjustment">Adjustment</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${prefix}-transaction-quantity`}>Quantity</Label>
        <Input
          id={`${prefix}-transaction-quantity`}
          min="1"
          onChange={(event) =>
            onChange((current) => ({
              ...current,
              quantity: event.target.value,
            }))
          }
          type="number"
          value={form.quantity}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${prefix}-transaction-reason`}>Reason</Label>
        <Select
          value={form.reason}
          onValueChange={(value) =>
            onChange((current) => ({
              ...current,
              reason: String(value ?? "Restock"),
            }))
          }
        >
          <SelectTrigger className="w-full" id={`${prefix}-transaction-reason`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TRANSACTION_REASONS.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:col-span-2 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`${prefix}-transaction-unit-cost`}>Unit cost</Label>
          <Input
            id={`${prefix}-transaction-unit-cost`}
            min="0"
            onChange={(event) =>
              onChange((current) => ({
                ...current,
                unitCost: event.target.value,
              }))
            }
            step="0.01"
            type="number"
            value={form.unitCost}
          />
        </div>

        {form.type === "In" ? (
          <div className="space-y-2">
            <Label htmlFor={`${prefix}-transaction-expense-amount`}>
              Restock expense
            </Label>
            <Input
              id={`${prefix}-transaction-expense-amount`}
              min="0"
              onChange={(event) =>
                onChange((current) => ({
                  ...current,
                  expenseAmount: event.target.value,
                }))
              }
              step="0.01"
              type="number"
              value={form.expenseAmount}
            />
          </div>
        ) : null}
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor={`${prefix}-transaction-note`}>Note</Label>
        <Textarea
          className={noteClassName}
          id={`${prefix}-transaction-note`}
          onChange={(event) =>
            onChange((current) => ({
              ...current,
              note: event.target.value,
            }))
          }
          placeholder="Context for this stock movement"
          value={form.note}
        />
      </div>
    </>
  );
}
