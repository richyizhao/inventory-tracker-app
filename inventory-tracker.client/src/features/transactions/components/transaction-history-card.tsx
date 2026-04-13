import { Eye, Pencil, Search, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Transaction } from "@/features/transactions/api/transactions-api";
import { formatDateTime } from "@/utils/format";

function transactionVariant(type: string) {
  switch (type.toLowerCase()) {
    case "in":
      return "default" as const;
    case "out":
      return "destructive" as const;
    default:
      return "secondary" as const;
  }
}

type TransactionHistoryCardProps = {
  canDeleteTransactions: boolean;
  canManageTransactions: boolean;
  canViewTransactionHistory: boolean;
  historyPage: number;
  historyQuery: string;
  isLoadingTransactions: boolean;
  paginatedTransactions: Transaction[];
  totalHistoryPages: number;
  transactionTypeFilter: string;
  onDelete: (transaction: Transaction) => void;
  onEdit: (transaction: Transaction) => void;
  onHistoryPageChange: (updater: (current: number) => number) => void;
  onHistoryQueryChange: (query: string) => void;
  onOpenDetails: (transactionId: string) => void;
  onTransactionTypeFilterChange: (value: string) => void;
};

export function TransactionHistoryCard({
  canDeleteTransactions,
  canManageTransactions,
  canViewTransactionHistory,
  historyPage,
  historyQuery,
  isLoadingTransactions,
  paginatedTransactions,
  totalHistoryPages,
  transactionTypeFilter,
  onDelete,
  onEdit,
  onHistoryPageChange,
  onHistoryQueryChange,
  onOpenDetails,
  onTransactionTypeFilterChange,
}: TransactionHistoryCardProps) {
  return (
    <Card>
      {!canViewTransactionHistory ? (
        <CardHeader>
          <CardDescription>
            Your role can record movements, but ledger history is limited to
            managers and admins.
          </CardDescription>
        </CardHeader>
      ) : null}

      <CardContent className="space-y-4">
        {canViewTransactionHistory ? (
          <>
            <div className="flex flex-col gap-4 lg:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="h-9 pl-9"
                  onChange={(event) => onHistoryQueryChange(event.target.value)}
                  placeholder="Search by product, user, or note"
                  value={historyQuery}
                />
              </div>

              <Select
                value={transactionTypeFilter}
                onValueChange={(value) =>
                  onTransactionTypeFilterChange(String(value ?? "all"))
                }
              >
                <SelectTrigger className="w-full lg:w-56">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="in">In</SelectItem>
                  <SelectItem value="out">Out</SelectItem>
                  <SelectItem value="adjustment">Adjustment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isLoadingTransactions ? (
              <p className="text-sm text-muted-foreground">
                Loading transaction history...
              </p>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Total cost</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Note</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="w-36">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTransactions.map((transaction) => (
                      <TableRow className="h-12" key={transaction.id}>
                        <TableCell className="font-medium">
                          {transaction.productName}
                        </TableCell>
                        <TableCell>
                          <Badge variant={transactionVariant(transaction.type)}>
                            {transaction.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{transaction.reason}</TableCell>
                        <TableCell>{transaction.quantity}</TableCell>
                        <TableCell>${transaction.totalCost.toFixed(2)}</TableCell>
                        <TableCell>{transaction.userName}</TableCell>
                        <TableCell className="max-w-64 truncate text-muted-foreground">
                          {transaction.note || "-"}
                        </TableCell>
                        <TableCell>
                          {formatDateTime(transaction.createdAt)}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => onOpenDetails(transaction.id)}
                              size="icon-sm"
                              variant="outline"
                            >
                              <Eye className="size-4" />
                            </Button>

                            {canManageTransactions ? (
                              <Button
                                onClick={() => onEdit(transaction)}
                                size="icon-sm"
                                variant="outline"
                              >
                                <Pencil className="size-4" />
                              </Button>
                            ) : null}

                            {canDeleteTransactions ? (
                              <Button
                                onClick={() => onDelete(transaction)}
                                size="icon-sm"
                                variant="outline"
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            ) : null}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="flex items-center justify-between text-sm">
                  <p className="text-muted-foreground">
                    Page {historyPage} of {totalHistoryPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      disabled={historyPage <= 1}
                      onClick={() => onHistoryPageChange((current) => current - 1)}
                      variant="outline"
                    >
                      Previous
                    </Button>
                    <Button
                      disabled={historyPage >= totalHistoryPages}
                      onClick={() => onHistoryPageChange((current) => current + 1)}
                      variant="outline"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </>
            )}
          </>
        ) : (
          <div className="rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">
            Record new transactions from the first tab. For cross-product
            history, the backend currently only exposes `GET /Transactions` to
            Admin and Manager roles.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
