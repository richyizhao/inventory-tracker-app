import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Transaction } from "@/features/transactions/api/transactions-api";
import { formatDateTime } from "@/utils/format";

type TransactionDetailSheetProps = {
  isLoading: boolean;
  open: boolean;
  transaction: Transaction | null;
  onOpenChange: (open: boolean) => void;
};

export function TransactionDetailSheet({
  isLoading,
  open,
  transaction,
  onOpenChange,
}: TransactionDetailSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Transaction details</SheetTitle>
          <SheetDescription>Review the selected ledger entry.</SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">
            Loading transaction details...
          </p>
        ) : transaction ? (
          <div className="grid gap-4 p-4 text-sm">
            <div className="rounded-2xl border bg-muted/30 p-4">
              <p className="text-muted-foreground">Product</p>
              <p className="mt-1 font-medium">{transaction.productName}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <DetailCard label="Type" value={transaction.type} />
              <DetailCard label="Reason" value={transaction.reason} />
              <DetailCard
                label="Quantity"
                value={String(transaction.quantity)}
              />
              <DetailCard
                label="Expense"
                value={`$${transaction.expenseAmount.toFixed(2)}`}
              />
              <DetailCard
                label="Unit cost"
                value={`$${transaction.unitCost.toFixed(2)}`}
              />
              <DetailCard
                label="Total cost"
                value={`$${transaction.totalCost.toFixed(2)}`}
              />
            </div>

            <DetailCard
              label="Handled by"
              value={`${transaction.userName} (${transaction.userEmail})`}
            />

            <DetailCard
              label="Created"
              value={formatDateTime(transaction.createdAt)}
            />

            <div className="rounded-2xl border p-4">
              <p className="text-muted-foreground">Note</p>
              <p className="mt-1 whitespace-pre-wrap text-foreground">
                {transaction.note || "-"}
              </p>
            </div>
          </div>
        ) : (
          <p className="mt-6 text-sm text-muted-foreground">
            Select a transaction to view its details.
          </p>
        )}
      </SheetContent>
    </Sheet>
  );
}

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border p-4">
      <p className="text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}
