
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ProductOption } from "@/features/transactions/api/transactions-api";
import {
  TransactionFormFields,
} from "@/features/transactions/components/transaction-form-fields";
import type { TransactionFormState } from "@/features/transactions/types/transaction-form";

type RecordTransactionFormProps = {
  form: TransactionFormState;
  isLoadingProducts: boolean;
  isSubmitting: boolean;
  products: ProductOption[];
  onChange: (
    updater: (current: TransactionFormState) => TransactionFormState,
  ) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export function RecordTransactionForm({
  form,
  isLoadingProducts,
  isSubmitting,
  products,
  onChange,
  onSubmit,
}: RecordTransactionFormProps) {
  return (
    <Card>
      <CardContent>
        {isLoadingProducts ? (
          <p className="text-sm text-muted-foreground">Loading products...</p>
        ) : (
          <form className="grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
            <TransactionFormFields
              form={form}
              noteClassName="h-94 overflow-y-auto resize-none"
              onChange={onChange}
              prefix="record"
              products={products}
            />

            <div className="md:col-span-2">
              <Button disabled={isSubmitting || !form.productId} type="submit">
                {isSubmitting ? "Saving..." : "Record transaction"}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
