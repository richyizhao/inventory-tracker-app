
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type {
  ProductOption,
  Transaction,
} from "@/features/transactions/api/transactions-api";
import {
  TransactionFormFields,
} from "@/features/transactions/components/transaction-form-fields";
import type { TransactionFormState } from "@/features/transactions/types/transaction-form";

type EditTransactionDialogProps = {
  form: TransactionFormState;
  isSaving: boolean;
  open: boolean;
  products: ProductOption[];
  transaction: Transaction | null;
  onChange: (
    updater: (current: TransactionFormState) => TransactionFormState,
  ) => void;
  onOpenChange: (open: boolean) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export function EditTransactionDialog({
  form,
  isSaving,
  open,
  products,
  transaction,
  onChange,
  onOpenChange,
  onSubmit,
}: EditTransactionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit transaction</DialogTitle>
          <DialogDescription>
            Update the selected stock movement entry.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <TransactionFormFields
              form={form}
              onChange={onChange}
              prefix="edit"
              products={products}
            />
          </div>

          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              Cancel
            </DialogClose>
            <Button
              disabled={isSaving || !transaction || !form.productId}
              type="submit"
            >
              {isSaving ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
